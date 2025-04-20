// src/controller/authController.js
const { getRepository } = require("typeorm");
const bcrypt = require("bcrypt");
const { Usuario } = require("../entity/Usuario");

const mostrarLogin = (req, res) => {
  res.render("auth/login", { error: null }); 
};

const iniciarSesion = async (req, res) => {
  const { correo, contraseña } = req.body;
  const usuario = await getRepository(Usuario).findOne({ where: { correo } });

  if (usuario && await bcrypt.compare(contraseña, usuario.contraseña)) {
    req.session.usuarioId = usuario.id; 
    return res.redirect("/"); 
  }

  res.render("auth/login", { error: "Credenciales incorrectas" }); 
};

module.exports = {
  mostrarLogin,
  iniciarSesion,
};