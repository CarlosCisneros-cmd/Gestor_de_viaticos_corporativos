const Evidencias = require("../Dominio/Entidades/Evidencias");

class CrearEvidencias {
  constructor(IEvidenciasRepositorio) {
    this.IEvidenciasRepositorio = IEvidenciasRepositorio;
  }

  async ejecutar(data) {
    const evidencias = new Evidencias(data);
    return await this.IEvidenciasRepositorio.save(evidencias);
  }
}

module.exports = CrearEvidencias;