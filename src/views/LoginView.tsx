import { useState } from "react";
import { Heart, LogIn, Phone, AlertCircle, UserPlus, Shield, Users } from "lucide-react";
import { Usuario } from "../App";
import { cn, iniciales } from "@/lib/utils";
import { limpiarTelefono, telefonoValido } from "@/lib/whatsapp";

interface Props {
  usuarios: Usuario[];
  onLogin: (usuario: Usuario) => void;
  onCrearUsuario: (nombre: string, telefono: string) => Usuario;
}

export function LoginView({ usuarios, onLogin, onCrearUsuario }: Props) {
  const [modo, setModo] = useState<"seleccion" | "registro" | "login">("seleccion");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError("");
    if (!nombre.trim()) { setError("Escribe tu nombre."); return; }
    if (!telefono.trim()) { setError("Escribe tu número de celular."); return; }
    if (!telefonoValido(telefono)) { setError("El número de celular no es válido."); return; }

    setLoading(true);
    setTimeout(() => {
      const telefonoLimpio = limpiarTelefono(telefono);
      const usuario = usuarios.find(u =>
        u.nombre.toLowerCase() === nombre.trim().toLowerCase() &&
        limpiarTelefono(u.telefono) === telefonoLimpio
      );

      if (usuario) {
        onLogin(usuario);
      } else {
        setError("No encontramos un usuario con ese nombre y teléfono. Verifica tus datos o regístrate.");
      }
      setLoading(false);
    }, 500);
  };

  const handleRegistro = () => {
    setError("");
    if (!nombre.trim()) { setError("Escribe tu nombre completo."); return; }
    if (!telefonoValido(telefono)) { setError("El número de celular debe tener al menos 10 dígitos."); return; }

    const telefonoLimpio = limpiarTelefono(telefono);

    // Verificar si ya existe
    const existente = usuarios.find(u => limpiarTelefono(u.telefono) === telefonoLimpio);
    if (existente) {
      setError("Ya existe un usuario con ese número de celular.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const nuevo = onCrearUsuario(nombre.trim(), telefonoLimpio);
      onLogin(nuevo);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-sky-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-600 shadow-xl shadow-sky-500/30 mb-4">
            <Heart className="w-8 h-8 text-white" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">MEDIFAMILY</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
            Cuidando juntos la salud de la familia
          </p>
        </div>

        {/* Pestañas */}
        <div className="flex gap-1 mb-4 p-1 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-700">
          {[
            { key: "seleccion", label: "Familiares", icon: Users },
            { key: "login", label: "Ingresar", icon: LogIn },
            { key: "registro", label: "Registrarse", icon: UserPlus }
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => { setModo(t.key as any); setError(""); }}
                className={cn("flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1",
                  modo === t.key
                    ? "bg-gradient-to-r from-sky-500 to-cyan-600 text-white shadow-md"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200")}>
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur border border-white/40 dark:border-slate-800 p-6">
          {/* Modo: selección familiar */}
          {modo === "seleccion" && (
            <>
              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Elige tu cuenta</h2>
                <p className="text-xs text-slate-500 mt-1">{usuarios.length} familiar(es) registrado(s)</p>
              </div>

              {usuarios.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                    <Users className="w-8 h-8 text-sky-500" />
                  </div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">¡Aún no hay familiares!</p>
                  <p className="text-xs text-slate-500 mt-1">Sé el primero en registrarte para comenzar.</p>
                  <button onClick={() => setModo("registro")}
                    className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 text-white font-medium text-sm hover:from-sky-600 hover:to-cyan-700">
                    Registrarme ahora
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {usuarios.map(u => (
                      <div key={u.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                          {iniciales(u.nombre)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{u.nombre}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                            <Phone className="w-3 h-3" /> {u.telefono}
                          </p>
                        </div>
                        <button
                          onClick={() => onLogin(u)}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-600 text-white text-xs font-semibold hover:from-sky-600 hover:to-cyan-700 shadow-md"
                        >
                          Ingresar
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setModo("registro")}
                    className="w-full mt-3 py-2 rounded-xl border-2 border-dashed border-sky-300 dark:border-sky-700 text-sky-600 dark:text-sky-400 text-xs font-medium hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Agregar otro familiar
                  </button>
                </>
              )}
            </>
          )}

          {/* Modo: ingresar (login con teléfono) */}
          {modo === "login" && (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Ingresa a tu cuenta</h2>
                <p className="text-xs text-slate-500 mt-1">Usa tu nombre y número de celular</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => { setNombre(e.target.value); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    placeholder=""
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 text-sm"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Número de celular
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={telefono}
                      onChange={(e) => { setTelefono(e.target.value); setError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      placeholder=""
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 text-sm font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Tu celular es tu contraseña. Asegúrate de escribirlo igual que al registrarte.
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 text-white font-semibold hover:from-sky-600 hover:to-cyan-700 shadow-lg shadow-sky-500/30 disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" /> Ingresar
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-500 mt-3">
                ¿No tienes cuenta?{" "}
                <button onClick={() => setModo("registro")} className="text-sky-600 dark:text-sky-400 font-semibold">
                  Regístrate aquí
                </button>
              </p>
            </>
          )}

          {/* Modo: registro */}
          {modo === "registro" && (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Nuevo familiar</h2>
                <p className="text-xs text-slate-500 mt-1">Únete al cuidado familiar</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => { setNombre(e.target.value); setError(""); }}
                    placeholder=""
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Número de celular
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={telefono}
                      onChange={(e) => { setTelefono(e.target.value); setError(""); }}
                      placeholder=""
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Este número se usará para enviar alertas de citas y medicamentos vía WhatsApp.
                  </p>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 mt-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/40 text-sm text-rose-700 dark:text-rose-300">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <button
                onClick={handleRegistro}
                disabled={loading}
                className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/30 disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" /> Crear cuenta y entrar
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-500 mt-3">
                ¿Ya tienes cuenta?{" "}
                <button onClick={() => setModo("login")} className="text-sky-600 dark:text-sky-400 font-semibold">
                  Inicia sesión
                </button>
              </p>
            </>
          )}
        </div>

        <p className="text-center text-xs text-slate-500 mt-6 flex items-center justify-center gap-1">
          <Shield className="w-3 h-3" />
          Tus datos se almacenan en tu dispositivo. Nunca se comparten.
        </p>
      </div>
    </div>
  );
}
