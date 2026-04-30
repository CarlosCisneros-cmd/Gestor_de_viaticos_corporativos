const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../Infraestructura/database/Postgres");
const UsuarioModel = require("../../Usuario/Infraestructura/UsuarioModel");

const DepartamentosModel = sequelize.define("Departamentos", {
  id_departamento: { // Usando tu nombre exacto
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_departamento: { // Usando tu nombre exacto
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  }
}, {
  tableName: "departamentos",
  timestamps: true,
});

// DEFINICIÓN DE LA RELACIÓN
DepartamentosModel.hasMany(UsuarioModel, {
  foreignKey: "id_departamento", // Llave que se creará en 'usuarios'
  sourceKey: "id_departamento"
});

UsuarioModel.belongsTo(DepartamentosModel, {
  foreignKey: "id_departamento",
  targetKey: "id_departamento"
});

module.exports = DepartamentosModel;