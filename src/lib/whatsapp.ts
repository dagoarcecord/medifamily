/**
 * Utilidades para generar enlaces de WhatsApp y mensajes de alerta.
 * 
 * Permite enviar mensajes automáticos a familiares y paciente
 * para recordar citas y recolección de medicamentos.
 */

/**
 * Limpia un número de teléfono eliminando espacios, guiones y paréntesis.
 * Añade prefijo internacional 52 (México) si no lo tiene.
 */
export function limpiarTelefono(numero: string): string {
  if (!numero) return "";
  // Eliminar todo lo que no sea dígito
  let limpio = numero.replace(/[^\d]/g, "");
  // Si empieza con 52 y tiene 12 dígitos (formato internacional correcto), mantener
  if (limpio.length === 12 && limpio.startsWith("52")) return limpio;
  // Si tiene 10 dígitos (México sin prefijo), añadir 52
  if (limpio.length === 10) return "52" + limpio;
  // Si tiene 12 dígitos sin prefijo (raro), asumir que es con prefijo
  if (limpio.length === 13 && limpio.startsWith("521")) return limpio.slice(1);
  return limpio;
}

/**
 * Genera el enlace de WhatsApp para enviar un mensaje.
 * 
 * @param telefono - Número de destino (se limpiará automáticamente)
 * @param mensaje - Texto del mensaje
 */
export function generarEnlaceWhatsApp(telefono: string, mensaje: string): string {
  const num = limpiarTelefono(telefono);
  if (!num) return "";
  const texto = encodeURIComponent(mensaje);
  return `https://wa.me/${num}?text=${texto}`;
}

/**
 * Genera diferentes tipos de mensajes según el evento.
 */
export function generarMensajeCita(params: {
  especialidad: string;
  medico: string;
  hospital: string;
  fecha: string;
  hora: string;
  indicaciones?: string;
}): string {
  const linea1 = `🏥 *Recordatorio de Cita Médica - MEDIFAMILY*`;
  const cuerpo = [
    ``,
    `📋 *Especialidad:* ${params.especialidad}`,
    `👨‍⚕️ *Médico:* ${params.medico}`,
    `🏥 *Lugar:* ${params.hospital}`,
    `📅 *Fecha:* ${params.fecha}`,
    `⏰ *Hora:* ${params.hora}`,
    ``,
    params.indicaciones ? `📝 *Indicaciones:* ${params.indicaciones}` : null,
    ``,
    `_Enviado automáticamente por MEDIFAMILY_ 💙`
  ].filter(Boolean).join("\n");
  return linea1 + cuerpo;
}

export function generarMensajeRecoleccion(params: {
  medicamento: string;
  lugar: string;
  fecha: string;
}): string {
  return [
    `💊 *Recordatorio de Recolección - MEDIFAMILY*`,
    ``,
    `📦 *Medicamento:* ${params.medicamento}`,
    `📍 *Lugar:* ${params.lugar}`,
    `📅 *Fecha:* ${params.fecha}`,
    ``,
    `¡No olvides recogerlo a tiempo!`,
    ``,
    `_Enviado automáticamente por MEDIFAMILY_ 💙`
  ].join("\n");
}

export function generarMensajeEstudio(params: {
  tipo: string;
  nombre: string;
  fecha: string;
  lugar: string;
}): string {
  return [
    `🔬 *Recordatorio de Estudio Médico - MEDIFAMILY*`,
    ``,
    `🧪 *Tipo:* ${params.tipo}`,
    `📋 *Estudio:* ${params.nombre}`,
    `📅 *Fecha:* ${params.fecha}`,
    `📍 *Lugar:* ${params.lugar}`,
    ``,
    `_Enviado automáticamente por MEDIFAMILY_ 💙`
  ].join("\n");
}

/**
 * Verifica si un número es válido para WhatsApp.
 */
export function telefonoValido(telefono: string): boolean {
  const limpio = limpiarTelefono(telefono);
  return limpio.length >= 10;
}
