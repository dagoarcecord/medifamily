import { useState } from "react";
import { Stethoscope, Search, Plus, Trash2, Edit, Save, X, Phone, Mail, MapPin } from "lucide-react";
import { useApp, Medico } from "@/App";
import { cn, iniciales } from "@/lib/utils";

export function DirectorioView() {
  const { medicos, modoNoche } = useApp();
  const { medicos: _m, ..._r } = useApp();
  void _m; void _r;
  const [busqueda, setBusqueda] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editando, setEditando] = useState<Medico | null>(null);

  const [form, setForm] = useState({
    nombre: "",
    especialidad: "",
    telefono: "",
    correo: "",
    direccion: ""
  });

  const filtrados = medicos.filter(m =>
    m.nombre.toLowerCase().includes(busqueda.toLowerCase())
    || m.especialidad.toLowerCase().includes(busqueda.toLowerCase())
  );

  const especialidades = [...new Set(filtrados.map(m => m.especialidad))];

  const abrirNuevo = () => {
    setEditando(null);
    setForm({ nombre: "", especialidad: "", telefono: "", correo: "", direccion: "" });
    setOpenModal(true);
  };

  const abrirEditar = (m: Medico) => {
    setEditando(m);
    setForm({ nombre: m.nombre, especialidad: m.especialidad, telefono: m.telefono, correo: m.correo || "", direccion: m.direccion || "" });
    setOpenModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.especialidad) return;

    const lista = [...medicos];
    if (editando) {
      const idx = lista.findIndex(x => x.id === editando.id);
      if (idx >= 0) {
        lista[idx] = { ...editando, ...form };
      }
    } else {
      const nuevoId = Math.max(0, ...lista.map(x => x.id)) + 1;
      lista.push({ id: nuevoId, ...form });
    }
    // Use the global state setter via localStorage persistence
    localStorage.setItem("medifamily-datos", JSON.stringify({
      ...JSON.parse(localStorage.getItem("medifamily-datos") || "{}"),
      medicos: lista
    }));
    window.location.reload();
    setOpenModal(false);
  };

  const eliminar = (id: number) => {
    if (!confirm("¿Eliminar este médico del directorio?")) return;
    const lista = medicos.filter(x => x.id !== id);
    localStorage.setItem("medifamily-datos", JSON.stringify({
      ...JSON.parse(localStorage.getItem("medifamily-datos") || "{}"),
      medicos: lista
    }));
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Directorio médico</h1>
          <p className="text-sm text-slate-500">{medicos.length} médico(s) registrado(s)</p>
        </div>
        <button onClick={abrirNuevo}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 flex items-center gap-2 shadow-lg shadow-emerald-500/30">
          <Plus className="w-4 h-4" /> Agregar médico
        </button>
      </div>

      <div className={cn("flex items-center gap-2 px-3 py-2.5 rounded-xl border",
        modoNoche ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")}>
        <Search className="w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Buscar por nombre o especialidad..."
          value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none" />
      </div>

      <div className="space-y-5">
        {especialidades.map(esp => {
          const docs = filtrados.filter(m => m.especialidad === esp);
          return (
            <div key={esp}>
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-500" />
                {esp} ({docs.length})
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {docs.map(m => (
                  <div key={m.id}
                    className={cn("rounded-2xl border p-4 flex gap-3 transition-all hover:shadow-lg",
                      modoNoche ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200")}>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {iniciales(m.nombre)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold">{m.nombre}</h4>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{m.especialidad}</p>
                      <div className="space-y-0.5 mt-2">
                        <a href={`tel:${m.telefono}`} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-600">
                          <Phone className="w-3 h-3" /> {m.telefono}
                        </a>
                        {m.correo && (
                          <a href={`mailto:${m.correo}`} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-600">
                            <Mail className="w-3 h-3" /> {m.correo}
                          </a>
                        )}
                        {m.direccion && (
                          <p className="flex items-center gap-1.5 text-xs text-slate-500">
                            <MapPin className="w-3 h-3" /> {m.direccion}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <button onClick={() => abrirEditar(m)}
                        className="p-2 rounded-lg text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/30">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => eliminar(m.id)}
                        className="p-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {openModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpenModal(false)} />
          <div className={cn("relative w-full max-w-lg rounded-2xl shadow-2xl border",
            modoNoche ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-emerald-500" />
                {editando ? "Editar médico" : "Nuevo médico"}
              </h2>
              <button onClick={() => setOpenModal(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Nombre completo *</label>
                  <input value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Dr. Nombre Apellido"
                    className={cn("w-full px-3 py-2 rounded-lg text-sm border outline-none",
                      modoNoche ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Especialidad *</label>
                  <input value={form.especialidad}
                    onChange={(e) => setForm({ ...form, especialidad: e.target.value })}
                    placeholder="Cardiología"
                    className={cn("w-full px-3 py-2 rounded-lg text-sm border outline-none",
                      modoNoche ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Teléfono</label>
                  <input value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    placeholder="5551234567"
                    className={cn("w-full px-3 py-2 rounded-lg text-sm border outline-none",
                      modoNoche ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Correo</label>
                  <input value={form.correo}
                    onChange={(e) => setForm({ ...form, correo: e.target.value })}
                    placeholder="medico@hospital.com"
                    className={cn("w-full px-3 py-2 rounded-lg text-sm border outline-none",
                      modoNoche ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Dirección del consultorio</label>
                  <input value={form.direccion}
                    onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                    placeholder="Hospital Ángeles - Consultorio 402"
                    className={cn("w-full px-3 py-2 rounded-lg text-sm border outline-none",
                      modoNoche ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")} />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setOpenModal(false)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-800">
                  Cancelar
                </button>
                <button type="submit"
                  className="flex-1 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 flex items-center justify-center gap-1">
                  <Save className="w-4 h-4" /> Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
