class Gastos {
  constructor({
    id_gasto,
    id_viatico,
    id_categoria,
    monto,
    fecha_gasto,
    descripcion,
    observaciones, // ✨ Cambiado de foto_comprobante a observaciones
    estado_gasto,
  }) {
    // Validaciones de negocio (Capa de Dominio)
    if (!id_viatico)
      throw new Error(
        "El id_viatico es requerido para vincular el gasto a una cabecera",
      );
    if (!id_categoria) throw new Error("La categoría del gasto es requerida");
    if (!monto || monto <= 0)
      throw new Error("El monto debe ser un valor positivo");
    if (!descripcion) throw new Error("La descripción del gasto es requerida");

    this.id_gasto = id_gasto;
    this.id_viatico = id_viatico;
    this.id_categoria = id_categoria;
    this.monto = monto;
    this.fecha_gasto = fecha_gasto || new Date(); 
    this.descripcion = descripcion.trim();
    
    // ✨ Se almacena como texto plano. Si viene vacío, se guarda como string vacío.
    this.observaciones = observaciones ? observaciones.trim() : ""; 

    // Estado por defecto: 'Pendiente'
    this.estado_gasto = estado_gasto || "Pendiente";
  }
}

module.exports = Gastos;