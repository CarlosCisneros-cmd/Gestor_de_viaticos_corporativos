class DepartamentosController {
  // Recibe los Casos de Uso (Aplicación) mediante Inyección de Dependencias
  constructor({ crearDepartamento, listarDepartamentos, obtenerDepartamentoPorId, eliminarDepartamento }) {
    this.crearDepartamento = crearDepartamento;
    this.listarDepartamentos = listarDepartamentos;
    this.obtenerDepartamentoPorId = obtenerDepartamentoPorId;
    this.eliminarDepartamento = eliminarDepartamento;
  }

  // Operación: CREAR
  crear = async (req, res) => {
    try {
      const departamento = await this.crearDepartamento.ejecutar(req.body);
      res.status(201).json(departamento);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // Operación: LISTAR
  listar = async (req, res) => {
    try {
      const departamentos = await this.listarDepartamentos.ejecutar();
      res.json(departamentos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Operación: OBTENER POR ID
  obtenerPorId = async (req, res) => {
    try {
      const departamento = await this.obtenerDepartamentoPorId.ejecutar(req.params.id);
      if (!departamento) {
        return res.status(404).json({ message: "Departamento no encontrado" });
      }
      res.json(departamento);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Operación: ELIMINAR
  eliminar = async (req, res) => {
    try {
      await this.eliminarDepartamento.ejecutar(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = DepartamentosController;