import { useState, useMemo } from "react";
import { Pill, Plus, Search, Trash2, Edit, AlertTriangle, Clock } from "lucide-react";
import { useApp, Medicamento } from "@/App";
import { cn } from "@/lib/utils";
import { ModalMedicamento } from "./components/ModalMedicamento";

export function MedicamentosView() {
  const { medicamentos, eliminarMedicamento, tienePermiso, modoNoche } = useApp();
  const [openModal, setOpenModal] = useState(false);
  const [editar, setEditar] = useState<Medicamento | undefined>();
  const [busqueda, setBusqueda] = useState("");
  const [vista, setVista] = useState<"lista" | "diaria" | "semanal">("lista");

  const filtrados = useMemo(() => {
    return medicamentos.filter(m =>
      m.nombre.toLowerCase().includes(busqueda.toLowerCase())
      || m.dosis.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [medicamentos, busqueda]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Medicamentos</h1>
          <p className="text-sm text-slate-500">{medicamentos.length} medicamento(s) activo(s)</p>
        </div>
        {tienePermiso("crear") && (
          <button onClick={() => { setEditar(undefined); setOpenModal(true); }}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 flex items-center gap-2 shadow-lg shadow-emerald-500/30">
            <Plus className="w-4 h-4" /> Nuevo medicamento
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className={cn("flex items-center gap-2 px-3 py-2.5 rounded-xl border flex-1",
          modoNoche ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")}>
          <Search className="w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Buscar medicamento..."
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none" />
        </div>
        <div className={cn("flex rounded-xl border p-1",
          modoNoche ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")}>
          {["lista", "diaria", "semanal"].map(v => (
            <button key={v}
              onClick={() => setVista(v as any)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                vista === v ? "bg-emerald-500 text-white" : "text-slate-500")}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {vista === "lista" && (
        <div className="grid md:grid-cols-2 gap-3">
          {filtrados.map(m => {
            const bajoStock = m.stock < 14;
            return (
              <div key={m.id}
                className={cn("rounded-2xl border p-4 flex gap-3 transition-all hover:shadow-lg",
                  modoNoche ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200")}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white flex-shrink-0">
                  <Pill className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{m.nombre}</h3>
                    {bajoStock && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                        <AlertTriangle className="w-2.5 h-2.5" /> Stock bajo
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{m.dosis} · {m.frecuencia}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.hora1 && <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-mono">{m.hora1}</span>}
                    {m.hora2 && <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-mono">{m.hora2}</span>}
                    {m.hora3 && <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-mono">{m.hora3}</span>}
                  </div>
                  {m.observaciones && (
                    <p className="text-xs text-slate-500 mt-1">{m.observaciones}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>Stock: {m.stock}</span>
                    <span>Hasta: {m.fechaFin}</span>
                  </div>
                </div>
                {tienePermiso("editar") && (
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <button onClick={() => { setEditar(m); setOpenModal(true); }}
                      className="p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30">
                      <Edit className="w-4 h-4" />
                    </button>
                    {tienePermiso("eliminar") && (
                      <button onClick={() => eliminarMedicamento(m.id)}
                        className="p-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {(vista === "diaria" || vista === "semanal") && (
        <div className={cn("rounded-2xl border p-6 text-center",
          modoNoche ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200")}>
          <Clock className="w-12 h-12 mx-auto mb-3 text-emerald-500/30" />
          <h3 className="font-semibold mb-1">Vista {vista}</h3>
          <p className="text-sm text-slate-500">
            {vista === "diaria"
              ? "Agenda diaria de medicamentos con recordatorios."
              : "Agenda semanal con distribución por día."}
          </p>
          <div className="grid md:grid-cols-7 gap-2 mt-6">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(d => (
              <div key={d} className={cn("p-3 rounded-lg text-xs font-medium",
                modoNoche ? "bg-slate-800" : "bg-slate-50")}>
                {d}
              </div>
            ))}
          </div>
        </div>
      )}

      <ModalMedicamento open={openModal} onClose={() => setOpenModal(false)} medicamento={editar} />
    </div>
  );
}
