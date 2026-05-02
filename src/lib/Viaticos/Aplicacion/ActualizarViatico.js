class ActualizarViaticos {
  constructor(IViaticosRepositorio) {
    this.IViaticosRepositorio = IViaticosRepositorio;
  }

  async ejecutar(id, datosNuevos) {
    // 1. Llamamos al método update del repositorio
    const viaticoActualizado = await this.IViaticosRepositorio.update(id, datosNuevos);

    // 2. Si el repositorio devuelve null, lanzamos un error 404 con statusCode
    if (!viaticoActualizado) {
      const error = new Error("No se pudo actualizar: Viatico no encontrado");
      error.statusCode = 404; // Coherencia con la lógica de tu compañero
      throw error;
    }

    return viaticoActualizado;
  }
}

module.exports = ActualizarViaticos;