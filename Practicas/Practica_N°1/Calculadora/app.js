const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
 
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.post('/calcular', (req, res) => {
    const { a, b, operacion } = req.body;
    let resultado;

    const numA = parseFloat(a);
    const numB = parseFloat(b);

    switch (operacion) {
        case 'sumar':
            resultado = numA + numB;
            break;
        case 'restar':
            resultado = numA - numB;
            break;
        case 'multiplicar':
            resultado = numA * numB;
            break;
        case 'dividir':
            resultado = numB !== 0 ? numA / numB : 'Error: División por cero';
            break;
        default:
            resultado = 'Operación no válida';
    }

        res.send(`El resultado de ${operacion} ${numA} y ${numB} es: ${resultado}`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});