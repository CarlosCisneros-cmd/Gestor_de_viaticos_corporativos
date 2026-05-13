class Departamentos {
  constructor({ id_departamento, nombre_departamento }) {
    if (!nombre_departamento) {
      throw new Error("El nombre del departamento es requerido");
    }

    this.id_departamento = id_departamento;
    this.nombre_departamento = nombre_departamento.trim();
  }
}

module.exports = Departamentos;