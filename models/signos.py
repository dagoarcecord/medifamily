"""
Modelo de Signos Vitales.

Almacena las mediciones de signos vitales del paciente:
presión arterial, glucosa, peso, temperatura, oxigenación, pulso.
Permite generar gráficas de tendencias.
"""

from datetime import datetime

from .base import db, BaseModel


class SignoVital(BaseModel):
    """Registro de signos vitales en un momento específico."""

    __tablename__ = "signos_vitales"
    __table_args__ = (
        db.Index("idx_signos_fecha", "fecha"),
    )

    id = db.Column(db.Integer, primary_key=True)
    fecha = db.Column(db.Date, nullable=False, index=True)
    hora = db.Column(db.String(10), nullable=False)
    presion_sistolica = db.Column(db.Integer, nullable=False)
    presion_diastolica = db.Column(db.Integer, nullable=False)
    glucosa = db.Column(db.Integer)
    peso = db.Column(db.Float)
    temperatura = db.Column(db.Float)
    oxigenacion = db.Column(db.Integer)
    pulso = db.Column(db.Integer)
    notas = db.Column(db.Text)

    registrado_por_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)

    @property
    def presion_arterial(self) -> str:
        return f"{self.presion_sistolica}/{self.presion_diastolica}"

    @property
    def presion_normal(self) -> bool:
        """Evalúa si la presión está en rango normal (OMS)."""
        return 90 <= self.presion_sistolica <= 120 and 60 <= self.presion_diastolica <= 80

    @property
    def glucosa_normal(self) -> bool:
        """Evalúa si la glucosa está en ayuno normal (< 100 mg/dL)."""
        if self.glucosa is None:
            return True
        return self.glucosa < 100

    def __repr__(self):
        return f"<SignoVital {self.fecha} PA={self.presion_arterial}>"
