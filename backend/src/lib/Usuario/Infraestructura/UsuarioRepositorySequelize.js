const Usuario = require("../Dominio/Entidades/Usuario");
const UsuarioModel = require("./UsuarioModel");
const DepartamentosModel = require("../../Departamentos/Infraestructura/DepartamentosModel");

class UsuarioRepositorySequelize {
  
  // Buscar por cédula para validación de duplicados
  async findByCedula(cedula) {
    const doc = await UsuarioModel.findOne({ where: { cedula } });
    if (!doc) return null;
    return new Usuario({
      id_Usuario: doc.id_Usuario,
      nombre: doc.nombre,
      correo: doc.correo,
      contraseña: doc.contraseña,
      rol: doc.rol,
      cedula: doc.cedula,
      telefono: doc.telefono,
      id_departamento: doc.id_departamento
    });
  }

  // Buscar por correo para validación de duplicados y login
  async findByEmail(correo) {
    const doc = await UsuarioModel.findOne({ where: { correo } });
    if (!doc) return null;

    return new Usuario({
      id_Usuario: doc.id_Usuario,
      nombre: doc.nombre,
      correo: doc.correo,
      contraseña: doc.contraseña,
      rol: doc.rol,
      cedula: doc.cedula,
      telefono: doc.telefono,
      id_departamento: doc.id_departamento
    });
  }

  // Operación: CREAR USUARIO
  async save(usuario) {
    const doc = await UsuarioModel.create({
      nombre: usuario.nombre,
      correo: usuario.correo,
      contraseña: usuario.contraseña,
      rol: usuario.rol,
      cedula: usuario.cedula,
      telefono: usuario.telefono,
      id_departamento: usuario.id_departamento
    });

    return new Usuario({
      id_Usuario: doc.id_Usuario,
      nombre: doc.nombre,
      correo: doc.correo,
      contraseña: doc.contraseña,
      rol: doc.rol,
      cedula: doc.cedula,
      telefono: doc.telefono,
      id_departamento: doc.id_departamento
    });
  }

  // Operación: OBTENER POR ID
  async findById(id) {
    const doc = await UsuarioModel.findByPk(id, {
      include: [{ model: DepartamentosModel }]
    });

    if (!doc) return null;

    const u = new Usuario({
      id_Usuario: doc.id_Usuario,
      nombre: doc.nombre,
      correo: doc.correo,
      contraseña: doc.contraseña,
      rol: doc.rol,
      cedula: doc.cedula,
      telefono: doc.telefono,
      id_departamento: doc.id_departamento
    });

    if (doc.Departamento) {
      u.nombre_departamento = doc.Departamento.nombre_departamento;
    }

    return u;
  }

  // Operación: LISTAR TODOS
  async findAll() {
    const docs = await UsuarioModel.findAll({
      include: [{ model: DepartamentosModel }]
    });

    return docs.map((doc) => {
      const u = new Usuario({
        id_Usuario: doc.id_Usuario,
        nombre: doc.nombre,
        correo: doc.correo,
        contraseña: doc.contraseña,
        rol: doc.rol,
        cedula: doc.cedula,
        telefono: doc.telefono,
        id_departamento: doc.id_departamento
      });

      if (doc.Departamento) {
        u.nombre_departamento = doc.Departamento.nombre_departamento;
      }
      return u;
    });
  }

  // Operación: ACTUALIZAR
  async update(id, usuarioData) {
    const [affectedCount] = await UsuarioModel.update({
      nombre: usuarioData.nombre,
      correo: usuarioData.correo,
      rol: usuarioData.rol,
      cedula: usuarioData.cedula,
      telefono: usuarioData.telefono,
      id_departamento: usuarioData.id_departamento
    }, {
      where: { id_Usuario: id }
    });

    if (affectedCount === 0) return null;
    return this.findById(id);
  }

  // Operación: ELIMINAR
  async delete(id) {
    return await UsuarioModel.destroy({
      where: { id_Usuario: id }
    });
  }
}

module.exports = UsuarioRepositorySequelize;