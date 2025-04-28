// src/routes/proveedorRoutes.js
const express = require("express");
const router = express.Router();
const proveedorController = require("../controller/proveedorController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

// Obtener todos los proveedores
router.get("/", proveedorController.obtenerProveedores);

// Crear un nuevo proveedor (página)
router.get("/crear", (req, res) => {
    res.render("proveedores/crear"); // Renderiza la vista para crear proveedores
  });
  
// Editar un proveedor (página)
router.get("/editar/:id", proveedorController.editarProveedorPage); // Agregar esta línea

// Crear múltiples proveedores
router.post("/crear-multiples", proveedorController.crearMultiplesProveedores);



// Editar un proveedor
router.post("/editar/:id", proveedorController.editarProveedor);

// Eliminar un proveedor
router.post("/eliminar/:id", proveedorController.eliminarProveedor);

//Eliminar Multiples proveedores
router.post("/eliminar-multiples", proveedorController.eliminarMultiplesProveedores); 

module.exports = router;