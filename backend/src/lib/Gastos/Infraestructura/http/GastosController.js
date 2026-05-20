class GastosController {
  constructor({
    CrearGastos,
    ListarGastos,
    ListarPorId,
    EliminarGastos,
    ActualizarGastos,
    ListarPorViatico,
  }) {
    this.crearGastos = CrearGastos;
    this.listarGastos = ListarGastos;
    this.listarPorId = ListarPorId;
    this.eliminarGastos = EliminarGastos;
    this.actualizarGastos = ActualizarGastos;
    this.listarPorViaticoService = ListarPorViatico; // Inyectamos el servicio
  }

  // Operación: CREAR GASTO
  crear = async (req, res) => {
    try {
      // Usamos la referencia guardada en el constructor
      const gasto = await this.crearGastos.ejecutar(req.body);
      res.status(201).json(gasto);
    } catch (error) {
      // Mantenemos el estándar de error de tu proyecto
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  };

  // Operación: LISTAR TODOS LOS GASTOS
  listar = async (req, res) => {
    try {
      const gastos = await this.listarGastos.ejecutar();
      res.json(gastos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Operación: OBTENER POR ID
  obtenerPorId = async (req, res) => {
    try {
      const { id } = req.params;
      const gasto = await this.listarPorId.ejecutar(id);
      res.json(gasto);
    } catch (error) {
      // Respetamos el manejo de statusCode dinámico
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  // Operación: ELIMINAR GASTO
  eliminar = async (req, res) => {
    try {
      const { id } = req.params;
      await this.eliminarGastos.ejecutar(id);
      // 204 No Content para eliminaciones exitosas
      res.status(204).send();
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  // Operación: ACTUALIZAR GASTO
  actualizar = async (req, res) => {
    try {
      const { id } = req.params;
      const datos = req.body;

      const resultado = await this.actualizarGastos.ejecutar(id, datos);

      res.status(200).json({
        message: "Gasto actualizado con éxito",
        data: resultado,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  listarPorViatico = async (req, res) => {
    try {
      const { id } = req.params;

      const gastos = await this.listarPorViaticoService.ejecutar(id);

      res.status(200).json(gastos);
    } catch (error) {
      console.error("Error en listarPorViatico:", error);
      res
        .status(500)
        .json({ message: "Error al obtener gastos", error: error.message });
    }
  };
}

module.exports = GastosController;
