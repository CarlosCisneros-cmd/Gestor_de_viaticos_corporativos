class ViaticoController {
  // El constructor recibe los Casos de Uso (Aplicación) de Viáticos
  constructor({ CrearViatico, ListarViaticos, ListarPorId, EliminarViatico, ActualizarViatico }) {
    this.CrearViatico = CrearViatico;
    this.ListarViaticos = ListarViaticos;
    this.ListarPorId = ListarPorId;
    this.EliminarViatico = EliminarViatico;
    this.ActualizarViatico = ActualizarViatico;
  }

  // Actividad 2: Implementar operación CREAR Viático
  crear = async (req, res) => {
    try {
      const viatico = await this.CrearViatico.ejecutar(req.body);
      res.status(201).json(viatico);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // Actividad 2: Implementar operación LISTAR todos los Viáticos
  listar = async (req, res) => {
    try {
      const viaticos = await this.ListarViaticos.ejecutar();
      res.json(viaticos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Actividad 2: Implementar operación obtener Viático por ID
  obtenerPorId = async (req, res) => {
    try {
      const viatico = await this.ListarPorId.ejecutar(req.params.id);
      if (!viatico) return res.status(404).json({ message: "Viático no encontrado" });
      res.json(viatico);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Actividad 2: Implementar operación ELIMINAR Viático
  eliminar = async (req, res) => {
    try {
      await this.EliminarViatico.ejecutar(req.params.id);
      res.status(204).send(); // 204 significa "No Content", éxito pero sin respuesta
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Actividad 2: Implementar operación ACTUALIZAR Viático
  actualizar = async (req, res) => {
    try {
      const { id } = req.params;
      const datos = req.body;
      
      const resultado = await this.ActualizarViatico.ejecutar(id, datos);
      
      res.status(200).json({
        message: "Viático actualizado con éxito",
        data: resultado
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };
}

module.exports = ViaticoController;