"""
Blueprint de Usuarios (solo ADMIN).

Gestión de usuarios familiares: crear, editar, cambiar roles y eliminar.
"""

from flask import Blueprint, render_template, request, redirect, url_for, flash, abort
from flask_login import login_required, current_user

from models import Usuario, db, Actividad
from app import rol_requerido

usuarios_bp = Blueprint("usuarios", __name__, url_prefix="/usuarios")


@usuarios_bp.route("/")
@login_required
@rol_requerido("ADMIN")
def index():
    """Listado de usuarios del sistema."""
    usuarios = Usuario.query.order_by(Usuario.nombre.asc()).all()
    return render_template("usuarios.html", usuarios=usuarios)


@usuarios_bp.route("/nuevo", methods=["GET", "POST"])
@login_required
@rol_requerido("ADMIN")
def nuevo():
    if request.method == "POST":
        correo = request.form["correo"].strip().lower()
        if Usuario.query.filter_by(correo=correo).first():
            flash("Ya existe un usuario con ese correo.", "warning")
            return redirect(request.url)

        u = Usuario(
            nombre=request.form["nombre"],
            correo=correo,
            rol=request.form.get("rol", "FAMILIAR"),
            telefono=request.form.get("telefono", "")
        )
        u.set_password(request.form["password"])
        db.session.add(u)
        db.session.commit()
        Actividad.registrar(current_user.id, "Creó usuario", "Usuarios", u.nombre)
        flash(f"Usuario '{u.nombre}' creado.", "success")
        return redirect(url_for("usuarios.index"))

    return render_template("usuarios_form.html", usuario=None)


@usuarios_bp.route("/<int:id>/editar", methods=["GET", "POST"])
@login_required
@rol_requerido("ADMIN")
def editar(id):
    u = Usuario.query.get_or_404(id)
    if request.method == "POST":
        u.nombre = request.form["nombre"]
        u.correo = request.form["correo"].strip().lower()
        u.rol = request.form.get("rol", u.rol)
        u.telefono = request.form.get("telefono", "")
        nueva_pass = request.form.get("password", "")
        if nueva_pass:
            u.set_password(nueva_pass)
        db.session.commit()
        Actividad.registrar(current_user.id, "Editó usuario", "Usuarios", u.nombre)
        flash("Usuario actualizado.", "success")
        return redirect(url_for("usuarios.index"))

    return render_template("usuarios_form.html", usuario=u)


@usuarios_bp.route("/<int:id>/eliminar", methods=["POST"])
@login_required
@rol_requerido("ADMIN")
def eliminar(id):
    u = Usuario.query.get_or_404(id)
    if u.id == current_user.id:
        flash("No puedes eliminar tu propia cuenta.", "danger")
        return redirect(url_for("usuarios.index"))
    db.session.delete(u)
    db.session.commit()
    Actividad.registrar(current_user.id, "Eliminó usuario", "Usuarios", u.nombre)
    flash("Usuario eliminado.", "info")
    return redirect(url_for("usuarios.index"))
