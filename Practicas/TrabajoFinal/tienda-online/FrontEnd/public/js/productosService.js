async function getEquipos() {
    try {
        const res = await fetch("http://localhost:4000/productos");
        
        // Verificar si la respuesta es exitosa
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const resjson = await res.json();
        return resjson; 
    } catch (error) {
        console.error("Error al obtener los equipos:", error);
        throw error; // Opcional: volver a lanzar el error si deseas manejarlo más arriba
    }
}

