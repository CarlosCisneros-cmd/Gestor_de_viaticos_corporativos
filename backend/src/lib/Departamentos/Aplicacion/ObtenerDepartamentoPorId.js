class ObtenerDepartamentoPorId {
  constructor(IDepartamentosRepositorio) {
    this.IDepartamentosRepositorio = IDepartamentosRepositorio;
  }

  async ejecutar(id) {
    const departamento = await this.IDepartamentosRepositorio.findById(id);
    if (!departamento) {
      const error = new Error("Departamento no encontrado");
      error.statusCode = 404;
      throw error;
    }
    return departamento;
  }
}

module.exports = ObtenerDepartamentoPorId;