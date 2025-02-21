function AgregarCarrito(productoc) {
    const memoria = localStorage.getItem('equipos');
    let productos = memoria ? JSON.parse(memoria) : [];

    const productoExistente = productos.find(prod => prod.id === productoc.id);
    
    if (productoExistente) {
        // Si el producto ya existe, solo incrementa la cantidad
        productoExistente.cantidad += 1;
    } else {
        // Si no existe, agrega el nuevo producto
        productoc.cantidad = 1;
        productos.push(productoc);
    }

    localStorage.setItem("equipos", JSON.stringify(productos));
}