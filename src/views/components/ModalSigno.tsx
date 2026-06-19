import { useState } from "react";
import { X, Activity, Save, Gauge, Droplets, Weight, Thermometer, Wind } from "lucide-react";
import { useApp, SignoVital } from "@/App";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  signo?: SignoVital;
}

export function ModalSigno({ open, onClose, signo }: Props) {
  const { modoNoche, agregarSigno, actualizarSigno, pacienteActual } = useApp();
  const hoy = new Date().toISOString().split("T")[0];
  const ahora = new Date().toTimeString().slice(0, 5);

  const [form, setForm] = useState({
    fecha: signo?.fecha || hoy,
    hora: signo?.hora || ahora,
    presionSistolica: signo?.presionSistolica || 120,
    presionDiastolica: signo?.presionDiastolica || 80,
    glucosa: signo?.glucosa || 100,
    peso: signo?.peso || 0,
    temperatura: signo?.temperatura || 36.5,
    oxigenacion: signo?.oxigenacion || 98,
    pulso: signo?.pulso || 70,
    notas: signo?.notas || ""
  });

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signo) {
      actualizarSigno({ ...signo, ...form });
    } else {
      agregarSigno({ ...form, pacienteId: pacienteActual?.id || 1 });
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
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Registrar signos vitales</h2>
              <p className="text-xs text-slate-500">Toma las mediciones con cuidado</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <CampoNum label="Sistólica" name="presionSistolica" value={form.presionSistolica} onChange={handleChange} icon={<Gauge className="w-3 h-3" />} unit="mmHg" />
            <CampoNum label="Diastólica" name="presionDiastolica" value={form.presionDiastolica} onChange={handleChange} icon={<Gauge className="w-3 h-3" />} unit="mmHg" />
            <CampoNum label="Glucosa" name="glucosa" value={form.glucosa} onChange={handleChange} icon={<Droplets className="w-3 h-3" />} unit="mg/dL" />
            <CampoNum label="Peso" name="peso" value={form.peso} onChange={handleChange} step="0.1" icon={<Weight className="w-3 h-3" />} unit="kg" />
            <CampoNum label="Temperatura" name="temperatura" value={form.temperatura} onChange={handleChange} step="0.1" icon={<Thermometer className="w-3 h-3" />} unit="°C" />
            <CampoNum label="Oxigenación" name="oxigenacion" value={form.oxigenacion} onChange={handleChange} icon={<Wind className="w-3 h-3" />} unit="%" />
            <CampoNum label="Pulso" name="pulso" value={form.pulso} onChange={handleChange} icon={<Activity className="w-3 h-3" />} unit="lpm" />
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Fecha</label>
              <input type="date" name="fecha" value={form.fecha} onChange={handleChange}
                className={cn("w-full px-3 py-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-sky-500/30",
                  modoNoche ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Notas</label>
            <textarea name="notas" value={form.notas} onChange={handleChange} rows={3}
              className={cn("w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-sky-500/30 resize-none",
                modoNoche ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")}
              placeholder="Comentarios adicionales sobre el estado de ánimo, síntomas, etc." />
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-800">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 flex items-center gap-2">
            <Save className="w-4 h-4" /> Guardar signos
          </button>
        </div>
      </div>
    </div>
  );
}

function CampoNum({ label, name, value, onChange, icon, unit, step = 1 }: any) {
  const { modoNoche } = useApp();
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <div className="relative">
        <input type="number" step={step} name={name} value={value} onChange={onChange}
          className={cn("w-full pl-8 pr-12 py-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-sky-500/30",
            modoNoche ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")} />
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">{unit}</span>
      </div>
    </div>
  );
}
