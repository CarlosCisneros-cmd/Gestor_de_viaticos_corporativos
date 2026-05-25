// Esta es una "interface" conceptual que define qué métodos debe tener 
// cualquier base de datos que elijas (Postgres o Mongo)
class IUsuarioRepositorio {
  async save(usuario) { throw new Error("Método no implementado"); }
  async findAll() { throw new Error("Método no implementado"); }
  async findById(id) { throw new Error("Método no implementado"); }
  async update(id, usuario) { throw new Error("Método no implementado"); }
  async delete(id) { throw new Error("Método no implementado"); }
  
  // 👇 NUEVOS MÉTODOS REQUERIDOS POR EL CONTRATO DE DOMINIO
  async findByEmail(correo) { throw new Error("Método no implementado"); }
  async findByCedula(cedula) { throw new Error("Método no implementado"); }
}

module.exports = IUsuarioRepositorio;