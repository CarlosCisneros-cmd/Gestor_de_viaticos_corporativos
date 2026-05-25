class Usuario {
  constructor({ id_Usuario, nombre, correo, contraseña, rol, cedula, telefono, id_departamento }) {
    if (!nombre) throw new Error("nombre requerido");
    if (!correo) throw new Error("correo requerido");
    if (!contraseña) throw new Error("contraseña requerido");
    if (!rol) throw new Error("rol requerido");
    if (!cedula) throw new Error("cedula requerida");
    if (!telefono) throw new Error("telefono requerido");

    // Validaciones de negocio para longitudes (12 a 15 caracteres)
    if (cedula.trim().length < 12 || cedula.trim().length > 15) {
      throw new Error("La cédula debe contener entre 12 y 15 caracteres");
    }
    if (telefono.trim().length < 12 || telefono.trim().length > 15) {
      throw new Error("El teléfono debe contener entre 12 y 15 caracteres");
    }

    this.id_Usuario = id_Usuario;
    this.nombre = nombre.trim();
    this.correo = correo.trim();
    this.contraseña = contraseña;
    this.rol = rol;
    this.cedula = cedula.trim();
    this.telefono = telefono.trim();
    this.id_departamento = id_departamento; 
  }
}

module.exports = Usuario;