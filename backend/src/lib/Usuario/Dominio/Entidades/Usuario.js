class Usuario {
  constructor({ id_Usuario, nombre, correo, contraseña, rol, id_departamento }) {
    if (!nombre) throw new Error("nombre requerido");
    if (!correo) throw new Error("correo requerido");
    if (!contraseña) throw new Error("contraseña requerido");
    if (!rol) throw new Error("rol requerido");

    this.id_Usuario = id_Usuario;
    this.nombre = nombre.trim();
    this.correo = correo;
    this.contraseña = contraseña;
    this.rol = rol;
    // Nuevo atributo para la relación
    this.id_departamento = id_departamento; 
  }
}

module.exports = Usuario;