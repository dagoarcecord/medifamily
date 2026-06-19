"""MEDIFAMILY - Sistema Colaborativo para Gestión Médica Familiar

Aplicación Flask principal.
Implementa autenticación, autorización por roles, gestión de citas,
medicamentos, estudios, documentos, signos vitales y más.

Arquitectura: MVC + Blueprints
Seguridad: Werkzeug (hash), CSRF Protection, Session Management

Ejecutar con: python app.py
"""

import os
from datetime import datetime, timedelta
from functools import wraps

from flask import Flask, render_template, request, redirect, url_for, flash, abort, jsonify, send_from_directory
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_wtf.csrf import CSRFProtect
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from sqlalchemy import event
from sqlalchemy.engine import Engine

from config import config
from models import db, Usuario, Cita, Medicamento, Recoleccion, Estudio, Documento, SignoVital, Medico, ContactoEmergencia, Actividad, Notificacion


# ============================================================
# INICIALIZACIÓN DE LA APP
# ============================================================
def create_app(environment="development"):
    """Factory pattern para crear la aplicación Flask."""
    app = Flask(
        __name__,
        template_folder="templates",
        static_folder="static"
    )
    app.config.from_object(config[environment])

    # Inicializar extensiones
    db.init_app(app)
    csrf = CSRFProtect(app)
    login_manager = LoginManager(app)
    login_manager.login_view = "auth.login"
    login_manager.login_message = "Por favor inicia sesión para acceder."
    login_manager.login_message_category = "warning"

    @login_manager.user_loader
    def load_user(user_id):
        return Usuario.query.get(int(user_id))

    # ============================================================
    # DECORADORES DE PERMISOS
    # ============================================================
    def rol_requerido(*roles_permitidos):
        """Decorador que valida que el rol del usuario esté en los permitidos."""
        def decorator(f):
            @wraps(f)
            def decorated_function(*args, **kwargs):
                if not current_user.is_authenticated:
                    return login_manager.unauthorized()
                if current_user.rol not in roles_permitidos:
                    flash("No tienes permisos para realizar esta acción.", "danger")
                    return redirect(url_for("dashboard.index"))
                return f(*args, **kwargs)
            decorated_function.__name__ = f.__name__
            return decorated_function
        return decorator

    # Registrar decorador en la app para usarlo desde los blueprints
    app.rol_requerido = rol_requerido

    # ============================================================
    # REGISTRO DE BLUEPRINTS
    # ============================================================
    from routes.auth import auth_bp
    from routes.dashboard import dashboard_bp
    from routes.citas import citas_bp
    from routes.medicamentos import medicamentos_bp
    from routes.documentos import documentos_bp
    from routes.estudios import estudios_bp
    from routes.signos import signos_bp
    from routes.usuarios import usuarios_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(citas_bp)
    app.register_blueprint(medicamentos_bp)
    app.register_blueprint(documentos_bp)
    app.register_blueprint(estudios_bp)
    app.register_blueprint(signos_bp)
    app.register_blueprint(usuarios_bp)

    # ============================================================
    # RUTAS BASE
    # ============================================================
    @app.context_processor
    def inject_globals():
        """Inyecta variables globales en todos los templates."""
        return {
            "app_name": "MEDIFAMILY",
            "now": datetime.now(),
            "current_year": datetime.now().year
        }

    @app.route("/")
    def root():
        if current_user.is_authenticated:
            return redirect(url_for("dashboard.index"))
        return redirect(url_for("auth.login"))

    @app.route("/manifest.json")
    def manifest():
        return send_from_directory("static", "manifest.json")

    @app.route("/sw.js")
    def service_worker():
        return send_from_directory("static", "sw.js", mimetype="application/javascript")

    @app.route("/health")
    def health():
        return jsonify({"status": "ok", "service": "MEDIFAMILY", "time": datetime.now().isoformat()})

    # ============================================================
    # MANEJO DE ERRORES
    # ============================================================
    @app.errorhandler(404)
    def not_found(e):
        return render_template("errors/404.html"), 404

    @app.errorhandler(403)
    def forbidden(e):
        return render_template("errors/403.html"), 403

    @app.errorhandler(500)
    def server_error(e):
        return render_template("errors/500.html"), 500

    # ============================================================
    # CREAR BASE DE DATOS Y USUARIO ADMIN POR DEFECTO
    # ============================================================
    with app.app_context():
        db.create_all()
        if not Usuario.query.filter_by(correo=app.config.get("ADMIN_CORREO", "admin@medifamily.local")).first():
            admin = Usuario(
                nombre="Administrador MEDIFAMILY",
                correo=app.config.get("ADMIN_CORREO", "admin@medifamily.local"),
                rol="ADMIN",
                password_hash=generate_password_hash(app.config.get("ADMIN_PASSWORD", "Admin123!")),
                fecha_creacion=datetime.now()
            )
            db.session.add(admin)
            db.session.commit()
            app.logger.info("Usuario administrador creado.")

    return app


# ============================================================
# PUNTO DE ENTRADA
# ============================================================
if __name__ == "__main__":
    env = os.getenv("FLASK_ENV", "development")
    app = create_app(env)
    port = int(os.getenv("PORT", 5000))
    app.run(
        host=os.getenv("HOST", "0.0.0.0"),
        port=port,
        debug=env == "development"
    )
