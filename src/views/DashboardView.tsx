import { useState } from "react";
import {
  Calendar, Pill, Activity, AlertTriangle, Plus, Microscope, FileText,
  Droplets, Weight, Gauge, History, Bell, CalendarDays
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { useApp } from "@/App";
import { cn, formatDate, estadoColor, daysFromNow } from "@/lib/utils";
import { ModalCita } from "./components/ModalCita";
import { ModalMedicamento } from "./components/ModalMedicamento";
import { ModalSigno } from "./components/ModalSigno";

export function DashboardView() {
  const {
    citas, medicamentos, recolecciones, documentos, signos, estudios,
    actividades, usuario
  } = useApp();

  const [openCita, setOpenCita] = useState(false);
  const [openMed, setOpenMed] = useState(false);
  const [openSigno, setOpenSigno] = useState(false);

  const proximaCita = [...citas]
    .filter(c => c.estado !== "Cancelada" && c.estado !== "Completada")
    .sort((a, b) => a.fecha.localeCompare(b.fecha))[0];

  const medicamentosHoy = medicamentos.length;
  const estudiosPendientes = estudios.filter(e => !e.resultadoDisponible).length;
  const recoleccionesPendientes = recolecciones.filter(r => r.estado === "Pendiente").length;
  const ultimosSignos = signos.slice(0, 8).map(s => ({
    fecha: s.fecha.slice(5),
    presion: s.presionSistolica,
    glucosa: s.glucosa,
    peso: s.peso
  }));

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-600 to-sky-700 p-6 md:p-8 text-white shadow-xl shadow-sky-500/25 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3 blur-2xl" />
        <div className="relative">
          <p className="text-sky-100 text-sm font-medium mb-1">Buen día, {usuario.nombre.split(" ")[0]}</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Bienvenida a MEDIFAMILY</h2>
          <p className="text-sky-100 max-w-xl text-sm md:text-base">
            Aquí puedes gestionar de forma colaborativa la salud de tu mamá o ser querido.
            Toda la familia informada y al tanto.
          </p>
          <div className="flex gap-3 mt-5 flex-wrap">
            <button
              onClick={() => setOpenCita(true)}
              className="px-4 py-2.5 bg-white text-sky-700 rounded-xl font-medium text-sm flex items-center gap-2 shadow-lg shadow-sky-700/20 hover:bg-sky-50 transition-colors"
            >
              <Plus className="w-4 h-4" /> Nueva cita
            </button>
            <button
              onClick={() => setOpenMed(true)}
              className="px-4 py-2.5 bg-sky-800/40 backdrop-blur text-white rounded-xl font-medium text-sm flex items-center gap-2 border border-white/20 hover:bg-sky-800/60 transition-colors"
            >
              <Pill className="w-4 h-4" /> Medicamento
            </button>
            <button
              onClick={() => setOpenSigno(true)}
              className="px-4 py-2.5 bg-sky-800/40 backdrop-blur text-white rounded-xl font-medium text-sm flex items-center gap-2 border border-white/20 hover:bg-sky-800/60 transition-colors"
            >
              <Activity className="w-4 h-4" /> Signos vitales
            </button>
          </div>
        </div>
      </div>

      {/* Tarjetas principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <TarjetaResumen titulo="Citas pendientes" valor={citas.filter(c => c.estado === "Pendiente").length} icon={Calendar} color="sky" />
        <TarjetaResumen titulo="Medicamentos" valor={medicamentos.length} icon={Pill} color="emerald" />
        <TarjetaResumen titulo="Estudios pendientes" valor={estudiosPendientes} icon={Microscope} color="violet" />
        <TarjetaResumen titulo="Documentos" valor={documentos.length} icon={FileText} color="amber" />
      </div>

      {/* Próxima cita y Recolección */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border p-5 md:p-6 bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400 flex items-center justify-center">
                <CalendarDays className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">Próxima cita médica</h3>
            </div>
            <span className="text-xs text-sky-600 dark:text-sky-400 font-medium">
              {proximaCita ? `${daysFromNow(proximaCita.fecha)} días` : ""}
            </span>
          </div>

          {proximaCita ? (
            <div className="space-y-3">
              <div className="flex flex-col md:flex-row md:items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 border border-sky-100 dark:border-sky-900/40">
                <div className="md:w-16 h-16 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 text-white flex flex-col items-center justify-center text-sm font-bold flex-shrink-0">
                  <span className="text-xs opacity-80">{proximaCita.fecha.slice(0, 7)}</span>
                  <span className="text-lg">{proximaCita.fecha.slice(8)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base">{proximaCita.especialidad}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{proximaCita.medico}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{proximaCita.hospital}</p>
                </div>
                <div className="flex md:flex-col items-center md:items-end gap-2 text-sm">
                  <span className="font-semibold text-sky-700 dark:text-sky-400">{proximaCita.hora}</span>
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", estadoColor(proximaCita.estado))}>
                    {proximaCita.estado}
                  </span>
                </div>
              </div>
              {proximaCita.indicaciones && (
                <div className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p>{proximaCita.indicaciones}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No hay citas programadas.</p>
          )}
        </div>

        <div className="rounded-2xl border p-5 md:p-6 bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 backdrop-blur">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="font-semibold">Alertas importantes</h3>
          </div>
          <div className="space-y-3">
            {recoleccionesPendientes > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  {recoleccionesPendientes} medicamento(s) por recoger
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                  Ver módulo de recolección
                </p>
              </div>
            )}
            {estudiosPendientes > 0 && (
              <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-900/40">
                <p className="text-sm font-medium text-violet-800 dark:text-violet-300">
                  {estudiosPendientes} estudio(s) pendientes
                </p>
                <p className="text-xs text-violet-700 dark:text-violet-400 mt-1">
                  Resultados en proceso
                </p>
              </div>
            )}
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/40">
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                {medicamentos.length} medicamento(s) activos
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                Revisar horarios del día
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Signos vitales gráfica */}
      <div className="rounded-2xl border p-5 md:p-6 bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 backdrop-blur">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Tendencia de signos vitales</h3>
              <p className="text-xs text-slate-500">Últimos 8 registros</p>
            </div>
          </div>
          <button
            onClick={() => setOpenSigno(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-500 text-white hover:bg-sky-600 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Registrar
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-500 flex items-center gap-1"><Gauge className="w-3 h-3" /> Presión sistólica</p>
              <span className="text-sm font-bold">{signos[0]?.presionSistolica || "--"}</span>
            </div>
            <ResponsiveContainer width="100%" height={60}>
              <AreaChart data={ultimosSignos}>
                <Area type="monotone" dataKey="presion" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-500 flex items-center gap-1"><Droplets className="w-3 h-3" /> Glucosa</p>
              <span className="text-sm font-bold">{signos[0]?.glucosa || "--"}</span>
            </div>
            <ResponsiveContainer width="100%" height={60}>
              <AreaChart data={ultimosSignos}>
                <Area type="monotone" dataKey="glucosa" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-500 flex items-center gap-1"><Weight className="w-3 h-3" /> Peso (kg)</p>
              <span className="text-sm font-bold">{signos[0]?.peso || "--"}</span>
            </div>
            <ResponsiveContainer width="100%" height={60}>
              <AreaChart data={ultimosSignos}>
                <Area type="monotone" dataKey="peso" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Medicamentos del día + Actividad */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border p-5 md:p-6 bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">Medicamentos del día</h3>
            </div>
            <span className="text-xs px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium">
              {medicamentosHoy} activos
            </span>
          </div>

          <div className="space-y-2">
            {medicamentos.slice(0, 4).map(m => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white flex-shrink-0">
                  <Pill className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{m.nombre}</p>
                  <p className="text-xs text-slate-500 truncate">{m.dosis} · {m.frecuencia}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {m.hora1 && <span className="text-xs px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-900 shadow-sm font-mono">{m.hora1}</span>}
                  {m.hora2 && <span className="text-xs px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-900 shadow-sm font-mono">{m.hora2}</span>}
                  {m.hora3 && <span className="text-xs px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-900 shadow-sm font-mono">{m.hora3}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border p-5 md:p-6 bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 backdrop-blur">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <h3 className="font-semibold">Actividad familiar</h3>
          </div>
          <div className="space-y-3">
            {actividades.slice(0, 5).map(a => (
              <div key={a.id} className="relative pl-4 border-l-2 border-sky-200 dark:border-sky-900">
                <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-sky-500" />
                <p className="text-sm font-medium leading-tight">{a.accion}</p>
                <p className="text-xs text-slate-500 mt-0.5">{a.detalle}</p>
                <p className="text-[11px] text-slate-400 mt-1">{a.usuario} · {formatDate(a.fecha)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ModalCita open={openCita} onClose={() => setOpenCita(false)} />
      <ModalMedicamento open={openMed} onClose={() => setOpenMed(false)} />
      <ModalSigno open={openSigno} onClose={() => setOpenSigno(false)} />
    </div>
  );
}

function TarjetaResumen({ titulo, valor, icon: Icon, color }: {
  titulo: string; valor: number; icon: any; color: string;
}) {
  const colores: any = {
    sky: "from-sky-400 to-cyan-500 bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
    emerald: "from-emerald-400 to-teal-500 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    violet: "from-violet-400 to-purple-500 bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
    amber: "from-amber-400 to-orange-500 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
  };
  const gradiente: any = {
    sky: "from-sky-500/10 to-cyan-500/10",
    emerald: "from-emerald-500/10 to-teal-500/10",
    violet: "from-violet-500/10 to-purple-500/10",
    amber: "from-amber-500/10 to-orange-500/10"
  };

  return (
    <div className={cn("relative rounded-2xl p-4 bg-gradient-to-br border border-slate-200 dark:border-slate-800 overflow-hidden",
      gradiente[color], "bg-white/70 dark:bg-slate-900/60 backdrop-blur")}>
      <div className="flex items-start justify-between mb-3">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center",
          colores[color], "bg-white/80 dark:bg-slate-800/80")}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-2xl md:text-3xl font-bold">{valor}</p>
      <p className="text-xs text-slate-500 mt-1">{titulo}</p>
    </div>
  );
}
