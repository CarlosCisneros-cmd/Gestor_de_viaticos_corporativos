const Viatico = require("../Dominio/Entidades/Viatico");
const ViaticoModel = require("./ViaticoModel");
// Importamos el modelo de Usuario para habilitar la relación
const UsuarioModel = require("../../Usuario/Infraestructura/UsuarioModel");

class ViaticoRepositorySequelize {
  // Operación: CREAR VIÁTICO
  async save(viatico) {
    const doc = await ViaticoModel.create({
      descripcion_Viatico: viatico.descripcion_Viatico,
      fecha_inicio: viatico.fecha_inicio,
      fecha_fin: viatico.fecha_fin,
      presupuesto_asignado: viatico.presupuesto_asignado,
      estado_Viatico: viatico.estado_Viatico,
      fecha_solicitud: viatico.fecha_solicitud,
      id_usuario: viatico.id_usuario, // Relación FK
    });

    return new Viatico(doc.toJSON());
  }

  // Operación: OBTENER POR ID (Con relación al Usuario)
  async findById(id) {
    const doc = await ViaticoModel.findByPk(id, {
      include: [
        {
          model: UsuarioModel,
          attributes: ["nombre", "correo"], // Solo traemos lo necesario del usuario
        },
      ],
    });

    if (!doc) return null;

    const v = new Viatico({
      id_Viatico: doc.id_Viatico,
      descripcion_Viatico: doc.descripcion_Viatico,
      fecha_inicio: doc.fecha_inicio,
      fecha_fin: doc.fecha_fin,
      presupuesto_asignado: doc.presupuesto_asignado,
      estado_Viatico: doc.estado_Viatico,
      fecha_solicitud: doc.fecha_solicitud,
      id_usuario: doc.id_usuario,
    });

    // Inyectamos el nombre del usuario si existe la relación (JOIN)
    if (doc.Usuario) {
      v.nombre_solicitante = doc.Usuario.nombre;
    }

    return v;
  }

  // Operación: LISTAR TODOS (Ideal para la tabla del administrador)
  async findAll() {
    const docs = await ViaticoModel.findAll({
      include: [
        {
          model: UsuarioModel,
          attributes: ["nombre"],
        },
      ],
    });

    return docs.map((doc) => {
      const v = new Viatico({
        id_Viatico: doc.id_Viatico,
        descripcion_Viatico: doc.descripcion_Viatico,
        fecha_inicio: doc.fecha_inicio,
        fecha_fin: doc.fecha_fin,
        presupuesto_asignado: doc.presupuesto_asignado,
        estado_Viatico: doc.estado_Viatico,
        fecha_solicitud: doc.fecha_solicitud,
        id_usuario: doc.id_usuario,
      });

      if (doc.Usuario) {
        v.nombre_solicitante = doc.Usuario.nombre;
      }
      return v;
    });
  }

  // Operación: ACTUALIZAR
  async update(id, viaticoData) {
    const [affectedCount] = await ViaticoModel.update(
      {
        descripcion_Viatico: viaticoData.descripcion_Viatico,
        fecha_inicio: viaticoData.fecha_inicio,
        fecha_fin: viaticoData.fecha_fin,
        presupuesto_asignado: viaticoData.presupuesto_asignado,
        estado_Viatico: viaticoData.estado_Viatico,
        id_usuario: viaticoData.id_usuario,
      },
      {
        where: { id_Viatico: id },
      },
    );

    if (affectedCount === 0) return null;
    return this.findById(id);
  }

  // Operación: ELIMINAR
  async delete(id) {
    return await ViaticoModel.destroy({
      where: { id_Viatico: id },
    });
  }

  async listarPorUsuario(idUsuario) {
    return await ViaticoModel.findAll({
      where: { id_usuario: idUsuario },
    });
  }
}

module.exports = ViaticoRepositorySequelize;
