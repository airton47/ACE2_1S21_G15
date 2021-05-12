const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rutinaSchema = new Schema({
    username: {type: String, required: true},
    fecha: {type:String, required: true},
    dateIndex: {type: Date},
    peso: {type: Number, required: true},
    calorias: {type: Number},
    pulso: [ {type: Number} ],
    maxPulso: {type: Number},
    minPulso: {type: Number},
    promPulso: {type: Number},
    oxigeno: [ {type: Number} ],
    maxOxigeno: {type: Number},
    minOxigeno: {type: Number},
    promOxigeno: {type: Number},
    temperatura: [ {type: Number} ],
    maxTemperatura: {type: Number},
    minTemperatura: {type: Number},
    promTemperatura: {type: Number},
    velocidad: [ {type: Number} ],
    maxVelocidad: {type: Number},
    minVelocidad: {type: Number},
    promVelocidad: {type: Number},
    distancia: [ {type: Number} ],
    maxDistancia: {type: Number},
    minDistancia: {type: Number},
    promDistancia: {type: Number},
    activo: {type: Boolean},
    intensidad: { type: String, enum: ["S", "M", "I"], required: true}
});

rutinaSchema.index({ username: 1, dateIndex: 1});

const Rutina = mongoose.model('Rutina', rutinaSchema);

module.exports = Rutina;