// src/controller/compraController.js
const { getRepository, Like } = require("typeorm");
const { Compra } = require("../entity/Compra");
const { Usuario } = require("../entity/Usuario"); //importar Usuario
const { Producto } = require("../entity/Producto");
const { Proveedor } = require("../entity/Proveedor"); 
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

  // Filtrar por código de producto
  let productosFiltrados = [];
  if (producto) {
      productosFiltrados = await getRepository(Producto).find({
          where: { codigo: Like(`%${producto}%`) }
      });
  }

  // Si hay productos filtrados, obtener sus IDs
  const productoIds = productosFiltrados.map(p => p.id);
  if (productoIds.length > 0) {
      whereConditions.producto = In(productoIds); // Filtrar compras por IDs de productos
  } else if (producto) {
    // fallback para permitir búsqueda parcial producto en compras si producto no encontrado en productos
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


  // Obtener el usuario logueado
  const usuarioId = req.session.usuarioId;
  const usuario = usuarioId ? await getRepository(Usuario).findOne({ where: { id: usuarioId } }) : null;

  res.render("compras/index", { compras, currentPage: page, totalPages, cite, producto, proveedor, usuario });
};

const crearCompra = async (req, res) => {
  try {
    const usuarioId = req.session.usuarioId;
    console.log("usuarioId:", usuarioId, "tipo:", typeof usuarioId); // Verifica el tipo de usuarioId

    if (!usuarioId) {
      return res.status(401).json({ mensaje: "Usuario no autenticado" });     
    }
    
    const usuario = usuarioId ? await getRepository(Usuario).findOne({ where: { id: usuarioId } }) : null;
    console.log("usuario:", usuario);
    res.render("compras/crear", { usuario });
  } catch (error) {
    console.error("Error al renderizar la vista de crear compra:", error);
    res.status(500).json({ mensaje: "Error al renderizar la vista de crear compra" });
  }
};
const crearMultiplesCompras = async (req, res) => {
  const { cite, codigo, cantidad, producto, precio_unitario, costo_total, proveedor, fecha } = req.body;

  try {
    const usuarioId = req.session.usuarioId;
    console.log("usuarioId:", usuarioId, "tipo:", typeof usuarioId); // Verifica el tipo de usuarioId

    if (!usuarioId) {
      return res.status(401).json({ mensaje: "Usuario no autenticado" });
    }

    const usuario = await getRepository(Usuario).findOne({ where: { id: parseInt(usuarioId, 10) } }); // Asegúrate de que el ID sea un número
    if (!usuario) {
      console.error("Usuario no encontrado con ID:", usuarioId);
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

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
        fecha: new Date(fecha[i] + 'T00:00:00Z'),
        nusuario: usuario.nusuario,
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
  console.log("Entrando a editarCompra");
  const { id } = req.params;  
  const { cite, codigo, cantidad, producto, precio_unitario, costo_total, proveedor, fecha } = req.body;
  

  try {
    const compra = await getRepository(Compra).findOne({ where: { id: parseInt(id) } });
    if (!compra) {
      return res.status(404).json({ mensaje: "Compra no encontrada" });
    }

    if (typeof compra.fecha === 'string') {
      compra.fecha = new Date(compra.fecha);
    }

    //const usuario = await getRepository(Usuario).findOne(req.session.usuarioId); // Obtener el usuario logueado
    // Obtener el usuario logueado
    const usuarioId = req.session.usuarioId;
    console.log("usuarioId:", usuarioId, "tipo:", typeof usuarioId);
    const usuario = usuarioId ? await getRepository(Usuario).findOne({ where: { id: usuarioId } }) : null;
    console.log("usuario:", usuario);

    compra.cite = cite;
    compra.codigo = codigo;
    compra.cantidad = cantidad;
    compra.producto = producto;
    compra.precio_unitario = precio_unitario;
    compra.costo_total = costo_total;
    compra.proveedor = proveedor;
    compra.fecha = new Date(fecha)
    compra.nusuario = usuario.nusuario;

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

// Función para generar el reporte PDF con tabla y logo 
const generarReporte = async (req, res) => {
  const { tipo, fecha } = req.query;
  const compras = await getRepository(Compra).find();
  const fechaObj = new Date(fecha);
  if (isNaN(fechaObj)) {
    return res.status(400).json({ mensaje: "Fecha no válida" });
  }
  let comprasFiltradas;
  switch (tipo) {
    case 'diario':
      comprasFiltradas = compras.filter(compra => {
        const compraFecha = new Date(compra.fecha);
        return compraFecha.toDateString() === fechaObj.toDateString();
      });
      break;
    case 'mensual':
      comprasFiltradas = compras.filter(compra => {
        const compraFecha = new Date(compra.fecha);
        return compraFecha.getFullYear() === fechaObj.getFullYear() &&
               compraFecha.getMonth() === fechaObj.getMonth();
      });
      break;
      case 'anual':
      comprasFiltradas = compras.filter(compra => {
        const compraFecha = new Date(compra.fecha);
        return compraFecha.getFullYear() === fechaObj.getFullYear();
      });
      break;
    default:
      return res.status(400).json({ mensaje: "Tipo de reporte no válido" });
      }
      const doc = new PDFDocument({ size: 'legal', layout: 'landscape', margin: 40 });
      const filePath = path.join(__dirname, '../reports/reporte_compras.pdf');
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);
      const logoPath = path.join(__dirname, '../Public/Images/logo.png');
      try {
        doc.image(logoPath, 100, 30, { width: 45 });
      } catch (err) {
        console.error("Error cargando logo:", err);
      }
      doc.fontSize(20).font('Helvetica-Bold')
      .text('Caja Nacional de Salud', { align: 'center', underline: true });
      doc.moveDown(0.3);
      doc.fontSize(16).text('Reporte de Compras', { align: 'center' });
      doc.moveDown(1.5);
      const columnSpacing = 10;
      const columns = [
        { title: 'Cite', width: 80, align: 'left' },
        { title: 'Código', width: 80, align: 'left' },
        { title: 'Cantidad', width: 70, align: 'center' },
        { title: 'Producto', width: 160, align: 'left' },
        { title: 'Precio Unitario', width: 90, align: 'right' },
        { title: 'Costo Total', width: 90, align: 'right' },
        { title: 'Proveedor', width: 130, align: 'left' },
        { title: 'Fecha', width: 90, align: 'center' },
      ];
      const startX = doc.page.margins.left;
      let startY = 100;
      const totalWidth = columns.reduce((acc, c) => acc + c.width, 0) + columnSpacing * (columns.length - 1);
      doc.rect(startX - 2, startY - 4, totalWidth + 4, 22)
        .fill('#004610');
      doc.fillColor('white').font('Helvetica-Bold').fontSize(10);
      let x = startX;
      columns.forEach(col => {
        doc.text(col.title, x, startY, { width: col.width - columnSpacing, align: 'center' });
        x += col.width + columnSpacing;
      });
      doc.strokeColor('white').moveTo(startX - 2, startY + 18).lineTo(startX - 2 + totalWidth + 4, startY + 18).stroke();
      doc.fillColor('black').strokeColor('black');
      startY += 25;
      doc.font('Helvetica').fontSize(9);
      const drawRowLine = (y) => {
        doc.moveTo(startX - 2, y).lineTo(startX - 2 + totalWidth + 4, y).strokeColor('#bbbbbb').stroke();
        doc.strokeColor('black');
      };
      const maxY = doc.page.height - doc.page.margins.bottom - 30;
  for (let compra of comprasFiltradas) {
    if (startY > maxY) {
      doc.addPage();
      startY = doc.page.margins.top;
      doc.rect(startX - 2, startY - 4, totalWidth + 4, 22)
        .fill('#004610');
      doc.fillColor('white').font('Helvetica-Bold').fontSize(10);
      let xHead = startX;
      columns.forEach(col => {
        doc.text(col.title, xHead, startY, { width: col.width - columnSpacing, align: 'center' });
        xHead += col.width + columnSpacing;
      });
      doc.strokeColor('white').moveTo(startX - 2, startY + 18).lineTo(startX - 2 + totalWidth + 4, startY + 18).stroke();
      doc.fillColor('black').strokeColor('black');
      startY += 25;
      doc.font('Helvetica').fontSize(9);
    }
    let xRow = startX;
    let cantidad = compra.cantidad;
    let precioUnitario = parseFloat(compra.precio_unitario);
    let costoTotal = parseFloat(compra.costo_total);
    let fechaCompra = new Date(compra.fecha).toLocaleDateString();
    if (isNaN(precioUnitario)) precioUnitario = 0;
    if (isNaN(costoTotal)) costoTotal = 0;
    doc.text(compra.cite || '', xRow, startY, { width: columns[0].width - columnSpacing, align: columns[0].align });
    xRow += columns[0].width + columnSpacing;
    doc.text(compra.codigo || '', xRow, startY, { width: columns[1].width - columnSpacing, align: columns[1].align });
    xRow += columns[1].width + columnSpacing;
    doc.text(cantidad != null ? cantidad.toString() : '', xRow, startY, { width: columns[2].width - columnSpacing, align: columns[2].align });
    xRow += columns[2].width + columnSpacing;
    doc.text(compra.producto || '', xRow, startY, { width: columns[3].width - columnSpacing, align: columns[3].align });
    xRow += columns[3].width + columnSpacing;
    doc.text(precioUnitario.toFixed(2), xRow, startY, { width: columns[4].width - columnSpacing, align: columns[4].align });
    xRow += columns[4].width + columnSpacing;
    doc.text(costoTotal.toFixed(2), xRow, startY, { width: columns[5].width - columnSpacing, align: columns[5].align });
    xRow += columns[5].width + columnSpacing;
    doc.text(compra.proveedor || '', xRow, startY, { width: columns[6].width - columnSpacing, align: columns[6].align });
    xRow += columns[6].width + columnSpacing;
    doc.text(fechaCompra, xRow, startY, { width: columns[7].width - columnSpacing, align: columns[7].align });
    drawRowLine(startY + 18);
    startY += 22;
  }
  doc.end();
  writeStream.on('finish', () => {
    res.download(filePath, 'reporte_compras.pdf', (err) => {
      if (err) {
        console.error("Error al enviar el archivo PDF:", err);
        res.status(500).json({ mensaje: "Error al enviar el archivo PDF" });
      }
    });
  });
  writeStream.on('error', (error) => {
    console.error("Error al crear el archivo PDF:", error);
    res.status(500).json({ mensaje: "Error al crear el archivo PDF" });
  });
};







/*const generarReporte = async (req, res) => {
  const { tipo, fecha } = req.query;
  const compras = await getRepository(Compra).find();
  const fechaObj = new Date(fecha);
  if (isNaN(fechaObj)) {
    return res.status(400).json({ mensaje: "Fecha no válida" });
  }
  let comprasFiltradas;
  switch (tipo) {
    case 'diario':
      comprasFiltradas = compras.filter(compra => {
        const compraFecha = new Date(compra.fecha);
        return compraFecha.toDateString() === fechaObj.toDateString();
      });
      break;
    case 'mensual':
      comprasFiltradas = compras.filter(compra => {
        const compraFecha = new Date(compra.fecha);
        return compraFecha.getFullYear() === fechaObj.getFullYear() &&
               compraFecha.getMonth() === fechaObj.getMonth();
      });
      break;
    case 'anual':
      comprasFiltradas = compras.filter(compra => {
        const compraFecha = new Date(compra.fecha);
        return compraFecha.getFullYear() === fechaObj.getFullYear();
      });
      break;
      default:
      return res.status(400).json({ mensaje: "Tipo de reporte no válido" });
      }
      const doc = new PDFDocument({ size: 'legal', layout: 'landscape', margin: 40 });
      const filePath = path.join(__dirname, '../reports/reporte_compras.pdf');
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);
      const logoPath = path.join(__dirname, '../Public/Images/logo.png');
      try {
        doc.image(logoPath, 100, 30, { width: 45 });
      } catch (err) {
        console.error("Error cargando logo:", err);
      }
      doc.fontSize(20).font('Helvetica-Bold')
        .text('Caja Nacional de Salud', { align: 'center', underline: true });
      doc.moveDown(0.3);
      doc.fontSize(16).text('Reporte de Compras', { align: 'center' });
      doc.moveDown(1.5);
    // Espaciado en puntos (~1 cm = 28.35 pts, usar 10 pts para separación visual)
      const columnSpacing = 10;
      const columns = [
        { title: 'Cite', width: 80, align: 'left' },
        { title: 'Código', width: 80, align: 'left' },
        { title: 'Cantidad', width: 70, align: 'center' },
        { title: 'Producto', width: 160, align: 'left' },
        { title: 'Precio Unitario', width: 90, align: 'right' },
        { title: 'Costo Total', width: 90, align: 'right' },
        { title: 'Proveedor', width: 130, align: 'left' },
        { title: 'Fecha', width: 90, align: 'center' },
      ];
      const startX = doc.page.margins.left;
      let startY = 100;
      // Dibujar fondo encabezado considerando espacios entre columnas
      const totalWidth = columns.reduce((acc, c) => acc + c.width, 0) + columnSpacing * (columns.length -1);
      doc.rect(startX - 2, startY - 4, totalWidth + 4, 22)
        .fill('#004610');
      doc.fillColor('white').font('Helvetica-Bold').fontSize(10);
      let x = startX;
      
      
      columns.forEach(col => {
         
    // Reducir el ancho en columnSpacing al escribir texto para que quede espacio entre columnas
    doc.text(
      col.title,
      x,
      startY,
      {
        width: col.width - columnSpacing,
        align: 'center' // headers centered per user previous request
      }
    );
    x += col.width + columnSpacing;
  });

  // Línea bajo encabezado
  // doc.moveTo(startX - 2, startY + 18).lineTo(startX - 2 + totalWidth + 4, startY + 18).stroke();
  startY += 25;
  
  doc.strokeColor('white').moveTo(startX - 2, startY + 18).lineTo(startX - 2 + totalWidth + 4, startY + 18).stroke();
// Reset fill and stroke colors for body rows
doc.fillColor('black').strokeColor('black');

  
  
  
  
  
  
  
  
  doc.font('Helvetica').fontSize(9);
  const drawRowLine = (y) => {
    doc.moveTo(startX - 2, y).lineTo(startX - 2 + totalWidth + 4, y).strokeColor('#bbbbbb').stroke();
    doc.strokeColor('black');
  };
  const maxY = doc.page.height - doc.page.margins.bottom - 30;
  for (let compra of comprasFiltradas) {
    if (startY > maxY) {
      doc.addPage();
      startY = doc.page.margins.top;
      // Repetir encabezado en nueva página con espacios
      doc.rect(startX - 2, startY - 4, totalWidth + 4, 22)
        .fill('#eeeeee');
      doc.fillColor('black').font('Helvetica-Bold').fontSize(10);
      let xHead = startX;
      columns.forEach(col => {
        doc.text(
          col.title,
          xHead,
          startY,
          { width: col.width - columnSpacing, align: 'center' }
        );
        xHead += col.width + columnSpacing;
      });
      doc.moveTo(startX - 2, startY + 18).lineTo(startX - 2 + totalWidth + 4, startY + 18).stroke();
      startY += 25;
      doc.font('Helvetica').fontSize(9);
    }
    let xRow = startX;
    let cantidad = compra.cantidad;
    let precioUnitario = parseFloat(compra.precio_unitario);
    let costoTotal = parseFloat(compra.costo_total);
    let fechaCompra = new Date(compra.fecha).toLocaleDateString();
    if (isNaN(precioUnitario)) precioUnitario = 0;
    if (isNaN(costoTotal)) costoTotal = 0;
    doc.text(compra.cite || '', xRow, startY, { width: columns[0].width - columnSpacing, align: columns[0].align });
    xRow += columns[0].width + columnSpacing;
    doc.text(compra.codigo || '', xRow, startY, { width: columns[1].width - columnSpacing, align: columns[1].align });
    xRow += columns[1].width + columnSpacing;
    doc.text(cantidad != null ? cantidad.toString() : '', xRow, startY, { width: columns[2].width - columnSpacing, align: columns[2].align });
    xRow += columns[2].width + columnSpacing;
    doc.text(compra.producto || '', xRow, startY, { width: columns[3].width - columnSpacing, align: columns[3].align });
    xRow += columns[3].width + columnSpacing;
    doc.text(precioUnitario.toFixed(2), xRow, startY, { width: columns[4].width - columnSpacing, align: columns[4].align });
    xRow += columns[4].width + columnSpacing;
    doc.text(costoTotal.toFixed(2), xRow, startY, { width: columns[5].width - columnSpacing, align: columns[5].align });
    xRow += columns[5].width + columnSpacing;
    doc.text(compra.proveedor || '', xRow, startY, { width: columns[6].width - columnSpacing, align: columns[6].align });
    xRow += columns[6].width + columnSpacing;
    doc.text(fechaCompra, xRow, startY, { width: columns[7].width - columnSpacing, align: columns[7].align });
    drawRowLine(startY + 18);
    startY += 22;
  }
  doc.end();
  writeStream.on('finish', () => {
    res.download(filePath, 'reporte_compras.pdf', (err) => {
      if (err) {
        console.error("Error al enviar el archivo PDF:", err);
        res.status(500).json({ mensaje: "Error al enviar el archivo PDF" });
      }
    });
  });
  writeStream.on('error', (error) => {
    console.error("Error al crear el archivo PDF:", error);
    res.status(500).json({ mensaje: "Error al crear el archivo PDF" });
  });
};*/












const obtenerProductosPorCodigo = async (req, res) => {
  const { codigo } = req.query;
  

  try {
    const productos = await getRepository(Producto).find({
      where: { codigo: Like(`%${codigo}%`) },
    });

    // Solo devolver el código y el detalle
    const productosResponse = productos.map(producto => ({
      codigo: producto.codigo,
      detalle: producto.detalle,
    }));

    res.json(productosResponse);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ mensaje: "Error al obtener productos" });
  }
};

const obtenerProductosPorNombre = async (req, res) => {
  const { nombre } = req.query;

  try {
    const productos = await getRepository(Producto).find({
      where: { detalle: Like(`%${nombre}%`) },
    });

    // Solo devolver el código y el detalle
    const productosResponse = productos.map(producto => ({
      codigo: producto.codigo,
      detalle: producto.detalle,
    }));

    res.json(productosResponse);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ mensaje: "Error al obtener productos" });
  }
};

const obtenerProveedoresPorNombre = async (req, res) => {
  const { nombre } = req.query;
  try {
    const proveedores = await getRepository(Proveedor).find({
      where: { empresa: Like(`%${nombre}%`) },
    });
    // Solo devolver el nombre de la empresa
    const proveedoresResponse = proveedores.map(proveedor => ({
      empresa: proveedor.empresa,
    }));
    res.json(proveedoresResponse);
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    res.status(500).json({ mensaje: "Error al obtener proveedores" });
  }
};

module.exports = {
  obtenerCompras,
  crearCompra,
  crearMultiplesCompras,
  editarCompra,
  eliminarCompra,
  generarReporte,
  obtenerProductosPorCodigo,
  obtenerProductosPorNombre,
  obtenerProveedoresPorNombre,
};
