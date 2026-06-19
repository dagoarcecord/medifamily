import { useState } from "react";
import { Microscope, Plus, Search, Trash2, MapPin, Calendar, FileCheck, AlertCircle } from "lucide-react";
import { useApp, Estudio } from "@/App";
import { cn } from "@/lib/utils";

export function EstudiosView() {
  const { estudios, agregarEstudio, eliminarEstudio, tienePermiso, modoNoche, pacienteActual } = useApp();
  const [busqueda, setBusqueda] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({
    tipo: "Laboratorio" as Estudio["tipo"],
    nombre: "",
    fecha: "",
    lugar: "",
    indicaciones: "",
    resultadoDisponible: false
  });

  const filtrados = estudios.filter(e =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase())
    || e.tipo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleSubmit = () => {
    if (!form.nombre || !form.fecha) return;
    const pacienteId = pacienteActual?.id || 1;
    agregarEstudio({ ...form, asistio: false, pacienteId });
    setForm({ tipo: "Laboratorio", nombre: "", fecha: "", lugar: "", indicaciones: "", resultadoDisponible: false });
    setOpenModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Estudios médicos</h1>
          <p className="text-sm text-slate-500">{estudios.length} estudio(s) registrado(s)</p>
        </div>
        {tienePermiso("crear") && (
          <button onClick={() => setOpenModal(true)}
            className="px-4 py-2.5 rounded-xl bg-violet-500 text-white text-sm font-medium hover:bg-violet-600 flex items-center gap-2 shadow-lg shadow-violet-500/30">
            <Plus className="w-4 h-4" /> Nuevo estudio
          </button>
        )}
      </div>

      <div className={cn("flex items-center gap-2 px-3 py-2.5 rounded-xl border",
        modoNoche ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")}>
        <Search className="w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Buscar estudio..."
          value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtrados.map(e => (
          <div key={e.id}
            className={cn("rounded-2xl border p-4 space-y-2 transition-all hover:shadow-lg",
              modoNoche ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200")}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white">
                <Microscope className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                  {e.tipo}
                </span>
                <h3 className="font-semibold text-sm mt-1 truncate">{e.nombre}</h3>
              </div>
              {tienePermiso("editar") && (
                <button onClick={() => eliminarEstudio(e.id)}
                  className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {e.fecha}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {e.lugar}</span>
            </div>
            {e.indicaciones && (
              <p className="text-xs text-slate-500">{e.indicaciones}</p>
            )}
            <div className="flex items-center gap-2 pt-2">
              {e.resultadoDisponible ? (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  <FileCheck className="w-3 h-3" /> Resultado disponible
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                  <AlertCircle className="w-3 h-3" /> Pendiente resultado
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {openModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpenModal(false)} />
          <div className={cn("relative w-full max-w-lg rounded-2xl shadow-2xl border",
            modoNoche ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")}>
            <div className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Nuevo estudio</h2>
              <div className="grid grid-cols-2 gap-3">
                <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as any })}
                  className={cn("col-span-2 px-3 py-2 rounded-lg text-sm border outline-none",
                    modoNoche ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")}>
                  <option value="Laboratorio">Laboratorio</option>
                  <option value="Rayos X">Rayos X</option>
                  <option value="Resonancia">Resonancia</option>
                  <option value="Tomografia">Tomografía</option>
                  <option value="Ultrasonido">Ultrasonido</option>
                  <option value="Otro">Otro</option>
                </select>
                <input placeholder="Nombre del estudio *" value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className={cn("col-span-2 px-3 py-2 rounded-lg text-sm border outline-none",
                    modoNoche ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")} />
                <input type="date" value={form.fecha}
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                  className="px-3 py-2 rounded-lg text-sm border outline-none" />
                <input placeholder="Lugar" value={form.lugar}
                  onChange={(e) => setForm({ ...form, lugar: e.target.value })}
                  className={cn("px-3 py-2 rounded-lg text-sm border outline-none",
                    modoNoche ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")} />
                <textarea placeholder="Indicaciones"
                  value={form.indicaciones} onChange={(e) => setForm({ ...form, indicaciones: e.target.value })}
                  className={cn("col-span-2 px-3 py-2 rounded-lg text-sm border outline-none resize-none",
                    modoNoche ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")} rows={2} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setOpenModal(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-800">
                  Cancelar
                </button>
                <button onClick={handleSubmit}
                  className="px-4 py-2 rounded-lg bg-violet-500 text-white text-sm font-medium hover:bg-violet-600">
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
