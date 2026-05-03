class Evidencia {
  constructor({ 
    id_evidencia, 
    id_gasto, 
    url_evidencia, 
    public_id, 
    nombre_original, 
    tipo_archivo, 
    comentario, 
    fecha_subida 
  }) {
    if (!id_gasto) throw new Error("El ID del gasto es obligatorio.");
    if (!url_evidencia) throw new Error("La URL de la evidencia es obligatoria.");
    if (!public_id) throw new Error("El identificador (public_id) es obligatorio.");

    this.id_evidencia = id_evidencia;
    this.id_gasto = id_gasto;
    this.url_evidencia = url_evidencia.trim();
    this.public_id = public_id.trim();
    this.nombre_original = nombre_original ? nombre_original.trim() : null;
    this.tipo_archivo = tipo_archivo ? tipo_archivo.trim() : null;
    this.comentario = comentario ? comentario.trim() : "";
    this.fecha_subida = fecha_subida || new Date();
  }
}

module.exports = Evidencia;