class CategoriaController {
  // Recibimos los Casos de Uso con Mayúscula para coincidir con el index.js
  constructor({ CrearCategoria, ListarCategoria, ListarPorId, EliminarCategoria, ActualizarCategoria }) {
    this.crearCategoria = CrearCategoria;
    this.listarCategorias = ListarCategoria;
    this.listarPorId = ListarPorId;
    this.eliminarCategoria = EliminarCategoria;
    this.actualizarCategoria = ActualizarCategoria;
  }

  // Operación: CREAR CATEGORÍA
  crear = async (req, res) => {
    try {
      const categoria = await this.crearCategoria.ejecutar(req.body);
      res.status(201).json(categoria);
    } catch (error) {
      res.status(error.statusCode || 400).json({ error: error.message });
    }
  };

  // Operación: LISTAR TODAS LAS CATEGORÍAS
  listar = async (req, res) => {
    try {
      const categorias = await this.listarCategorias.ejecutar();
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Operación: OBTENER POR ID
  obtenerPorId = async (req, res) => {
    try {
      const { id } = req.params;
      const categoria = await this.listarPorId.ejecutar(id);
      res.json(categoria);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  // Operación: ELIMINAR CATEGORÍA
  eliminar = async (req, res) => {
    try {
      const { id } = req.params;
      await this.eliminarCategoria.ejecutar(id);
      // Mantenemos el 204 para ser coherentes con Usuarios
      res.status(204).send();
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  // Operación: ACTUALIZAR CATEGORÍA
  actualizar = async (req, res) => {
    try {
      const { id } = req.params;
      const datos = req.body;
      
      const resultado = await this.actualizarCategoria.ejecutar(id, datos);
      
      res.status(200).json({
        message: "Categoría actualizada con éxito",
        data: resultado
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };
}

module.exports = CategoriaController;