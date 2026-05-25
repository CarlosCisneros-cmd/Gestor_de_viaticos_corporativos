const cloudinary = require("cloudinary").v2;

class EvidenciasController {
  constructor({
    crearEvidencias,
    listarEvidenciasPorGastos,
    eliminarEvidencias,
  }) {
    this.crearEvidencias = crearEvidencias;
    this.listarEvidenciasPorGastos = listarEvidenciasPorGastos;
    this.eliminarEvidencias = eliminarEvidencias;
  }

  async crear(req, res, next) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "No se ha seleccionado ningún archivo." });
      }

      const { id_gasto, comentario } = req.body;

      const datosEvidencia = {
        id_gasto: Number(id_gasto),
        url_evidencia: req.file.path,
        public_id: req.file.filename,
        nombre_original: req.file.originalname,
        tipo_archivo: req.file.mimetype,
        comentario: comentario || "",
      };

      const nuevaEvidencia =
        await this.crearEvidencias.ejecutar(datosEvidencia);

      return res.status(201).json({
        message: "¡Evidencia subida y registrada con éxito!",
        evidencia: nuevaEvidencia,
      });
    } catch (error) {
      console.error("Error en el controlador de evidencias:", error);
      next(error);
    }
  }

  listarPorGasto = async (req, res, next) => {
    try {
      const { id_gasto } = req.params;

      // Ejecutamos el caso de uso
      const evidencias =
        await this.listarEvidenciasPorGastos.ejecutar(id_gasto);

      // Devolvemos el arreglo de evidencias (puede estar vacío)
      res.json(evidencias);
    } catch (error) {
      console.error("Error al listar evidencias por gasto:", error);
      next(error);
    }
  };

  eliminar = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { public_id } = req.body;

      if (!public_id) {
        return res
          .status(400)
          .json({
            error:
              "El public_id es requerido para eliminar el archivo de la nube.",
          });
      }

      // 2. Eliminamos el archivo de Cloudinary
      const resultadoCloudinary = await cloudinary.uploader.destroy(public_id);

      if (
        resultadoCloudinary.result !== "ok" &&
        resultadoCloudinary.result !== "not found"
      ) {
        console.error("Fallo al eliminar en Cloudinary:", resultadoCloudinary);
        return res
          .status(500)
          .json({ error: "No se pudo eliminar el archivo de la nube." });
      }

      // 3. Si se borró de la nube (o ya no existía), eliminamos el registro en la Base de Datos
      const resultadoBD = await this.eliminarEvidencias.ejecutar(id);

      res.json({
        message: "Evidencia y archivo eliminados correctamente",
        dbResult: resultadoBD,
      });
    } catch (error) {
      console.error("Error al eliminar la evidencia:", error);
      next(error);
    }
  };
}

module.exports = EvidenciasController;
