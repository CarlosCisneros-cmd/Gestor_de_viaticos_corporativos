const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../../Infraestructura/database/Postgres");
const UsuarioModel = require("../../Usuario/Infraestructura/UsuarioModel");

class ViaticoModel extends Model {}

ViaticoModel.init(
  {
    id_Viatico: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descripcion_Viatico: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fecha_inicio: {
      type: DataTypes.DATEONLY, 
      allowNull: false,
    },
    fecha_fin: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    presupuesto_asignado: {
      type: DataTypes.DECIMAL(10, 2), 
      allowNull: true,
      defaultValue: 0.00,
    },
    estado_Viatico: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "Pendiente",
    },
    fecha_solicitud: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    
    },
  },
  {
    sequelize,
    modelName: "Viatico",
    tableName: "viaticos",
    timestamps: true, // Habilita createdAt y updatedAt automáticamente
  }
);

ViaticoModel.belongsTo(UsuarioModel, { foreignKey: 'id_usuario'});
UsuarioModel.hasMany(ViaticoModel, { foreignKey: 'id_usuario' });

module.exports = ViaticoModel;