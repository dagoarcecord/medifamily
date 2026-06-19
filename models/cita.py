"""
Modelo de Cita Médica.

Representa una cita programada con un especialista médico.
Incluye información del médico, lugar, hora, indicaciones y estado.
"""

from datetime import datetime

from .base import db, BaseModel


class Cita(BaseModel):
    """Cita médica programada."""

    __tablename__ = "citas"
    __table_args__ = (
        db.Index("idx_citas_fecha", "fecha"),
        db.Index("idx_citas_estado", "estado"),
    )

    id = db.Column(db.Integer, primary_key=True)
    especialidad = db.Column(db.String(100), nullable=False, index=True)
    medico = db.Column(db.String(120), nullable=False)
    hospital = db.Column(db.String(200), nullable=False)
    direccion = db.Column(db.Text)
    telefono = db.Column(db.String(20))
    fecha = db.Column(db.Date, nullable=False, index=True)
    hora = db.Column(db.String(10), nullable=False)
    motivo = db.Column(db.Text)
    indicaciones = db.Column(db.Text)
    ayuno = db.Column(db.Boolean, default=False)
    llevar_estudios = db.Column(db.Boolean, default=False)
    observaciones = db.Column(db.Text)
    estado = db.Column(db.String(20), default="Pendiente", index=True)

    # Audit trail
    creado_por_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_actualizacion = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    ESTADOS_VALIDOS = ("Pendiente", "Completada", "Reprogramada", "Cancelada")

    @property
    def fecha_formateada(self) -> str:
        return self.fecha.strftime("%d/%m/%Y") if self.fecha else ""

    @property
    def dias_para_cita(self) -> int:
        if not self.fecha:
            return 0
        delta = self.fecha - datetime.now().date()
        return delta.days

    def __repr__(self):
        return f"<Cita {self.especialidad} - {self.fecha}>"
