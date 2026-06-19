import { useState } from "react";
import { ShoppingBag, MapPin, Calendar, CheckCircle2, AlertCircle, MessageCircle, Plus, Trash2, Edit, Save, X, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { useApp, Recoleccion } from "@/App";
import { cn, daysFromNow, formatDate } from "@/lib/utils";
import { generarEnlaceWhatsApp, generarMensajeRecoleccion } from "@/lib/whatsapp";

export function RecoleccionView() {
  const { recolecciones, modoNoche, usuario, pacienteActual } = useApp();
  const { eliminarRecoleccion, agregarRecoleccion } = useApp();
  const [openModal, setOpenModal] = useState(false);
  const [editando, setEditando] = useState<Recoleccion | null>(null);
  const [openRecogido, setOpenRecogido] = useState<Recoleccion | null>(null);
  const [expandido, setExpandido] = useState<number | null>(null);

  const pendientes = recolecciones
    .filter(r => r.estado === "Pendiente")
    .sort((a, b) => a.fechaRecoleccion.localeCompare(b.fechaRecoleccion));
  const recogidos = recolecciones.filter(r => r.estado === "Recogido");

  const handleEliminar = (id: number) => {
    if (confirm("¿Eliminar esta recolección? Esta acción no se puede deshacer.")) {
      eliminarRecoleccion(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-6 text-white shadow-xl shadow-amber-500/25 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3 blur-2xl" />
        <div className="relative flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-amber-100 text-sm font-medium mb-1">Recolección de medicamentos</p>
            <h2 className="text-2xl font-bold">¡No olvides recogerlos!</h2>
            <p className="text-amber-100 text-sm">Tienes {pendientes.length} medicamento(s) pendientes por recoger</p>
          </div>
          <button onClick={() => { setEditando(null); setOpenModal(true); }}
            className="px-4 py-2.5 rounded-xl bg-white text-amber-700 text-sm font-semibold hover:bg-amber-50 shadow-lg flex items-center gap-2 cursor-pointer">
            <Plus className="w-4 h-4" /> Nueva recolección
          </button>
        </div>
      </div>

      {/* Pendientes */}
      <div>
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" /> Pendientes ({pendientes.length})
        </h3>
        <div className="grid gap-3">
          {pendientes.length === 0 && (
            <div className={cn("text-center py-8 rounded-2xl border-2 border-dashed",
              modoNoche ? "border-slate-700 text-slate-400" : "border-slate-200 text-slate-500")}>
              <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500/40" />
              <p className="text-sm">¡Todo al día!</p>
            </div>
          )}
          {pendientes.map(r => {
            const dias = daysFromNow(r.fechaRecoleccion);
            const urgente = dias <= 2;
            const estaExpandido = expandido === r.id;
            return (
              <div key={r.id}
                className={cn("rounded-2xl border transition-all overflow-hidden",
                  urgente
                    ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/40"
                    : modoNoche ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200")}>
                <div
                  className="p-4 flex items-start gap-3 cursor-pointer"
                  onClick={() => setExpandido(estaExpandido ? null : r.id)}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white flex-shrink-0">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold">{r.medicamentoNombre}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 flex-wrap">
                      <MapPin className="w-3 h-3" /> {r.lugar}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="text-xs flex items-center gap-1 text-slate-500">
                        <Calendar className="w-3 h-3" /> {formatDate(r.fechaRecoleccion)}
                      </span>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium",
                        urgente ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300")}>
                        {dias === 0 ? "HOY" : dias === 1 ? "Mañana" : `En ${dias} días`}
                      </span>
                    </div>
                  </div>
                  <button
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {estaExpandido ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Contenido expandido */}
                {estaExpandido && (
                  <div className={cn("px-4 pb-4 space-y-3 border-t",
                    modoNoche ? "border-slate-800" : "border-slate-200")}>
                    <div className="pt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Medicamento</p>
                        <p className="font-medium text-sm">{r.medicamentoNombre}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Lugar</p>
                        <p className="text-sm">{r.lugar}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Fecha de recolección</p>
                        <p className="text-sm">{formatDate(r.fechaRecoleccion)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Estado</p>
                        <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium inline-block mt-0.5",
                          "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300")}>
                          {r.estado}
                        </span>
                      </div>
                      {r.observaciones && (
                        <div className="md:col-span-2">
                          <p className="text-xs text-slate-500 font-medium">Observaciones</p>
                          <p className="text-sm italic">"{r.observaciones}"</p>
                        </div>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <a
                        href={generarEnlaceWhatsApp(
                          usuario.telefono,
                          generarMensajeRecoleccion({
                            medicamento: r.medicamentoNombre,
                            lugar: r.lugar,
                            fecha: r.fechaRecoleccion
                          })
                        )}
                        target="_blank" rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500 text-white hover:bg-emerald-600 flex items-center gap-1 cursor-pointer"
                      >
                        <MessageCircle className="w-3 h-3" /> WhatsApp
                      </a>
                      <button onClick={() => { setEditando(r); setOpenModal(true); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/30 flex items-center gap-1 cursor-pointer">
                        <Edit className="w-3 h-3" /> Editar
                      </button>
                      <button onClick={() => setOpenRecogido(r)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600 flex items-center gap-1 cursor-pointer">
                        <CheckCircle2 className="w-3 h-3" /> Marcar recogido
                      </button>
                      <button onClick={() => handleEliminar(r.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 flex items-center gap-1 cursor-pointer">
                        <Trash2 className="w-3 h-3" /> Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recogidos */}
      {recogidos.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Recogidos ({recogidos.length})
          </h3>
          <div className="grid gap-3">
            {recogidos.map(r => {
              const estaExpandido = expandido === r.id;
              return (
                <div key={r.id}
                  className={cn("rounded-2xl border transition-all overflow-hidden",
                    modoNoche ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200")}>
                  <div
                    className="p-4 flex items-start gap-3 cursor-pointer"
                    onClick={() => setExpandido(estaExpandido ? null : r.id)}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium line-through">{r.medicamentoNombre}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {r.lugar}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{formatDate(r.fechaRecoleccion)}</p>
                      {r.quienRecogio && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                          ✓ Recogió: {r.quienRecogio}
                          {r.cuandoRecogio && ` · ${formatDate(r.cuandoRecogio)}`}
                        </p>
                      )}
                    </div>
                    <button
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {estaExpandido ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                  {estaExpandido && (
                    <div className={cn("px-4 pb-4 space-y-3 border-t",
                      modoNoche ? "border-slate-800" : "border-slate-200")}>
                      <div className="pt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Medicamento</p>
                          <p className="font-medium text-sm">{r.medicamentoNombre}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Lugar</p>
                          <p className="text-sm">{r.lugar}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Fecha programada</p>
                          <p className="text-sm">{formatDate(r.fechaRecoleccion)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Estado</p>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium inline-block mt-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                            {r.estado}
                          </span>
                        </div>
                        {r.quienRecogio && (
                          <div>
                            <p className="text-xs text-slate-500 font-medium">Recogido por</p>
                            <p className="text-sm">{r.quienRecogio}</p>
                          </div>
                        )}
                        {r.cuandoRecogio && (
                          <div>
                            <p className="text-xs text-slate-500 font-medium">Fecha real de recolección</p>
                            <p className="text-sm flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {formatDate(r.cuandoRecogio)}
                            </p>
                          </div>
                        )}
                        {r.comentarios && (
                          <div className="md:col-span-2">
                            <p className="text-xs text-slate-500 font-medium">Comentarios</p>
                            <p className="text-sm italic">"{r.comentarios}"</p>
                          </div>
                        )}
                        {r.observaciones && (
                          <div className="md:col-span-2">
                            <p className="text-xs text-slate-500 font-medium">Observaciones originales</p>
                            <p className="text-sm italic">"{r.observaciones}"</p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button onClick={() => setOpenRecogido(r)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500 text-white hover:bg-amber-600 flex items-center gap-1 cursor-pointer">
                          <Clock className="w-3 h-3" /> Editar recogida
                        </button>
                        <button onClick={() => handleEliminar(r.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 flex items-center gap-1 cursor-pointer">
                          <Trash2 className="w-3 h-3" /> Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <ModalRecoleccion
        open={openModal}
        onClose={() => setOpenModal(false)}
        editando={editando}
      />

      <ModalMarcarRecogido
        open={openRecogido !== null}
        recoleccion={openRecogido}
        onClose={() => setOpenRecogido(null)}
      />
    </div>
  );
}

function ModalRecoleccion({ open, onClose, editando }: {
  open: boolean; onClose: () => void; editando: Recoleccion | null;
}) {
  const { modoNoche, actualizarRecoleccion } = useApp();

  const [form, setForm] = useState({
    medicamentoNombre: editando?.medicamentoNombre || "",
    lugar: editando?.lugar || "",
    fechaRecoleccion: editando?.fechaRecoleccion || "",
    observaciones: editando?.observaciones || ""
  });

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.medicamentoNombre.trim() || !form.lugar.trim() || !form.fechaRecoleccion) {
      alert("Completa los campos obligatorios (medicamento, lugar y fecha).");
      return;
    }
    if (editando) {
      actualizarRecoleccion({ ...editando, ...form });
    } else {
      const pacienteId = pacienteActual?.id || 1;
      agregarRecoleccion({
        medicamentoNombre: form.medicamentoNombre,
        lugar: form.lugar,
        fechaRecoleccion: form.fechaRecoleccion,
        observaciones: form.observaciones,
        medicamentoId: 0,
        estado: "Pendiente",
        pacienteId
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative w-full max-w-md rounded-2xl shadow-2xl border",
        modoNoche ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            {editando ? <Edit className="w-5 h-5 text-sky-500" /> : <Plus className="w-5 h-5 text-emerald-500" />}
            {editando ? "Editar recolección" : "Nueva recolección"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Medicamento *</label>
            <input type="text" value={form.medicamentoNombre}
              onChange={(e) => setForm({ ...form, medicamentoNombre: e.target.value })}
              placeholder="Enalapril 10 mg"
              className={cn("w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-amber-500/30",
                modoNoche ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Lugar *</label>
            <input type="text" value={form.lugar}
              onChange={(e) => setForm({ ...form, lugar: e.target.value })}
              placeholder="Farmacia del Ahorro - Reforma"
              className={cn("w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-amber-500/30",
                modoNoche ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Fecha de recolección *</label>
            <input type="date" value={form.fechaRecoleccion}
              onChange={(e) => setForm({ ...form, fechaRecoleccion: e.target.value })}
              className={cn("w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-amber-500/30",
                modoNoche ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Observaciones</label>
            <textarea value={form.observaciones}
              onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
              rows={2}
              placeholder="Solicitar descuento por adulto mayor..."
              className={cn("w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-amber-500/30 resize-none",
                modoNoche ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")} />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
              Cancelar
            </button>
            <button type="submit"
              className="flex-1 py-2 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 flex items-center justify-center gap-1 cursor-pointer">
              <Save className="w-4 h-4" /> {editando ? "Guardar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModalMarcarRecogido({ open, recoleccion, onClose }: {
  open: boolean; recoleccion: Recoleccion | null; onClose: () => void;
}) {
  const { modoNoche, usuario } = useApp();
  const { actualizarRecoleccion } = useApp();
  const [quien, setQuien] = useState(usuario.nombre);
  const [comentarios, setComentarios] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);

  if (!open || !recoleccion) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quien.trim()) {
      alert("Indica quién recogió el medicamento.");
      return;
    }
    actualizarRecoleccion({
      ...recoleccion,
      estado: "Recogido",
      quienRecogio: quien,
      cuandoRecogio: fecha,
      comentarios: comentarios
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative w-full max-w-md rounded-2xl shadow-2xl border",
        modoNoche ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Marcar como recogido
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-3 text-sm">
            <p className="font-medium">{recoleccion.medicamentoNombre}</p>
            <p className="text-xs text-slate-500 mt-0.5">{recoleccion.lugar}</p>
            <p className="text-xs text-slate-500">{recoleccion.fechaRecoleccion}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">¿Quién recogió el medicamento? *</label>
            <input type="text" value={quien}
              onChange={(e) => setQuien(e.target.value)}
              placeholder="Nombre de quien recogió"
              className={cn("w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-emerald-500/30",
                modoNoche ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Fecha de recolección</label>
            <input type="date" value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className={cn("w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-emerald-500/30",
                modoNoche ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Comentarios adicionales</label>
            <textarea value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              rows={3}
              placeholder="Estado del medicamento, precio, descuentos aplicados..."
              className={cn("w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none",
                modoNoche ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")} />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
              Cancelar
            </button>
            <button type="submit"
              className="flex-1 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 flex items-center justify-center gap-1 cursor-pointer">
              <CheckCircle2 className="w-4 h-4" /> Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
