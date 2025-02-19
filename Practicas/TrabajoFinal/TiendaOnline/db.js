const mysql = require('mysql2');

// Configurar la conexión
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tienda_online'
});

// Conectar a la base de datos
connection.connect((error) => {
    if (error) {
        console.log('Error al conectar a la base de datos');
        return;
    }
    console.log('Conectado a la base de datos');
});

module.exports = connection;