class ListarGastos {
  constructor(IGastosRepositorio) {
    // Inyectamos el repositorio (Sequelize) a través del puerto
    this.IGastosRepositorio = IGastosRepositorio;
  }

  async ejecutar() {
    // Llama al método findAll del repositorio que ya configuramos con los JOINs de categorías
    return await this.IGastosRepositorio.findAll();
  }
}

module.exports = ListarGastos;