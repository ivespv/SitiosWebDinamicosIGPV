const { getRepository } = require("typeorm");
const { agenda } = require("../entity/agenda");

// Obtener todos los registros de Agenda



const obtenerAgenda = async (req, res) => {
  try {
      const agendaList = await getRepository(agenda).find();
      console.log(agendaList)
      res.render("reg_agenda/index", { agenda: agendaList });
  } catch (error) {
      res.status(500).json({ mensaje: "Error al obtener la agenda ", error });
  }
};

// Crear un nuevo Registro

async function crearAgenda(req, res) {
  const { nombres, apellidos, direccion, telefono } = req.body;
  try {
      const nuevaAgenda = getRepository(agenda).create({ nombres, apellidos, direccion, telefono });
      const resultado = await getRepository(agenda).save(nuevaAgenda);
      res.status(201).json({ mensaje: "Agenda creada", data: resultado });
  } catch (error) {
      res.status(500).json({ mensaje: "Error al crear la agenda", error });
  }
};


async function editarAgenda(req, res) {
  const { nombres, apellidos, direccion, telefono } = req.body;
  try {
      const agendaEntry = await getRepository(agenda).findOne(req.params.id);
      if (agendaEntry) {
          agendaEntry.nombres = nombres;
          agendaEntry.apellidos = apellidos;
          agendaEntry.direccion = direccion;
          agendaEntry.telefono = telefono;
          const resultado = await getRepository(agenda).save(agendaEntry);
          res.json({ mensaje: "Agenda actualizada", data: resultado });
      } else {
          res.status(404).json({ mensaje: "Registro no encontrado" });
      }
  } catch (error) {
      res.status(500).json({ mensaje: "Error al actualizar la agenda", error });
  }
};

// Eliminar un agenda
const eliminarAgenda = async (req, res) => {
  try {
      const resultado = await getRepository(agenda).delete(req.params.id);
      if (resultado.affected > 0) {
          res.status(204).send(); // No content
      } else {
          res.status(404).json({ mensaje: "Registro no encontrado" });
      }
  } catch (error) {
      res.status(500).json({ mensaje: "Error al eliminar la agenda", error });
  }
};

module.exports = {
  obtenerAgenda,
  crearAgenda,
  editarAgenda,
  eliminarAgenda,
};
