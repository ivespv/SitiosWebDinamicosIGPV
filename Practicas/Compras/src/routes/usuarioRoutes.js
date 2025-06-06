// src/Routes/usuarioRoutes.js
const express = require("express");
const router = express.Router();
const { getRepository } = require("typeorm");
const bcrypt = require("bcrypt");
const { Usuario } = require("../entity/Usuario");
const authMiddleware = require("../middleware/authMiddleware");
const controlador = require("../controller/usuarioController");

router.use(authMiddleware);

router.get("/", async (req, res) => {
 controlador.obtenerUsuarios(req, res);
});

//para que usuario loguedo se visualize en la pagina crear
router.get("/crear", controlador.crearUsuarioPage);

//para que usuario loguedo se visualize en la pagina editar
router.get("/editar/:id", controlador.obtenerUsuarioPorId);

/*// Página para crear un usuario
router.get("/crear", (req, res) => {   EN COMENTARIO PARA PROBAR ERRORES
  res.render("usuarios/crear");
});*/

router.post("/crear", async (req, res) => {
  const { correo, contraseña, nombre, rol, nusuario } = req.body;
  const usuarioExistente = await getRepository(Usuario).findOne({ where: { correo } });
  if (usuarioExistente) {
    // Redirigir a la página de creación con un mensaje de error
    return res.render("usuarios/crear", { error: "El correo ya está en uso", usuario: req.session.usuarioId });
  }

  const hashedPassword = await bcrypt.hash(contraseña, 10);
  const nuevoUsuario = getRepository(Usuario).create({
    correo,
    contraseña: hashedPassword,
    nombre,
    rol,
    nusuario,
  });
  await getRepository(Usuario).save(nuevoUsuario);
  res.redirect("/usuarios");
});

// Página para editar un usuario
router.get("/editar/:id", async (req, res) => {
    
   const usuario = await getRepository(Usuario).findOneBy({id:req.params.id});
      if (!usuario) return res.status(404).send("Usuario no encontrado");
  
      res.render("usuarios/editar", { usuario });
});

router.post("/editar/:id", async (req, res) => {
  console.log("entro");
  const { correo, nombre, rol, nusuario } = req.body;
  const usuario = await getRepository(Usuario).findOneBy({id:req.params.id});
  console.log(usuario);
  if (usuario) {
    usuario.correo = correo;
    usuario.nombre = nombre;
    usuario.rol = rol;
    usuario.nusuario = nusuario;
    await getRepository(Usuario).save(usuario);
  }
  res.redirect("/usuarios");
});

// Eliminar un usuario
router.post("/eliminar/:id", async (req, res) => {
  await getRepository(Usuario).delete(req.params.id);
  res.redirect("/usuarios");
});

module.exports = router;
