import { useState } from "react";
import { X, Calendar, Save } from "lucide-react";
import { useApp, Cita } from "@/App";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  cita?: Cita;
}

export function ModalCita({ open, onClose, cita }: Props) {
  const { modoNoche, agregarCita, actualizarCita, usuario, pacienteActual } = useApp();
  const [form, setForm] = useState({
    especialidad: cita?.especialidad || "",
    medico: cita?.medico || "",
    hospital: cita?.hospital || "",
    direccion: cita?.direccion || "",
    telefono: cita?.telefono || "",
    fecha: cita?.fecha || "",
    hora: cita?.hora || "",
    motivo: cita?.motivo || "",
    indicaciones: cita?.indicaciones || "",
    ayuno: cita?.ayuno || false,
    llevarEstudios: cita?.llevarEstudios || false,
    observaciones: cita?.observaciones || "",
    estado: cita?.estado || "Pendiente" as const
  });

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cita) {
      actualizarCita({ ...cita, ...form });
    } else {
      const pacienteId = pacienteActual?.id || 1;
      agregarCita({ ...form, creadoPor: usuario.nombre, pacienteId });
    }
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? target.checked : value
    }));
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
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{cita ? "Editar cita" : "Nueva cita médica"}</h2>
              <p className="text-xs text-slate-500">Completa la información de la cita</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Campo label="Especialidad *" name="especialidad" value={form.especialidad} onChange={handleChange} required placeholder="Cardiología" />
            <Campo label="Médico/a *" name="medico" value={form.medico} onChange={handleChange} required placeholder="Dr. Nombre Apellido" />
            <Campo label="Hospital / Clínica" name="hospital" value={form.hospital} onChange={handleChange} placeholder="Hospital Ángeles" />
            <Campo label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} placeholder="5551234567" />
            <Campo label="Fecha *" name="fecha" type="date" value={form.fecha} onChange={handleChange} required />
            <Campo label="Hora *" name="hora" type="time" value={form.hora} onChange={handleChange} required />
            <Campo label="Motivo" name="motivo" value={form.motivo} onChange={handleChange} placeholder="Control mensual" />
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Estado</label>
              <select name="estado" value={form.estado} onChange={handleChange}
                className={cn("w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-sky-500/30",
                  modoNoche ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")}>
                <option value="Pendiente">Pendiente</option>
                <option value="Completada">Completada</option>
                <option value="Reprogramada">Reprogramada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
          </div>
          <Campo label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} placeholder="Calle, número, colonia" />
          <Campo label="Indicaciones" name="indicaciones" value={form.indicaciones} onChange={handleChange} placeholder="Ayuno, llegar 15 min antes, etc." />
          <Campo label="Observaciones" name="observaciones" value={form.observaciones} onChange={handleChange} placeholder="Notas adicionales" />

          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="ayuno" checked={form.ayuno} onChange={handleChange} className="rounded" />
              Requiere ayuno
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="llevarEstudios" checked={form.llevarEstudios} onChange={handleChange} className="rounded" />
              Llevar estudios previos
            </label>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-800">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-sky-500 text-white text-sm font-medium hover:bg-sky-600 flex items-center gap-2">
            <Save className="w-4 h-4" /> {cita ? "Guardar cambios" : "Crear cita"}
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
