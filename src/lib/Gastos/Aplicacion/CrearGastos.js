// Importamos la entidad para realizar las validaciones de dominio
const Gastos = require("../Dominio/Entidades/Gastos");

class CrearGastos {
  constructor(IGastosRepositorio) {
    // Inyectamos el puerto (la interfaz)
    this.IGastosRepositorio = IGastosRepositorio;
  }

  async ejecutar(data) {
    // 1. Instanciamos la entidad de dominio.
    // Esto disparará automáticamente los errores si falta el monto, 
    // la descripción, el id_viatico o el id_categoria.
    const gastoEntidad = new Gastos(data); 

    // 2. Aquí podrías añadir validaciones de aplicación adicionales si fuera necesario,
    // como verificar si el usuario tiene permisos para este viático.

    // 3. Enviamos la entidad validada al repositorio de infraestructura (Sequelize)
    return await this.IGastosRepositorio.save(gastoEntidad);
  }
}

module.exports = CrearGastos;