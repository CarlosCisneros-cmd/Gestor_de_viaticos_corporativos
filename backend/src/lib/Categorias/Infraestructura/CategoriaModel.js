const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../Infraestructura/database/Postgres");

const CategoriaModel = sequelize.define(
  "Categoria",
  {
    id_categoria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_categoria: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion_categoria: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "categorias",
    timestamps: false, // O true, según prefieras
  }
);

module.exports = CategoriaModel;