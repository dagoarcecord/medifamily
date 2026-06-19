"""
Sistema de notificaciones internas.

Las notificaciones son generadas por APScheduler para recordar eventos
importantes (citas, recolecciones, estudios). Pueden ser leídas por
cualquier usuario con acceso a la cuenta familiar.
"""

from datetime import datetime

from .base import db, BaseModel


class Notificacion(BaseModel):
    """Notificación para usuarios de la cuenta familiar."""

    __tablename__ = "notificaciones"
    __table_args__ = (
        db.Index("idx_notificaciones_leida", "leida"),
        db.Index("idx_notificaciones_fecha", "fecha"),
    )

    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(30), nullable=False, index=True)
    titulo = db.Column(db.String(200), nullable=False)
    mensaje = db.Column(db.Text, nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    hora = db.Column(db.String(10), nullable=False)
    leida = db.Column(db.Boolean, default=False, index=True)
    icono = db.Column(db.String(50))

    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)

    TIPOS_VALIDOS = ("cita", "medicamento", "estudio", "recoleccion", "signos")

    @classmethod
    def no_leidas(cls):
        return cls.query.filter_by(leida=False).count()

    def marcar_leida(self):
        self.leida = True
        db.session.commit()

    def __repr__(self):
        return f"<Notificacion {self.tipo}: {self.titulo}>"
