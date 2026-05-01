const Categoria = require("../Dominio/Entidades/Categoria");

class CrearCategoria {
  constructor(ICategoriaRepositorio) {
    this.ICategoriaRepositorio = ICategoriaRepositorio;
  }

  async ejecutar(data) {
    const categoriaEntidad = new Categoria(data); // Valida nombre obligatorio
    return await this.ICategoriaRepositorio.save(categoriaEntidad);
  }
}

module.exports = CrearCategoria;