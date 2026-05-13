const { Schema, model } = require("mongoose");


const EvidenciaSchema = new Schema({
  id_gasto: { type: Number, required: true }, // Referencia a tabla en PostgreSQL
  url_evidencia: { type: String, required: true },
  public_id: { type: String, required: true },
  nombre_original: { type: String, default: '' },
  tipo_archivo: { type: String, default: '' },
  comentario: { type: String, default: '' },
  fecha_subida: { type: Date, default: Date.now }
});

module.exports = model('Evidencia', EvidenciaSchema, "evidencias");