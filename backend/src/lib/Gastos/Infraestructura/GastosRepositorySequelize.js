const Gastos = require("../Dominio/Entidades/Gastos");
const GastosModel = require("./GastosModel");
const CategoriaModel = require("../../Categorias/Infraestructura/CategoriaModel");

class GastosRepositorySequelize {
  // Operación: CREAR GASTO
  async save(gasto) {
    const doc = await GastosModel.create({
      id_viatico: gasto.id_viatico,
      id_categoria: gasto.id_categoria,
      monto: gasto.monto,
      fecha_gasto: gasto.fecha_gasto,
      descripcion: gasto.descripcion,
      observaciones: gasto.observaciones, // ✨ Modificado
      estado_gasto: gasto.estado_gasto,
    });

    return new Gastos({
      id_gasto: doc.id_gasto,
      id_viatico: doc.id_viatico,
      id_categoria: doc.id_categoria,
      monto: doc.monto,
      fecha_gasto: doc.fecha_gasto,
      descripcion: doc.descripcion,
      observaciones: doc.observaciones, // ✨ Modificado
      estado_gasto: doc.estado_gasto,
    });
  }

  // Operación: OBTENER POR ID (Con su categoría)
  async findById(id) {
    const doc = await GastosModel.findByPk(id, {
      include: [{ model: CategoriaModel, as: "categoria" }],
    });

    if (!doc) return null;

    const g = new Gastos({
      id_gasto: doc.id_gasto,
      id_viatico: doc.id_viatico,
      id_categoria: doc.id_categoria,
      monto: doc.monto,
      fecha_gasto: doc.fecha_gasto,
      descripcion: doc.descripcion,
      observaciones: doc.observaciones, // ✨ Modificado
      estado_gasto: doc.estado_gasto,
    });

    if (doc.categoria) {
      g.nombre_categoria = doc.categoria.nombre_categoria;
    }

    return g;
  }

  // Operación: LISTAR TODOS
  async findAll() {
    const docs = await GastosModel.findAll({
      include: [{ model: CategoriaModel, as: "categoria" }],
    });

    return docs.map((doc) => {
      const g = new Gastos({
        id_gasto: doc.id_gasto,
        id_viatico: doc.id_viatico,
        id_categoria: doc.id_categoria,
        monto: doc.monto,
        fecha_gasto: doc.fecha_gasto,
        descripcion: doc.descripcion,
        observaciones: doc.observaciones, // ✨ Modificado
        estado_gasto: doc.estado_gasto,
      });

      if (doc.categoria) {
        g.nombre_categoria = doc.categoria.nombre_categoria;
      }
      return g;
    });
  }

  // Operación: BUSCAR POR VIÁTICO (Para el reporte de la cabecera)
  async findByViatico(id_viatico) {
    const docs = await GastosModel.findAll({
      where: { id_viatico },
      include: [{ model: CategoriaModel, as: "categoria" }],
    });

    return docs.map((doc) => {
      const g = new Gastos({
        id_gasto: doc.id_gasto,
        id_viatico: doc.id_viatico,
        id_categoria: doc.id_categoria,
        monto: doc.monto,
        fecha_gasto: doc.fecha_gasto,
        descripcion: doc.descripcion,
        observaciones: doc.observaciones, 
        estado_gasto: doc.estado_gasto,
      });

      if (doc.categoria) {
        g.nombre_categoria = doc.categoria.nombre_categoria;
      }
      return g;
    });
  }

  // Operación: ACTUALIZAR
  async update(id, gastoData) {
    const [affectedCount] = await GastosModel.update(
      {
        id_categoria: gastoData.id_categoria,
        monto: gastoData.monto,
        fecha_gasto: gastoData.fecha_gasto,
        descripcion: gastoData.descripcion,
        observaciones: gastoData.observaciones, 
        estado_gasto: gastoData.estado_gasto,
      },
      {
        where: { id_gasto: id },
      },
    );

    if (affectedCount === 0) return null;
    return this.findById(id);
  }

  // Operación: ELIMINAR
  async delete(id) {
    return await GastosModel.destroy({
      where: { id_gasto: id },
    });
  }
}

module.exports = GastosRepositorySequelize;
