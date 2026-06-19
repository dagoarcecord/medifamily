"""
Base SQLAlchemy para MEDIFAMILY.

Provee la instancia `db` que se utiliza en todas las definiciones de modelos.
El objeto `db` se inicializa en app.py con `db.init_app(app)`.
"""

from flask_sqlalchemy import SQLAlchemy

# Instancia única de SQLAlchemy
db = SQLAlchemy()


class BaseModel(db.Model):
    """Clase base abstracta con helpers comunes a todos los modelos."""

    __abstract__ = True

    def to_dict(self):
        """Convierte el modelo a diccionario (útil para APIs)."""
        result = {}
        for column in self.__table__.columns:
            value = getattr(self, column.name)
            # Serializar fechas a ISO string
            if hasattr(value, "isoformat"):
                value = value.isoformat()
            result[column.name] = value
        return result

    def update_from_dict(self, data: dict, exclude: list = None):
        """Actualiza los campos del modelo desde un diccionario."""
        exclude = exclude or ["id", "fecha_creacion"]
        for key, value in data.items():
            if key in exclude:
                continue
            if hasattr(self, key):
                setattr(self, key, value)

    @classmethod
    def get_by_id(cls, id):
        """Obtiene una instancia por ID o None."""
        return db.session.get(cls, id)
