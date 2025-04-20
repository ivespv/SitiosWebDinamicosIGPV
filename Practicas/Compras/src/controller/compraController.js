// src/controller/compraController.js
const { getRepository } = require("typeorm");
const { Compra } = require("../entity/Compra");

// Obtener todas las compras
const obtenerCompras = async (req, res) => {
  const page = parseInt(req.query.page) || 1; 
  const limit = 5; 
  const offset = (page - 1) * limit; 

  const [compras, total] = await getRepository(Compra).findAndCount({
    skip: offset,
    take: limit,
  });

  compras.forEach(compra => {
    compra.fecha = new Date(compra.fecha); 
  });

  const totalPages = Math.ceil(total / limit); 

  res.render("compras/index", { compras, currentPage: page, totalPages });
};

const crearMultiplesCompras = async (req, res) => {
  const { cite, codigo, cantidad, producto, precio_unitario, costo_total, proveedor, fecha } = req.body;

  try {
    const compras = [];
    for (let i = 0; i < cite.length; i++) {
      const nuevaCompra = getRepository(Compra).create({
        cite: cite[i],
        codigo: codigo[i],
        cantidad: parseInt(cantidad[i], 10),
        producto: producto[i],
        precio_unitario: parseFloat(precio_unitario[i]),
        costo_total: parseFloat(costo_total[i]),
        proveedor: proveedor[i],
        fecha: new Date(fecha[i] + 'T00:00:00Z')
      });
      compras.push(nuevaCompra);
    }
    await getRepository(Compra).save(compras);
    res.redirect("/compras");
  } catch (error) {
    console.error("Error al crear múltiples compras:", error);
    res.status(500).json({ mensaje: "Error al crear múltiples compras" });
  }
};

// Actualizar una compra
const editarCompra = async (req, res) => {
  const { id } = req.params;  
  const { cite, codigo, cantidad, producto, precio_unitario, costo_total, proveedor, fecha } = req.body;

  try {
    const compra = await getRepository(Compra).findOne({ where: { id: parseInt(id) } });
    if (!compra) {
      return res.status(404).json({ mensaje: "Compra no encontrada" });
    }

    compra.cite = cite;
    compra.codigo = codigo;
    compra.cantidad = cantidad;
    compra.producto = producto;
    compra.precio_unitario = precio_unitario;
    compra.costo_total = costo_total;
    compra.proveedor = proveedor;
    fecha: new Date(fecha[i] + 'T00:00:00Z')

    await getRepository(Compra).save(compra);
    res.redirect("/compras");
  } catch (error) {
    console.error("Error al editar la compra:", error);
    res.status(500).json({ mensaje: "Error al editar la compra" });
  }
};

// Eliminar una compra
const eliminarCompra = async (req, res) => {
  await getRepository(Compra).delete(req.params.id);
  res.redirect("/compras");
};

module.exports = {
  obtenerCompras,
  /*crearCompra,*/
  crearMultiplesCompras,
  editarCompra,
  eliminarCompra,
};
