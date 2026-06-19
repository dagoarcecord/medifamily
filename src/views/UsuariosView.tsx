import { useState } from "react";
import { Users, Plus, Trash2, Phone, Edit, Check, X, MessageCircle } from "lucide-react";
import { Usuario } from "../App";
import { cn, iniciales } from "@/lib/utils";
import { limpiarTelefono, generarEnlaceWhatsApp, generarMensajeCita } from "@/lib/whatsapp";

interface Props {
  usuarios: Usuario[];
  onCrear: (nombre: string, telefono: string) => Usuario;
  onActualizar: (id: number, datos: Partial<Usuario>) => void;
  onEliminar: (id: number) => void;
  usuarioActual: Usuario | null;
}

export function UsuariosView({ usuarios, onCrear, onActualizar, onEliminar, usuarioActual }: Props) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState("");
  const [editando, setEditando] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editTelefono, setEditTelefono] = useState("");

  const handleCrear = () => {
    if (!nombre.trim()) { setError("Escribe el nombre."); return; }
    if (limpiarTelefono(telefono).length < 10) { setError("Número inválido."); return; }
    const tel = limpiarTelefono(telefono);
    if (usuarios.some(u => limpiarTelefono(u.telefono) === tel)) {
      setError("Ya existe un usuario con ese teléfono.");
      return;
    }
    onCrear(nombre.trim(), tel);
    setNombre("");
    setTelefono("");
    setError("");
  };

  const iniciarEdicion = (u: Usuario) => {
    setEditando(u.id);
    setEditNombre(u.nombre);
    setEditTelefono(u.telefono);
  };

  const guardarEdicion = (id: number) => {
    onActualizar(id, { nombre: editNombre.trim(), telefono: limpiarTelefono(editTelefono) });
    setEditando(null);
  };

  const probarWhatsApp = (u: Usuario) => {
    const mensaje = generarMensajeCita({
      especialidad: "Ejemplo",
      medico: "Dr. Ejemplo",
      hospital: "Hospital Demo",
      fecha: "2026-02-15",
      hora: "10:00",
      indicaciones: "Esta es una prueba del sistema de alertas"
    });
    const link = generarEnlaceWhatsApp(u.telefono, mensaje);
    window.open(link, "_blank");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-7 h-7 text-sky-500" /> Familiares
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Gestiona las personas que cuidan y consultan la salud de tu familia
        </p>
      </div>

      {/* Formulario nuevo */}
      <div className={cn("rounded-2xl border p-5",
        "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800")}>
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-500" /> Agregar familiar
        </h2>
        <div className="grid md:grid-cols-3 gap-3">
          <input
            type="text"
            value={nombre}
            onChange={(e) => { setNombre(e.target.value); setError(""); }}
            placeholder="Nombre completo"
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-sky-500/30 dark:bg-slate-800 dark:border-slate-700"
          />
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="tel"
              value={telefono}
              onChange={(e) => { setTelefono(e.target.value); setError(""); }}
              placeholder="Celular (10 dígitos)"
              className="w-full pl-10 pr-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-sky-500/30 dark:bg-slate-800 dark:border-slate-700 font-mono"
            />
          </div>
          <button onClick={handleCrear}
            className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 flex items-center justify-center gap-1">
            <Plus className="w-4 h-4" /> Agregar
          </button>
        </div>
        {error && (
          <p className="text-rose-500 text-xs mt-2 flex items-center gap-1">
            <X className="w-3 h-3" /> {error}
          </p>
        )}
      </div>

      {/* Lista */}
      <div className="rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-semibold">{usuarios.length} familiar(es) registrado(s)</h2>
        </div>
        {usuarios.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Aún no hay familiares registrados.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {usuarios.map(u => (
              <div key={u.id} className="flex items-center gap-3 p-4">
                {editando === u.id ? (
                  <>
                    <input
                      value={editNombre}
                      onChange={(e) => setEditNombre(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg text-sm border dark:bg-slate-800 dark:border-slate-700"
                    />
                    <input
                      value={editTelefono}
                      onChange={(e) => setEditTelefono(e.target.value)}
                      className="w-40 px-3 py-1.5 rounded-lg text-sm border dark:bg-slate-800 dark:border-slate-700 font-mono"
                    />
                    <button onClick={() => guardarEdicion(u.id)}
                      className="p-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditando(null)}
                      className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700">
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center text-white text-xs font-bold">
                      {iniciales(u.nombre)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{u.nombre}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {u.telefono}
                        {usuarioActual?.id === u.id && (
                          <span className="ml-2 px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 text-[10px] font-bold">
                            TÚ
                          </span>
                        )}
                      </p>
                    </div>
                    <button onClick={() => probarWhatsApp(u)}
                      className="p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                      title="Enviar prueba por WhatsApp">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button onClick={() => iniciarEdicion(u)}
                      className="p-2 rounded-lg text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/30">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar a ${u.nombre}? Esta acción es permanente.`)) {
                          onEliminar(u.id);
                        }
                      }}
                      disabled={usuarioActual?.id === u.id}
                      className="p-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 disabled:opacity-30 disabled:cursor-not-allowed"
                      title={usuarioActual?.id === u.id ? "No puedes eliminar tu propia cuenta" : "Eliminar"}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
