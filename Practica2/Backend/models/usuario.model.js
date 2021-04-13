const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const options = { discriminatorKey: 'kind'};

const usuarioSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        index: true
    },
    password: { type: String, required: true },
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    edad:  { type: Number, required: true },
    genero: { type: String, enum: ["M", "F"], required: true },
    peso: { type: Number, required: true },
    altura: { type: Number, required: true },
    coach: Boolean
},{
    timestamps: true,
    discriminatorKey: 'kind'
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
