// src/controller/authController.js
const { getRepository } = require("typeorm");
const bcrypt = require("bcrypt");
const { Usuario } = require("../entity/Usuario");

// Mostrar la página de inicio de sesión
const mostrarLogin = (req, res) => {
  res.render("auth/login", { error: null }); // Asegúrate de pasar error como null
};

// Manejar el inicio de sesión
const iniciarSesion = async (req, res) => {
  const { correo, contraseña } = req.body;
  const usuario = await getRepository(Usuario).findOne({ where: { correo } });

  if (usuario && await bcrypt.compare(contraseña, usuario.contraseña)) {
    // Aquí puedes establecer la sesión del usuario
    req.session.usuarioId = usuario.id; // Suponiendo que estás usando sesiones
    return res.redirect("/"); // Redirigir a la página principal
  }

  // Si las credenciales son incorrectas, renderiza la vista de login con el mensaje de error
  res.render("auth/login", { error: "Credenciales incorrectas" }); // Asegúrate de pasar el mensaje de error
};

module.exports = {
  mostrarLogin,
  iniciarSesion,
};