// src/app.js
require('dotenv').config();
const express = require("express");
const session = require("express-session");
const connectDB = require("./database");
const path = require("path");
const usuarioRoutes = require("./routes/usuarioRoutes");
const compraRoutes = require("./routes/compraRoutes"); 
const authRoutes = require("./routes/authRoutes");

const app = express();

// Configuración de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'mi_secreto', resave: false, saveUninitialized: true })); 

app.use(express.static(path.join(__dirname, "public")));

// Configuración del motor de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Rutas
app.use("/usuarios", usuarioRoutes);
app.use("/compras", compraRoutes); 
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.render("Principal");
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
