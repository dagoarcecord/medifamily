import {
  Cita, Medicamento, Recoleccion, Estudio, Documento, SignoVital,
  Medico, ContactoEmergencia, Actividad, NotificacionItem
} from "../App";

export const mockData = {
  // Sin usuarios de ejemplo - la familia se registra por su cuenta
  usuarios: [],

  citas: [
    {
      id: 1, especialidad: "Cardiología", medico: "Dr. Roberto Sánchez",
      hospital: "Hospital Ángeles", direccion: "Av. Reforma 123, CDMX", telefono: "5551234567",
      fecha: "2026-02-15", hora: "10:30", motivo: "Control mensual", indicaciones: "Llegar 15 min antes. Traer estudios previos.",
      ayuno: false, llevarEstudios: true, observaciones: "Revisar presión arterial.",
      estado: "Pendiente" as const, creadoPor: "María Elena Vargas",
      fechaCreacion: "2026-01-20T10:00:00Z",
      pacienteId: 1
    },
    {
      id: 2, especialidad: "Geriatría", medico: "Dra. Laura Mendoza",
      hospital: "Hospital ABC", direccion: "Calz. Ejército Nacional 123", telefono: "5559876543",
      fecha: "2026-02-22", hora: "09:00", motivo: "Evaluación general", indicaciones: "Ayuno de 8 horas.",
      ayuno: true, llevarEstudios: false, observaciones: "Revisar medicación actual.",
      estado: "Pendiente" as const, creadoPor: "Carlos Vargas",
      fechaCreacion: "2026-01-22T14:30:00Z"
    },
    {
      id: 3, especialidad: "Nutrición", medico: "Lic. Patricia Ruiz",
      hospital: "Consultorio Privado", direccion: "Polanco 456", telefono: "5557654321",
      fecha: "2026-01-30", hora: "16:00", motivo: "Plan alimenticio", indicaciones: "Llevar registro de comidas.",
      ayuno: false, llevarEstudios: false, observaciones: "",
      estado: "Completada" as const, creadoPor: "Ana Vargas",
      fechaCreacion: "2026-01-10T08:00:00Z"
    },
    {
      id: 4, especialidad: "Neurología", medico: "Dr. Eduardo Torres",
      hospital: "Hospital Español", direccion: "Eje Central 1500", telefono: "5552468135",
      fecha: "2026-03-05", hora: "11:00", motivo: "Seguimiento", indicaciones: "Traer resonancia magnética.",
      ayuno: false, llevarEstudios: true, observaciones: "Evaluar mareos recurrentes.",
      estado: "Pendiente" as const, creadoPor: "María Elena Vargas",
      fechaCreacion: "2026-01-25T11:20:00Z"
    }
  ] as Cita[],

  medicamentos: [
    {
      id: 1, nombre: "Enalapril", dosis: "10 mg", frecuencia: "2 veces al día",
      hora1: "08:00", hora2: "20:00", hora3: "", fechaInicio: "2025-12-01", fechaFin: "2026-06-01",
      observaciones: "Tomar con alimentos.", stock: 30, creadoPor: "María Elena Vargas"
    },
    {
      id: 2, nombre: "Metformina", dosis: "500 mg", frecuencia: "3 veces al día",
      hora1: "08:00", hora2: "14:00", hora3: "21:00", fechaInicio: "2025-11-15", fechaFin: "2026-12-31",
      observaciones: "Después de cada comida.", stock: 90, creadoPor: "Carlos Vargas"
    },
    {
      id: 3, nombre: "Atorvastatina", dosis: "20 mg", frecuencia: "1 vez al día",
      hora1: "22:00", hora2: "", hora3: "", fechaInicio: "2025-10-01", fechaFin: "2026-09-30",
      observaciones: "Antes de dormir.", stock: 60, creadoPor: "María Elena Vargas"
    },
    {
      id: 4, nombre: "Vitamina D3", dosis: "1000 UI", frecuencia: "1 vez al día",
      hora1: "09:00", hora2: "", hora3: "", fechaInicio: "2026-01-01", fechaFin: "2026-12-31",
      observaciones: "Con el desayuno.", stock: 120, creadoPor: "Ana Vargas"
    }
  ] as Medicamento[],

  recolecciones: [
    {
      id: 1, medicamentoId: 1, medicamentoNombre: "Enalapril",
      lugar: "Farmacia del Ahorro - Reforma", fechaRecoleccion: "2026-02-05",
      observaciones: "Receta vigente hasta marzo.", estado: "Pendiente" as const
    },
    {
      id: 2, medicamentoId: 3, medicamentoNombre: "Atorvastatina",
      lugar: "Farmacia Similares - Polanco", fechaRecoleccion: "2026-02-10",
      observaciones: "Solicitar descuento por adulto mayor.", estado: "Pendiente" as const
    },
    {
      id: 3, medicamentoId: 2, medicamentoNombre: "Metformina",
      lugar: "Hospital ABC - Farmacia interna", fechaRecoleccion: "2026-01-28",
      observaciones: "Recogido con seguro.", estado: "Recogido" as const
    }
  ] as Recoleccion[],

  estudios: [
    {
      id: 1, tipo: "Laboratorio" as const, nombre: "Química sanguínea completa",
      fecha: "2026-02-12", lugar: "Laboratorio Médica Sur",
      indicaciones: "Ayuno de 12 horas. Llegar 8:00 am.",
      resultadoDisponible: false, asistio: false
    },
    {
      id: 2, tipo: "Resonancia" as const, nombre: "Resonancia magnética cerebral",
      fecha: "2026-03-08", lugar: "Imaging Center Polanco",
      indicaciones: "Sin aretes ni objetos metálicos.",
      resultadoDisponible: false, asistio: false
    },
    {
      id: 3, tipo: "Rayos X" as const, nombre: "Radiografía de tórax",
      fecha: "2026-01-22", lugar: "Hospital Ángeles",
      indicaciones: "Solicitado por Dr. Sánchez.",
      resultadoDisponible: true, archivo: "rayos_torax_ene2026.pdf", asistio: true,
      fechaResultados: "2026-01-23", quienRecogioResultados: "Carlos Vargas",
      comentarios: "Sin hallazgos relevantes según el radiólogo."
    },
    {
      id: 4, tipo: "Ultrasonido" as const, nombre: "Ecocardiograma",
      fecha: "2026-02-20", lugar: "Cardiocentro Norte",
      indicaciones: "Traer study previo de 2025.",
      resultadoDisponible: false, asistio: false
    }
  ] as Estudio[],

  documentos: [
    {
      id: 1, titulo: "Receta Enalapril - Enero 2026",
      categoria: "Recetas" as const, fecha: "2026-01-15",
      archivo: "receta_enero_2026.pdf", tipo: "PDF",
      tamano: "245 KB", descripcion: "Receta mensual para presión arterial."
    },
    {
      id: 2, titulo: "Resultados Química Sanguínea - Dic 2025",
      categoria: "Laboratorios" as const, fecha: "2025-12-15",
      archivo: "quimica_dic2025.pdf", tipo: "PDF",
      tamano: "1.2 MB", descripcion: "Perfil lipídico y metabólico completo."
    },
    {
      id: 3, titulo: "Radiografía de Tórax",
      categoria: "Imagenologia" as const, fecha: "2026-01-22",
      archivo: "torax_012026.jpg", tipo: "JPG",
      tamano: "3.4 MB", descripcion: "Control post-infección respiratoria."
    },
    {
      id: 4, titulo: "Nota de Consulta Cardiológica",
      categoria: "Consultas" as const, fecha: "2026-01-12",
      archivo: "nota_cardio_enero.pdf", tipo: "PDF",
      tamano: "320 KB", descripcion: "Evaluación inicial de riesgo cardiovascular."
    },
    {
      id: 5, titulo: "Alta Hospitalaria - Hospitalización",
      categoria: "Hospitalizaciones" as const, fecha: "2025-11-08",
      archivo: "alta_nov2025.pdf", tipo: "PDF",
      tamano: "540 KB", descripcion: "Post-operatorio apendicectomía."
    }
  ] as Documento[],

  signos: [
    { id: 1, fecha: "2026-01-30", hora: "08:00", presionSistolica: 135, presionDiastolica: 85, glucosa: 110, peso: 68.5, temperatura: 36.5, oxigenacion: 97, pulso: 72, notas: "Buen descanso." },
    { id: 2, fecha: "2026-01-28", hora: "08:00", presionSistolica: 138, presionDiastolica: 88, glucosa: 115, peso: 68.7, temperatura: 36.6, oxigenacion: 96, pulso: 75, notas: "" },
    { id: 3, fecha: "2026-01-26", hora: "08:00", presionSistolica: 142, presionDiastolica: 90, glucosa: 122, peso: 68.8, temperatura: 36.7, oxigenacion: 95, pulso: 78, notas: "Un poco elevada." },
    { id: 4, fecha: "2026-01-24", hora: "08:00", presionSistolica: 130, presionDiastolica: 82, glucosa: 105, peso: 68.4, temperatura: 36.5, oxigenacion: 97, pulso: 70, notas: "" },
    { id: 5, fecha: "2026-01-22", hora: "08:00", presionSistolica: 128, presionDiastolica: 80, glucosa: 102, peso: 68.3, temperatura: 36.4, oxigenacion: 98, pulso: 68, notas: "" },
    { id: 6, fecha: "2026-01-20", hora: "08:00", presionSistolica: 132, presionDiastolica: 84, glucosa: 108, peso: 68.5, temperatura: 36.5, oxigenacion: 97, pulso: 71, notas: "" },
    { id: 7, fecha: "2026-01-18", hora: "08:00", presionSistolica: 140, presionDiastolica: 88, glucosa: 118, peso: 68.9, temperatura: 36.6, oxigenacion: 96, pulso: 76, notas: "Mañana fría." },
    { id: 8, fecha: "2026-01-16", hora: "08:00", presionSistolica: 134, presionDiastolica: 84, glucosa: 112, peso: 68.6, temperatura: 36.5, oxigenacion: 97, pulso: 73, notas: "" }
  ] as SignoVital[],

  medicos: [
    { id: 1, nombre: "Dra. Laura Mendoza", especialidad: "Geriatría", telefono: "5559876543", correo: "lmendoza@hospitalabc.com", direccion: "Hospital ABC - Torre Médica 2, Piso 5" },
    { id: 2, nombre: "Dr. Roberto Sánchez", especialidad: "Cardiología", telefono: "5551234567", correo: "rsanchez@hospitalangeles.com", direccion: "Hospital Ángeles - Consultorio 402" },
    { id: 3, nombre: "Lic. Patricia Ruiz", especialidad: "Nutrición", telefono: "5557654321", correo: "pruiz@nutricion.mx", direccion: "Polanco 456, Consultorio 12B" },
    { id: 4, nombre: "Dr. Eduardo Torres", especialidad: "Neurología", telefono: "5552468135", correo: "etorres@hospitalespanol.mx", direccion: "Hospital Español - Piso 8" },
    { id: 5, nombre: "Dra. Carmen Jiménez", especialidad: "Medicina Interna", telefono: "5553691478", correo: "cjimenez@medicina.mx", direccion: "Consultorio Privado - Reforma 789" }
  ] as Medico[],

  contactos: [] as ContactoEmergencia[],

  pacientes: [
    { id: 1, nombre: "Mamá", parentesco: "Paciente principal", color: "from-rose-500 to-pink-600" }
  ] as any[],

  actividades: [
    { id: 1, usuario: "María Elena Vargas", accion: "Creó cita", modulo: "Citas", detalle: "Cardiología - 2026-02-15", fecha: "2026-01-25", hora: "10:30" },
    { id: 2, usuario: "Carlos Vargas", accion: "Actualizó medicamento", modulo: "Medicamentos", detalle: "Enalapril - Ajuste de dosis", fecha: "2026-01-25", hora: "09:15" },
    { id: 3, usuario: "Ana Vargas", accion: "Subió documento", modulo: "Documentos", detalle: "Receta Enalapril - Enero 2026", fecha: "2026-01-24", hora: "18:45" },
    { id: 4, usuario: "María Elena Vargas", accion: "Registró signos vitales", modulo: "Signos Vitales", detalle: "PA: 135/85, GC: 110", fecha: "2026-01-30", hora: "08:05" },
    { id: 5, usuario: "Carlos Vargas", accion: "Creó estudio", modulo: "Estudios", detalle: "Resonancia magnética cerebral", fecha: "2026-01-23", hora: "14:20" }
  ] as Actividad[],

  notificaciones: [
    { id: 1, tipo: "cita", titulo: "Cita próxima en 7 días", mensaje: "Cardiología - Dr. Roberto Sánchez", fecha: "2026-02-08", hora: "09:00", leida: false, icono: "cita" },
    { id: 2, tipo: "medicamento", titulo: "Hora de medicamento", mensaje: "Enalapril 10 mg - 08:00", fecha: "2026-01-31", hora: "08:00", leida: false, icono: "medicamento" },
    { id: 3, tipo: "recoleccion", titulo: "Recoger medicamento", mensaje: "Enalapril - Farmacia del Ahorro", fecha: "2026-02-05", hora: "12:00", leida: false, icono: "recoleccion" },
    { id: 4, tipo: "estudio", titulo: "Estudio programado", mensaje: "Química sanguínea - 2026-02-12", fecha: "2026-02-12", hora: "08:00", leida: false, icono: "estudio" },
    { id: 5, tipo: "cita", titulo: "Cita completada", mensaje: "Nutrición - Lic. Patricia Ruiz", fecha: "2026-01-30", hora: "16:00", leida: true, icono: "cita" }
  ] as NotificacionItem[]
};
