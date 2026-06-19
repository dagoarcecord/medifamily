"""
Modelo de Documento Médico.

Almacena referencias a archivos PDF, JPG, PNG subidos por los usuarios:
recetas, resultados de laboratorio, notas de consulta, etc.
"""

import os
from datetime import datetime

from werkzeug.utils import secure_filename

from .base import db, BaseModel


class Documento(BaseModel):
    """Documento médico asociado al expediente del paciente."""

    __tablename__ = "documentos"
    __table_args__ = (
        db.Index("idx_documentos_categoria", "categoria"),
        db.Index("idx_documentos_fecha", "fecha"),
    )

    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(255), nullable=False)
    categoria = db.Column(db.String(50), nullable=False, index=True)
    fecha = db.Column(db.Date, nullable=False)
    archivo = db.Column(db.String(255), nullable=False)  # ruta relativa al archivo
    tipo = db.Column(db.String(10), nullable=False)
    tamano = db.Column(db.String(20))
    descripcion = db.Column(db.Text)

    subido_por_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)

    CATEGORIAS_VALIDAS = (
        "Recetas", "Consultas", "Laboratorios",
        "Hospitalizaciones", "Imagenologia", "Otros"
    )

    EXTENSIONES_PERMITIDAS = {"pdf", "png", "jpg", "jpeg", "gif", "doc", "docx"}

    @staticmethod
    def es_archivo_seguro(filename: str) -> bool:
        """Valida que el archivo tenga una extensión permitida."""
        if not filename or "." not in filename:
            return False
        ext = filename.rsplit(".", 1)[1].lower()
        return ext in Documento.EXTENSIONES_PERMITIDAS

    @staticmethod
    def generar_nombre_seguro(filename: str, usuario_id: int) -> str:
        """Genera un nombre único seguro para el archivo."""
        base = secure_filename(filename)
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        return f"{usuario_id}_{timestamp}_{base}"

    def ruta_completa(self, upload_folder: str) -> str:
        return os.path.join(upload_folder, self.archivo)

    def __repr__(self):
        return f"<Documento {self.titulo} ({self.categoria})>"
