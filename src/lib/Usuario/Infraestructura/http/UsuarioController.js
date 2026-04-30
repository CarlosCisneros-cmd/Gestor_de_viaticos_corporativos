class UsuarioController {
  // El constructor recibe los Casos de Uso (Aplicación)
  constructor({ crearUsuario, ListarUsuarios, ListarPorId, EliminarUsuario, ActualizarUsuario }) {
    this.crearUsuario = crearUsuario;
    this.ListarUsuarios = ListarUsuarios;
    this.ListarPorId = ListarPorId;
    this.EliminarUsuario = EliminarUsuario;
    this.ActualizarUsuario = ActualizarUsuario;
  }

  // Actividad 2: Implementar operación CREAR [cite: 19]
  crear = async (req, res) => {
    try {
      const usuario = await this.crearUsuario.ejecutar(req.body);
      res.status(201).json(usuario);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // Actividad 2: Implementar operación LISTAR [cite: 19]
  listar = async (req, res) => {
    try {
      const usuarios = await this.ListarUsuarios.ejecutar();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Actividad 2: Implementar operación obtener por ID [cite: 19]
  obtenerPorId = async (req, res) => {
    try {
      const usuario = await this.ListarPorId.ejecutar(req.params.id);
      if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Actividad 2: Implementar operación ELIMINAR [cite: 19]
  eliminar = async (req, res) => {
    try {
      await this.EliminarUsuario.ejecutar(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

   actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;
    
    const resultado = await this.ActualizarUsuario.ejecutar(id, datos);
    
    res.status(200).json({
      message: "Usuario actualizado con éxito",
      data: resultado
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
  }
}

module.exports = UsuarioController;