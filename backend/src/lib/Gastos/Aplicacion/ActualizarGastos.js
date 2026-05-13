class ActualizarGastos {
  constructor(IGastosRepositorio) {
    this.IGastosRepositorio = IGastosRepositorio;
  }

  async ejecutar(id, datosNuevos) {
    // Siguiendo el estilo de tu compañero:
    // 1. Llamamos al método update del repositorio
    const gastoActualizado = await this.IGastosRepositorio.update(id, datosNuevos);

    // 2. Si el repositorio devuelve null, lanzamos un error 404 con statusCode
    if (!gastoActualizado) {
      const error = new Error("No se pudo actualizar: Gasto no encontrado");
      error.statusCode = 404; // Coherencia con la lógica de tu compañero
      throw error;
    }

    return gastoActualizado;
  }
}

module.exports = ActualizarGastos;