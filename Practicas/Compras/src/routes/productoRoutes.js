// src/routes/productoRoutes.js
const express = require("express");
const router = express.Router();
const controlador = require("../controller/productoController");

router.get("/", controlador.obtenerProductos);

// Página para crear productos
router.get("/crear", (req, res) => {
  res.render("productos/crear");
});

// Crear múltiples productos
router.post("/crear-multiples", controlador.crearMultiplesProductos);

// Obtener un producto para editar
router.get("/editar/:id", controlador.obtenerProductoPorId); 


// Editar un producto
router.post("/editar/:id", controlador.editarProducto);

// Eliminar un producto
router.post("/eliminar/:id", controlador.eliminarProducto);

module.exports = router;