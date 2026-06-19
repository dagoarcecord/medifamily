"""Configuración centralizada de MEDIFAMILY.

Maneja configuraciones para development, testing y production.
Las variables sensibles se cargan desde variables de entorno o archivo .env.
"""

import os
from datetime import timedelta


def get_env(key, default=""):
    """Helper para leer variables de entorno con valor por defecto."""
    return os.getenv(key, default)


class Config:
    """Configuración base compartida por todos los entornos."""

    SECRET_KEY = get_env("SECRET_KEY", "medifamily-secret-key-cambia-en-produccion-2025")

    # Base de datos: PostgreSQL en producción, SQLite en desarrollo
    SQLALCHEMY_DATABASE_URI = get_env(
        "DATABASE_URL",
        "sqlite:///database.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
    }

    # Seguridad de sesión
    PERMANENT_SESSION_LIFETIME = timedelta(hours=12)
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"
    REMEMBER_COOKIE_DURATION = timedelta(days=30)

    # CSRF Protection
    WTF_CSRF_ENABLED = True
    WTF_CSRF_TIME_LIMIT = 3600

    # Configuración de uploads
    UPLOAD_FOLDER = "static/uploads"
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB máximo
    ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "gif", "doc", "docx"}

    # Usuario administrador por defecto (solo desarrollo)
    ADMIN_CORREO = get_env("ADMIN_CORREO", "admin@medifamily.local")
    ADMIN_PASSWORD = get_env("ADMIN_PASSWORD", "Admin123!")

    # APScheduler
    SCHEDULER_API_ENABLED = True

    # PWA
    PWA_NAME = "MEDIFAMILY"
    PWA_SHORT_NAME = "MEDIFAMILY"

    @staticmethod
    def init_app(app):
        """Tareas de inicialización adicionales."""
        os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)


class DevelopmentConfig(Config):
    """Configuración para desarrollo local."""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = get_env("DEV_DATABASE_URL", "sqlite:///database.db")
    WTF_CSRF_ENABLED = True


class TestingConfig(Config):
    """Configuración para pruebas automatizadas."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    WTF_CSRF_ENABLED = False


class ProductionConfig(Config):
    """Configuración para producción en Render, Railway, PythonAnywhere, etc."""
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = get_env("DATABASE_URL")
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_SECURE = True

    @classmethod
    def init_app(cls, app):
        Config.init_app(app)
        # En producción con PostgreSQL, ajustar la URI si viene de Render/Heroku
        uri = app.config.get("SQLALCHEMY_DATABASE_URI", "")
        if uri.startswith("postgres://"):
            app.config["SQLALCHEMY_DATABASE_URI"] = uri.replace("postgres://", "postgresql://", 1)


config = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig
}
