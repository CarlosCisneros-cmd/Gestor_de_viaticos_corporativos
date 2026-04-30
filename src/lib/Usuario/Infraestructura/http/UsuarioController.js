class UsuarioController {
  // El constructor recibe los Casos de Uso (Aplicación)
  constructor({ crearUsuario, listarUsuarios, obtenerUsuarioPorId, eliminarUsuario }) {
    this.crearUsuario = crearUsuario;
    this.listarUsuarios = listarUsuarios;
    this.obtenerUsuarioPorId = obtenerUsuarioPorId;
    this.eliminarUsuario = eliminarUsuario;
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
      const usuario = await this.obtenerUsuarioPorId.ejecutar(req.params.id);
      if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Actividad 2: Implementar operación ELIMINAR [cite: 19]
  eliminar = async (req, res) => {
    try {
      await this.eliminarUsuario.ejecutar(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = UsuarioController;