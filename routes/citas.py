"""
Blueprint de Citas Médicas.

CRUD completo de citas médicas con búsqueda y filtrado.
"""

from flask import Blueprint, render_template, request, redirect, url_for, flash, abort, jsonify
from flask_login import login_required, current_user

from models import Cita, db, Actividad
from app import rol_requerido

citas_bp = Blueprint("citas", __name__, url_prefix="/citas")


@citas_bp.route("/")
@login_required
def index():
    """Listado de citas con filtros."""
    estado = request.args.get("estado", "")
    busqueda = request.args.get("q", "").strip()

    query = Cita.query
    if estado:
        query = query.filter_by(estado=estado)
    if busqueda:
        query = query.filter(
            (Cita.especialidad.contains(busqueda)) |
            (Cita.medico.contains(busqueda)) |
            (Cita.hospital.contains(busqueda))
        )
    citas = query.order_by(Cita.fecha.desc()).all()
    return render_template("citas.html", citas=citas, estado=estado, busqueda=busqueda)


@citas_bp.route("/nueva", methods=["GET", "POST"])
@login_required
@rol_requerido("ADMIN", "FAMILIAR")
def nueva():
    """Crear una nueva cita."""
    if request.method == "POST":
        cita = Cita(
            especialidad=request.form["especialidad"],
            medico=request.form["medico"],
            hospital=request.form["hospital"],
            direccion=request.form.get("direccion", ""),
            telefono=request.form.get("telefono", ""),
            fecha=request.form["fecha"],
            hora=request.form["hora"],
            motivo=request.form.get("motivo", ""),
            indicaciones=request.form.get("indicaciones", ""),
            ayuno=bool(request.form.get("ayuno")),
            llevar_estudios=bool(request.form.get("llevar_estudios")),
            observaciones=request.form.get("observaciones", ""),
            estado=request.form.get("estado", "Pendiente"),
            creado_por_id=current_user.id
        )
        db.session.add(cita)
        db.session.commit()
        Actividad.registrar(current_user.id, "Creó cita", "Citas", f"{cita.especialidad} - {cita.fecha}")
        flash("Cita creada correctamente.", "success")
        return redirect(url_for("citas.index"))

    return render_template("citas_form.html", cita=None)


@citas_bp.route("/<int:id>/editar", methods=["GET", "POST"])
@login_required
@rol_requerido("ADMIN", "FAMILIAR")
def editar(id):
    """Editar una cita existente."""
    cita = Cita.query.get_or_404(id)
    if request.method == "POST":
        cita.especialidad = request.form["especialidad"]
        cita.medico = request.form["medico"]
        cita.hospital = request.form["hospital"]
        cita.direccion = request.form.get("direccion", "")
        cita.telefono = request.form.get("telefono", "")
        cita.fecha = request.form["fecha"]
        cita.hora = request.form["hora"]
        cita.motivo = request.form.get("motivo", "")
        cita.indicaciones = request.form.get("indicaciones", "")
        cita.ayuno = bool(request.form.get("ayuno"))
        cita.llevar_estudios = bool(request.form.get("llevar_estudios"))
        cita.observaciones = request.form.get("observaciones", "")
        cita.estado = request.form.get("estado", cita.estado)
        db.session.commit()
        Actividad.registrar(current_user.id, "Actualizó cita", "Citas", cita.especialidad)
        flash("Cita actualizada.", "success")
        return redirect(url_for("citas.index"))

    return render_template("citas_form.html", cita=cita)


@citas_bp.route("/<int:id>/eliminar", methods=["POST"])
@login_required
@rol_requerido("ADMIN")
def eliminar(id):
    """Eliminar una cita."""
    cita = Cita.query.get_or_404(id)
    db.session.delete(cita)
    db.session.commit()
    Actividad.registrar(current_user.id, "Eliminó cita", "Citas", f"ID {id}")
    flash("Cita eliminada.", "info")
    return redirect(url_for("citas.index"))


@citas_bp.route("/api/lista")
@login_required
def api_lista():
    """Endpoint API para el calendario o vistas externas."""
    citas = Cita.query.order_by(Cita.fecha.asc()).all()
    return jsonify([c.to_dict() for c in citas])
