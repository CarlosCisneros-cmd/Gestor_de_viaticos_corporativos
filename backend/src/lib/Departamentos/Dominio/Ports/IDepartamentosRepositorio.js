// Esta es la interface conceptual para Departamentos
// Mantiene la misma estructura que IUsuarioRepositorio
class IDepartamentosRepositorio {
  async save(departamento) { throw new Error("Método no implementado"); }
  async findAll() { throw new Error("Método no implementado"); }
  async findById(id) { throw new Error("Método no implementado"); }
  async update(id, departamento) { throw new Error("Método no implementado"); }
  async delete(id) { throw new Error("Método no implementado"); }
}

module.exports = IDepartamentosRepositorio;