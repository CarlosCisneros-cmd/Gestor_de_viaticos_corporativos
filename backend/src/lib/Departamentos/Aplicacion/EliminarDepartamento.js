class EliminarDepartamento {
  constructor(IDepartamentosRepositorio) {
    this.IDepartamentosRepositorio = IDepartamentosRepositorio;
  }

  async ejecutar(id) {
    const eliminado = await this.IDepartamentosRepositorio.delete(id);
    if (!eliminado) {
      const error = new Error("No se pudo eliminar: Departamento no encontrado");
      error.statusCode = 404;
      throw error;
    }
    return eliminado;
  }
}

module.exports = EliminarDepartamento;