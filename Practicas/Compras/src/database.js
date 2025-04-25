// src/Database.js
const { createConnection } = require("typeorm");
const { Usuario } = require("./entity/Usuario");
const { Compra } = require("./entity/Compra"); 
const connectDB = async () => {
  try {
    await createConnection({
      type: "mysql",
      host: process.env.DB_HOST, 
      port: 3306, 
      username: process.env.DB_USER, 
      password: process.env.DB_PASS,
      database: process.env.DB_NAME, 
      entities: [Usuario, Compra], 
      synchronize: false, 
    });
    console.log("Conexión a la base de datos establecida correctamente.");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
