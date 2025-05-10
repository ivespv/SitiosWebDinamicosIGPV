// src/app.js
require('dotenv').config();
const express = require("express");
const session = require("express-session");
const connectDB = require("./database");
const path = require("path");
const { getRepository } = require("typeorm"); // Importar getRepository
const { Usuario } = require("./entity/Usuario"); // Asegúrate de importar el modelo Usuario
const usuarioRoutes = require("./routes/usuarioRoutes");
const compraRoutes = require("./routes/compraRoutes"); 
const authRoutes = require("./routes/authRoutes");
const proveedorRoutes = require("./routes/proveedorRoutes");
const productoRoutes = require("./routes/productoRoutes");


const app = express();

const principalRoutes = require('./routes/principalRoutes');

// Configuración de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'mi_secreto', resave: false, saveUninitialized: true })); 

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

app.use(express.static(path.join(__dirname, "public")));

// Configuración del motor de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Rutas
app.use("/usuarios", usuarioRoutes);
app.use("/compras", compraRoutes); 
app.use("/auth", authRoutes);
app.use("/proveedores", proveedorRoutes);
app.use("/productos", productoRoutes);
app.use('/', principalRoutes);

app.get("/", async (req, res) => {
  const usuarioId = req.session.usuarioId;
  let usuario = null;

  try {
    if (usuarioId) {
      usuario = await getRepository(Usuario).findOne({ where: { id: usuarioId } }); // Corrección aquí
      console.log("Usuario:", usuario);
    }
    res.render("Principal", { usuario });
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).send("Error interno del servidor");
  }
});

/*app.get("/", (req, res) => {
  res.render("Principal");
});*/

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
