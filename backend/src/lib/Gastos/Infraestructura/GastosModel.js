const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../Infraestructura/database/Postgres");
const CategoriaModel = require("../../Categorias/Infraestructura/CategoriaModel");
const ViaticoModel = require("../../Viaticos/Infraestructura/ViaticoModel");

const GastosModel = sequelize.define("Gasto", {
  id_gasto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0.01 },
  },
  fecha_gasto: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  observaciones: { // Reemplazado foto_comprobante por observaciones
    type: DataTypes.TEXT, // Usamos TEXT para dar espacio a justificaciones largas de rechazo
    allowNull: true,      // Permitimos null porque al crearse puede ir vacío
  },
  estado_gasto: {
    type: DataTypes.ENUM('Pendiente', 'Aceptado', 'Rechazado'),
    allowNull: false,
    defaultValue: 'Pendiente',
  },
}, {
  tableName: "gastos",
  timestamps: true,
});

// --- RELACIONES ACTIVAS ---

GastosModel.belongsTo(CategoriaModel, { foreignKey: 'id_categoria', as: 'categoria' });
CategoriaModel.hasMany(GastosModel, { foreignKey: 'id_categoria' });

GastosModel.belongsTo(ViaticoModel, { foreignKey: 'id_viatico', as: 'viatico' });
ViaticoModel.hasMany(GastosModel, { foreignKey: 'id_viatico' });

module.exports = GastosModel;