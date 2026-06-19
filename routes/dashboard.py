"""
Blueprint del dashboard principal.

Muestra las tarjetas resumen con citas próximas, medicamentos del día,
estudios pendientes, recolecciones por hacer y últimos signos vitales.
"""

from flask import Blueprint, render_template
from flask_login import login_required, current_user
from datetime import date, timedelta

from models import Cita, Medicamento, Recoleccion, Estudio, SignoVital, Actividad, Notificacion

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/dashboard")
@dashboard_bp.route("/inicio")
@login_required
def index():
    """Vista principal del dashboard."""
    hoy = date.today()
    proxima_cita = (
        Cita.query
        .filter(Cita.fecha >= hoy)
        .filter(Cita.estado.in_(["Pendiente", "Reprogramada"]))
        .order_by(Cita.fecha.asc(), Cita.hora.asc())
        .first()
    )

    citas_pendientes = Cita.query.filter(
        Cita.estado.in_(["Pendiente", "Reprogramada"]),
        Cita.fecha >= hoy
    ).count()

    medicamentos_activos = Medicamento.query.filter(
        (Medicamento.fecha_fin.is_(None)) | (Medicamento.fecha_fin >= hoy)
    ).count()

    estudios_pendientes = Estudio.query.filter(
        Estudio.resultado_disponible.is_(False)
    ).count()

    recolecciones_pendientes = Recoleccion.query.filter_by(estado="Pendiente").count()
    documentos_count = 0  # Placeholder

    signos_recientes = (
        SignoVital.query
        .order_by(SignoVital.fecha.desc(), SignoVital.hora.desc())
        .limit(7)
        .all()
    )

    actividad_reciente = (
        Actividad.query
        .order_by(Actividad.fecha.desc(), Actividad.hora.desc())
        .limit(10)
        .all()
    )

    notificaciones_recientes = (
        Notificacion.query
        .order_by(Notificacion.fecha.desc(), Notificacion.hora.desc())
        .limit(10)
        .all()
    )

    return render_template(
        "dashboard.html",
        proxima_cita=proxima_cita,
        citas_pendientes=citas_pendientes,
        medicamentos_activos=medicamentos_activos,
        estudios_pendientes=estudios_pendientes,
        recolecciones_pendientes=recolecciones_pendientes,
        documentos_count=documentos_count,
        signos_recientes=signos_recientes,
        actividad_reciente=actividad_reciente,
        notificaciones_recientes=notificaciones_recientes
    )
