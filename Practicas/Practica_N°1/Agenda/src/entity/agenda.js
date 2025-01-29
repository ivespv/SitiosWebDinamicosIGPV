const { EntitySchema } = require("typeorm");

module.exports.agenda = new EntitySchema({
  name: "agenda",
  tableName: "agenda",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    nombres: {
      type: "varchar",
    },
    apellidos: {    
      type: "varchar",
    },
    direccion: {
      type: "varchar",
    },
    telefono: {
      type: "varchar",
    },
  },
});
