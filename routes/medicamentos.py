"""
Blueprint de Medicamentos.

CRUD de medicamentos con vista diaria, semanal y control de stock.
"""

from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_required, current_user

from models import Medicamento, db, Actividad
from app import rol_requerido

medicamentos_bp = Blueprint("medicamentos", __name__, url_prefix="/medicamentos")


@medicamentos_bp.route("/")
@login_required
def index():
    """Listado de medicamentos activos."""
    vista = request.args.get("vista", "lista")
    busqueda = request.args.get("q", "")
    medicamentos = Medicamento.query.order_by(Medicamento.nombre.asc()).all()
    if busqueda:
        medicamentos = [m for m in medicamentos if busqueda.lower() in m.nombre.lower()]

    return render_template(
        "medicamentos.html",
        medicamentos=medicamentos,
        vista=vista,
        busqueda=busqueda
    )


@medicamentos_bp.route("/nuevo", methods=["GET", "POST"])
@login_required
@rol_requerido("ADMIN", "FAMILIAR")
def nuevo():
    """Crear nuevo medicamento."""
    if request.method == "POST":
        m = Medicamento(
            nombre=request.form["nombre"],
            dosis=request.form["dosis"],
            frecuencia=request.form["frecuencia"],
            hora1=request.form.get("hora1", ""),
            hora2=request.form.get("hora2", ""),
            hora3=request.form.get("hora3", ""),
            fecha_inicio=request.form["fecha_inicio"],
            fecha_fin=request.form.get("fecha_fin") or None,
            observaciones=request.form.get("observaciones", ""),
            stock=int(request.form.get("stock", 0) or 0),
            creado_por_id=current_user.id
        )
        db.session.add(m)
        db.session.commit()
        Actividad.registrar(current_user.id, "Creó medicamento", "Medicamentos", m.nombre)
        flash(f"Medicamento '{m.nombre}' agregado.", "success")
        return redirect(url_for("medicamentos.index"))

    return render_template("medicamentos_form.html", medicamento=None)


@medicamentos_bp.route("/<int:id>/editar", methods=["GET", "POST"])
@login_required
@rol_requerido("ADMIN", "FAMILIAR")
def editar(id):
    """Editar un medicamento."""
    m = Medicamento.query.get_or_404(id)
    if request.method == "POST":
        m.nombre = request.form["nombre"]
        m.dosis = request.form["dosis"]
        m.frecuencia = request.form["frecuencia"]
        m.hora1 = request.form.get("hora1", "")
        m.hora2 = request.form.get("hora2", "")
        m.hora3 = request.form.get("hora3", "")
        m.fecha_inicio = request.form["fecha_inicio"]
        m.fecha_fin = request.form.get("fecha_fin") or None
        m.observaciones = request.form.get("observaciones", "")
        m.stock = int(request.form.get("stock", 0) or 0)
        db.session.commit()
        Actividad.registrar(current_user.id, "Actualizó medicamento", "Medicamentos", m.nombre)
        flash("Medicamento actualizado.", "success")
        return redirect(url_for("medicamentos.index"))

    return render_template("medicamentos_form.html", medicamento=m)


@medicamentos_bp.route("/<int:id>/eliminar", methods=["POST"])
@login_required
@rol_requerido("ADMIN")
def eliminar(id):
    """Eliminar un medicamento."""
    m = Medicamento.query.get_or_404(id)
    db.session.delete(m)
    db.session.commit()
    Actividad.registrar(current_user.id, "Eliminó medicamento", "Medicamentos", m.nombre)
    flash("Medicamento eliminado.", "info")
    return redirect(url_for("medicamentos.index"))
