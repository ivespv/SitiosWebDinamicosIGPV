document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = parseInt(urlParams.get("id"));
    const producto = equipos.find(equipo => equipo.id === productoId);

    if (producto) {
        document.getElementById("producto-imagen").src = `./img/productos/${producto.id}.jpg`;
        document.getElementById("producto-nombre").innerText = producto.nombre;
        document.getElementById("producto-precio").innerText = `$${producto.precio}`;
        document.getElementById("producto-detalle").innerText = producto.detalle;

        document.getElementById("agregar-carrito").addEventListener("click", () => {
            agregarAlCarrito(producto);
            alert("Producto agregado al carrito");
        });
    } else {
        document.getElementById("detalle-producto-container").innerHTML = "<p>Producto no encontrado.</p>";
    }
});