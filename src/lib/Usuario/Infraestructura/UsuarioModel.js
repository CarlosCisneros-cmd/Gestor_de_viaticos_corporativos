const { DataTypes } = require("sequelize");
// Importamos la instancia de sequelize desde tu archivo de conexión
const { sequelize } = require("../../../Infraestructura/database/Postgres");

const UsuarioModel = sequelize.define("Usuario", {
  id_Usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Valida que el formato sea de correo electrónico
    },
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: "usuarios",
  timestamps: true, // Crea automáticamente createdAt y updatedAt
});

module.exports = UsuarioModel;