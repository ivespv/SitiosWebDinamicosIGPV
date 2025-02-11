const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    correo: { type: String, required: true },
    password: { type: String, required: true },
    nombre: { type: String, required: true },
    rol: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);