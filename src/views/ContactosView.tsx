import { useState } from "react";
import { Phone, PhoneCall, Heart, User, UserPlus, AlertCircle, Plus, Trash2, Edit, Save, X } from "lucide-react";
import { useApp, ContactoEmergencia } from "@/App";
import { cn } from "@/lib/utils";

export function ContactosView() {
  const { contactos, modoNoche } = useApp();
  const [openModal, setOpenModal] = useState(false);
  const [editando, setEditando] = useState<ContactoEmergencia | null>(null);

  const [form, setForm] = useState({
    nombre: "",
    parentesco: "",
    telefono: "",
    prioridad: 1
  });

  const ordenados = [...contactos].sort((a, b) => {
    if (a.prioridad === 0) return -1;
    if (b.prioridad === 0) return 1;
    return a.prioridad - b.prioridad;
  });

  const abrirNuevo = () => {
    setEditando(null);
    setForm({ nombre: "", parentesco: "", telefono: "", prioridad: 1 });
    setOpenModal(true);
  };

  const abrirEditar = (c: ContactoEmergencia) => {
    setEditando(c);
    setForm({ nombre: c.nombre, parentesco: c.parentesco, telefono: c.telefono, prioridad: c.prioridad });
    setOpenModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.telefono) return;

    const lista = [...contactos];
    if (editando) {
      const idx = lista.findIndex(x => x.id === editando.id);
      if (idx >= 0) lista[idx] = { ...editando, ...form };
    } else {
      const nuevoId = (lista.length > 0 ? Math.max(...lista.map(x => x.id)) : 0) + 1;
      lista.push({ id: nuevoId, ...form });
    }
    const datos = JSON.parse(localStorage.getItem("medifamily-datos") || "{}");
    localStorage.setItem("medifamily-datos", JSON.stringify({ ...datos, contactos: lista }));
    setOpenModal(false);
    window.location.reload();
  };

  const eliminar = (id: number) => {
    if (!confirm("¿Eliminar este contacto?")) return;
    const lista = contactos.filter(x => x.id !== id);
    const datos = JSON.parse(localStorage.getItem("medifamily-datos") || "{}");
    localStorage.setItem("medifamily-datos", JSON.stringify({ ...datos, contactos: lista }));
    window.location.reload();
  };

  const getIcon = (parentesco: string) => {
    if (parentesco.toLowerCase().includes("emergencia") || parentesco.toLowerCase().includes("cruz")) return AlertCircle;
    if (parentesco.toLowerCase().includes("hijo") || parentesco.toLowerCase().includes("hija")) return User;
    return UserPlus;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-rose-500 via-rose-600 to-pink-600 p-6 text-white shadow-xl shadow-rose-500/25 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3 blur-2xl" />
        <div className="relative flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-5 h-5" fill="currentColor" />
              <p className="text-rose-100 text-sm font-medium">Contactos de emergencia</p>
            </div>
            <h2 className="text-2xl font-bold">¡Estamos listos para cualquier situación!</h2>
            <p className="text-rose-100 text-sm">{contactos.length} contacto(s) configurado(s)</p>
          </div>
          <button onClick={abrirNuevo}
            className="px-4 py-2.5 rounded-xl bg-white text-rose-700 text-sm font-semibold hover:bg-rose-50 shadow-lg flex items-center gap-2">
            <Plus className="w-4 h-4" /> Agregar contacto
          </button>
        </div>
      </div>

      {contactos.length === 0 ? (
        <div className={cn("text-center py-12 rounded-2xl border-2 border-dashed",
          modoNoche ? "border-slate-700 text-slate-400" : "border-slate-200 text-slate-500")}>
          <Phone className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No hay contactos de emergencia</p>
          <p className="text-sm mt-1">Agrega los números importantes para cualquier situación.</p>
          <button onClick={abrirNuevo}
            className="mt-4 px-4 py-2 rounded-xl bg-rose-500 text-white text-sm font-medium hover:bg-rose-600">
            Agregar primer contacto
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {ordenados.map(c => {
            const Icon = getIcon(c.parentesco);
            const esEmergencia = c.prioridad === 0;
            const esCritico = c.prioridad === 1;
            return (
              <div key={c.id}
                className={cn("rounded-2xl border p-4 flex gap-3",
                  esEmergencia
                    ? "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-900/40"
                    : modoNoche ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200")}>
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg",
                  esEmergencia ? "bg-gradient-to-br from-rose-500 to-rose-700"
                    : esCritico ? "bg-gradient-to-br from-sky-500 to-cyan-500"
                    : "bg-gradient-to-br from-slate-400 to-slate-600")}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold">{c.nombre}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{c.parentesco}</p>
                  <p className="text-sm font-mono mt-1.5">{c.telefono}</p>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <a href={`tel:${c.telefono}`}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 flex items-center gap-1">
                    <PhoneCall className="w-3 h-3" /> Llamar
                  </a>
                  <button onClick={() => abrirEditar(c)}
                    className="p-1.5 rounded-lg text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/30">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => eliminar(c.id)}
                    className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {openModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpenModal(false)} />
          <div className={cn("relative w-full max-w-md rounded-2xl shadow-2xl border",
            modoNoche ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Phone className="w-5 h-5 text-rose-500" />
                {editando ? "Editar contacto" : "Nuevo contacto"}
              </h2>
              <button onClick={() => setOpenModal(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Nombre *</label>
                <input value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej. Carlos Vargas (Hijo)"
                  className={cn("w-full px-3 py-2 rounded-lg text-sm border outline-none",
                    modoNoche ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Parentesco</label>
                <input value={form.parentesco}
                  onChange={(e) => setForm({ ...form, parentesco: e.target.value })}
                  placeholder="Hijo, Hija, Médico, Emergencia..."
                  className={cn("w-full px-3 py-2 rounded-lg text-sm border outline-none",
                    modoNoche ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Teléfono *</label>
                <input value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  placeholder="5551234567"
                  className={cn("w-full px-3 py-2 rounded-lg text-sm border outline-none font-mono",
                    modoNoche ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Prioridad</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { v: 0, label: "Emergencia", color: "rose" },
                    { v: 1, label: "Alta", color: "sky" },
                    { v: 2, label: "Media", color: "amber" },
                    { v: 3, label: "Baja", color: "slate" }
                  ].map(p => (
                    <button type="button" key={p.v}
                      onClick={() => setForm({ ...form, prioridad: p.v })}
                      className={cn("py-2 rounded-lg text-xs font-medium border transition-all",
                        form.prioridad === p.v
                          ? `bg-${p.color}-500 text-white border-${p.color}-500`
                          : "border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800")}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setOpenModal(false)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-800">
                  Cancelar
                </button>
                <button type="submit"
                  className="flex-1 py-2 rounded-lg bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 flex items-center justify-center gap-1">
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
