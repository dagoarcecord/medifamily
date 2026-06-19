import { useState } from "react";
import { X, Pill, Save } from "lucide-react";
import { useApp, Medicamento } from "@/App";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  medicamento?: Medicamento;
}

export function ModalMedicamento({ open, onClose, medicamento }: Props) {
  const { modoNoche, agregarMedicamento, actualizarMedicamento, usuario, pacienteActual } = useApp();
  const [form, setForm] = useState({
    nombre: medicamento?.nombre || "",
    dosis: medicamento?.dosis || "",
    frecuencia: medicamento?.frecuencia || "",
    hora1: medicamento?.hora1 || "",
    hora2: medicamento?.hora2 || "",
    hora3: medicamento?.hora3 || "",
    fechaInicio: medicamento?.fechaInicio || "",
    fechaFin: medicamento?.fechaFin || "",
    observaciones: medicamento?.observaciones || "",
    stock: medicamento?.stock ?? 0,
    creadoPor: medicamento?.creadoPor || usuario.nombre
  });

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (medicamento) {
      actualizarMedicamento({ ...medicamento, ...form });
    } else {
      agregarMedicamento({ ...form, creadoPor: usuario.nombre, pacienteId: pacienteActual?.id || 1 });
    }
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn(
        "relative w-full max-w-2xl rounded-2xl shadow-2xl border max-h-[90vh] overflow-hidden flex flex-col",
        modoNoche ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
      )}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{medicamento ? "Editar medicamento" : "Nuevo medicamento"}</h2>
              <p className="text-xs text-slate-500">Información del tratamiento</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Campo label="Nombre del medicamento *" name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Enalapril" />
            <Campo label="Dosis *" name="dosis" value={form.dosis} onChange={handleChange} required placeholder="10 mg" />
            <Campo label="Frecuencia *" name="frecuencia" value={form.frecuencia} onChange={handleChange} required placeholder="2 veces al día" />
            <Campo label="Stock actual" name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="30" />
            <Campo label="Hora 1" name="hora1" type="time" value={form.hora1} onChange={handleChange} />
            <Campo label="Hora 2" name="hora2" type="time" value={form.hora2} onChange={handleChange} />
            <Campo label="Hora 3" name="hora3" type="time" value={form.hora3} onChange={handleChange} />
            <Campo label="Fecha inicio" name="fechaInicio" type="date" value={form.fechaInicio} onChange={handleChange} />
            <Campo label="Fecha fin" name="fechaFin" type="date" value={form.fechaFin} onChange={handleChange} />
          </div>
          <Campo label="Observaciones" name="observaciones" value={form.observaciones} onChange={handleChange} placeholder="Tomar con alimentos" />
        </form>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-800">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 flex items-center gap-2">
            <Save className="w-4 h-4" /> {medicamento ? "Guardar cambios" : "Crear medicamento"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Campo({ label, ...props }: any) {
  const { modoNoche } = useApp();
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <input {...props}
        className={cn("w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-sky-500/30",
          modoNoche ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")}
      />
    </div>
  );
}
