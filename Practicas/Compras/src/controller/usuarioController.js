// src/controller/usuarioController.js
const { getRepository } = require("typeorm");
const bcrypt = require("bcrypt");
const { Usuario } = require("../entity/Usuario");

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
    // res.json(usuarios);
    //res.render("usuarios/index", { usuarios });

    const usuarios = await getRepository(Usuario).find();
    const usuarioId = req.session.usuarioId;
    let usuario = null;
  
    if (usuarioId) {
      usuario = await getRepository(Usuario).findOne({ where: { id: usuarioId } });
    }
  
    res.render("usuarios/index", { usuarios, usuario });
};

// Obtener un usuario para editar
// Obtener un usuario para editar
const obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.session.usuarioId;
  let usuarioLogueado = null;

  try {
    // Obtener el usuario logueado
    if (usuarioId) {
      usuarioLogueado = await getRepository(Usuario).findOne({ where: { id: usuarioId } });
    }

    // Obtener el usuario a editar
    const usuario = await getRepository(Usuario).findOne({ where: { id: parseInt(id) } });
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Renderizar la vista de edición pasando el usuario logueado
    res.render("usuarios/editar", { usuario, usuarioLogueado }); // Asegúrate de pasar ambas variables
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).json({ mensaje: "Error al obtener el usuario" });
  }
};

// Arrastra suario para la pagina
const crearUsuarioPage = async (req, res) => {
  const usuarioId = req.session.usuarioId;
  let usuario = null;

  if (usuarioId) {
    usuario = await getRepository(Usuario).findOne({ where: { id: usuarioId } });
  }

  res.render("usuarios/crear", { usuario }); // Asegúrate de pasar la variable usuario
};

// Crear un nuevo usuario
const crearUsuario = async (req, res) => {
  const { correo, contraseña, nombre, rol, nusuario } = req.body;
  const hashedPassword = await bcrypt.hash(contraseña, 10);
  const nuevoUsuario = getRepository(Usuario).create({
    correo,
    contraseña: hashedPassword,
    nombre,
    rol,
    nusuario,
  });
  const resultado = await getRepository(Usuario).save(nuevoUsuario);
  res.json(resultado);
};

// Actualizar un usuario
const editarUsuario = async (req, res) => {
  const { correo, nombre, rol,nusuario } = req.body;
  const usuario = await getRepository(Usuario).findOne(req.params.id);
  if (usuario) {
    usuario.correo = correo;
    usuario.nombre = nombre;
    usuario.rol = rol;
    usuario.nusuario = nusuario;
    const resultado = await getRepository(Usuario).save(usuario);
    res.json(resultado);
  } else {
    res.status(404).json({ mensaje: "Usuario no encontrado" });
  }
};

// Eliminar un usuario
const eliminarUsuario = async (req, res) => {
  const resultado = await getRepository(Usuario).delete(req.params.id);
  res.json(resultado);
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  crearUsuarioPage,
  editarUsuario,
  eliminarUsuario,
};
