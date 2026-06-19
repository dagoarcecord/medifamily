import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Calendar, Pill, Clock } from "lucide-react";
import { useApp } from "../../App";
import {
  generarEnlaceWhatsApp,
  generarMensajeCita,
  generarMensajeRecoleccion,
  generarMensajeEstudio
} from "@/lib/whatsapp";
import { cn, daysFromNow } from "@/lib/utils";

interface Alerta {
  id: string;
  tipo: "cita" | "recoleccion" | "estudio";
  titulo: string;
  mensaje: string;
  telefonoDestino: string;
  enlace: string;
  fechaCreacion: number;
}

/**
 * Sistema de alertas que:
 * 1. Detecta eventos próximos (citas, recolección, estudios)
 * 2. Muestra notificaciones emergentes con botón para enviar por WhatsApp
 * 3. Se ejecuta cada 60 segundos
 */
export function AlertasWhatsApp() {
  const { citas, recolecciones, estudios, usuario, modoNoche } = useApp();
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [, setMostrarPanel] = useState(false);
  const [vistas, setVistas] = useState<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Buscar eventos próximos cada 60 segundos
  useEffect(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const verificar = () => {
      const nuevas: Alerta[] = [];
      const ahora = Date.now();

      // Citas: 1 día antes y 2 horas antes
      citas.forEach((c: any) => {
        if (!c.fecha || c.estado === "Cancelada") return;
        const dias = daysFromNow(c.fecha);
        if (dias === 1) {
          const id = `cita-1-${c.id}`;
          if (!vistas.has(id)) {
            nuevas.push({
              id,
              tipo: "cita",
              titulo: `🏥 Cita mañana: ${c.especialidad}`,
              mensaje: `Cita con ${c.medico} mañana ${c.fecha} a las ${c.hora}`,
              telefonoDestino: usuario.telefono,
              enlace: generarEnlaceWhatsApp(
                usuario.telefono,
                generarMensajeCita({
                  especialidad: c.especialidad,
                  medico: c.medico,
                  hospital: c.hospital,
                  fecha: c.fecha,
                  hora: c.hora,
                  indicaciones: c.indicaciones
                })
              ),
              fechaCreacion: ahora
            });
          }
        }
        if (dias === 0) {
          const id = `cita-hoy-${c.id}`;
          if (!vistas.has(id)) {
            nuevas.push({
              id,
              tipo: "cita",
              titulo: `⏰ Cita HOY: ${c.especialidad}`,
              mensaje: `¡Cita programada hoy a las ${c.hora}!`,
              telefonoDestino: usuario.telefono,
              enlace: generarEnlaceWhatsApp(
                usuario.telefono,
                generarMensajeCita({
                  especialidad: c.especialidad,
                  medico: c.medico,
                  hospital: c.hospital,
                  fecha: c.fecha,
                  hora: c.hora,
                  indicaciones: c.indicaciones
                })
              ),
              fechaCreacion: ahora
            });
          }
        }
      });

      // Recolecciones: 2 días antes y el mismo día
      recolecciones.filter((r: any) => r.estado === "Pendiente").forEach((r: any) => {
        const dias = daysFromNow(r.fechaRecoleccion);
        if (dias <= 2 && dias >= 0) {
          const id = `recoleccion-${r.id}-${dias}`;
          if (!vistas.has(id)) {
            nuevas.push({
              id,
              tipo: "recoleccion",
              titulo: `💊 Recolectar ${r.medicamentoNombre}`,
              mensaje: dias === 0
                ? `¡Hoy debes recoger ${r.medicamentoNombre}!`
                : `En ${dias} día(s) debes recoger ${r.medicamentoNombre}`,
              telefonoDestino: usuario.telefono,
              enlace: generarEnlaceWhatsApp(
                usuario.telefono,
                generarMensajeRecoleccion({
                  medicamento: r.medicamentoNombre,
                  lugar: r.lugar,
                  fecha: r.fechaRecoleccion
                })
              ),
              fechaCreacion: ahora
            });
          }
        }
      });

      // Estudios: 1 día antes
      estudios.filter((e: any) => !e.resultadoDisponible).forEach((e: any) => {
        const dias = daysFromNow(e.fecha);
        if (dias === 1) {
          const id = `estudio-${e.id}`;
          if (!vistas.has(id)) {
            nuevas.push({
              id,
              tipo: "estudio",
              titulo: `🔬 Estudio mañana: ${e.tipo}`,
              mensaje: `${e.nombre} mañana ${e.fecha} en ${e.lugar}`,
              telefonoDestino: usuario.telefono,
              enlace: generarEnlaceWhatsApp(
                usuario.telefono,
                generarMensajeEstudio({
                  tipo: e.tipo,
                  nombre: e.nombre,
                  fecha: e.fecha,
                  lugar: e.lugar
                })
              ),
              fechaCreacion: ahora
            });
          }
        }
      });

      if (nuevas.length > 0) {
        setAlertas(prev => [...nuevas, ...prev].slice(0, 10));
        setMostrarPanel(true);
        // Marcar como vistas automáticamente después de 5 minutos
        const idsNuevos = nuevas.map(a => a.id);
        setTimeout(() => {
          setVistas(prev => {
            const next = new Set(prev);
            idsNuevos.forEach(id => next.add(id));
            return next;
          });
          setAlertas(prev => prev.filter(a => !idsNuevos.includes(a.id)));
        }, 5 * 60 * 1000);
      }
    };

    verificar(); // Ejecutar al montar
    intervalRef.current = setInterval(verificar, 60 * 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [citas, recolecciones, estudios, usuario.telefono, vistas]);

  if (alertas.length === 0) return null;

  const iconoTipo = (tipo: Alerta["tipo"]) => {
    if (tipo === "cita") return <Calendar className="w-5 h-5" />;
    if (tipo === "recoleccion") return <Pill className="w-5 h-5" />;
    return <Clock className="w-5 h-5" />;
  };

  const colorTipo = (tipo: Alerta["tipo"]) => {
    if (tipo === "cita") return "from-sky-500 to-cyan-600";
    if (tipo === "recoleccion") return "from-emerald-500 to-teal-600";
    return "from-amber-500 to-orange-600";
  };

  return (
    <div className="fixed bottom-24 lg:bottom-6 right-4 z-50 max-w-sm w-full pointer-events-auto">
      <div className={cn("rounded-2xl shadow-2xl border overflow-hidden transition-all",
        modoNoche ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")}>
        <div className="px-4 py-3 bg-gradient-to-r from-sky-500 to-cyan-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <p className="font-semibold text-sm">
              {alertas.length} alerta(s) pendiente(s)
            </p>
          </div>
          <button onClick={() => setMostrarPanel(false)}
            className="p-1 rounded-lg hover:bg-white/20">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {alertas.slice(0, 5).map(a => (
            <div key={a.id} className="p-3 flex items-start gap-3">
              <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-white flex-shrink-0",
                colorTipo(a.tipo))}>
                {iconoTipo(a.tipo)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{a.titulo}</p>
                <p className="text-xs text-slate-500 mt-0.5">{a.mensaje}</p>
              </div>
              <a
                href={a.enlace}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 flex items-center gap-1 flex-shrink-0"
                onClick={() => setAlertas(prev => prev.filter(x => x.id !== a.id))}
              >
                <Send className="w-3 h-3" /> WhatsApp
              </a>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 text-center text-[10px] text-slate-500">
          Toca <span className="font-semibold">WhatsApp</span> para enviar la alerta
        </div>
      </div>
    </div>
  );
}
