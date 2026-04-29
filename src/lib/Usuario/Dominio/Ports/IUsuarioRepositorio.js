// Esta es una "interface" conceptual que define qué métodos debe tener 
// cualquier base de datos que elijas (Postgres o Mongo)
class IUsuarioRepositorio {
  async save(usuario) { throw new Error("Método no implementado"); }
  async findAll() { throw new Error("Método no implementado"); }
  async findById(id) { throw new Error("Método no implementado"); }
  async update(id, usuario) { throw new Error("Método no implementado"); }
  async delete(id) { throw new Error("Método no implementado"); }
}

module.exports = IUsuarioRepositorio;