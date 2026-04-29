const Usuario = require("../Dominio/Entidades/Usuario");
const UsuarioModel = require("./UsuarioModel"); // Ajusta la ruta según tu estructura

class UsuarioRepositorySequelize {
  // Actividad 2: Implementar operación CREAR
  async save(usuario) {
    const doc = await UsuarioModel.create({
      nombre: usuario.nombre,
      correo: usuario.correo,
      contraseña: usuario.contraseña,
      rol: usuario.rol
    });

    // Retornamos la Entidad de Dominio
    return new Usuario({
      id_Usuario: doc.id_Usuario,
      nombre: doc.nombre,
      correo: doc.correo,
      contraseña: doc.contraseña,
      rol: doc.rol
    });
  }

  // Actividad 2: Implementar operación OBTENER POR ID
  async findById(id) {
    const doc = await UsuarioModel.findByPk(id); // findByPk es el findById de Sequelize
    if (!doc) return null;

    return new Usuario({
      id_Usuario: doc.id_Usuario,
      nombre: doc.nombre,
      correo: doc.correo,
      contraseña: doc.contraseña,
      rol: doc.rol
    });
  }

  // Actividad 2: Implementar operación LISTAR TODOS
  async findAll() {
    const docs = await UsuarioModel.findAll();
    return docs.map((doc) => new Usuario({
      id_Usuario: doc.id_Usuario,
      nombre: doc.nombre,
      correo: doc.correo,
      contraseña: doc.contraseña,
      rol: doc.rol
    }));
  }

  // Bonus: Implementar operación ELIMINAR (para completar el CRUD)
  async delete(id) {
    return await UsuarioModel.destroy({
      where: { id_Usuario: id }
    });
  }
}

module.exports = UsuarioRepositorySequelize;