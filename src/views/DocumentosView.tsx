import { useState } from "react";
import { FileText, Search, Trash2, Download, Upload, FileImage, FolderOpen } from "lucide-react";
import { useApp } from "@/App";
import { cn } from "@/lib/utils";

export function DocumentosView() {
  const { documentos, eliminarDocumento, tienePermiso, modoNoche } = useApp();
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todos");

  const categorias = ["Todos", "Recetas", "Consultas", "Laboratorios", "Hospitalizaciones", "Imagenologia", "Otros"];

  const filtrados = documentos.filter(d => {
    const matchBusq = d.titulo.toLowerCase().includes(busqueda.toLowerCase());
    const matchCat = categoria === "Todos" || d.categoria === categoria;
    return matchBusq && matchCat;
  });

  const agrupados = filtrados.reduce((acc, d) => {
    if (!acc[d.categoria]) acc[d.categoria] = [];
    acc[d.categoria].push(d);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Documentos médicos</h1>
          <p className="text-sm text-slate-500">{documentos.length} documento(s) archivado(s)</p>
        </div>
        {tienePermiso("crear") && (
          <button className="px-4 py-2.5 rounded-xl bg-sky-500 text-white text-sm font-medium hover:bg-sky-600 flex items-center gap-2 shadow-lg shadow-sky-500/30">
            <Upload className="w-4 h-4" /> Subir documento
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className={cn("flex items-center gap-2 px-3 py-2.5 rounded-xl border flex-1",
          modoNoche ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")}>
          <Search className="w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Buscar documento..."
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none" />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categorias.map(c => (
          <button key={c}
            onClick={() => setCategoria(c)}
            className={cn("px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
              categoria === c
                ? "bg-sky-500 text-white"
                : modoNoche ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-700")}>
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {Object.entries(agrupados).map(([cat, docs]) => (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-2">
              <FolderOpen className="w-4 h-4 text-sky-500" />
              <h3 className="font-semibold text-sm">{cat} ({docs.length})</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {docs.map(d => (
                <div key={d.id}
                  className={cn("rounded-2xl border p-4 flex items-center gap-3 transition-all hover:shadow-lg",
                    modoNoche ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200")}>
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center text-white flex-shrink-0">
                    {d.tipo === "JPG" || d.tipo === "PNG" ? <FileImage className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{d.titulo}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{d.tipo} · {d.tamano}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{d.fecha}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button className="p-2 rounded-lg text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/30">
                      <Download className="w-4 h-4" />
                    </button>
                    {tienePermiso("eliminar") && (
                      <button onClick={() => eliminarDocumento(d.id)}
                        className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
