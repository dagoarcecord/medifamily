import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import {
  Heart, Calendar, Pill, Activity, FileText, Stethoscope, PhoneCall, Bell,
  Search, Menu, X, Sun, Moon, LayoutDashboard, Shield,
  ShoppingBag, CalendarDays, Home, Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockData } from "@/data/mockData";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export type RolUsuario = "ADMIN" | "FAMILIAR" | "LECTURA";

export interface Usuario {
  id: number;
  nombre: string;
  correo?: string;
  rol: RolUsuario;
  fechaCreacion: string;
  avatar?: string;
  telefono: string;
}

export interface Cita {
  id: number;
  especialidad: string;
  medico: string;
  hospital: string;
  direccion: string;
  telefono: string;
  fecha: string;
  hora: string;
  motivo: string;
  indicaciones: string;
  ayuno: boolean;
  llevarEstudios: boolean;
  observaciones: string;
  estado: "Pendiente" | "Completada" | "Reprogramada" | "Cancelada";
  creadoPor: string;
  fechaCreacion: string;
  pacienteId: number;
}

export interface Medicamento {
  id: number;
  nombre: string;
  dosis: string;
  frecuencia: string;
  hora1: string;
  hora2: string;
  hora3: string;
  fechaInicio: string;
  fechaFin: string;
  observaciones: string;
  stock: number;
  creadoPor: string;
  pacienteId: number;
}

export interface Recoleccion {
  id: number;
  medicamentoId: number;
  medicamentoNombre: string;
  lugar: string;
  fechaRecoleccion: string;
  observaciones: string;
  estado: "Pendiente" | "Recogido";
  quienRecogio?: string;
  cuandoRecogio?: string;
  comentarios?: string;
  pacienteId: number;
}

export interface Estudio {
  id: number;
  tipo: "Laboratorio" | "Rayos X" | "Resonancia" | "Tomografia" | "Ultrasonido" | "Otro";
  nombre: string;
  fecha: string;
  lugar: string;
  indicaciones: string;
  resultadoDisponible: boolean;
  archivo?: string;
  asistio: boolean;
  fechaResultados?: string;
  quienRecogioResultados?: string;
  comentarios?: string;
  pacienteId: number;
}

export interface Documento {
  id: number;
  titulo: string;
  categoria: "Recetas" | "Consultas" | "Laboratorios" | "Hospitalizaciones" | "Imagenologia" | "Otros";
  fecha: string;
  archivo: string;
  tipo: string;
  tamano: string;
  descripcion: string;
  pacienteId: number;
}

export interface SignoVital {
  id: number;
  fecha: string;
  hora: string;
  presionSistolica: number;
  presionDiastolica: number;
  glucosa: number;
  peso: number;
  temperatura: number;
  oxigenacion: number;
  pulso: number;
  notas: string;
  pacienteId: number;
}

export interface Medico {
  id: number;
  nombre: string;
  especialidad: string;
  telefono: string;
  correo: string;
  direccion: string;
}

export interface ContactoEmergencia {
  id: number;
  nombre: string;
  parentesco: string;
  telefono: string;
  prioridad: number;
}

export interface Paciente {
  id: number;
  nombre: string;
  parentesco: string;
  color: string;
  fechaNacimiento?: string;
  observaciones?: string;
  foto?: string;
}

export interface Actividad {
  id: number;
  usuario: string;
  accion: string;
  modulo: string;
  detalle: string;
  fecha: string;
  hora: string;
}

export interface NotificacionItem {
  id: number;
  tipo: "cita" | "medicamento" | "estudio" | "recoleccion" | "signos";
  titulo: string;
  mensaje: string;
  fecha: string;
  hora: string;
  leida: boolean;
  icono: string;
}

interface AppContextType {
  usuario: Usuario;
  modoNoche: boolean;
  toggleModoNoche: () => void;
  logout: () => void;
  login: (u: Usuario) => void;
  moduloActual: string;
  logoUrl: string | null;
  setLogoUrl: (url: string | null) => void;
  setModuloActual: (m: string) => void;
  citas: Cita[];
  medicamentos: Medicamento[];
  recolecciones: Recoleccion[];
  estudios: Estudio[];
  documentos: Documento[];
  signos: SignoVital[];
  medicos: Medico[];
  contactos: ContactoEmergencia[];
  actividades: Actividad[];
  notificaciones: NotificacionItem[];
  usuarios: Usuario[];
  pacientes: Paciente[];
  pacienteActual: Paciente | null;
  setPacienteActual: (p: Paciente | null) => void;
  agregarCita: (c: Omit<Cita, "id" | "fechaCreacion">) => void;
  actualizarCita: (c: Cita) => void;
  eliminarCita: (id: number) => void;
  agregarMedicamento: (m: Omit<Medicamento, "id">) => void;
  actualizarMedicamento: (m: Medicamento) => void;
  eliminarMedicamento: (id: number) => void;
  agregarSigno: (s: Omit<SignoVital, "id">) => void;
  actualizarSigno: (s: SignoVital) => void;
  eliminarSigno: (id: number) => void;
  agregarEstudio: (e: Omit<Estudio, "id">) => void;
  actualizarEstudio: (e: Estudio) => void;
  eliminarEstudio: (id: number) => void;
  marcarRecoleccion: (id: number) => void;
  actualizarRecoleccion: (r: Recoleccion) => void;
  eliminarRecoleccion: (id: number) => void;
  agregarDocumento: (d: Omit<Documento, "id">) => void;
  eliminarDocumento: (id: number) => void;
  marcarNotificacion: (id: number) => void;
  resetDatos: () => void;
  crearUsuario: (nombre: string, telefono: string) => Usuario;
  actualizarUsuario: (id: number, datos: Partial<Usuario>) => void;
  eliminarUsuario: (id: number) => void;
  actualizarPaciente: (p: Paciente) => void;
  eliminarPaciente: (id: number) => void;
  tienePermiso: (accion: "leer" | "crear" | "editar" | "eliminar") => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de AppProvider");
  return ctx;
};

const generarId = (lista: { id: number }[]) =>
  lista.length > 0 ? Math.max(...lista.map(i => i.id)) + 1 : 1;

// ============================================================
// APP PRINCIPAL CON LOGIN Y PERSISTENCIA
// ============================================================
export default function App() {
  const [modoNoche, setModoNoche] = useLocalStorage<boolean>("medifamily-modo-noche", false);
  const [usuarioActual, setUsuarioActual] = useLocalStorage<Usuario | null>("medifamily-usuario", null);
  const [moduloActual, setModuloActual] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoOpen, setLogoOpen] = useState(false);

  // Persistencia de datos - se cargan del localStorage o del mock inicial
  const [datosGuardados, setDatosGuardados] = useLocalStorage<any>("medifamily-datos", null);
  const datos = datosGuardados || mockData;

  // Estados que SÍ se persisten
  const [citas, setCitas] = useState<Cita[]>(datos.citas);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>(datos.medicamentos);
  const [recolecciones, setRecolecciones] = useState<Recoleccion[]>(datos.recolecciones);
  const [estudios, setEstudios] = useState<Estudio[]>(datos.estudios);
  const [documentos, setDocumentos] = useState<Documento[]>(datos.documentos);
  const [signos, setSignos] = useState<SignoVital[]>(datos.signos);
  const [medicos] = useState<Medico[]>(datos.medicos);
  const [contactos] = useState<ContactoEmergencia[]>(datos.contactos);
  const [actividades, setActividades] = useState<Actividad[]>(datos.actividades);
  const [notificaciones, setNotificaciones] = useState<NotificacionItem[]>(datos.notificaciones);
  const [usuarios, setUsuarios] = useState<Usuario[]>(datos.usuarios);
  const [pacientes, setPacientes] = useState<Paciente[]>(
    datos.pacientes && datos.pacientes.length > 0
      ? datos.pacientes
      : [{ id: 1, nombre: "Mamá", parentesco: "Paciente principal", color: "from-rose-500 to-pink-600" }]
  );
  const [pacienteActual, setPacienteActual] = useLocalStorage<Paciente | null>("medifamily-paciente", null);
  const [logoUrl, setLogoUrl] = useLocalStorage<string | null>("medifamily-logo", null);

  // Asegurar que pacienteActual siempre sea válido
  useEffect(() => {
    if (!pacienteActual || !pacientes.find(p => p.id === pacienteActual.id)) {
      setPacienteActual(pacientes[0] || null);
    }
  }, [pacientes, pacienteActual?.id]);

  // Persistir todos los datos cambiantes (incluyendo la lista de usuarios)
  useEffect(() => {
    setDatosGuardados({
      citas, medicamentos, recolecciones, estudios, documentos,
      signos, medicos, contactos, actividades, notificaciones, usuarios
    });
  }, [citas, medicamentos, recolecciones, estudios, documentos,
      signos, actividades, notificaciones, usuarios,
      setDatosGuardados]);

  const usuario: Usuario = usuarioActual || {
    id: 0,
    nombre: "Sin sesión",
    rol: "LECTURA",
    fechaCreacion: "",
    telefono: ""
  };

  const toggleModoNoche = () => setModoNoche(!modoNoche);
  const logout = () => {
    setUsuarioActual(null);
    setModuloActual("dashboard");
  };
  // TODOS los usuarios autenticados pueden administrar
  const tienePermiso = (_accion: "leer" | "crear" | "editar" | "eliminar") =>
    usuarioActual !== null;

  const crearUsuario = (nombre: string, telefono: string): Usuario => {
    const ahora = new Date().toISOString().split("T")[0];
    const nuevo: Usuario = {
      id: generarId(usuarios),
      nombre,
      rol: "ADMIN", // Cualquier usuario registrado es admin de la familia
      fechaCreacion: ahora,
      telefono: telefono
    };
    setUsuarios(prev => [...prev, nuevo]);
    return nuevo;
  };

  const actualizarUsuario = (id: number, datos: Partial<Usuario>) => {
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, ...datos } : u));
  };

  const eliminarUsuario = (id: number) => {
    setUsuarios(prev => prev.filter(u => u.id !== id));
  };

  const actualizarPaciente = (p: Paciente) => {
    setPacientes(prev => prev.map(x => x.id === p.id ? { ...p } : x));
    if (pacienteActual?.id === p.id) {
      setPacienteActual(p);
    }
  };

  const eliminarPaciente = (id: number) => {
    setPacientes(prev => prev.filter(x => x.id !== id));
    if (pacienteActual?.id === id) {
      const lista = pacientes.filter(x => x.id !== id);
      setPacienteActual(lista[0] || null);
    }
  };

  const registrarActividad = (accion: string, modulo: string, detalle: string) => {
    const ahora = new Date();
    setActividades(prev => [{
      id: generarId(prev),
      usuario: usuario.nombre,
      accion,
      modulo,
      detalle,
      fecha: ahora.toISOString().split("T")[0],
      hora: ahora.toTimeString().slice(0, 5)
    }, ...prev].slice(0, 50));
  };

  const agregarCita = (c: Omit<Cita, "id" | "fechaCreacion">) => {
    const nueva = { ...c, id: generarId(citas), fechaCreacion: new Date().toISOString() };
    setCitas(prev => [nueva, ...prev]);
    registrarActividad("Creó cita", "Citas", `${c.especialidad} - ${c.fecha}`);
  };
  const actualizarCita = (c: Cita) => {
    setCitas(prev => prev.map(x => x.id === c.id ? c : x));
    registrarActividad("Actualizó cita", "Citas", `${c.especialidad}`);
  };
  const eliminarCita = (id: number) => {
    setCitas(prev => prev.filter(x => x.id !== id));
    registrarActividad("Eliminó cita", "Citas", `ID ${id}`);
  };

  const agregarMedicamento = (m: Omit<Medicamento, "id">) => {
    const nuevo = { ...m, id: generarId(medicamentos) };
    setMedicamentos(prev => [nuevo, ...prev]);
    registrarActividad("Creó medicamento", "Medicamentos", m.nombre);
  };
  const actualizarMedicamento = (m: Medicamento) => {
    setMedicamentos(prev => prev.map(x => x.id === m.id ? m : x));
    registrarActividad("Actualizó medicamento", "Medicamentos", m.nombre);
  };
  const eliminarMedicamento = (id: number) => {
    setMedicamentos(prev => prev.filter(x => x.id !== id));
    registrarActividad("Eliminó medicamento", "Medicamentos", `ID ${id}`);
  };

  const agregarSigno = (s: Omit<SignoVital, "id">) => {
    const nuevo = { ...s, id: generarId(signos) };
    setSignos(prev => [nuevo, ...prev]);
    registrarActividad("Registró signos vitales", "Signos Vitales", `${s.fecha}`);
  };

  const actualizarSigno = (s: SignoVital) => {
    setSignos(prev => prev.map(x => x.id === s.id ? s : x));
    registrarActividad("Actualizó signos vitales", "Signos Vitales", s.fecha);
  };

  const eliminarSigno = (id: number) => {
    setSignos(prev => prev.filter(x => x.id !== id));
    registrarActividad("Eliminó signos vitales", "Signos Vitales", `ID ${id}`);
  };

  const actualizarRecoleccion = (r: Recoleccion) => {
    setRecolecciones(prev => prev.map(x => x.id === r.id ? r : x));
    registrarActividad("Actualizó recolección", "Recolección", r.medicamentoNombre);
  };

  const eliminarRecoleccion = (id: number) => {
    setRecolecciones(prev => prev.filter(x => x.id !== id));
    registrarActividad("Eliminó recolección", "Recolección", `ID ${id}`);
  };

  const actualizarEstudio = (e: Estudio) => {
    setEstudios(prev => prev.map(x => x.id === e.id ? e : x));
    registrarActividad("Actualizó estudio", "Estudios", e.nombre);
  };

  const agregarEstudio = (e: Omit<Estudio, "id">) => {
    const nuevo = { ...e, id: generarId(estudios), asistio: e.asistio ?? false };
    setEstudios(prev => [nuevo, ...prev]);
    registrarActividad("Registró estudio", "Estudios", e.nombre);
  };
  const eliminarEstudio = (id: number) => {
    setEstudios(prev => prev.filter(x => x.id !== id));
    registrarActividad("Eliminó estudio", "Estudios", `ID ${id}`);
  };

  const marcarRecoleccion = (id: number) => {
    setRecolecciones(prev => prev.map(x =>
      x.id === id ? { ...x, estado: x.estado === "Pendiente" ? "Recogido" : ("Pendiente" as const) } : x
    ));
    registrarActividad("Cambió estado de recolección", "Recolección", `ID ${id}`);
  };

  const agregarDocumento = (d: Omit<Documento, "id">) => {
    const nuevo = { ...d, id: generarId(documentos) };
    setDocumentos(prev => [nuevo, ...prev]);
    registrarActividad("Subió documento", "Documentos", d.titulo);
  };
  const eliminarDocumento = (id: number) => {
    setDocumentos(prev => prev.filter(x => x.id !== id));
    registrarActividad("Eliminó documento", "Documentos", `ID ${id}`);
  };

  const marcarNotificacion = (id: number) => {
    setNotificaciones(prev => prev.map(x => x.id === id ? { ...x, leida: !x.leida } : x));
  };

  const login = (u: Usuario) => {
    setUsuarioActual(u);
    registrarActividad("Inició sesión", "Sistema", `Usuario: ${u.nombre}`);
  };

  const resetDatos = () => {
    setDatosGuardados(null);
    setCitas(mockData.citas);
    setMedicamentos(mockData.medicamentos);
    setRecolecciones(mockData.recolecciones);
    setEstudios(mockData.estudios);
    setDocumentos(mockData.documentos);
    setSignos(mockData.signos);
    setActividades(mockData.actividades);
    setNotificaciones(mockData.notificaciones);
  };

  const value: AppContextType = {
    usuario, modoNoche, toggleModoNoche, logout, login,
    moduloActual, setModuloActual,
    citas, medicamentos, recolecciones, estudios, documentos, signos,
    medicos, contactos, actividades, notificaciones, usuarios,
    pacientes, pacienteActual, setPacienteActual,
    logoUrl, setLogoUrl,
    agregarCita, actualizarCita, eliminarCita,
    actualizarPaciente, eliminarPaciente,
    agregarMedicamento, actualizarMedicamento, eliminarMedicamento,
    agregarSigno, actualizarSigno, eliminarSigno,
    agregarEstudio, actualizarEstudio, eliminarEstudio,
    marcarRecoleccion, actualizarRecoleccion, eliminarRecoleccion,
    agregarDocumento, eliminarDocumento,
    marcarNotificacion, resetDatos,
    crearUsuario, actualizarUsuario, eliminarUsuario,
    tienePermiso
  };

  return (
    <AppContext.Provider value={value}>
      <div className={cn(
        "min-h-screen transition-colors duration-300",
        modoNoche
          ? "bg-slate-950 text-slate-100"
          : "bg-gradient-to-br from-slate-50 via-sky-50/40 to-cyan-50/40 text-slate-900"
      )}>
        {!usuarioActual ? (
          <LoginView usuarios={usuarios} onLogin={login} onCrearUsuario={crearUsuario} />
        ) : (
          <>
            <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
              {renderModulo(moduloActual)}
            </Layout>
            <AlertasWhatsApp />
          </>
        )}
        <LogoUploader open={logoOpen} onClose={() => setLogoOpen(false)} />
      </div>
    </AppContext.Provider>
  );
}

function Layout({ children, sidebarOpen, setSidebarOpen }: {
  children: ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}) {
  const { modoNoche, toggleModoNoche, notificaciones, logoUrl } = useApp();
  const noLeidas = notificaciones.filter(n => !n.leida).length;

  return (
    <div className="flex min-h-screen">
      <aside className={cn(
        "hidden lg:flex flex-col w-64 fixed inset-y-0 z-40 transition-all duration-300",
        modoNoche ? "bg-slate-900 border-r border-slate-800" : "bg-white/95 backdrop-blur border-r border-slate-200"
      )}>
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className={cn(
            "absolute left-0 top-0 bottom-0 w-72 flex flex-col",
            modoNoche ? "bg-slate-900" : "bg-white"
          )}>
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      <main className="flex-1 lg:ml-64 pb-20 lg:pb-6">
        <header className={cn(
          "sticky top-0 z-30 backdrop-blur-md border-b px-4 py-3 flex items-center gap-3",
          modoNoche ? "bg-slate-900/80 border-slate-800" : "bg-white/85 border-slate-200"
        )}>
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-9 h-9 rounded-xl object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
                <Heart className="w-5 h-5 text-white" fill="currentColor" />
              </div>
            )}
            <div>
              <h1 className="font-bold text-lg leading-tight">MEDIFAMILY</h1>
              <p className={cn("text-xs", modoNoche ? "text-slate-400" : "text-slate-500")}>
                Cuidando juntos
              </p>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-auto hidden md:block">
            <Buscador />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <SelectorPaciente />
            <button onClick={toggleModoNoche}
              className={cn("p-2 rounded-lg transition-colors",
                modoNoche ? "hover:bg-slate-800" : "hover:bg-slate-100")}>
              {modoNoche ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <NotificacionesDropdown noLeidas={noLeidas} />
            <UsuarioMenu />
          </div>
        </header>

        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {children}
        </div>

        <MobileNav />
      </main>
    </div>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { moduloActual, setModuloActual, modoNoche } = useApp();

  const items = [
    { id: "dashboard", label: "Inicio", icon: LayoutDashboard },
    { id: "citas", label: "Citas Médicas", icon: Calendar },
    { id: "medicamentos", label: "Medicamentos", icon: Pill },
    { id: "recoleccion", label: "Recolección", icon: ShoppingBag },
    { id: "estudios", label: "Estudios", icon: Search },
    { id: "documentos", label: "Documentos", icon: FileText },
    { id: "signos", label: "Signos Vitales", icon: Activity },
    { id: "calendario", label: "Calendario", icon: CalendarDays },
    { id: "medicos", label: "Directorio", icon: Stethoscope },
    { id: "contactos", label: "Emergencias", icon: PhoneCall },
    { id: "usuarios", label: "Familiares", icon: Users },
  ];

  return (
    <>
      {onClose && (
        <button onClick={onClose}
          className="lg:hidden absolute top-3 right-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
          <Heart className="w-5 h-5 text-white" fill="currentColor" />
        </div>
        <div>
          <h2 className="font-bold text-lg">MEDIFAMILY</h2>
          <p className={cn("text-xs", modoNoche ? "text-slate-400" : "text-slate-500")}>v1.0</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const active = moduloActual === item.id;
          return (
            <button key={item.id}
              onClick={() => { setModuloActual(item.id); onClose?.(); }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-gradient-to-r from-sky-500 to-cyan-600 text-white shadow-lg shadow-sky-500/30"
                  : modoNoche
                    ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                    : "text-slate-700 hover:bg-slate-100"
              )}>
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-3 mt-auto">
        <div className={cn("rounded-xl p-3",
          modoNoche ? "bg-slate-800" : "bg-sky-50")}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Respaldos automáticos</p>
              <p className={cn("text-xs", modoNoche ? "text-slate-400" : "text-slate-500")}>
                Último: hoy 03:00
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Buscador() {
  const { modoNoche } = useApp();
  return (
    <div className={cn("flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors",
      modoNoche ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-transparent")}>
      <Search className="w-4 h-4 text-slate-400" />
      <input type="text" placeholder="Buscar citas, medicamentos, documentos..."
        className={cn("bg-transparent flex-1 text-sm outline-none",
          modoNoche ? "placeholder:text-slate-500" : "placeholder:text-slate-400")} />
    </div>
  );
}

function NotificacionesDropdown({ noLeidas }: { noLeidas: number }) {
  const { notificaciones, marcarNotificacion, modoNoche } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className={cn("relative p-2 rounded-lg transition-colors",
          modoNoche ? "hover:bg-slate-800" : "hover:bg-slate-100")}>
        <Bell className="w-5 h-5" />
        {noLeidas > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
            {noLeidas}
          </span>
        )}
      </button>

      {open && (
        <div className={cn("absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl shadow-xl border z-50",
          modoNoche ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")}>
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-semibold">Notificaciones</h3>
            <span className="text-xs text-slate-500">{noLeidas} sin leer</span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {notificaciones.slice(0, 8).map(n => (
              <button key={n.id} onClick={() => marcarNotificacion(n.id)}
                className={cn("w-full text-left p-3 flex gap-3 hover:bg-slate-50 dark:hover:bg-slate-800",
                  !n.leida && "bg-sky-50/50 dark:bg-sky-900/10")}>
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                  n.icono === "cita" && (modoNoche ? "bg-sky-900/40 text-sky-400" : "bg-sky-100 text-sky-700"),
                  n.icono === "medicamento" && (modoNoche ? "bg-emerald-900/40 text-emerald-400" : "bg-emerald-100 text-emerald-700"),
                  n.icono === "estudio" && (modoNoche ? "bg-violet-900/40 text-violet-400" : "bg-violet-100 text-violet-700"),
                  n.icono === "recoleccion" && (modoNoche ? "bg-amber-900/40 text-amber-400" : "bg-amber-100 text-amber-700")
                )}>
                  {n.icono === "cita" && <Calendar className="w-4 h-4" />}
                  {n.icono === "medicamento" && <Pill className="w-4 h-4" />}
                  {n.icono === "estudio" && <Search className="w-4 h-4" />}
                  {n.icono === "recoleccion" && <ShoppingBag className="w-4 h-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{n.titulo}</p>
                  <p className="text-xs text-slate-500 truncate">{n.mensaje}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{n.fecha} · {n.hora}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileNav() {
  const { moduloActual, setModuloActual, modoNoche } = useApp();
  const items = [
    { id: "dashboard", label: "Inicio", icon: Home },
    { id: "citas", label: "Citas", icon: Calendar },
    { id: "medicamentos", label: "Meds", icon: Pill },
    { id: "signos", label: "Signos", icon: Activity },
    { id: "documentos", label: "Docs", icon: FileText },
  ];

  return (
    <nav className={cn("lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t backdrop-blur-md",
      modoNoche ? "bg-slate-900/95 border-slate-800" : "bg-white/95 border-slate-200")}>
      <div className="grid grid-cols-5">
        {items.map(item => {
          const Icon = item.icon;
          const active = moduloActual === item.id;
          return (
            <button key={item.id} onClick={() => setModuloActual(item.id)}
              className={cn("flex flex-col items-center gap-1 py-2.5 transition-colors",
                active ? "text-sky-500" : modoNoche ? "text-slate-400" : "text-slate-500")}>
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function renderModulo(modulo: string) {
  switch (modulo) {
    case "dashboard": return <DashboardView />;
    case "citas": return <CitasView />;
    case "medicamentos": return <MedicamentosView />;
    case "recoleccion": return <RecoleccionView />;
    case "estudios": return <EstudiosView />;
    case "documentos": return <DocumentosView />;
    case "signos": return <SignosView />;
    case "calendario": return <CalendarioView />;
    case "medicos": return <DirectorioView />;
    case "contactos": return <ContactosView />;
    case "usuarios": return <UsuariosViewWrapper />;
    default: return <DashboardView />;
  }
}

function UsuariosViewWrapper() {
  const { usuarios, crearUsuario, actualizarUsuario, eliminarUsuario, usuario } = useApp();
  return (
    <UsuariosView
      usuarios={usuarios}
      onCrear={crearUsuario}
      onActualizar={actualizarUsuario}
      onEliminar={eliminarUsuario}
      usuarioActual={usuario}
    />
  );
}

import { DashboardView } from "./views/DashboardView";
import { CitasView } from "./views/CitasView";
import { MedicamentosView } from "./views/MedicamentosView";
import { RecoleccionView } from "./views/RecoleccionView";
import { EstudiosView } from "./views/EstudiosView";
import { DocumentosView } from "./views/DocumentosView";
import { SignosView } from "./views/SignosView";
import { CalendarioView } from "./views/CalendarioView";
import { DirectorioView } from "./views/DirectorioView";
import { ContactosView } from "./views/ContactosView";
import { UsuariosView } from "./views/UsuariosView";
import { LoginView } from "./views/LoginView";
import { AlertasWhatsApp } from "./views/components/AlertasWhatsApp";
import { SelectorPaciente } from "./views/components/SelectorPaciente";
import { LogoUploader } from "./views/components/LogoUploader";
import { LogOut, KeyRound, ShieldCheck } from "lucide-react";

function UsuarioMenu() {
  const { usuario, modoNoche, logout, usuarios, login, resetDatos, logoUrl } = useApp();
  const [open, setOpen] = useState(false);
  const [cambiarOpen, setCambiarOpen] = useState(false);
  const setLogoOpen = (window as any).__setLogoOpen__ || (() => {});

  const colorRol = (rol: string) => {
    if (rol === "ADMIN") return "from-sky-500 to-cyan-600";
    if (rol === "FAMILIAR") return "from-emerald-500 to-teal-600";
    return "from-amber-500 to-orange-500";
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className={cn("flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700",
          "hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg py-1 pr-2 transition-colors")}>
        <div className={cn("w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm shadow-md",
          colorRol(usuario.rol))}>
          {usuario.nombre.charAt(0)}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium leading-tight truncate max-w-[120px]">{usuario.nombre}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: usuario.rol === "ADMIN" ? "#0ea5e9" : usuario.rol === "FAMILIAR" ? "#10b981" : "#f59e0b" }}>
            {usuario.rol}
          </p>
        </div>
      </button>

      {open && (
        <div className={cn("absolute right-0 top-full mt-2 w-72 rounded-2xl shadow-xl border z-50 overflow-hidden",
          modoNoche ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")}>
          <div className={cn("p-4 bg-gradient-to-r", colorRol(usuario.rol))}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold">
                {usuario.nombre.charAt(0)}
              </div>
              <div className="text-white">
                <p className="font-semibold truncate">{usuario.nombre}</p>
                <p className="text-xs text-white/80 truncate">{usuario.correo}</p>
              </div>
            </div>
          </div>

          <div className="p-3 border-b border-slate-200 dark:border-slate-700">
            <button onClick={() => { setCambiarOpen(!cambiarOpen); }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <KeyRound className="w-4 h-4 text-sky-500" />
              <span className="flex-1 text-left">Cambiar usuario</span>
            </button>

            {cambiarOpen && (
              <div className="mt-2 max-h-48 overflow-y-auto space-y-1">
                {usuarios.map(u => (
                  <button key={u.id}
                    onClick={() => { login(u); setCambiarOpen(false); setOpen(false); }}
                    className={cn("w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left",
                      u.id === usuario.id && "bg-sky-50 dark:bg-sky-900/20")}>
                    <div className={cn("w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center text-[10px] font-bold text-white",
                      colorRol(u.rol))}>
                      {u.nombre.split(" ").filter(Boolean).slice(0, 2).map(n => n[0]).join("").toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{u.nombre.split(" ")[0]}</p>
                      <p className="text-[10px] text-slate-500">{u.rol}</p>
                    </div>
                    {u.id === usuario.id && <ShieldCheck className="w-3 h-3 text-emerald-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 space-y-1">
            <button onClick={() => {
              if (confirm("¿Restablecer todos los datos a los valores de ejemplo? Esta acción no se puede deshacer.")) {
                resetDatos();
                setOpen(false);
              }
            }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
              <span className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center text-[10px]">↻</span>
              Restablecer datos de ejemplo
            </button>
            <button onClick={() => { logout(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
