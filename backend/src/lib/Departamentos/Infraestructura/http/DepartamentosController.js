class DepartamentosController {
  constructor({ 
    crearDepartamento, 
    listarDepartamentos, 
    obtenerDepartamentoPorId, 
    actualizarDepartamento, // ✨ Añadido
    eliminarDepartamento 
  }) {
    this.crearDepartamento = crearDepartamento;
    this.listarDepartamentos = listarDepartamentos;
    this.obtenerDepartamentoPorId = obtenerDepartamentoPorId;
    this.actualizarDepartamento = actualizarDepartamento; // ✨ Añadido
    this.eliminarDepartamento = eliminarDepartamento;
  }

  crear = async (req, res) => {
    try {
      const departamento = await this.crearDepartamento.ejecutar(req.body);
      res.status(201).json(departamento);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  listar = async (req, res) => {
    try {
      const departamentos = await this.listarDepartamentos.ejecutar();
      res.json(departamentos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  obtenerPorId = async (req, res) => {
    try {
      const departamento = await this.obtenerDepartamentoPorId.ejecutar(req.params.id);
      res.json(departamento);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  actualizar = async (req, res) => { // ✨ Añadido método de actualización HTTP
    try {
      const { id } = req.params;
      const departamentoActualizado = await this.actualizarDepartamento.ejecutar(id, req.body);
      res.json(departamentoActualizado);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  eliminar = async (req, res) => {
    try {
      await this.eliminarDepartamento.ejecutar(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };
}

module.exports = DepartamentosController;