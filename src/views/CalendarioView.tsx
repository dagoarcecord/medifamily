import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Microscope, ShoppingBag } from "lucide-react";
import { useApp } from "@/App";
import { cn } from "@/lib/utils";

export function CalendarioView() {
  const { modoNoche, citas, estudios, recolecciones } = useApp();
  const [fecha, setFecha] = useState(new Date());

  const mes = fecha.getMonth();
  const anio = fecha.getFullYear();
  const primerDia = new Date(anio, mes, 1).getDay();
  const diasEnMes = new Date(anio, mes + 1, 0).getDate();
  const hoy = new Date();

  const dias = Array.from({ length: diasEnMes }, (_, i) => i + 1);

  const eventosDelDia = (dia: number) => {
    const fechaStr = `${anio}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    const eventos: { tipo: string; titulo: string; color: string; icon: any }[] = [];

    citas.filter(c => c.fecha === fechaStr && c.estado !== "Cancelada").forEach(c => {
      eventos.push({ tipo: "cita", titulo: c.especialidad, color: "bg-sky-500", icon: CalendarIcon });
    });
    estudios.filter(e => e.fecha === fechaStr).forEach(e => {
      eventos.push({ tipo: "estudio", titulo: e.nombre, color: "bg-violet-500", icon: Microscope });
    });
    recolecciones.filter(r => r.fechaRecoleccion === fechaStr).forEach(r => {
      eventos.push({ tipo: "recoleccion", titulo: r.medicamentoNombre, color: "bg-amber-500", icon: ShoppingBag });
    });
    return eventos;
  };

  const mesAnterior = () => setFecha(new Date(anio, mes - 1, 1));
  const mesSiguiente = () => setFecha(new Date(anio, mes + 1, 1));
  const mesActual = () => setFecha(new Date());

  const nombresMes = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Calendario médico</h1>
          <p className="text-sm text-slate-500">Vista mensual de todos los eventos</p>
        </div>
      </div>

      <div className={cn("rounded-2xl border overflow-hidden",
        modoNoche ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200")}>
        <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={mesAnterior}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-lg min-w-[140px] text-center">{nombresMes[mes]} {anio}</h2>
            <button onClick={mesSiguiente}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button onClick={mesActual}
            className="px-3 py-1.5 rounded-lg bg-sky-500 text-white text-xs font-medium">
            Mes actual
          </button>
        </div>

        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800">
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(d => (
            <div key={d} className={cn("p-3 text-center text-xs font-semibold uppercase",
              modoNoche ? "bg-slate-800/50" : "bg-slate-50")}>
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {Array.from({ length: primerDia }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[100px] p-2 border-r border-b border-slate-100 dark:border-slate-800/50" />
          ))}
          {dias.map(dia => {
            const esHoy = dia === hoy.getDate() && mes === hoy.getMonth() && anio === hoy.getFullYear();
            const eventos = eventosDelDia(dia);
            return (
              <div key={dia}
                className={cn("min-h-[100px] p-2 border-r border-b border-slate-100 dark:border-slate-800/50 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30")}>
                <div className={cn("w-7 h-7 flex items-center justify-center text-sm font-medium rounded-full mx-auto mb-1",
                  esHoy ? "bg-sky-500 text-white" : "")}>
                  {dia}
                </div>
                <div className="space-y-0.5">
                  {eventos.slice(0, 3).map((ev, i) => (
                    <div key={i} className={cn("px-1 py-0.5 rounded text-[10px] text-white truncate", ev.color)}>
                      <ev.icon className="w-2.5 h-2.5 inline mr-0.5" />
                      {ev.titulo}
                    </div>
                  ))}
                  {eventos.length > 3 && (
                    <div className="text-[10px] text-slate-400 px-1">+{eventos.length - 3} más</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className={cn("rounded-xl p-3 flex items-center gap-3",
          modoNoche ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-200")}>
          <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400 flex items-center justify-center">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">{citas.filter(c => c.estado !== "Cancelada").length}</p>
            <p className="text-xs text-slate-500">Citas programadas</p>
          </div>
        </div>
        <div className={cn("rounded-xl p-3 flex items-center gap-3",
          modoNoche ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-200")}>
          <div className="w-9 h-9 rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400 flex items-center justify-center">
            <Microscope className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">{estudios.length}</p>
            <p className="text-xs text-slate-500">Estudios</p>
          </div>
        </div>
        <div className={cn("rounded-xl p-3 flex items-center gap-3",
          modoNoche ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-200")}>
          <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">{recolecciones.filter(r => r.estado === "Pendiente").length}</p>
            <p className="text-xs text-slate-500">Por recoger</p>
          </div>
        </div>
      </div>
    </div>
  );
}
