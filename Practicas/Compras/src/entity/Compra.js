// src/entity/Compra.js
const { EntitySchema } = require("typeorm");

module.exports.Compra = new EntitySchema({
  name: "Compra",
  tableName: "compras",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    cite: {
      type: "varchar",
    },
    codigo: {
      type: "varchar",
    },
    cantidad: {
      type: "int",
    },
    producto: {
      type: "varchar",
    },
    precio_unitario: {
      type: "decimal",
      precision: 10,
      scale: 2,
    },
    costo_total: {
      type: "decimal",
      precision: 10,
      scale: 2,
    },
    proveedor: { 
      type: "varchar",
    },
    fecha: {
      type: "date",
    },
    nusuario: {
      type: "varchar",
    },
  },
});
