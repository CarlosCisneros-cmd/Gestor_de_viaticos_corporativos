class Viatico {
  constructor({ id_Viatico , descripcion_Viatico, fecha_inicio, fecha_fin, presupuesto_asignado, estado_Viatico,fecha_solicitud, id_usuario  }) {
    if (!descripcion_Viatico) throw new Error("La descripción es obligatoria.");
    if (!fecha_inicio) throw new Error("La fecha de inicio es obligatoria.");
    if (!fecha_fin) throw new Error("La fecha de fin es obligatoria.");
    
    if (new Date(fecha_fin) < new Date(fecha_inicio)) {
        throw new Error("La fecha de fin no puede ser anterior a la fecha de inicio.");
    }

    this.id_Viatico = id_Viatico ;
    this.descripcion_Viatico = descripcion_Viatico.trim();
    this.fecha_inicio = fecha_inicio    ;
    this.fecha_fin = fecha_fin;
    this.presupuesto_asignado = presupuesto_asignado;
    this.estado_Viatico = estado_Viatico || "Pendiente";
    this.fecha_solicitud = fecha_solicitud || new Date();

    // atributo para la relación
    this.id_usuario  = id_usuario ; 
  }
}

module.exports = Viatico;