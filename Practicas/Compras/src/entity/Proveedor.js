const { EntitySchema } = require("typeorm");

module.exports.Proveedor = new EntitySchema({
  name: "Proveedor",
  tableName: "proveedores",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    correo: {
      type: "varchar",
    },
    nombre: {
      type: "varchar",
    },
    empresa: {
      type: "varchar",
    },
    direccion: {
      type: "varchar",
    },
    telefono: {
      type: "int",
    },
  },
});