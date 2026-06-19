"""
Modelo de Recolección de Medicamentos.

Permite llevar control de qué medicamentos deben ser recogidos
en farmacias o clínicas, con fechas límite y confirmación.
"""

from datetime import datetime

from .base import db, BaseModel


class Recoleccion(BaseModel):
    """Registro de recolección de medicamentos en farmacias."""

    __tablename__ = "recolecciones"
    __table_args__ = (
        db.Index("idx_recolecciones_fecha", "fecha_recoleccion"),
        db.Index("idx_recolecciones_estado", "estado"),
    )

    id = db.Column(db.Integer, primary_key=True)
    medicamento_id = db.Column(db.Integer, db.ForeignKey("medicamentos.id"), nullable=False)
    medicamento_nombre = db.Column(db.String(200), nullable=False)
    lugar = db.Column(db.String(200), nullable=False)
    fecha_recoleccion = db.Column(db.Date, nullable=False, index=True)
    observaciones = db.Column(db.Text)
    estado = db.Column(db.String(20), default="Pendiente", index=True)

    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_actualizacion = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    ESTADOS_VALIDOS = ("Pendiente", "Recogido")

    @property
    def dias_restantes(self) -> int:
        if not self.fecha_recoleccion:
            return 0
        delta = self.fecha_recoleccion - datetime.now().date()
        return delta.days

    @property
    def urgente(self) -> bool:
        """Colección próxima (≤ 2 días) y pendiente."""
        return self.estado == "Pendiente" and self.dias_restantes <= 2

    def __repr__(self):
        return f"<Recoleccion {self.medicamento_nombre} - {self.fecha_recoleccion}>"
