const Departamentos = require("../Dominio/Entidades/Departamentos");
const DepartamentosModel = require("./DepartamentosModel");

class DepartamentosRepositorySequelize {
  // Operación: CREAR DEPARTAMENTO
  async save(departamento) {
    const doc = await DepartamentosModel.create({
      nombre_departamento: departamento.nombre_departamento
    });

    // Retornamos la Entidad de Dominio
    return new Departamentos({
      id_departamento: doc.id_departamento,
      nombre_departamento: doc.nombre_departamento
    });
  }

  // Operación: OBTENER POR ID
  async findById(id) {
    const doc = await DepartamentosModel.findByPk(id);
    if (!doc) return null;

    return new Departamentos({
      id_departamento: doc.id_departamento,
      nombre_departamento: doc.nombre_departamento
    });
  }

  // Operación: LISTAR TODOS LOS DEPARTAMENTOS
  async findAll() {
    const docs = await DepartamentosModel.findAll();
    return docs.map((doc) => new Departamentos({
      id_departamento: doc.id_departamento,
      nombre_departamento: doc.nombre_departamento
    }));
  }

  // Operación: ELIMINAR
  async delete(id) {
    return await DepartamentosModel.destroy({
      where: { id_departamento: id }
    });
  }

  // Operación: ACTUALIZAR
  async update(id, departamento) {
    const [affectedCount] = await DepartamentosModel.update(
      { nombre_departamento: departamento.nombre_departamento },
      { where: { id_departamento: id } }
    );
    
    if (affectedCount === 0) return null;
    return this.findById(id);
  }
}

module.exports = DepartamentosRepositorySequelize;