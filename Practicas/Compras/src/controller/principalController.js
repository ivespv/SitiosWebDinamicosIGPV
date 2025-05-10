// src/controller/principalController.js
const { getRepository, Like } = require("typeorm");
const { Usuario } = require("../entity/Usuario");
const getPrincipal = async (req, res) => {
    // Datos simulados de médicos, en una app real podrían venir de una BD
    const medicos = [
      {
        nombre: 'DEL 12 AL 18',
        horario: {
          lunes: 'Dr. Henrry Villca',
          martes: 'Dr. Miranda',
          miercoles: 'Dr. Serrano ',
          jueves: 'Dr. Oropeza',
          viernes: 'Dr. Henrry Villca',
          sabado: 'Dr. Miranda',
          domingo: 'Dr. Serrano '
        },
        estado: 'Disponible' // Puede ser 'Disponible', 'Vacaciones', 'Licencia'
      },
      {
        nombre: 'DEL 19 AL 25',
        horario: {
          lunes: 'Dr. Oropeza',
          martes: 'Dr. henrry Villca',
          miercoles: 'Dr. Miranda', 
          jueves: 'Dr. Serrano ',
          viernes: 'Dr. Oropeza',
          sabado: 'Dr. Henrry Villca',
          domingo: 'Dr. Miranda'
        },
        estado: 'Disponible' // Puede ser 'Disponible', 'Vacaciones', 'Licencia'
      },
    ];
  
    const usuarioId = req.session.usuarioId;
    console.log("ID del usuario:", usuarioId);
    const usuario = usuarioId ? await getRepository(Usuario).findOne({ where: { id: usuarioId } }) : null;
    console.log("Usuario:", usuario);

    // Renderizar la vista principal enviando los datos de médicos y el usuario si existe
    res.render('principal', { usuario: req.user, medicos, usuario });
  };
  
  module.exports = {
    getPrincipal,
  };
  
  