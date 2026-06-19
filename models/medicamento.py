"""
Modelo de Medicamento.

Tratamiento recetado al paciente con horarios de administración.
Incluye fechas de inicio/fin y stock disponible.
"""

from datetime import datetime

from .base import db, BaseModel


class Medicamento(BaseModel):
    """Medicamento en el tratamiento del paciente."""

    __tablename__ = "medicamentos"
    __table_args__ = (
        db.Index("idx_medicamentos_nombre", "nombre"),
        db.Index("idx_medicamentos_vigencia", "fecha_fin"),
    )

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False, index=True)
    dosis = db.Column(db.String(50), nullable=False)
    frecuencia = db.Column(db.String(100), nullable=False)
    hora1 = db.Column(db.String(10))
    hora2 = db.Column(db.String(10))
    hora3 = db.Column(db.String(10))
    fecha_inicio = db.Column(db.Date, nullable=False)
    fecha_fin = db.Column(db.Date)
    observaciones = db.Column(db.Text)
    stock = db.Column(db.Integer, default=0)

    # Relación con el usuario que registró el medicamento
    creado_por_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_actualizacion = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    @property
    def stock_bajo(self) -> bool:
        """Determina si el stock está por debajo del umbral crítico (14 días)."""
        return self.stock is not None and self.stock < 14

    @property
    def vigente(self) -> bool:
        """Indica si el medicamento está dentro del período de tratamiento."""
        if not self.fecha_fin:
            return True
        return self.fecha_fin >= datetime.now().date()

    def __repr__(self):
        return f"<Medicamento {self.nombre} {self.dosis}>"
