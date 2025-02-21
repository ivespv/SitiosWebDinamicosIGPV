document.addEventListener("DOMContentLoaded", () => {
    const contenedorTarjetas = document.getElementById("Productos-Container");

    function CrearTarjetasProductosInicio(productos) {
        if (!productos || productos.length === 0) {
            console.log("No hay productos para mostrar.");
            return;
        }

        productos.forEach(producto => {
            const nuevoEquipo = document.createElement("div");
            nuevoEquipo.classList = "tarjeta-producto";
            nuevoEquipo.innerHTML = `
                <img src="./Imagenes/${producto.id}.jpg"> 
                <h3>${producto.nombre}</h3>
                <p>$${producto.precio}</p>
                <button>Agregar al carrito</button>
            `;

            contenedorTarjetas.appendChild(nuevoEquipo);
            
            // Agregar evento al botón
            nuevoEquipo.getElementsByTagName("button")[0].addEventListener("click", () => AgregarCarrito(producto));
        });
    }

    // Llama a la función con los productos inyectados
    CrearTarjetasProductosInicio(productos);
});
