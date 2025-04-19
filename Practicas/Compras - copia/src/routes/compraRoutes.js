// src/Routes/compraRoutes.js
const express = require("express");
const router = express.Router();
const { getRepository } = require("typeorm");
const { Compra } = require("../entity/Compra");
const controlador = require("../controller/compraController");

router.get("/", async (req, res) => {
  controlador.obtenerCompras(req, res);
});

// Página para crear una compra
router.get("/crear", (req, res) => {
  res.render("compras/crear");
});

router.post("/crear-multiples", async (req, res) => {
  await controlador.crearMultiplesCompras(req, res);
});

router.post("/crear", async (req, res) => {
  const { cite, codigo, cantidad, producto, precio_unitario, costo_total, fecha } = req.body;
  const nuevaCompra = getRepository(Compra).create({
    cite,
    codigo,
    cantidad: parseInt(cantidad, 10), // Convertir a número
    producto,
    precio_unitario: parseFloat(precio_unitario), // Convertir a número
    costo_total: parseFloat(costo_total), // Convertir a número
    fecha: new Date(fecha), // Asegúrate de que la fecha sea un objeto Date
  });
  await getRepository(Compra).save(nuevaCompra);
  res.redirect("/compras");
});

// Página para editar múltiples compras
router.get("/editarMultiples", async (req, res) => {
  const { comprasIds } = req.query; // Obtener los IDs de las compras seleccionadas
  if (!comprasIds) {
    return res.redirect("/compras"); // Redirigir si no hay IDs seleccionados
  }

  // Convertir los IDs a un array si es necesario
  const ids = Array.isArray(comprasIds) ? comprasIds : [comprasIds];

  // Obtener las compras seleccionadas
  const compras = await getRepository(Compra).findByIds(ids);
  res.render("compras/editarMultiples", { compras }); // Renderizar la vista para editar múltiples compras
});

router.post("/editarMultiples", async (req, res) => {
  // Imprimir los datos recibidos para depuración
  console.log("Datos recibidos para guardar múltiples compras:", req.body);

  // Filtrar los campos que comienzan con "cite-"
  const compraIds = Object.keys(req.body).filter(key => key.startsWith("cite-")); 
  const errores = []; // Array para almacenar errores
  console.log("IDs de compras a actualizar:", compraIds); // Imprimir los IDs filtrados

  try {
      for (const id of compraIds) {
          const compraId = id.split("-")[1]; // Obtener el ID de la compra
          console.log("Buscando compra con ID:", compraId); // Imprimir el ID que se busca
          
          // Buscar la compra usando un objeto de condiciones
          const compra = await getRepository(Compra).findOne({ where: { id: parseInt(compraId, 10) } });
          
          // Asegúrate de que la fecha sea un objeto Date
          if (compra && typeof compra.fecha === 'string') {
            compra.fecha = new Date(compra.fecha); // Convertir a objeto Date si es un string
        }
          
          if (compra) {
              // Actualizar los campos de la compra
              compra.cite = req.body[`cite-${compraId}`];
              compra.codigo = req.body[`codigo-${compraId}`];
              compra.cantidad = parseInt(req.body[`cantidad-${compraId}`], 10); // Convertir a número
              compra.producto = req.body[`producto-${compraId}`];
              compra.precio_unitario = parseFloat(req.body[`precio_unitario-${compraId}`]); // Convertir a número
              compra.costo_total = parseFloat(req.body[`costo_total-${compraId}`]); // Convertir a número
              const fecha = new Date(req.body[`fecha-${compraId}`]);
              
              // Validar la fecha
              if (isNaN(fecha.getTime())) {
                errores.push("Fecha inválida para la compra ID: " + compraId);
                continue; // Saltar a la siguiente compra
              }
              compra.fecha = fecha; // Asegúrate de que la fecha sea un objeto Date

              // Validar datos antes de guardar
              if (!compra.cite || !compra.codigo || !compra.producto || isNaN(compra.cantidad) || isNaN(compra.precio_unitario) || isNaN(compra.costo_total)) {
                errores.push("Datos de compra inválidos para la compra ID: " + compraId);
                continue; // Saltar a la siguiente compra
              }

              // Guardar los cambios en la base de datos
              await getRepository(Compra).save(compra);
          } else {
              console.error("Compra no encontrada con ID:", compraId);
          }
      }
      if (errores.length > 0) {
        // Renderizar la vista de editarMultiples con errores
        const compras = await getRepository(Compra).findByIds(compraIds.map(id => id.split("-")[1]));
        return res.render("compras/editarMultiples", { compras, errores });
      }
      res.redirect("/compras"); // Redirigir a la lista de compras después de guardar
  } catch (error) {
      console.error("Error al guardar múltiples compras:", error.message);
      res.status(500).send("Error al guardar múltiples compras: " + error.message);
  }
});

// Eliminar múltiples compras
router.post("/eliminar-multiples", async (req, res) => {
  const { comprasIds } = req.body; // Asegúrate de que el nombre coincida con el del formulario
  if (!comprasIds) {
    return res.redirect("/compras"); // Si no hay IDs seleccionados, redirige
  }

  // Asegúrate de que comprasIds sea un array
  const ids = Array.isArray(comprasIds) ? comprasIds : [comprasIds];

  try {
    await getRepository(Compra).delete(ids); // Eliminar las compras seleccionadas
    res.redirect("/compras");
  } catch (error) {
    console.error("Error al eliminar compras:", error);
    res.status(500).send("Error al eliminar compras");
  }
});

// Actualizar una compra individual (si es necesario)
router.post("/editar/:id", controlador.editarCompra);

module.exports = router;