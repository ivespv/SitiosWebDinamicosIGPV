
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const Cliente = require('./models/Cliente');

const app = express();

// Configuración
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // Para soportar PUT y DELETE

app.set('view engine', 'ejs');


// Conexión a MongoDB
mongoose.connect('mongodb://167.179.100.51:27017/RCliente', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
/*mongoose.connect('mongodb://127.0.0.1:27017/RCliente', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})*/
.then(() => {
    console.log('Conexión a MongoDB establecida');
})
.catch(err => {
    console.error('Error de conexión a MongoDB:', err);
});


// Rutas
app.get('/', async (req, res) => {
    const consulta = req.query.ci;
    if (consulta) {
        const clientes = await Cliente.find({ ci: consulta} );
        return res.render('index', { clientes });
    }
    const clientes = await Cliente.find( );
    res.render('index', { clientes });
});

app.get('/Cliente/new', (req, res) => {
    res.render('create');
});


app.post('/Cliente', async (req, res) => {
    try {
        const { ci, nombres, apellidos, celular, correo } = req.body;
        await Cliente.create({ ci, nombres, apellidos, celular, correo });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear el cliente');
    }
});

app.get('/Cliente/:id', async (req, res) => {
    const cliente = await Cliente.findById(req.params.id);
    res.render('show', { cliente });
    console.log(cliente)
});

//////////////////////////////
app.get('/Cliente/:id/edit', async (req, res) => {
    const cliente = await Cliente.findById(req.params.id);
    res.render('edit', { cliente });
});

app.put('/Cliente/:id', async (req, res) => {
    const { ci, nombres, apellidos, celular, correo } = req.body;
    await Cliente.findByIdAndUpdate(req.params.id, { ci, nombres, apellidos, celular, correo});
    res.redirect('/');
});

app.delete('/Cliente/:id', async (req, res) => {
    await Cliente.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
