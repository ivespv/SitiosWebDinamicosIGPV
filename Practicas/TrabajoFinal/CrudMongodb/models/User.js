const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    ci: { type: Number, required: true },
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    celular: { type: Number, required: true },
    correo: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);