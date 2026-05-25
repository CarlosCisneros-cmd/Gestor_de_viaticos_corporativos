class ActualizarDepartamento {
  constructor(IDepartamentosRepositorio) {
    this.IDepartamentosRepositorio = IDepartamentosRepositorio;
  }

  async ejecutar(id, datosNuevos) {
    const departamentoActualizado = await this.IDepartamentosRepositorio.update(id, datosNuevos);
    if (!departamentoActualizado) {
      const error = new Error("No se pudo actualizar: Departamento no encontrado");
      error.statusCode = 404;
      throw error;
    }
    return departamentoActualizado;
  }
}

module.exports = ActualizarDepartamento;