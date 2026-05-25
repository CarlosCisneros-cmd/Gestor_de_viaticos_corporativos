class UsuarioController {
  constructor({ CrearUsuario, ListarUsuarios, ListarPorId, EliminarUsuario, ActualizarUsuario, LoginUsuario }) {
    this.CrearUsuario = CrearUsuario;
    this.ListarUsuarios = ListarUsuarios;
    this.ListarPorId = ListarPorId;
    this.EliminarUsuario = EliminarUsuario;
    this.ActualizarUsuario = ActualizarUsuario;
    this.LoginUsuario = LoginUsuario; 
  }

  login = async (req, res) => {
    try {
      const { correo, contraseña } = req.body;
      if (!correo || !contraseña) {
        return res.status(400).json({ error: "El correo y la contraseña son obligatorios" });
      }
      const sesion = await this.LoginUsuario.run(correo, contraseña);
      res.status(200).json(sesion);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  };

  crear = async (req, res) => {
    try {
      const usuario = await this.CrearUsuario.ejecutar(req.body);
      res.status(201).json(usuario);
    } catch (error) {
      res.status(400).json({ error: error.message }); // Atrapa errores de duplicados o caracteres
    }
  };

  listar = async (req, res) => {
    try {
      const usuarios = await this.ListarUsuarios.ejecutar();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  obtenerPorId = async (req, res) => {
    try {
      const usuario = await this.ListarPorId.ejecutar(req.params.id);
      if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

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
      res.status(400).json({ error: error.message });
    }
  };
}

module.exports = UsuarioController;