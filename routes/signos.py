"""
Blueprint de Signos Vitales.

Registro y visualización de signos vitales con gráficas de tendencia.
"""

from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_required, current_user

from models import SignoVital, db, Actividad
from app import rol_requerido

signos_bp = Blueprint("signos", __name__, url_prefix="/signos")


@signos_bp.route("/")
@login_required
def index():
    """Vista con historial y gráficas de signos vitales."""
    metrica = request.args.get("metrica", "presion")
    signos = SignoVital.query.order_by(SignoVital.fecha.desc(), SignoVital.hora.desc()).all()
    return render_template("signos.html", signos=signos, metrica=metrica)


@signos_bp.route("/nuevo", methods=["GET", "POST"])
@login_required
@rol_requerido("ADMIN", "FAMILIAR")
def nuevo():
    if request.method == "POST":
        s = SignoVital(
            fecha=request.form["fecha"],
            hora=request.form["hora"],
            presion_sistolica=int(request.form["presion_sistolica"]),
            presion_diastolica=int(request.form["presion_diastolica"]),
            glucosa=int(request.form.get("glucosa") or 0),
            peso=float(request.form.get("peso") or 0),
            temperatura=float(request.form.get("temperatura") or 0),
            oxigenacion=int(request.form.get("oxigenacion") or 98),
            pulso=int(request.form.get("pulso") or 70),
            notas=request.form.get("notas", ""),
            registrado_por_id=current_user.id
        )
        db.session.add(s)
        db.session.commit()
        Actividad.registrar(current_user.id, "Registró signos vitales", "Signos Vitales", s.fecha.isoformat())
        flash("Signos vitales registrados.", "success")
        return redirect(url_for("signos.index"))

    return render_template("signos_form.html")


@signos_bp.route("/api/datos")
@login_required
def api_datos():
    """API para gráficas de tendencias."""
    signos = (
        SignoVital.query
        .order_by(SignoVital.fecha.asc(), SignoVital.hora.asc())
        .all()
    )
    return jsonify([s.to_dict() for s in signos])
