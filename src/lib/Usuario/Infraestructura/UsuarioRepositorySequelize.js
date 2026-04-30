const Usuario = require("../Dominio/Entidades/Usuario");
const UsuarioModel = require("./UsuarioModel");
// Importamos el modelo de Departamentos para habilitar los JOINs
const DepartamentosModel = require("../../Departamentos/Infraestructura/DepartamentosModel");

class UsuarioRepositorySequelize {
  // Operación: CREAR USUARIO (Con relación)
  async save(usuario) {
    const doc = await UsuarioModel.create({
      nombre: usuario.nombre,
      correo: usuario.correo,
      contraseña: usuario.contraseña,
      rol: usuario.rol,
      id_departamento: usuario.id_departamento // Se guarda la FK
    });

    return new Usuario({
      id_Usuario: doc.id_Usuario,
      nombre: doc.nombre,
      correo: doc.correo,
      contraseña: doc.contraseña,
      rol: doc.rol,
      id_departamento: doc.id_departamento
    });
  }

  // Operación: OBTENER POR ID (Incluyendo datos del departamento)
  async findById(id) {
    const doc = await UsuarioModel.findByPk(id, {
      include: [{ model: DepartamentosModel }] // Trae el objeto Departamento asociado
    });

    if (!doc) return null;

    const u = new Usuario({
      id_Usuario: doc.id_Usuario,
      nombre: doc.nombre,
      correo: doc.correo,
      contraseña: doc.contraseña,
      rol: doc.rol,
      id_departamento: doc.id_departamento
    });

    // Si existe el departamento, lo inyectamos como propiedad extra
    if (doc.Departamento) {
      u.nombre_departamento = doc.Departamento.nombre_departamento;
    }

    return u;
  }

  // Operación: LISTAR TODOS (Optimizado para reportes)
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