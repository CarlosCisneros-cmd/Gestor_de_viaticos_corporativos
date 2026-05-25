class ListarUsuarios {
  constructor(IUsuarioRepositorio) {
    // Inyectamos la interfaz del repositorio (que en infraestructura será Sequelize)
    this.IUsuarioRepositorio = IUsuarioRepositorio;
  }

  async ejecutar() {
    // Llama al repositorio, el cual ya hace el 'Include' interno 
    // y mapea el campo 'nombre_departamento' a la entidad
    const usuarios = await this.IUsuarioRepositorio.findAll();
    
    return usuarios;
  }
}

module.exports = ListarUsuarios;