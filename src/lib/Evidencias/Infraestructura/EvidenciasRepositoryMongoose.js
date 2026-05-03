const Evidencia = require('../Dominio/Entidades/Evidencias');
const EvidenciaModel = require('./EvidenciasModel');


class EvidenciaRepositoryMongoose {
  
  // Guardar una nueva evidencia en MongoDB
  async save(evidenciaData) {
    const nuevaEvidencia = new EvidenciaModel(evidenciaData);
    const doc = await nuevaEvidencia.save();
    
    // Retornamos la entidad de dominio mapeada
    return new Evidencia({
      id_evidencia: doc._id,
      id_gasto: doc.id_gasto,
      url_evidencia: doc.url_evidencia,
      public_id: doc.public_id,
      nombre_original: doc.nombre_original,
      tipo_archivo: doc.tipo_archivo,
      comentario: doc.comentario,
      fecha_subida: doc.fecha_subida
    });
  }

  // Buscar evidencias por el ID del Gasto
  async findByGastoId(id_gasto) {
    const documentos = await EvidenciaModel.find({ id_gasto });
    
    // Mapeamos los documentos de Mongoose a entidades de dominio
    return documentos.map(doc => new Evidencia({
      id_evidencia: doc._id,
      id_gasto: doc.id_gasto,
      url_evidencia: doc.url_evidencia,
      public_id: doc.public_id,
      nombre_original: doc.nombre_original,
      tipo_archivo: doc.tipo_archivo,
      comentario: doc.comentario,
      fecha_subida: doc.fecha_subida
    }));
  }

  // Eliminar una evidencia por su ID
  async delete(id) {
    const docEliminado = await EvidenciaModel.findByIdAndDelete(id);
    return docEliminado;
  }
}

module.exports = EvidenciaRepositoryMongoose;