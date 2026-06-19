"""
Bitácora de actividad familiar.

Registra automáticamente cada acción importante realizada por los usuarios:
creación de citas, edición de medicamentos, subida de documentos, etc.
Permite el seguimiento colaborativo completo.
"""

from datetime import datetime

from .base import db, BaseModel


class Actividad(BaseModel):
    """Registro histórico de acciones realizadas por usuarios."""

    __tablename__ = "actividades"
    __table_args__ = (
        db.Index("idx_actividades_fecha", "fecha"),
        db.Index("idx_actividades_usuario", "usuario_id"),
    )

    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False)
    accion = db.Column(db.String(100), nullable=False)  # "creó", "editó", "eliminó"
    modulo = db.Column(db.String(50), nullable=False)   # "Citas", "Medicamentos", etc.
    detalle = db.Column(db.String(255))
    fecha = db.Column(db.Date, nullable=False, index=True)
    hora = db.Column(db.String(10), nullable=False)

    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)

    @classmethod
    def registrar(cls, usuario_id: int, accion: str, modulo: str, detalle: str = ""):
        """Helper para crear un nuevo registro de actividad."""
        ahora = datetime.utcnow()
        actividad = cls(
            usuario_id=usuario_id,
            accion=accion,
            modulo=modulo,
            detalle=detalle,
            fecha=ahora.date(),
            hora=ahora.strftime("%H:%M")
        )
        from .base import db
        db.session.add(actividad)
        db.session.commit()
        return actividad

    def __repr__(self):
        return f"<Actividad {self.accion} en {self.modulo}>"
