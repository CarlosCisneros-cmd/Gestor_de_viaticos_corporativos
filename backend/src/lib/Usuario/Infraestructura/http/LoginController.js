const LoginUsuario = require("../../Aplicacion/LoginUsuario");

class LoginController {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
    this.loginUsuario = new LoginUsuario(usuarioRepository);
  }

  // 👇 CORREGIDO A ARROW FUNCTION PARA NO PERDER EL CONTEXTO EN LAS RUTAS DE EXPRESS
  login = async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
      if (!correo || !contraseña) {
        return res.status(400).json({ error: "Correo y contraseña son requeridos" });
      }

      // Ejecutamos la lógica de negocio
      const sesionUsuario = await this.loginUsuario.run(correo, contraseña);

      // Enviamos la respuesta con código 200 OK
      return res.status(200).json(sesionUsuario);
    } catch (error) {
      // Si las credenciales fallan, respondemos con 401 Unauthorized
      return res.status(401).json({ error: error.message });
    }
  };
}

module.exports = LoginController;