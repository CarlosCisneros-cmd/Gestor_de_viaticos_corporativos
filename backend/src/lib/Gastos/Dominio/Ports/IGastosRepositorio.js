// Esta interfaz define las operaciones permitidas para el módulo de Gastos.
// Cualquier adaptador de infraestructura (ej. Sequelize) debe implementar estos métodos.

class IGastosRepositorio {
  // Guarda un nuevo gasto o actualiza uno existente
  async save(gasto) { 
    throw new Error("Método 'save' no implementado"); 
  }

  // Obtiene todos los gastos registrados (Uso administrativo)
  async findAll() { 
    throw new Error("Método 'findAll' no implementado"); 
  }

  // Obtiene un gasto específico por su ID único
  async findById(id_gasto) { 
    throw new Error("Método 'findById' no implementado"); 
  }

  // Obtiene todos los gastos vinculados a un Viático (Cabecera)
  // Este método es clave para la relación Viáticos ↔ Gastos
  async findByViatico(id_viatico) { 
    throw new Error("Método 'findByViatico' no implementado"); 
  }

  // Actualiza los datos de un gasto existente
  async update(id_gasto, gasto) { 
    throw new Error("Método 'update' no implementado"); 
  }

  // Elimina un registro de gasto
  async delete(id_gasto) { 
    throw new Error("Método 'delete' no implementado"); 
  }
}

module.exports = IGastosRepositorio;