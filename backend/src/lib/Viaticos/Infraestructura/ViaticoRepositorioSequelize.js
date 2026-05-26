const Viatico = require("../Dominio/Entidades/Viatico");
const ViaticoModel = require("./ViaticoModel");
// Importamos el modelo de Usuario para habilitar la relación
const UsuarioModel = require("../../Usuario/Infraestructura/UsuarioModel");
const DepartamentosModel = require("../../Departamentos/Infraestructura/DepartamentosModel"); // Ajusta según tu carpeta

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

  // Operación: ESTADÍSTICAS - Gasto Mensual por Año
  async obtenerGastoMensualPorAnio(anio) {
    const { Op } = require("sequelize");

    // 1. Buscamos todos los viáticos aprobados en el año solicitado
    const viaticos = await ViaticoModel.findAll({
      where: {
        estado_Viatico: "Aprobado",
        fecha_inicio: {
          [Op.gte]: new Date(`${anio}-01-01T00:00:00.000Z`), // Desde el 1 de Enero
          [Op.lte]: new Date(`${anio}-12-31T23:59:59.999Z`), // Hasta el 31 de Diciembre
        },
      },
      attributes: ["fecha_inicio", "presupuesto_asignado"], // Solo traemos lo que necesitamos
    });

    // 2. Preparamos el array de los 12 meses en 0
    const meses = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    const resultado = meses.map((mes) => ({ mes, total: 0 }));

    // 3. Sumamos los presupuestos en su mes correspondiente
    viaticos.forEach((v) => {
      const fecha = new Date(v.fecha_inicio);
      const mesIndex = fecha.getUTCMonth(); // Obtiene el mes (0 para Enero, 11 para Diciembre)

      // Sumamos asegurándonos de que sea un número
      resultado[mesIndex].total += parseFloat(v.presupuesto_asignado) || 0;
    });

    return resultado;
  }

  /// ESTADISTICAS
  async obtenerGastoPorDepartamento(anio) {
    const { Op } = require("sequelize");
    // Consulta optimizada usando joins específicos
    const viaticos = await ViaticoModel.findAll({
      where: {
        estado_Viatico: "Aprobado",
        fecha_inicio: {
          [Op.between]: [`${anio}-01-01`, `${anio}-12-31`],
        },
      },
      // Le decimos exactamente qué modelos cruzar
      include: [
        {
          model: UsuarioModel,
          attributes: ["id_Usuario", "nombre"],
          include: [
            {
              model: DepartamentosModel,
              attributes: ["nombre_departamento"],
            },
          ],
        },
      ],
    });

    // Agrupación matemática en JavaScript
    const acumulador = {};

    viaticos.forEach((viatico) => {
      const nombreDepartamento =
        viatico.Usuario?.Departamento?.nombre_departamento ||
        "Sin Departamento";

      // El parseo es vital porque DECIMALS vienen como strings desde la librería 'pg'
      const presupuesto = parseFloat(viatico.presupuesto_asignado) || 0;

      if (!acumulador[nombreDepartamento]) {
        acumulador[nombreDepartamento] = 0;
      }
      acumulador[nombreDepartamento] += presupuesto;
    });

    // 3. Formateo para MUI X-Charts
    return Object.keys(acumulador).map((nombre) => ({
      departamento: nombre,
      total: acumulador[nombre],
    }));
  }
}

module.exports = ViaticoRepositorySequelize;
