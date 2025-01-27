const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send(`
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
            }
            h1 {
                text-align: center;
                color: #333;
            }
            form {
                max-width: 400px;
                margin: 0 auto;
                padding: 20px;
                background: #fff;
                border-radius: 5px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
            }
            input[type="number"], select {
                width: 100%;
                padding: 10px;
                margin-bottom: 15px;
                border: 1px solid #ccc;
                border-radius: 4px;
            }
            .btn {
                background-color: #28a745;
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                width: 100%;
            }
            .btn:hover {
                background-color: #218838;
            }
        </style>
        <h1>Calculadora</h1>
        <form action="/calcular" method="POST">
            <label for="a">Primer Valor</label><br><br>
            <input type="number"  id="a" name="a" required><br><br>
            <label for="b">Segundo Valor</label><br><br>
            <input type="number" id="b" name="b" required><br><br>
            <label for="operacion">Selecciones Tipo de Operación:</label><br><br>
            <select id="operacion" name="operacion" required>
                <option value="sumar">Sumar</option>
                <option value="restar">Restar</option>
                <option value="multiplicar">Multiplicar</option>
                <option value="dividir">Dividir</option>
            </select>
            <br><br>
            <button class="btn" type="submit">Calcular</button>
        </form>
    `);
});

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
    res.send(`
         <style>
            body {
                font-family: Arial, sans-serif;
                background-color:rgb(231, 231, 231);
                margin: 0;
                padding: 20px;
            }
            h1 {
                text-align: center;
                color: #333;
            }
            a {
                text-align: center;
                color: #333;
            }
            div {
                max-width: 400px;
                margin: 0 auto;
                padding: 20px;
                background: #fff;
                border-radius: 5px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
        </style>
        <h1>Resultado</h1>
        <div>
            <p>El resultado de ${operacion} ${numA} y ${numB} es: ${resultado}</>
            <br><br>
            <a href="/">Volver a la página inicial</a>
        </div>    
    `);
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});