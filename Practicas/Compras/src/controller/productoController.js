// src/controller/productoController.js
const { getRepository } = require("typeorm");
const { Producto } = require("../entity/Producto");

// Obtener todos los productos
const obtenerProductos = async (req, res) => {
  const productos = await getRepository(Producto).find();
  res.render("productos/index", { productos });
};

const obtenerProductoPorId = async (req, res) => {
    const { id } = req.params;
    const producto = await getRepository(Producto).findOne({ where: { id } }); 
  if (!producto) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }
  res.render("productos/editar", { producto });
};

// Crear múltiples productos
const crearMultiplesProductos = async (req, res) => {
  const { codigo, detalle, unidad, concentracion, psicotropico, estupefaciente } = req.body;

  const productos = [];
  for (let i = 0; i < codigo.length; i++) {
    const nuevoProducto = getRepository(Producto).create({
      codigo: codigo[i],
      detalle: detalle[i],
      unidad: unidad[i],
      concentracion: concentracion[i],
      psicotropico: psicotropico[i],
      estupefaciente: estupefaciente[i],
    });
    productos.push(nuevoProducto);
  }
  await getRepository(Producto).save(productos);
  res.redirect("/productos");
};

// Editar un producto
const editarProducto = async (req, res) => {
    const { id } = req.params;
    console.log("ID recibido:", id); // Agregar este log
    const { codigo, codint, detalle, unidad, concentracion, psicotropico, estupefaciente } = req.body;
  
    try {
      const producto = await getRepository(Producto).findOne({ where: { id } });
      console.log("Producto encontrado:", producto); // Agregar este log
      if (!producto) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
      }
  
      producto.codigo = codigo;
      producto.codint = codint;
      producto.detalle = detalle;
      producto.unidad = unidad;
      producto.concentracion = concentracion;
      producto.psicotropico = psicotropico;
      producto.estupefaciente = estupefaciente;
  
      await getRepository(Producto).save(producto);
      res.redirect("/productos");
    } catch (error) {
      console.error("Error al editar el producto:", error);
      res.status(500).json({ mensaje: "Error al editar el producto" });
    }
  };

// Eliminar un producto
const eliminarProducto = async (req, res) => {
  await getRepository(Producto).delete(req.params.id);
  res.redirect("/productos");
};

module.exports = {
  obtenerProductos,
  crearMultiplesProductos,
  editarProducto,
  eliminarProducto,
  obtenerProductoPorId,
};