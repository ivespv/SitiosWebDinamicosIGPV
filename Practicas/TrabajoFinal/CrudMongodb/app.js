
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const User = require('./models/User');

const app = express();

// Configuración
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // Para soportar PUT y DELETE
app.set('view engine', 'ejs');

// Conexión a MongoDB
// Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/BdCliente', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
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
        const users = await User.find({ ci: consulta} );
        return res.render('index', { users });
    }
    const users = await User.find( );
    res.render('index', { users });
});

app.get('/users/new', (req, res) => {
    res.render('create');
});

app.post('/users', async (req, res) => {
    const { ci, nombres, apellidos, celular, correo } = req.body;
    await User.create({ ci, nombres, apellidos, celular, correo });
    res.redirect('/');
});

app.get('/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('show', { user });
    console.log(user)
});

//////////////////////////////
app.get('/users/:id/edit', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('edit', { user });
});

app.put('/users/:id', async (req, res) => {
    const { correo, password, nombre, rol } = req.body;
    await User.findByIdAndUpdate(req.params.id, { correo, password, nombre, rol });
    res.redirect('/');
});

app.delete('/users/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
