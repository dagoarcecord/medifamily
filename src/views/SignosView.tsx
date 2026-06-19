import { useState } from "react";
import {
  Activity, Plus, Gauge, Droplets, Weight, Wind, TrendingUp, TrendingDown,
  Edit, Trash2, ChevronDown, ChevronUp
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis } from "recharts";
import { useApp, SignoVital } from "@/App";
import { cn } from "@/lib/utils";
import { ModalSigno } from "./components/ModalSigno";

export function SignosView() {
  const { signos, modoNoche } = useApp();
  const { eliminarSigno } = useApp();
  const [openModal, setOpenModal] = useState(false);
  const [editando, setEditando] = useState<SignoVital | null>(null);
  const [metrica, setMetrica] = useState<"presion" | "glucosa" | "peso" | "oxigenacion">("presion");
  const [expandido, setExpandido] = useState<number | null>(null);

  const handleEliminar = (id: number) => {
    if (confirm("¿Eliminar este registro de signos vitales?")) {
      eliminarSigno(id);
    }
  };

  const ultimo = signos[0];
  const anterior = signos[1];

  const datos = [...signos].reverse().map(s => ({
    fecha: s.fecha.slice(5),
    sistolica: s.presionSistolica,
    diastolica: s.presionDiastolica,
    glucosa: s.glucosa,
    peso: s.peso,
    temperatura: s.temperatura,
    oxigenacion: s.oxigenacion,
    pulso: s.pulso
  }));

  const tarjetas = [
    { label: "Presión sistólica", valor: ultimo?.presionSistolica || 0, unidad: "mmHg", icon: Gauge, color: "rose", diff: ultimo && anterior ? ultimo.presionSistolica - anterior.presionSistolica : 0 },
    { label: "Glucosa", valor: ultimo?.glucosa || 0, unidad: "mg/dL", icon: Droplets, color: "emerald", diff: ultimo && anterior ? ultimo.glucosa - anterior.glucosa : 0 },
    { label: "Peso", valor: ultimo?.peso || 0, unidad: "kg", icon: Weight, color: "amber", diff: ultimo && anterior ? Number((ultimo.peso - anterior.peso).toFixed(1)) : 0 },
    { label: "Oxigenación", valor: ultimo?.oxigenacion || 0, unidad: "%", icon: Wind, color: "sky", diff: ultimo && anterior ? ultimo.oxigenacion - anterior.oxigenacion : 0 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Signos vitales</h1>
          <p className="text-sm text-slate-500">{signos.length} registro(s) · Último: {ultimo?.fecha}</p>
        </div>
        <button onClick={() => { setEditando(null); setOpenModal(true); }}
          className="px-4 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-medium hover:bg-rose-600 flex items-center gap-2 shadow-lg shadow-rose-500/30">
          <Plus className="w-4 h-4" /> Registrar medición
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tarjetas.map(t => (
          <div key={t.label}
            className={cn("rounded-2xl border p-4 bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800")}>
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center",
                t.color === "rose" && "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
                t.color === "emerald" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
                t.color === "amber" && "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
                t.color === "sky" && "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400"
              )}>
                <t.icon className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">{t.label}</p>
            </div>
            <p className="text-2xl font-bold">{t.valor}<span className="text-xs text-slate-500 ml-1 font-normal">{t.unidad}</span></p>
            <div className="flex items-center gap-1 mt-1">
              {t.diff > 0 ? (
                <span className="flex items-center gap-0.5 text-xs text-rose-500"><TrendingUp className="w-3 h-3" /> +{t.diff}</span>
              ) : t.diff < 0 ? (
                <span className="flex items-center gap-0.5 text-xs text-emerald-500"><TrendingDown className="w-3 h-3" /> {t.diff}</span>
              ) : (
                <span className="text-xs text-slate-400">Sin cambio</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={cn("rounded-2xl border p-5",
        modoNoche ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200")}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-semibold">Tendencia</h3>
          </div>
          <div className={cn("flex rounded-xl border p-1",
            modoNoche ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200")}>
            {(["presion", "glucosa", "peso", "oxigenacion"] as const).map(m => (
              <button key={m}
                onClick={() => setMetrica(m)}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  metrica === m ? "bg-rose-500 text-white" : "text-slate-500")}>
                {m === "presion" ? "Presión" : m === "glucosa" ? "Glucosa" : m === "peso" ? "Peso" : "O2"}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={datos}>
              <CartesianGrid strokeDasharray="3 3" stroke={modoNoche ? "#334155" : "#e2e8f0"} />
              <XAxis dataKey="fecha" stroke={modoNoche ? "#94a3b8" : "#64748b"} fontSize={12} />
              <YAxis stroke={modoNoche ? "#94a3b8" : "#64748b"} fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: modoNoche ? "#0f172a" : "#ffffff",
                  border: `1px solid ${modoNoche ? "#334155" : "#e2e8f0"}`,
                  borderRadius: 12,
                  color: modoNoche ? "#f1f5f9" : "#0f172a"
                }}
              />
              {metrica === "presion" && (
                <>
                  <Area type="monotone" dataKey="sistolica" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.25} strokeWidth={2} name="Sistólica" />
                  <Area type="monotone" dataKey="diastolica" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} strokeWidth={2} name="Diastólica" />
                </>
              )}
              {metrica === "glucosa" && <Area type="monotone" dataKey="glucosa" stroke="#10b981" fill="#10b981" fillOpacity={0.25} strokeWidth={2} name="Glucosa" />}
              {metrica === "peso" && <Area type="monotone" dataKey="peso" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.25} strokeWidth={2} name="Peso" />}
              {metrica === "oxigenacion" && <Area type="monotone" dataKey="oxigenacion" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} strokeWidth={2} name="Oxigenación" />}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={cn("rounded-2xl border overflow-hidden",
        modoNoche ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200")}>
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-semibold">Historial completo ({signos.length} registros)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={cn("text-xs uppercase", modoNoche ? "bg-slate-800/60" : "bg-slate-50")}>
              <tr>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Hora</th>
                <th className="px-4 py-3 text-left">Presión</th>
                <th className="px-4 py-3 text-left">Glucosa</th>
                <th className="px-4 py-3 text-left">Peso</th>
                <th className="px-4 py-3 text-left">Temp</th>
                <th className="px-4 py-3 text-left">SpO2</th>
                <th className="px-4 py-3 text-left">Pulso</th>
                <th className="px-4 py-3 text-left">Notas</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {signos.map(s => {
                const estaExpandido = expandido === s.id;
                return (
                  <>
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-medium">{s.fecha}</td>
                      <td className="px-4 py-3 text-slate-500">{s.hora}</td>
                      <td className="px-4 py-3">{s.presionSistolica}/{s.presionDiastolica}</td>
                      <td className="px-4 py-3">{s.glucosa}</td>
                      <td className="px-4 py-3">{s.peso}</td>
                      <td className="px-4 py-3">{s.temperatura}°</td>
                      <td className="px-4 py-3">{s.oxigenacion}%</td>
                      <td className="px-4 py-3">{s.pulso}</td>
                      <td className="px-4 py-3 max-w-[150px] truncate text-xs text-slate-500">{s.notas}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setEditando(s); setOpenModal(true); }}
                            className="p-1.5 rounded-lg text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/30"
                            title="Editar">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleEliminar(s.id)}
                            className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                            title="Eliminar">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setExpandido(estaExpandido ? null : s.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            {estaExpandido ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {estaExpandido && (
                      <tr className={cn(modoNoche ? "bg-slate-800/40" : "bg-slate-50/60")}>
                        <td colSpan={10} className="px-4 py-3">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            <div>
                              <p className="text-slate-500 font-medium">Fecha y hora</p>
                              <p className="mt-0.5">{s.fecha} · {s.hora}</p>
                            </div>
                            <div>
                              <p className="text-slate-500 font-medium">Presión arterial</p>
                              <p className="mt-0.5">{s.presionSistolica}/{s.presionDiastolica} mmHg</p>
                            </div>
                            <div>
                              <p className="text-slate-500 font-medium">Glucosa</p>
                              <p className="mt-0.5">{s.glucosa} mg/dL</p>
                            </div>
                            <div>
                              <p className="text-slate-500 font-medium">Peso</p>
                              <p className="mt-0.5">{s.peso} kg</p>
                            </div>
                            <div>
                              <p className="text-slate-500 font-medium">Temperatura</p>
                              <p className="mt-0.5">{s.temperatura}°C</p>
                            </div>
                            <div>
                              <p className="text-slate-500 font-medium">Oxigenación</p>
                              <p className="mt-0.5">{s.oxigenacion}%</p>
                            </div>
                            <div>
                              <p className="text-slate-500 font-medium">Pulso</p>
                              <p className="mt-0.5">{s.pulso} lpm</p>
                            </div>
                            <div>
                              <p className="text-slate-500 font-medium">ID del registro</p>
                              <p className="mt-0.5 font-mono">#{s.id}</p>
                            </div>
                          </div>
                          {s.notas && (
                            <div className="mt-3 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:amber-200">
                              <p className="text-xs font-medium mb-0.5">Notas:</p>
                              <p className="italic">{s.notas}</p>
                            </div>
                          )}
                          <div className="mt-3 flex gap-2">
                            <button onClick={() => { setEditando(s); setOpenModal(true); }}
                              className="px-3 py-1.5 rounded-lg bg-sky-500 text-white text-xs font-medium hover:bg-sky-600 flex items-center gap-1">
                              <Edit className="w-3 h-3" /> Editar registro
                            </button>
                            <button onClick={() => handleEliminar(s.id)}
                              className="px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-medium hover:bg-rose-600 flex items-center gap-1">
                              <Trash2 className="w-3 h-3" /> Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ModalSigno open={openModal} onClose={() => setOpenModal(false)} signo={editando || undefined} />
    </div>
  );
}
