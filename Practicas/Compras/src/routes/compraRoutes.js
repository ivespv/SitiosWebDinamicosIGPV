// src/Routes/compraRoutes.js
const express = require("express");
const router = express.Router();
const { getRepository } = require("typeorm");
const { Compra } = require("../entity/Compra");
const authMiddleware = require("../middleware/authMiddleware");
const controlador = require("../controller/compraController");

router.use(authMiddleware);

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
    cantidad: parseInt(cantidad, 10), 
    producto,
    precio_unitario: parseFloat(precio_unitario), 
    costo_total: parseFloat(costo_total), 
    fecha: new Date(fecha), 
  });
  await getRepository(Compra).save(nuevaCompra);
  res.redirect("/compras");
});


router.get("/editarMultiples", async (req, res) => {
  const { comprasIds } = req.query; 
  if (!comprasIds) {
    return res.redirect("/compras"); 
  }

  
  const ids = Array.isArray(comprasIds) ? comprasIds : [comprasIds];

  
  const compras = await getRepository(Compra).findByIds(ids);
  res.render("compras/editarMultiples", { compras }); 
});

router.post("/editarMultiples", async (req, res) => {
  
  console.log("Datos recibidos para guardar múltiples compras:", req.body);

  
  const compraIds = Object.keys(req.body).filter(key => key.startsWith("cite-")); 
  const errores = [];
  console.log("IDs de compras a actualizar:", compraIds); 

  try {
      for (const id of compraIds) {
          const compraId = id.split("-")[1]; 
          console.log("Buscando compra con ID:", compraId); 
          
          
          const compra = await getRepository(Compra).findOne({ where: { id: parseInt(compraId, 10) } });
          
          
          if (compra && typeof compra.fecha === 'string') {
            compra.fecha = new Date(compra.fecha); 
        }
          
          if (compra) {
              compra.cite = req.body[`cite-${compraId}`];
              compra.codigo = req.body[`codigo-${compraId}`];
              compra.cantidad = parseInt(req.body[`cantidad-${compraId}`], 10); // Convertir a número
              compra.producto = req.body[`producto-${compraId}`];
              compra.precio_unitario = parseFloat(req.body[`precio_unitario-${compraId}`]); // Convertir a número
              compra.costo_total = parseFloat(req.body[`costo_total-${compraId}`]); // Convertir a número
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
        return res.render("compras/editarMultiples", { compras, errores });
      }
      res.redirect("/compras"); 
  } catch (error) {
      console.error("Error al guardar múltiples compras:", error.message);
      res.status(500).send("Error al guardar múltiples compras: " + error.message);
  }
});

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


router.post("/editar/:id", controlador.editarCompra);

module.exports = router;