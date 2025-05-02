const express = require("express");
const router = express.Router();
const { getRepository, In } = require("typeorm");
const { Compra } = require("../entity/Compra");
const authMiddleware = require("../middleware/authMiddleware");
const compraController = require('../controller/compraController');

router.use(authMiddleware);

// Ruta para mostrar todas las compras
router.get("/", async (req, res) => {
  try {
    await compraController.obtenerCompras(req, res);
  } catch (error) {
    console.error("Error al obtener compras:", error);
    res.status(500).send("Error al obtener compras");
  }
});

// Ruta para mostrar la página de crear compra con usuario
router.get("/crear", compraController.crearCompra);

// Ruta para crear múltiples compras
router.post("/crear-multiples", async (req, res) => {
  try {
    await compraController.crearMultiplesCompras(req, res);
  } catch (error) {
    console.error("Error al crear múltiples compras:", error);
    res.status(500).send("Error al crear múltiples compras");
  }
});

// Ruta para crear una compra individual
router.post("/crear", async (req, res) => {
  try {
    const { cite, codigo, cantidad, producto, precio_unitario, costo_total, proveedor, fecha } = req.body;
    const nuevaCompra = getRepository(Compra).create({
      cite,
      codigo,
      cantidad: parseInt(cantidad, 10), 
      producto,
      precio_unitario: parseFloat(precio_unitario),
      costo_total: parseFloat(costo_total), 
      proveedor,
      fecha: new Date(fecha), 
    });
    await getRepository(Compra).save(nuevaCompra);
    res.redirect("/compras");
  } catch (error) {
    console.error("Error al crear compra:", error);
    res.status(500).send("Error al crear compra");
  }
});

// NUEVA RUTA: Mostrar la página de edición de una compra
router.get("/editar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const compra = await getRepository(Compra).findOne({ where: { id: parseInt(id) } });
    if (!compra) {
      return res.status(404).send("Compra no encontrada");
    }
    const usuarioId = req.session.usuarioId;
    const usuario = usuarioId ? await getRepository('Usuario').findOne({ where: { id: usuarioId } }) : null;
    res.render("compras/editar", { compra, usuario });
  } catch (error) {
    console.error("Error al mostrar la página de edición:", error);
    res.status(500).send("Error al mostrar la página de edición");
  }
});

// Ruta para mostrar la página para editar múltiples compras
/*router.get("/editar", async (req, res) => {
  const { comprasIds } = req.query; 
  if (!comprasIds) {
    return res.redirect("/compras");
  }

  const ids = Array.isArray(comprasIds) ? comprasIds : [comprasIds];

  try {
    const compras = await getRepository(Compra).findByIds(ids);
    res.render("compras/editarMultiples", { compras, usuario: req.session.usuario }); // Pasar usuario si es necesario
  } catch (error) {
    console.error("Error al obtener compras para editar:", error);
    res.status(500).send("Error al obtener compras para editar");
  }
});*/

// Ruta para editar múltiples compras
/*router.post("/editarMultiples", async (req, res) => {
  const compraIds = Object.keys(req.body).filter(key => key.startsWith("cite-")); 
  const errores = [];

  try {
    for (const id of compraIds) {
      const compraId = id.split("-")[1];
      const compra = await getRepository(Compra).findOne({ where: { id: parseInt(compraId, 10) } });

      if (compra && typeof compra.fecha === 'string') {
        compra.fecha = new Date(compra.fecha);
      }

      if (compra) {
        compra.cite = req.body[`cite-${compraId}`];
        compra.codigo = req.body[`codigo-${compraId}`];
        compra.cantidad = parseInt(req.body[`cantidad-${compraId}`], 10);
        compra.producto = req.body[`producto-${compraId}`];
        compra.precio_unitario = parseFloat(req.body[`precio_unitario-${compraId}`]);
        compra.costo_total = parseFloat(req.body[`costo_total-${compraId}`]);
        compra.proveedor = req.body[`proveedor-${compraId}`];
        const fecha = new Date(req.body[`fecha-${compraId}`]);

        if (isNaN(fecha.getTime())) {
          errores.push("Fecha inválida para la compra ID: " + compraId);
          continue;
        }
        compra.fecha = fecha;

        if (!compra.cite || !compra.codigo || !compra.producto || isNaN(compra.cantidad) || isNaN(compra.precio_unitario) || isNaN(compra.costo_total)) {
          errores.push("Datos de compra inválidos para la compra ID: " + compraId);
          continue;
        }

        await getRepository(Compra).save(compra);
      } else {
        console.error("Compra no encontrada con ID:", compraId);
      }
    }
    if (errores.length > 0) {
      const compras = await getRepository(Compra).findByIds(compraIds.map(id => id.split("-")[1]));
      return res.render("compras/editarMultiples", { compras, errores, usuario: req.session.usuario });
    }
    res.redirect("/compras");
  } catch (error) {
    console.error("Error al guardar múltiples compras:", error.message);
    res.status(500).send("Error al guardar múltiples compras: " + error.message);
  }
});*/

// Ruta para eliminar múltiples compras
router.post("/eliminar-multiples", async (req, res) => {
  const { comprasIds } = req.body;
  if (!comprasIds) {
    return res.redirect("/compras");
  }

  const ids = Array.isArray(comprasIds) ? comprasIds : [comprasIds];

  try {
    await getRepository(Compra).delete(ids);
    res.redirect("/compras");
  } catch (error) {
    console.error("Error al eliminar compras:", error);
    res.status(500).send("Error al eliminar compras");
  }
});

// Ruta para generar reporte
router.get("/reporte", async (req, res) => {
  try {
    await compraController.generarReporte(req, res);
  } catch (error) {
    console.error("Error al generar reporte:", error);
    res.status(500).send("Error al generar reporte");
  }
});

// Ruta para editar compra individual
router.post("/editar/:id", async (req, res) => {
  try {
    await compraController.editarCompra(req, res);
  } catch (error) {
    console.error("Error al editar compra:", error);
    res.status(500).send("Error al editar compra");
  }
});

// Rutas para obtener productos por código o nombre
router.get("/productos", async (req, res) => {
  try {
    await compraController.obtenerProductosPorCodigo(req, res);
  } catch (error) {
    console.error("Error al obtener productos por código:", error);
    res.status(500).send("Error al obtener productos por código");
  }
});

router.get("/productos/nombre", async (req, res) => {
  try {
    await compraController.obtenerProductosPorNombre(req, res);
  } catch (error) {
    console.error("Error al obtener productos por nombre:", error);
    res.status(500).send("Error al obtener productos por nombre");
  }
});

module.exports = router;
