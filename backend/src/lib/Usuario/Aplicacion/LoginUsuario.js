class LoginUsuario {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async run(correo, contraseña) {
    // 1. Buscar al usuario por su correo electrónico usando el repositorio
    const usuario = await this.usuarioRepository.findByEmail(correo);
    
    if (!usuario) {
      throw new Error("Credenciales incorrectas");
    }

    // 2. Verificar la contraseña en texto plano
    if (usuario.contraseña !== contraseña) {
      throw new Error("Credenciales incorrectas");
    }

    // 3. Retornar los datos que necesita el Frontend (quitando la contraseña por seguridad)
    return {
      id_Usuario: usuario.id_Usuario,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      id_departamento: usuario.id_departamento
    };
  }
}

module.exports = LoginUsuario;