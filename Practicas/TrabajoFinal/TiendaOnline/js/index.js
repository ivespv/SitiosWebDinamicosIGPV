const contenedorTarjetas = document.getElementById("productos-container");

/** Crea las tarjetas de productos teniendo en cuenta la lista en equipos.js */
function crearTarjetasProductosInicio(productos) {
  productos.forEach(producto => {
    const equipo = document.createElement("div");
    equipo.classList = "tarjeta-producto";
    equipo.innerHTML = `
      <img src="./img/productos/${producto.id}.jpg" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p class="precio">$${producto.precio}</p>
      <button>Agregar al carrito</button>`;
    
    // Agregar el evento de clic para redirigir a la página de detalles del producto
    equipo.addEventListener("click", () => {
      window.location.href = `detalle_producto.html?id=${producto.id}`;
    });

    contenedorTarjetas.appendChild(equipo);
    
    // Agregar el evento de clic para agregar al carrito
    equipo.getElementsByTagName("button")[0].addEventListener("click", (event) => {
      event.stopPropagation(); // Evitar que el clic en el botón redirija a la página de detalles
      agregarAlCarrito(producto);
    });
  });
}

crearTarjetasProductosInicio(equipos);