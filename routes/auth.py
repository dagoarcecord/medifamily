"""
Blueprint de autenticación.

Maneja login, logout, cambio y recuperación de contraseña.
"""

from flask import Blueprint, render_template, redirect, url_for, request, flash, abort
from flask_login import login_user, logout_user, login_required, current_user

from models import Usuario, db

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    """Página de inicio de sesión."""
    if current_user.is_authenticated:
        return redirect(url_for("dashboard.index"))

    if request.method == "POST":
        correo = request.form.get("correo", "").strip().lower()
        password = request.form.get("password", "")
        recordar = bool(request.form.get("recordar"))

        usuario = Usuario.query.filter_by(correo=correo).first()

        if usuario and usuario.check_password(password):
            if not usuario.activo:
                flash("Tu cuenta está desactivada. Contacta al administrador.", "warning")
                return render_template("auth/login.html"), 200

            login_user(usuario, remember=recordar)
            flash(f"Bienvenido/a, {usuario.nombre}", "success")

            next_url = request.args.get("next") or url_for("dashboard.index")
            return redirect(next_url)
        else:
            flash("Correo o contraseña incorrectos.", "danger")

    return render_template("auth/login.html")


@auth_bp.route("/logout")
@login_required
def logout():
    """Cierra la sesión del usuario actual."""
    logout_user()
    flash("Has cerrado sesión correctamente.", "info")
    return redirect(url_for("auth.login"))


@auth_bp.route("/recuperar", methods=["GET", "POST"])
def recuperar():
    """Página de recuperación de contraseña (placeholder)."""
    if request.method == "POST":
        correo = request.form.get("correo", "").strip().lower()
        usuario = Usuario.query.filter_by(correo=correo).first()
        if usuario:
            # Aquí se enviaría un correo con token de recuperación.
            # Por ahora solo mostramos el mensaje.
            flash(
                "Si el correo existe, recibirás instrucciones para restablecer tu contraseña.",
                "info"
            )
        else:
            flash("No encontramos una cuenta con ese correo.", "warning")
        return redirect(url_for("auth.login"))

    return render_template("auth/recuperar.html")
