require('dotenv').config();
const express = require("express");
const connectDB = require("./database");
const path = require("path");
const agendaRoutes = require("./routes/agendaRoutes");

const app = express();

// Configuración de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración del motor de vistas
app.set("view engine", "ejs");
app.set("view", path.join(__dirname, "view"));

// Rutas
app.use("/reg_agenda", agendaRoutes);
app.use("/", (req, res) => {
  res.send("Bienvenido a la página principal!!");
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
