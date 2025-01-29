const { getRepository } = require("typeorm");
const bcrypt = require("bcrypt");
const { agenda } = require("../entity/agenda");

// Obtener todos los registros de Agenda
const obtenerAgenda = async (req, res) => {
    const agenda = await getRepository(agenda).find();
    res.render("reg_agenda/index", { agenda });
};

// Crear un nuevo agenda
async function crearAgenda(req, res) {
    const { nombres, apellidos, direccion, telefono } = req.body;
    const nuevoAgenda = getRepository(agenda).create({
        nombres,
        apellidos,
        direccion,
        telefono,
    });
    const resultado = await getRepository(agenda).save(nuevoAgenda);
    res.json(resultado);
}

// Actualizar un agenda
const editarAgenda = async (req, res) => {
  const { nombres, apellidos, direccion, telefono } = req.body;
  const agenda = await getRepository(agenda).findOne(req.params.id);
  if (agenda) {
    agenda.nombres = nombres;
    agenda.apellidos = apellidos;
    agenda.direccion = direccion;
    agenda.telefono = telefono;
    const resultado = await getRepository(agenda).save(agenda);
    res.json(resultado);
  } else {
    res.status(404).json({ mensaje: "Registro no encontrado" });
  }
};

// Eliminar un agenda
const eliminarAgenda = async (req, res) => {
  const resultado = await getRepository(agenda).delete(req.params.id);
  res.json(resultado);
};

module.exports = {
  obtenerAgenda,
  crearAgenda,
  editarAgenda,
  eliminarAgenda,
};
