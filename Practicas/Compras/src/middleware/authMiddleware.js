// src/middleware/authMiddleware.js
const authMiddleware = (req, res, next) => {
    if (req.session.usuarioId) {
      return next(); // El usuario está autenticado
    }
    res.redirect("/auth/login"); // Redirigir a la página de inicio de sesión
  };
  
  module.exports = authMiddleware;
  