const express = require('express');
const app = express();
const port =3000;

app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) =>{
    res.send(`
        <form method="POST" action="/calcular">
            <label for="num1">Número 1:</label>
            <input type="number" id="num1" name="num1"
            <br>
            <label for="num2">Número 2:</label>
            <input type="number" id="num2" name="num2"
            <br>
            <button type="submit">Calcular Suma</button>
        </form>
    `);
});
app.post('/calcular',(req, res) =>{
    const num1 = parseInt(req.body.num1);
    const num2 = parseInt(req.body.num2);
    const suma = num1 + num2;
    res.send(`El resultado de la suma es ${num1} y ${num2} es: ${suma} `)
});
app.listen(port, () => {
    console.log(`servidor en el puerto ${port}`)
});
