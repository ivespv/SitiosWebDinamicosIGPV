// src/routes/productoRoutes.js
const express = require("express");
const router = express.Router();
const controlador = require("../controller/productoController");
const { getRepository } = require("typeorm");
const { Producto } = require("../entity/Producto");

/*router.get("/", controlador.obtenerProductos);*/
// Obtener todos los productos con paginación
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Página actual
  const limit = parseInt(req.query.limit) || 5; // Número de elementos por página

  const startIndex = (page - 1) * limit; // Índice inicial para la paginación
  const [productos, total] = await getRepository(Producto).findAndCount({
      skip: startIndex,
      take: limit,
  });

  const totalPages = Math.ceil(total / limit); // Total de páginas

  res.render("productos/index", { 
      productos, 
      totalPages, 
      currentPage: page 
  });
});

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

// Ruta para eliminar múltiples producto
router.post("/eliminar", controlador.eliminarProductos); 

module.exports = router;
