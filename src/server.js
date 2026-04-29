const buildApp = require("./app");
// Importamos la conexión desde tu nueva infraestructura de Postgres
const { connection } = require("./Infraestructura/database/Postgres");

async function start() {
  const port = Number(process.env.PORT) || 3977;

  try {
    // 1. Iniciamos la conexión a PostgreSQL con Sequelize
    await connection();

    // 2. Construimos la aplicación (ya con los módulos inyectados)
    const app = await buildApp();

    // 3. Encendemos el servidor
    app.listen(port, () => {
      console.log("--------------------------------------------------");
      console.log(`Servidor ORM (Sequelize) corriendo en puerto: ${port}`);
      console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log("--------------------------------------------------");
    });
  } catch (error) {
    console.error("Fallo crítico al iniciar la aplicación:", error);
    process.exit(1);
  }
}

// Manejo de cierres inesperados (Buena práctica para el informe)
process.on("unhandledRejection", (err) => {
  console.error("Rechazo no manejado:", err);
  process.exit(1);
});

start();