// src/controller/productoController.js
const { getRepository } = require("typeorm");
const { Producto } = require("../entity/Producto");

// Obtener todos los productos
const obtenerProductos = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Obtener el número de página desde la query
  const limit = 5; // Número de productos por página
  const [productos, total] = await getRepository(Producto).findAndCount({
    skip: (page - 1) * limit,
    take: limit,
  });

  const totalPages = Math.ceil(total / limit); // Calcular el total de páginas

  res.render("productos/index", { productos, currentPage: page, totalPages });
};

const obtenerProductoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await getRepository(Producto).findOne({ where: { id: parseInt(id) } });
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.render("productos/editar", { producto }); // Renderiza la vista de edición
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({ mensaje: "Error al obtener el producto" });
  }
};

// Crear múltiples productos
const crearMultiplesProductos = async (req, res) => {
  const { codigo, codint, detalle, unidad, concentracion, psicotropico, estupefaciente } = req.body;

  const productos = [];
  for (let i = 0; i < codigo.length; i++) {
    const nuevoProducto = getRepository(Producto).create({
      codigo: codigo[i],
      codint: codint[i],
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

const eliminarProductos = async (req, res) => {
  const ids = req.body.productos; // Obtener los IDs de los productos seleccionados
  if (!ids || ids.length === 0) {
    return res.redirect("/productos"); // Redirigir si no hay productos seleccionados
  }

  try {
    await getRepository(Producto).delete(ids); // Eliminar los productos
    res.redirect("/productos");
  } catch (error) {
    console.error("Error al eliminar productos:", error);
    res.status(500).json({ mensaje: "Error al eliminar productos" });
  }
};


module.exports = {
  obtenerProductos,
  crearMultiplesProductos,
  editarProducto,
  eliminarProducto,
  obtenerProductoPorId,
  eliminarProductos,
};
