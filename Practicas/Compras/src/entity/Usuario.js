// src/entity/Usuario.js
const { EntitySchema } = require("typeorm");

module.exports.Usuario = new EntitySchema({
  name: "Usuario",
  tableName: "usuarios",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    correo: {
      type: "varchar",
    },
    contraseña: {
      type: "varchar",
    },
    nombre: {
      type: "varchar",
    },
    nusuario: {
      type: "varchar",
    },
    rol: {
      type: "varchar",
    },
  },
});
