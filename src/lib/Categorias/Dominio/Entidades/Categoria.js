class Categoria {
  constructor({ id_categoria, nombre_categoria, descripcion_categoria }) {
    // Validaciones de dominio
    if (!nombre_categoria) {
      throw new Error("El nombre de la categoría es obligatorio.");
    }

    this.id_categoria = id_categoria;
    this.nombre_categoria = nombre_categoria;
    this.descripcion_categoria = descripcion_categoria;
  }
}

module.exports = Categoria;