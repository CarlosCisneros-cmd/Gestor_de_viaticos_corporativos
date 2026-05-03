class EvidenciasController {
  constructor({ crearEvidencias, listarEvidenciasPorGastos, eliminarEvidencias }) {
    this.crearEvidencias = crearEvidencias;
    this.listarEvidenciasPorGastos = listarEvidenciasPorGastos;
    this.eliminarEvidencias = eliminarEvidencias;
  }

  crear = async (req, res, next) => {
    try {
      const evidencia = await this.crearEvidencias.ejecutar(req.body);
      res.status(201).json(evidencia);
    } catch (error) {
      next(error);
    }
  };

  listarPorGasto = async (req, res, next) => {
    try {
      const evidencias = await this.listarEvidenciasPorGastos.ejecutar(req.params.id_gasto);
      res.json(evidencias);
    } catch (error) {
      next(error);
    }
  };

  eliminar = async (req, res, next) => {
    try {
      const resultado = await this.eliminarEvidencias.ejecutar(req.params.id);
      res.json(resultado);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = EvidenciasController;