"""
Blueprint de Documentos Médicos.

Subida, visualización y eliminación de documentos PDF, JPG, PNG
organizados por categorías.
"""

import os
from werkzeug.utils import secure_filename
from flask import Blueprint, render_template, request, redirect, url_for, flash, abort, send_from_directory, current_app
from flask_login import login_required, current_user

from models import Documento, db, Actividad
from app import rol_requerido

documentos_bp = Blueprint("documentos", __name__, url_prefix="/documentos")


def _subir_archivo(archivo):
    """Guarda el archivo en el sistema y retorna la ruta relativa."""
    if archivo and Documento.es_archivo_seguro(archivo.filename):
        nombre = Documento.generar_nombre_seguro(archivo.filename, current_user.id)
        ruta_completa = os.path.join(current_app.config["UPLOAD_FOLDER"], nombre)
        archivo.save(ruta_completa)
        return nombre
    return None


@documentos_bp.route("/")
@login_required
def index():
    """Listado de documentos por categoría."""
    categoria = request.args.get("categoria", "")
    query = Documento.query
    if categoria:
        query = query.filter_by(categoria=categoria)
    documentos = query.order_by(Documento.fecha.desc()).all()
    return render_template(
        "documentos.html",
        documentos=documentos,
        categoria=categoria
    )


@documentos_bp.route("/subir", methods=["GET", "POST"])
@login_required
@rol_requerido("ADMIN", "FAMILIAR")
def subir():
    """Subir un nuevo documento."""
    if request.method == "POST":
        archivo = request.files.get("archivo")
        if not archivo or archivo.filename == "":
            flash("Debes seleccionar un archivo.", "warning")
            return redirect(request.url)

        nombre_archivo = _subir_archivo(archivo)
        if not nombre_archivo:
            flash("Tipo de archivo no permitido.", "danger")
            return redirect(request.url)

        extension = nombre_archivo.rsplit(".", 1)[1].lower()
        tamano = os.path.getsize(
            os.path.join(current_app.config["UPLOAD_FOLDER"], nombre_archivo)
        )

        doc = Documento(
            titulo=request.form["titulo"],
            categoria=request.form["categoria"],
            fecha=request.form["fecha"],
            archivo=nombre_archivo,
            tipo=extension.upper(),
            tamano=f"{tamano / 1024:.1f} KB",
            descripcion=request.form.get("descripcion", ""),
            subido_por_id=current_user.id
        )
        db.session.add(doc)
        db.session.commit()
        Actividad.registrar(current_user.id, "Subió documento", "Documentos", doc.titulo)
        flash("Documento subido correctamente.", "success")
        return redirect(url_for("documentos.index"))

    return render_template("documentos_form.html")


@documentos_bp.route("/descargar/<int:id>")
@login_required
def descargar(id):
    """Descargar un documento."""
    doc = Documento.query.get_or_404(id)
    return send_from_directory(
        current_app.config["UPLOAD_FOLDER"],
        doc.archivo,
        as_attachment=True
    )


@documentos_bp.route("/<int:id>/eliminar", methods=["POST"])
@login_required
@rol_requerido("ADMIN")
def eliminar(id):
    """Eliminar un documento (borra archivo físico también)."""
    doc = Documento.query.get_or_404(id)
    try:
        ruta = os.path.join(current_app.config["UPLOAD_FOLDER"], doc.archivo)
        if os.path.exists(ruta):
            os.remove(ruta)
    except Exception:
        pass
    db.session.delete(doc)
    db.session.commit()
    Actividad.registrar(current_user.id, "Eliminó documento", "Documentos", doc.titulo)
    flash("Documento eliminado.", "info")
    return redirect(url_for("documentos.index"))
