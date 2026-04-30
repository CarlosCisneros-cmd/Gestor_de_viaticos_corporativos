const Departamentos = require("../Dominio/Entidades/Departamentos");

class CrearDepartamento {
  constructor(IDepartamentosRepositorio) {
    // Inyectamos el repositorio (el puerto)
    this.IDepartamentosRepositorio = IDepartamentosRepositorio;
  }

  async ejecutar(data) {
    // 1. Validamos mediante la entidad de dominio
    const departamentoEntidad = new Departamentos(data); 

    // 2. Guardamos a través del repositorio
    return await this.IDepartamentosRepositorio.save(departamentoEntidad);
  }
}

module.exports = CrearDepartamento;