"""
Modelo de Usuario - Sistema de autenticación y control de roles.

Roles disponibles:
- ADMIN: Control total del sistema
- FAMILIAR: Puede ver, crear y editar información
- LECTURA: Solo puede consultar (médicos, familiares externos)
"""

from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

from .base import db, BaseModel


class Usuario(BaseModel):
    """Usuario de MEDIFAMILY. Puede ser admin, familiar o lectura."""

    __tablename__ = "usuarios"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    correo = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    rol = db.Column(db.String(20), nullable=False, default="FAMILIAR")
    telefono = db.Column(db.String(20))
    avatar = db.Column(db.String(255))
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_actualizacion = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    activo = db.Column(db.Boolean, default=True)

    # Relaciones
    citas_creadas = db.relationship("Cita", backref="creador", lazy="dynamic")
    actividades = db.relationship(
        "Actividad", foreign_keys="Actividad.usuario_id", backref="usuario", lazy="dynamic"
    )

    ROLES_VALIDOS = ("ADMIN", "FAMILIAR", "LECTURA")

    def set_password(self, password: str) -> None:
        """Genera el hash seguro de la contraseña."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        """Verifica la contraseña contra el hash almacenado."""
        return check_password_hash(self.password_hash, password)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return self.activo

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)

    def tiene_permiso(self, accion: str) -> bool:
        """
        Verifica si el rol permite realizar la acción.
        accion: 'leer', 'crear', 'editar', 'eliminar'
        """
        if self.rol == "LECTURA":
            return accion == "leer"
        if self.rol in ("FAMILIAR", "ADMIN"):
            return True
        return False

    def __repr__(self):
        return f"<Usuario {self.correo} rol={self.rol}>"
