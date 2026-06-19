"""
Directorio de médicos.

Médicos de contacto: especialistas, médico familiar, etc.
Permite búsqueda rápida por nombre o especialidad.
"""

from datetime import datetime

from .base import db, BaseModel


class Medico(BaseModel):
    """Médico en el directorio de contactos."""

    __tablename__ = "medicos"
    __table_args__ = (
        db.Index("idx_medicos_especialidad", "especialidad"),
        db.Index("idx_medicos_nombre", "nombre"),
    )

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(150), nullable=False, index=True)
    especialidad = db.Column(db.String(100), nullable=False, index=True)
    telefono = db.Column(db.String(20))
    correo = db.Column(db.String(120))
    direccion = db.Column(db.Text)

    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Medico {self.nombre} - {self.especialidad}>"
