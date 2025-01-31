const { EntitySchema } = require("typeorm");

module.exports.agenda = new EntitySchema({
  name: "Agenda",
  tableName: "agenda",
  columns: {
    id: {
      primary: true,
      type: "smallint",
      generated: true,
    },
    nombres: {
      type: "varchar",
      length: 40
    },
    apellidos: {    
      type: "varchar",
      length: 30
    },
    direccion: {
      type: "varchar",
      length: 100
    },
    telefono: {
      type: "int",
    },
  },
});
