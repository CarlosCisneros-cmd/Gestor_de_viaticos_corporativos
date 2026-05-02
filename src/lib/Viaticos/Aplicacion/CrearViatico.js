// La entidad de dominio es la misma para ambos proyectos
const Viatico = require("../Dominio/Entidades/Viatico");

class CrearViatico {
  constructor(IViaticosRepositorio) {
    // Aquí inyectamos la implementación (Sequelize o Mongoose)
    this.IViaticosRepositorio = IViaticosRepositorio;
  }

  async ejecutar(data) {
    // 1. Instanciamos la entidad de dominio para validar los datos
    const viaticoEntidad = new Viatico(data); 

    // 2. Enviamos la entidad validada al repositorio
    return await this.IViaticosRepositorio.save(viaticoEntidad);
  }
}

module.exports = CrearViatico;

