// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

// Ruta para mostrar el formulario de inicio de sesión
router.get("/login", authController.mostrarLogin);

// Ruta para manejar el inicio de sesión
router.post("/login", authController.iniciarSesion);


router.post("/logout", (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.redirect("/usuarios");
      }
      res.redirect("/auth/login");
    });
});

module.exports = router;