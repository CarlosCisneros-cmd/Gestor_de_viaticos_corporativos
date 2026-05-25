class Usuario {
  constructor(data) {
    if (!data.nombre) throw new Error("nombre requerido");
    if (!data.correo) throw new Error("correo requerido");
    if (!data.contraseña) throw new Error("contraseña requerido");
    if (!data.rol) throw new Error("rol requerido");
    if (!data.cedula) throw new Error("cedula requerida");
    if (!data.telefono) throw new Error("telefono requerido");

    const cedulaStr = String(data.cedula).trim();
    const telefonoStr = String(data.telefono).trim();

    // Validaciones de negocio para longitudes exactas de Ecuador
    if (cedulaStr.length < 10 || cedulaStr.length > 12) {
      throw new Error("La cédula debe contener entre 10 y 12 caracteres");
    }
    if (telefonoStr.length < 10 || telefonoStr.length > 12) {
      throw new Error("El teléfono debe contener entre 10 y 12 caracteres");
    }

    this.id_Usuario = data.id_Usuario;
    this.nombre = String(data.nombre).trim();
    this.correo = String(data.correo).trim();
    this.contraseña = data.contraseña; 
    this.rol = data.rol;
    this.cedula = cedulaStr;
    this.telefono = telefonoStr;
    this.id_departamento = data.id_departamento;
  }
}

module.exports = Usuario;