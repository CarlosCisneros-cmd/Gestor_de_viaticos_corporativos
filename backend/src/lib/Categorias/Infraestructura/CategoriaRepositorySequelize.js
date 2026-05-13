const ICategoriaRepositorio = require("../Dominio/Ports/ICategoriaRepositorio");
const CategoriaModel = require("./CategoriaModel");

class CategoriaRepositorySequelize extends ICategoriaRepositorio {
  async save(categoria) {
    return await CategoriaModel.create(categoria);
  }

  async findAll() {
    return await CategoriaModel.findAll();
  }

  async findById(id) {
    return await CategoriaModel.findByPk(id);
  }

  async update(id, data) {
    const [rowsUpdated] = await CategoriaModel.update(data, {
      where: { id_categoria: id }
    });
    if (rowsUpdated === 0) return null;
    return await this.findById(id);
  }

  async delete(id) {
    return await CategoriaModel.destroy({
      where: { id_categoria: id }
    });
  }
}

module.exports = CategoriaRepositorySequelize;