// src/controller/compraController.js
const { getRepository, Like } = require("typeorm");
const { Compra } = require("../entity/Compra");

const PDFDocument = require('pdfkit');
const fs = require('fs');

const path = require('path');


// Obtener todas las compras
const obtenerCompras = async (req, res) => {
  const page = parseInt(req.query.page) || 1; 
  const limit = 5; 
  const offset = (page - 1) * limit; 

  const cite = req.query.cite || ''; 
  const producto = req.query.producto || ''; 
  const proveedor = req.query.proveedor || ''; 

  const whereConditions = {};

  if (cite) {
    whereConditions.cite = Like(`%${cite}%`);
  }

  if (producto) {
    whereConditions.producto = Like(`%${producto}%`);
  }

  if (proveedor) {
    whereConditions.proveedor = Like(`%${proveedor}%`);
  }

  const [compras, total] = await getRepository(Compra).findAndCount({
    where: whereConditions,
    skip: offset,
    take: limit,
  });

  compras.forEach(compra => {
    compra.fecha = new Date(compra.fecha); 
  });

  const totalPages = Math.ceil(total / limit); 

  res.render("compras/index", { compras, currentPage: page, totalPages, cite, producto, proveedor });
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

const generarReporte = async (req, res) => {
  const { tipo, fecha } = req.query; // tipo puede ser 'diario', 'mensual', 'anual'
  const compras = await getRepository(Compra).find();

  // Filtrar compras según el tipo de reporte
  let comprasFiltradas;
  const fechaObj = new Date(fecha);

  if (tipo === 'diario') {
    comprasFiltradas = compras.filter(compra => {
      const compraFecha = new Date(compra.fecha);
      return compraFecha.toDateString() === fechaObj.toDateString();
    });
  } else if (tipo === 'mensual') {
    comprasFiltradas = compras.filter(compra => {
      const compraFecha = new Date(compra.fecha);
      return compraFecha.getMonth() === fechaObj.getMonth() && compraFecha.getFullYear() === fechaObj.getFullYear();
    });
  } else if (tipo === 'anual') {
    comprasFiltradas = compras.filter(compra => {
      const compraFecha = new Date(compra.fecha);
      return compraFecha.getFullYear() === fechaObj.getFullYear();
    });
  } else {
    return res.status(400).json({ mensaje: "Tipo de reporte no válido" });
  }

  // Crear el documento PDF
  const doc = new PDFDocument({ size: 'legal', layout: 'landscape' });
  const filePath = path.join(__dirname,  '../reports/reporte_compras.pdf');
  doc.pipe(fs.createWriteStream(filePath));

  // Agregar contenido al PDF
  doc.fontSize(25).text('Reporte de Compras', { align: 'center' });
  doc.moveDown();

  // Encabezados de la tabla
  doc.fontSize(12).text('Cite', 50, 100);
  doc.text('Código', 150, 100);
  doc.text('Cantidad', 250, 100);
  doc.text('Producto', 350, 100);
  doc.text('Precio Unitario', 450, 100);
  doc.text('Costo Total', 550, 100);
  doc.text('Proveedor', 650, 100);
  doc.text('Fecha', 750, 100);
  doc.moveDown();

  comprasFiltradas.forEach(compra => {
    const precioUnitario = parseFloat(compra.precio_unitario);
    const costoTotal = parseFloat(compra.costo_total);
    const fechaCompra = new Date(compra.fecha).toLocaleDateString();
  
    // Verifica si los valores son números válidos
    if (isNaN(precioUnitario) || isNaN(costoTotal)) {
      console.error(`Error en los datos de compra: ${JSON.stringify(compra)}`);
      return; // Salir de la iteración si hay un error
    }
  
    // Dibuja cada fila de datos
    doc.text(compra.cite, 50);
    doc.text(compra.codigo, 150);
    doc.text(compra.cantidad.toString(), 250);
    doc.text(compra.producto, 350);
    doc.text(precioUnitario.toFixed(2), 450);
    doc.text(costoTotal.toFixed(2), 550);
    doc.text(compra.proveedor, 650);
    doc.text(fechaCompra, 750);
    doc.moveDown();
  });

  doc.end();

  // Enviar el archivo PDF como respuesta
  res.download(filePath, 'reporte_compras.pdf', (err) => {
    if (err) {
      console.error("Error al enviar el archivo PDF:", err);
      res.status(500).json({ mensaje: "Error al enviar el archivo PDF" });
    }
  });
};


module.exports = {
  obtenerCompras,
  /*crearCompra,*/
  crearMultiplesCompras,
  editarCompra,
  eliminarCompra,
  generarReporte,
};
