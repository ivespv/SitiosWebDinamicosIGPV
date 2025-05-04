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

  // Definir el ancho total y el número de columnas
  const totalWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const columns = [
    { title: 'Cite', width: 100 },
    { title: 'Código', width: 100 },
    { title: 'Cantidad', width: 100 },
    { title: 'Producto', width: 200 },
    { title: 'Precio Unitario', width: 100 },
    { title: 'Costo Total', width: 100 },
    { title: 'Proveedor', width: 100 },
    { title: 'Fecha', width: 100 }
  ];

   // Calcular la posición inicial
  let x = doc.page.margins.left;
  const rowHeight = 20;

  // Dibujar encabezados
  columns.forEach(column => {
    doc.fontSize(10).text(column.title, x, 100, { width: column.width });
    x += column.width;
  });
  doc.moveDown();

  // Dibujar filas de datos
  comprasFiltradas.forEach(compra => {
    x = doc.page.margins.left; // Reiniciar la posición x para cada fila
    const precioUnitario = parseFloat(compra.precio_unitario);
    const costoTotal = parseFloat(compra.costo_total);
    const fechaCompra = new Date(compra.fecha).toLocaleDateString();

    // Verifica si los valores son números válidos
    if (isNaN(precioUnitario) || isNaN(costoTotal)) {
      console.error(`Error en los datos de compra: ${JSON.stringify(compra)}`);
      return; // Salir de la iteración si hay un error
    }

     // Dibuja cada fila de datos
     doc.text(compra.cite, x, doc.y);
     x += columns[0].width;
     doc.text(compra.codigo, x, doc.y);
     x += columns[1].width;
     doc.text(compra.cantidad.toString(), x, doc.y);
     x += columns[2].width;
     doc.text(compra.producto, x, doc.y);
     x += columns[3].width;
     doc.text(precioUnitario.toFixed(2), x, doc.y);
     x += columns[4].width;
     doc.text(costoTotal.toFixed(2), x, doc.y);
     x += columns[5].width;
     doc.text(compra.proveedor, x, doc.y);
     x += columns[6].width;
     doc.text(fechaCompra, x, doc.y);
     doc.moveDown(rowHeight); // Mover hacia abajo para la siguiente fila
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
