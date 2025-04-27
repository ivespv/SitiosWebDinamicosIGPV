// src/controller/proveedorController.js
const { getRepository } = require("typeorm");
const { Proveedor } = require("../entity/Proveedor");

// Obtener todos los proveedores
const obtenerProveedores = async (req, res) => {
  const proveedores = await getRepository(Proveedor).find();
  res.render("proveedores/index", { proveedores });
};

// Mostrar la página de edición de un proveedor
const editarProveedorPage = async (req, res) => {
    const { id } = req.params; // Asegúrate de que estás obteniendo el ID correctamente
    const proveedor = await getRepository(Proveedor).findOne({ where: { id: id } }); // busqueda por id
    if (!proveedor) {
      return res.status(404).json({ mensaje: "Proveedor no encontrado" });
    }
    res.render("proveedores/editar", { proveedor }); // Renderiza la vista de edición
  };

// Crear múltiples proveedores
const crearMultiplesProveedores = async (req, res) => {
  const { correo, nombre, empresa, direccion, telefono } = req.body;

  const proveedores = [];
  for (let i = 0; i < correo.length; i++) {
    const nuevoProveedor = getRepository(Proveedor).create({
      correo: correo[i],
      nombre: nombre[i],
      empresa: empresa[i],
      direccion: direccion[i],
      telefono: parseInt(telefono[i], 10),
    });
    proveedores.push(nuevoProveedor);
  }
  await getRepository(Proveedor).save(proveedores);
  res.redirect("/proveedores");
};

// Editar un proveedor
const editarProveedor = async (req, res) => {
  const { id } = req.params;
  const { correo, nombre, empresa, direccion, telefono } = req.body;

  const proveedor = await getRepository(Proveedor).findOne({ where: { id: parseInt(id, 10) } }); //Buesqueda por id
  if (!proveedor) {
    return res.status(404).json({ mensaje: "Proveedor no encontrado" });
  }

  proveedor.correo = correo;
  proveedor.nombre = nombre;
  proveedor.empresa = empresa;
  proveedor.direccion = direccion;
  proveedor.telefono = parseInt(telefono, 10);

  await getRepository(Proveedor).save(proveedor);
  res.redirect("/proveedores");
};

// Eliminar un proveedor
const eliminarProveedor = async (req, res) => {
  await getRepository(Proveedor).delete(req.params.id);
  res.redirect("/proveedores");
};

module.exports = {
  obtenerProveedores,
  editarProveedorPage,
  crearMultiplesProveedores,
  editarProveedor,
  eliminarProveedor,
};