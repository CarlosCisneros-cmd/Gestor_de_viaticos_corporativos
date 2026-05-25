const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../Infraestructura/database/Postgres");
// Asegúrate que esta ruta sea correcta para tu estructura de carpetas
const UsuarioModel = require("../../Usuario/Infraestructura/UsuarioModel"); 

const DepartamentosModel = sequelize.define("Departamentos", {
  id_departamento: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre_departamento: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } }
}, {
  tableName: "departamentos",
  timestamps: true,
});

// DEFINICIÓN DE LA RELACIÓN
DepartamentosModel.hasMany(UsuarioModel, {
  foreignKey: "id_departamento",
  sourceKey: "id_departamento"
});

UsuarioModel.belongsTo(DepartamentosModel, {
  foreignKey: "id_departamento",
  targetKey: "id_departamento"
});

module.exports = DepartamentosModel;