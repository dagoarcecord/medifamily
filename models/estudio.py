"""
Modelo de Estudio Médico.

Registra estudios como laboratorios, rayos X, resonancias,
tomografías, ultrasonidos, con seguimiento de resultados.
"""

from datetime import datetime

from .base import db, BaseModel


class Estudio(BaseModel):
    """Estudio médico programado o realizado."""

    __tablename__ = "estudios"
    __table_args__ = (
        db.Index("idx_estudios_fecha", "fecha"),
        db.Index("idx_estudios_tipo", "tipo"),
    )

    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(50), nullable=False, index=True)
    nombre = db.Column(db.String(255), nullable=False)
    fecha = db.Column(db.Date, nullable=False, index=True)
    lugar = db.Column(db.String(255), nullable=False)
    indicaciones = db.Column(db.Text)
    resultado_disponible = db.Column(db.Boolean, default=False)
    archivo = db.Column(db.String(255))  # ruta del resultado

    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_actualizacion = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    TIPOS_VALIDOS = ("Laboratorio", "Rayos X", "Resonancia", "Tomografia", "Ultrasonido", "Otro")

    def __repr__(self):
        return f"<Estudio {self.tipo} - {self.nombre} ({self.fecha})>"
