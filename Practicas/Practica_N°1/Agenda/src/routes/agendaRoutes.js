const express = require("express");
const router = express.Router();
const { getRepository } = require("typeorm");
const { agenda } = require("../entity/agenda");
const controlador = require("../Controller/agendaController");

router.get("/", async (req, res) => {
  controlador.obtenerAgenda(req, res);
  //res.render('index')
});

// Página para crear un Registro
router.get("/crear", (req, res) => {
  res.render("RegAgenda/crear");
});

router.post("/crear", async (req, res) => {
  const { nombres, apellidos, direccion, telefono } = req.body;
  const nuevaAgenda = getRepository(agenda).create({
    nombres,
    apellidos,
    direccion,
    telefono,
  });
  await getRepository(agenda).save(nuevaAgenda);
  res.redirect("/RegAgenda");
});

// Página para editar un Registro
router.get("/editar/:id", async (req, res) => {
  console.log("entro1")
   const agenda2 = await getRepository(agenda).findOneBy({id:req.params.id});
      if (!agenda2) return res.status(404).send("Registro no encontrado");
  
      res.render("RegAgenda/editar", { agenda2 });
});

router.post("/editar/:id", async (req, res) => {
  console.log("entro")
  const { nombres, apellidos, direccion, telefono } = req.body;
  const agenda3 = await getRepository(agenda).findOneBy({id:req.params.id});
  console.log(agenda3);
  if (agenda3) {
    agenda3.nombres = nombres;
    agenda3.apellidos = apellidos;
    agenda3.direccion = direccion;
    agenda3.telefono = telefono;
    await getRepository(agenda).save(agenda3);
  }
  res.redirect("/RegAgenda");
});

// Eliminar un Registro
router.post("/eliminar/:id", async (req, res) => {
  await getRepository(agenda).delete(req.params.id);
  res.redirect("/RegAgenda");
});

module.exports = router;


