// src/routes/proveedorRoutes.js
const express = require("express");
const router = express.Router();
const { getRepository } = require("typeorm");
const { Usuario } = require("../entity/Usuario");

const proveedorController = require("../controller/proveedorController");
const authMiddleware = require("../middleware/authMiddleware");

// Middleware para obtener el usuario y hacerlo disponible en las vistas
const userMiddleware = async (req, res, next) => {
  const usuarioId = req.session.usuarioId;
  const usuario = usuarioId ? await getRepository(Usuario).findOne({ where: { id: usuarioId } }) : null;
  res.locals.usuario = usuario; // disponible en todas las vistas
  next();
};

router.use(authMiddleware);
router.use(userMiddleware);

// Obtener todos los proveedores
router.get("/", proveedorController.obtenerProveedores);

// Crear un nuevo proveedor (página)
router.get("/crear", (req, res) => {
  res.render("proveedores/crear"); // No es necesario pasar usuario aquí, está disponible en res.locals
});

// Editar un proveedor (página)
router.get("/editar/:id", proveedorController.editarProveedorPage);

// Crear múltiples proveedores
router.post("/crear-multiples", proveedorController.crearMultiplesProveedores);

// Editar un proveedor
router.post("/editar/:id", proveedorController.editarProveedor);

// Eliminar un proveedor
router.post("/eliminar/:id", proveedorController.eliminarProveedor);

// Ruta para eliminar múltiples proveedor
router.post("/eliminar", proveedorController.eliminarProveedores);

module.exports = router;
