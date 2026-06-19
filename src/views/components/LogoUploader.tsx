import { useRef, useState } from "react";
import { Image as ImageIcon, X, Heart, Trash2, Upload } from "lucide-react";
import { useApp } from "../../App";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function LogoUploader({ open, onClose }: Props) {
  const { modoNoche, logoUrl, setLogoUrl } = useApp();
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen (JPG, PNG, etc.)");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("La imagen es muy grande. Máximo 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" style={{ zIndex: 11000 }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden",
        modoNoche ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")}>
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-sky-500" />
            Logo de MEDIFAMILY
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Personaliza el logo que aparece en el encabezado y pantalla de inicio.
            </p>
          </div>

          {/* Logo preview */}
          <div className={cn("rounded-xl border-2 border-dashed p-6 flex flex-col items-center justify-center gap-3",
            dragOver ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20" : "border-slate-300 dark:border-slate-700")}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
          >
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-24 h-24 object-contain rounded-xl" />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center">
                <Heart className="w-12 h-12 text-white" fill="currentColor" />
              </div>
            )}
            <p className="text-xs text-slate-500">
              {dragOver ? "Suelta la imagen aquí" : "Arrastra una imagen o haz clic para subir"}
            </p>
          </div>

          <div className="flex gap-2">
            <button onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-2.5 rounded-xl bg-sky-500 text-white text-sm font-medium hover:bg-sky-600 flex items-center justify-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" /> Subir imagen
            </button>
            {logoUrl && (
              <button onClick={() => setLogoUrl(null)}
                className="px-4 py-2.5 rounded-xl text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-1 cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />

          {error && (
            <p className="text-xs text-rose-500 text-center">{error}</p>
          )}

          <div className="text-[10px] text-slate-400 text-center">
            Formatos: JPG, PNG, GIF · Máximo 2 MB
          </div>

          <button onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
