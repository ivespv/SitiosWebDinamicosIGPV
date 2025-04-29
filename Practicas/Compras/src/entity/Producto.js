// src/entity/Producto.js
const { EntitySchema } = require("typeorm");
const { In } = require("typeorm");

module.exports.Producto = new EntitySchema({
  name: "Producto",
  tableName: "productos",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    codigo: {
      type: "varchar",
    },
    codint: {
        type: "varchar",
      },
    detalle: {
      type: "varchar",
    },
    unidad: {
      type: "varchar",
    },
    concentracion: {
      type: "varchar",
    },
    psicotropico: {
      type: "varchar",
    },
    estupefaciente: {
      type: "varchar",
    },
  },
});
