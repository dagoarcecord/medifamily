import { useState, useMemo } from "react";
import { Calendar, Plus, Search, MapPin, Phone, Clock, AlertTriangle, Edit, Trash2, MessageCircle } from "lucide-react";
import { useApp, Cita } from "@/App";
import { cn, estadoColor, daysFromNow } from "@/lib/utils";
import { generarEnlaceWhatsApp, generarMensajeCita } from "@/lib/whatsapp";
import { ModalCita } from "./components/ModalCita";

export function CitasView() {
  const { citas, eliminarCita, tienePermiso, modoNoche, usuario } = useApp();
  const [openModal, setOpenModal] = useState(false);
  const [citaEditar, setCitaEditar] = useState<Cita | undefined>();
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("Todos");

  const citasFiltradas = useMemo(() => {
    return citas.filter(c => {
      const matchBusq = c.especialidad.toLowerCase().includes(busqueda.toLowerCase())
        || c.medico.toLowerCase().includes(busqueda.toLowerCase());
      const matchEstado = filtroEstado === "Todos" || c.estado === filtroEstado;
      return matchBusq && matchEstado;
    }).sort((a, b) => a.fecha.localeCompare(b.fecha));
  }, [citas, busqueda, filtroEstado]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Citas médicas</h1>
          <p className="text-sm text-slate-500">{citasFiltradas.length} cita(s) programada(s)</p>
        </div>
        {tienePermiso("crear") && (
          <button onClick={() => { setCitaEditar(undefined); setOpenModal(true); }}
            className="px-4 py-2.5 rounded-xl bg-sky-500 text-white text-sm font-medium hover:bg-sky-600 flex items-center gap-2 shadow-lg shadow-sky-500/30">
            <Plus className="w-4 h-4" /> Nueva cita
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className={cn("flex items-center gap-2 px-3 py-2.5 rounded-xl border flex-1",
          modoNoche ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")}>
          <Search className="w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Buscar por especialidad o médico..."
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none" />
        </div>
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}
          className={cn("px-3 py-2.5 rounded-xl text-sm border outline-none",
            modoNoche ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")}>
          <option value="Todos">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Completada">Completada</option>
          <option value="Reprogramada">Reprogramada</option>
          <option value="Cancelada">Cancelada</option>
        </select>
      </div>

      <div className="grid gap-3">
        {citasFiltradas.length === 0 && (
          <div className={cn("text-center py-12 rounded-2xl border-2 border-dashed",
            modoNoche ? "border-slate-700 text-slate-400" : "border-slate-200 text-slate-500")}>
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No hay citas que coincidan con los filtros</p>
          </div>
        )}
        {citasFiltradas.map(c => {
          const dias = daysFromNow(c.fecha);
          const urgente = dias <= 3 && c.estado === "Pendiente";
          return (
            <div key={c.id}
              className={cn("rounded-2xl border p-4 md:p-5 flex flex-col md:flex-row gap-4 transition-all hover:shadow-lg",
                modoNoche ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200")}>
              <div className={cn("md:w-24 h-20 md:h-auto rounded-xl flex flex-col items-center justify-center text-white font-bold flex-shrink-0",
                urgente ? "bg-gradient-to-br from-rose-500 to-amber-500" : "bg-gradient-to-br from-sky-500 to-cyan-600")}>
                <span className="text-xs opacity-90">{c.fecha.slice(0, 7)}</span>
                <span className="text-2xl leading-tight">{c.fecha.slice(8)}</span>
                {urgente && <span className="text-[10px] mt-1 bg-white/20 px-1 rounded">¡PRONTO!</span>}
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-base">{c.especialidad}</h3>
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", estadoColor(c.estado))}>
                    {c.estado}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{c.medico}</p>
                <p className="text-sm font-medium text-sky-700 dark:text-sky-400">{c.hora} hrs</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.hospital}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {c.telefono}</span>
                </div>
                {c.indicaciones && (
                  <div className="flex gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
                    <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                    <p>{c.indicaciones}</p>
                  </div>
                )}
                {c.ayuno && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 rounded-full">
                    <Clock className="w-3 h-3" /> Requiere ayuno
                  </span>
                )}
              </div>
              <div className="flex md:flex-col gap-2 flex-shrink-0">
                <a
                  href={generarEnlaceWhatsApp(
                    usuario.telefono,
                    generarMensajeCita({
                      especialidad: c.especialidad,
                      medico: c.medico,
                      hospital: c.hospital,
                      fecha: c.fecha,
                      hora: c.hora,
                      indicaciones: c.indicaciones
                    })
                  )}
                  target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                  title="Compartir por WhatsApp">
                  <MessageCircle className="w-4 h-4" />
                </a>
                {tienePermiso("editar") && (
                  <button onClick={() => { setCitaEditar(c); setOpenModal(true); }}
                    className="p-2 rounded-lg text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/30">
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                {tienePermiso("eliminar") && (
                  <button onClick={() => eliminarCita(c.id)}
                    className="p-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ModalCita open={openModal} onClose={() => setOpenModal(false)} cita={citaEditar} />
    </div>
  );
}
