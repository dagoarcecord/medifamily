import { useState, useRef } from "react";
import { X, Heart, Camera } from "lucide-react";
import { useApp, Paciente } from "../../App";
import { cn, iniciales } from "@/lib/utils";

export function SelectorPaciente() {
  const { pacienteActual, modoNoche } = useApp();
  const { actualizarPaciente } = useApp();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("La imagen es muy grande (máx 2 MB).");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setError("");
      const fotoUrl = ev.target?.result as string;
      if (pacienteActual) {
        actualizarPaciente({ ...pacienteActual, foto: fotoUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  const removerFoto = () => {
    if (pacienteActual) {
      actualizarPaciente({ ...pacienteActual, foto: "" });
    }
  };

  const paciente = pacienteActual;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-colors cursor-pointer",
          modoNoche
            ? "bg-slate-800 border-slate-700 hover:border-rose-500"
            : "bg-white border-slate-200 hover:border-rose-500"
        )}
      >
        {paciente?.foto ? (
          <img src={paciente.foto} alt="" className="w-7 h-7 rounded-lg object-cover" />
        ) : (
          <div className={cn("w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold",
            "from-rose-500 to-pink-600")}>
            {iniciales(paciente?.nombre || "M")}
          </div>
        )}
        <span className="text-sm font-semibold hidden sm:inline max-w-[120px] truncate">
          {paciente?.nombre || "Mamá"}
        </span>
        <Heart className="w-4 h-4 text-rose-500" fill="currentColor" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className={cn("relative w-full max-w-sm rounded-2xl shadow-2xl border overflow-hidden",
            modoNoche ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")}>
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-rose-500 to-pink-600 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Heart className="w-5 h-5" fill="currentColor" />
                <h2 className="font-bold">Foto de {paciente?.nombre}</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-white/20">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Foto preview */}
              <div className="flex flex-col items-center gap-3">
                {paciente?.foto ? (
                  <div className="relative">
                    <img src={paciente.foto} alt="" className="w-32 h-32 rounded-2xl object-cover shadow-lg" />
                    <button
                      type="button"
                      onClick={removerFoto}
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg hover:bg-rose-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
                    <Heart className="w-16 h-16 text-white" fill="currentColor" />
                  </div>
                )}
              </div>

              {/* Upload */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-semibold hover:from-rose-600 hover:to-pink-700 flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                {paciente?.foto ? "Cambiar foto" : "Subir foto"}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFoto} className="hidden" />

              {error && (
                <p className="text-xs text-rose-500 text-center">{error}</p>
              )}

              <p className="text-[11px] text-slate-400 text-center">
                Formatos: JPG, PNG, GIF · Máximo 2 MB
              </p>

              <div className={cn("rounded-xl p-4 border",
                modoNoche ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200")}>
                <p className="text-xs text-slate-500 text-center">
                  Esta foto aparece en el encabezado y se usa para identificar al paciente.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
