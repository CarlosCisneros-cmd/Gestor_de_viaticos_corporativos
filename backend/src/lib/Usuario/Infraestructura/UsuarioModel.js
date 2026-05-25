const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../Infraestructura/database/Postgres");

const UsuarioModel = sequelize.define("Usuario", {
  id_Usuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
  correo: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  contraseña: { type: DataTypes.STRING, allowNull: false },
  rol: { type: DataTypes.STRING, allowNull: false },
  cedula: { type: DataTypes.STRING(15), allowNull: false, unique: true, validate: { notEmpty: true } },
  telefono: { type: DataTypes.STRING(15), allowNull: false, validate: { notEmpty: true } },
  id_departamento: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "departamentos", // 🔥 CORREGIDO: Debe coincidir con tableName de DepartamentosModel
      key: "id_departamento",
    },
  },
}, {
  tableName: "usuarios",
  timestamps: true,
});

module.exports = UsuarioModel;