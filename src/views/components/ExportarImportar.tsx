import { useState } from "react";
import { Download, Upload, X, FileJson, Check } from "lucide-react";
import { useApp } from "../../App";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ExportarImportar({ open, onClose }: Props) {
  const { modoNoche } = useApp();
  const [mensaje, setMensaje] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);
  const [fileName, setFileName] = useState("");

  const exportar = () => {
    try {
      const datos = localStorage.getItem("medifamily-datos") || "{}";
      const usuario = localStorage.getItem("medifamily-usuario") || "null";
      const paciente = localStorage.getItem("medifamily-paciente") || "null";
      const modo = localStorage.getItem("medifamily-modo-noche") || "false";

      const backup = {
        fecha_exportacion: new Date().toISOString(),
        version: "1.0",
        datos: JSON.parse(datos),
        usuario: JSON.parse(usuario),
        paciente: JSON.parse(paciente),
        modo_noche: modo
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const fecha = new Date().toISOString().split("T")[0];
      a.href = url;
      a.download = `medifamily_backup_${fecha}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMensaje({ tipo: "ok", texto: "Datos exportados correctamente" });
    } catch (e) {
      setMensaje({ tipo: "error", texto: "Error al exportar los datos" });
    }
  };

  const importar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const contenido = JSON.parse(ev.target?.result as string);
        // Validar estructura básica
        if (!contenido.datos) {
          setMensaje({ tipo: "error", texto: "El archivo no tiene el formato correcto" });
          return;
        }

        // Guardar todos los datos
        if (contenido.datos) {
          localStorage.setItem("medifamily-datos", JSON.stringify(contenido.datos));
        }
        if (contenido.usuario) {
          localStorage.setItem("medifamily-usuario", JSON.stringify(contenido.usuario));
        }
        if (contenido.paciente) {
          localStorage.setItem("medifamily-paciente", JSON.stringify(contenido.paciente));
        }
        if (contenido.modo_noche) {
          localStorage.setItem("medifamily-modo-noche", contenido.modo_noche);
        }

        setMensaje({
          tipo: "ok",
          texto: "Datos importados. La página se recargará para aplicar los cambios."
        });

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (err) {
        setMensaje({ tipo: "error", texto: "Error al leer el archivo. Verifica que sea un JSON válido." });
      }
    };
    reader.readAsText(file);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" style={{ zIndex: 11000 }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden",
        modoNoche ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")}>
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileJson className="w-5 h-5 text-emerald-500" />
            Exportar / Importar datos
          </h2>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className={cn("rounded-xl p-4 border",
            modoNoche ? "bg-emerald-900/20 border-emerald-800" : "bg-emerald-50 border-emerald-200")}>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              <strong className="text-emerald-600 dark:text-emerald-400">¿Por qué esto?</strong>
              <br />Tu información se guarda en tu dispositivo (computadora o celular).
              Para ver los mismos datos en otro dispositivo, exporta aquí y luego
              importa en el otro dispositivo.
            </p>
          </div>

          {/* Exportar */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Download className="w-4 h-4 text-sky-500" />
              Exportar datos
            </h3>
            <p className="text-xs text-slate-500">
              Descarga un archivo con toda tu información médica
            </p>
            <button onClick={exportar}
              className="w-full py-2.5 rounded-xl bg-sky-500 text-white text-sm font-semibold hover:bg-sky-600 flex items-center justify-center gap-2 cursor-pointer">
              <Download className="w-4 h-4" /> Descargar archivo de respaldo
            </button>
          </div>

          {/* Separador */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs text-slate-400">o</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* Importar */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Upload className="w-4 h-4 text-violet-500" />
              Importar datos
            </h3>
            <p className="text-xs text-slate-500">
              Sube un archivo de respaldo para restaurar la información
            </p>
            <label className="block">
              <input type="file" accept=".json,application/json" onChange={importar}
                className="hidden" />
              <span className="block w-full py-2.5 rounded-xl bg-violet-500 text-white text-sm font-semibold hover:bg-violet-600 text-center cursor-pointer">
                <Upload className="w-4 h-4 inline mr-2" />
                Seleccionar archivo
              </span>
            </label>
            {fileName && (
              <p className="text-xs text-slate-500">Archivo: {fileName}</p>
            )}
          </div>

          {/* Mensaje de estado */}
          {mensaje && (
            <div className={cn("rounded-xl p-3 flex items-center gap-2 border text-sm",
              mensaje.tipo === "ok"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300"
                : "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-300"
            )}>
              {mensaje.tipo === "ok" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              <span>{mensaje.texto}</span>
            </div>
          )}

          <button onClick={onClose}
            className="w-full py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
