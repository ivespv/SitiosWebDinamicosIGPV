// src/middleware/authMiddleware.js
const authMiddleware = (req, res, next) => {
    if (req.session.usuarioId) {
      return next(); // El usuario está autenticado
    }
    res.redirect("/auth/login"); // Redirigir a la página de inicio de sesión
  };
  
  module.exports = authMiddleware;
  

/*  const verificarAutenticacion = (req, res, next) => {
    if (!req.session.usuarioId) {
      return res.redirect('/auth/login'); // Redirigir a la página de login si no está autenticado
    }
    next(); // Continuar si está autenticado
  };
  
  // Usar el middleware en rutas que requieren autenticación
  app.use("/compras", verificarAutenticacion, compraRoutes);
  app.use("/productos", verificarAutenticacion, productoRoutes);*/