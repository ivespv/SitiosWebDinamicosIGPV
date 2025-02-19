const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // Asegúrate de que tu archivo db.js esté configurado correctamente

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));  // Para poder leer los datos de un formulario

app.set('view engine', 'ejs'); // Configurar EJS como motor de plantillas
app.use(express.static('public')); // Servir archivos estáticos

// Ruta para la página principal
app.get('/', (req, res) => {
    // Hacer una consulta a la base de datos para obtener los productos
    db.query('SELECT * FROM productos', (error, results) => {
        if (error) {
            return res.status(500).send('Error al obtener productos');
        }
        // Renderiza index.ejs y pasa los datos
        res.render('index', { productos: results });
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});