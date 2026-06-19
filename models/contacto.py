"""
Contactos de emergencia.

Números importantes del paciente: familiares cercanos,
médico de cabecera, servicios de emergencia (Cruz Roja, etc.).
"""

from datetime import datetime

from .base import db, BaseModel


class ContactoEmergencia(BaseModel):
    """Contacto marcado como prioritario para emergencias."""

    __tablename__ = "contactos_emergencia"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(150), nullable=False)
    parentesco = db.Column(db.String(50), nullable=False)
    telefono = db.Column(db.String(20), nullable=False)
    prioridad = db.Column(db.Integer, default=3)  # 0 = emergencia, 1 = alta, 2 = media, 3 = baja

    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)

    @property
    def es_emergencia(self) -> bool:
        return self.prioridad == 0

    @property
    def prioridad_texto(self) -> str:
        return {
            0: "Emergencia",
            1: "Alta",
            2: "Media",
            3: "Baja"
        }.get(self.prioridad, "Sin definir")

    def __repr__(self):
        return f"<ContactoEmergencia {self.nombre} ({self.parentesco})>"
