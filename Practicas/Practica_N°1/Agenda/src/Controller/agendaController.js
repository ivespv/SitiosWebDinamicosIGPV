const { getRepository } = require("typeorm");
const { agenda } = require("../entity/agenda");

// Obtener todos los registros de Agenda
const obtenerAgenda = async (req, res) => {
  try {
      const agendaList = await getRepository(agenda).find();
      //console.log(agendaList)
      res.render("RegAgenda/index", { agenda: agendaList });
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

// Actualizar un usuario
const editarAgenda = async (req, res) => {
    console.log("entro1")
    const { nombres, apellidos, direccion, telefono } = req.body;
    const EdAgenda = await getRepository(agenda).findOne(req.params.id);
    if (EdAgenda) {
      EdAgenda.nombres = nombres;
      EdAgenda.apellidos = apellidos;
      EdAgenda.direccion = direccion;
      EdAgenda.telefono = telefono;
      const resultado = await getRepository(agenda).save(EdAgenda);
      res.json(resultado);
    } else {
      res.status(404).json({ mensaje: "Agenda no encontrada" });
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
