const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rutinaSchema = new Schema({
    username: {type: String, required: true},
    fechaInicio: {type:String, required: true},
    pulso: [ {type: Number} ],
    oxigeno: [ {type: Number} ],
    temperatura: [ {type: Number} ]
});

rutinaSchema.index({ username: 1, fechaInicio: 1});

const Rutina = mongoose.model('Rutina', rutinaSchema);

module.exports = Rutina;