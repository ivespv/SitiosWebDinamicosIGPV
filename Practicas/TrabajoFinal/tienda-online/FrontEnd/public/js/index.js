const contenedorTarjetas = document.getElementById("productos-container");

function crearTarjetasProductosInicio(productos){
  productos.forEach(producto => {
    const nuevoEquipo = document.createElement("div");
    nuevoEquipo.classList = "tarjeta-producto";
    nuevoEquipo.innerHTML = `
      <img src="${producto.imagen}">
      <h3>${producto.nombre}</h3>
      <p>$${producto.precio}</p>
      <p>$${producto.detalle}</p>
      <button>Agregar al carrito</button>
    `
    contenedorTarjetas.appendChild(nuevoEquipo);
    nuevoEquipo.getElementsByTagName("button")[0].addEventListener("click",()=> agregarAlCarrito(producto))
  });
}

getEquipos().then(equipos => {
  crearTarjetasProductosInicio(equipos);
})


