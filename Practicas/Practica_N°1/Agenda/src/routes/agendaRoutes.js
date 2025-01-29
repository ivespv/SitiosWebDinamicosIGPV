const express = require("express");
const router = express.Router();
const { getRepository } = require("typeorm");
const bcrypt = require("bcrypt");
const { agenda } = require("../entity/agenda");
const controlador = require("../controller/agendaController");

router.get("/", async (req, res) => {
 controlador.obtenerAgenda(req, res);
});

// Página para crear un Registro
router.get("/crear", (req, res) => {
  res.render("reg_agenda/crear");
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
  res.redirect("/reg_agenda");
});

// Página para editar un Registro
router.get("/editar/:id", async (req, res) => {
    
   const agenda = await getRepository(agenda).findOneBy({id:req.params.id});
      if (!agenda) return res.status(404).send("Registro no encontrado");
  
      res.render("reg_agenda/editar", { agenda });
});

router.post("/editar/:id", async (req, res) => {
  const { nombres, apellidos, direccion, telefono } = req.body;
  const agenda = await getRepository(agenda).findOneBy({id:req.params.id});
  console.log(agenda);
  if (agenda) {
    agenda.nombres = nombres;
    agenda.apellidos = apellidos;
    agenda.direccion = direccion;
    agenda.telefono = telefono;
    await getRepository(agenda).save(agenda);
  }
  res.redirect("/reg_agenda");
});

// Eliminar un Registro
router.post("/eliminar/:id", async (req, res) => {
  await getRepository(agenda).delete(req.params.id);
  res.redirect("/reg_agenda");
});

module.exports = router;


