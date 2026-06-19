"""
Blueprint de Estudios Médicos.

CRUD de estudios: laboratorios, rayos X, resonancias, etc.
"""

from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_required, current_user

from models import Estudio, db, Actividad
from app import rol_requerido

estudios_bp = Blueprint("estudios", __name__, url_prefix="/estudios")


@estudios_bp.route("/")
@login_required
def index():
    """Listado de todos los estudios."""
    busqueda = request.args.get("q", "")
    query = Estudio.query
    if busqueda:
        query = query.filter(Estudio.nombre.contains(busqueda))
    estudios = query.order_by(Estudio.fecha.desc()).all()
    return render_template("estudios.html", estudios=estudios, busqueda=busqueda)


@estudios_bp.route("/nuevo", methods=["GET", "POST"])
@login_required
@rol_requerido("ADMIN", "FAMILIAR")
def nuevo():
    if request.method == "POST":
        e = Estudio(
            tipo=request.form["tipo"],
            nombre=request.form["nombre"],
            fecha=request.form["fecha"],
            lugar=request.form["lugar"],
            indicaciones=request.form.get("indicaciones", ""),
            resultado_disponible=bool(request.form.get("resultado_disponible"))
        )
        db.session.add(e)
        db.session.commit()
        Actividad.registrar(current_user.id, "Registró estudio", "Estudios", e.nombre)
        flash("Estudio registrado.", "success")
        return redirect(url_for("estudios.index"))

    return render_template("estudios_form.html", estudio=None)


@estudios_bp.route("/<int:id>/eliminar", methods=["POST"])
@login_required
@rol_requerido("ADMIN", "FAMILIAR")
def eliminar(id):
    e = Estudio.query.get_or_404(id)
    db.session.delete(e)
    db.session.commit()
    Actividad.registrar(current_user.id, "Eliminó estudio", "Estudios", e.nombre)
    flash("Estudio eliminado.", "info")
    return redirect(url_for("estudios.index"))
