const { Sequelize } = require("sequelize");

// URI por defecto para PostgreSQL 
const DEFAULT_URI = "postgres://postgres:Uisrael.@localhost:5432/GestorViaticos";

// Instancia de Sequelize que se usará para definir los modelos [cite: 18]
const sequelize = new Sequelize(process.env.POSTGRES_URI || DEFAULT_URI, {
  dialect: 'postgres', // Especificado en la Actividad 2 de ORM 
  logging: false,      // Opcional: desactiva los logs de SQL en la consola
});

async function connection() {
  try {
    // authenticate() verifica si la conexión es exitosa 
    await sequelize.authenticate();
    console.log(`Se ha conectado exitosamente a la base de datos relacional.`);
  } catch (error) {
    console.error("Error conectando a Postgres con Sequelize:", error);
    throw new Error("No se ha podido establecer la conexión a la bdd relacional");
  }
}

async function disconnect() {
  try {
    // close() cierra la conexión de la instancia 
    await sequelize.close();
    console.log("Sequelize desconectado correctamente");
  } catch (error) {
    console.error("Error al cerrar la conexión de Sequelize:", error);
  }
}

// Exportamos tanto la instancia para los modelos como las funciones de control
module.exports = { sequelize, connection, disconnect };