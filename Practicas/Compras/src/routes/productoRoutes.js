// src/routes/productoRoutes.js
const express = require("express");
const router = express.Router();
const controlador = require("../controller/productoController");
const { getRepository } = require("typeorm");
const { Producto } = require("../entity/Producto");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

// Obtener todos los productos con paginación
router.get("/", controlador.obtenerProductos);

// Página para crear productos
router.get("/crear", controlador.mostrarCrearProducto); // Asegúrate de que esto esté correcto

// Crear múltiples productos
router.post("/crear-multiples", controlador.crearMultiplesProductos);

// Obtener un producto para editar
router.get("/editar/:id", controlador.obtenerProductoPorId); 

// Editar un producto
router.post("/editar/:id", controlador.editarProducto);

// Eliminar un producto
router.post("/eliminar/:id", controlador.eliminarProducto);

// Ruta para eliminar múltiples productos
router.post("/eliminar", controlador.eliminarProductos); 

module.exports = router;
