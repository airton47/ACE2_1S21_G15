const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pruebaSchema = new Schema({
    username: { type: String, required: true },
    fecha: { type: String, required: true },
    dateIndex: { type: Date },
    estado: { type: String, enum: ["R", "F", "C", "P"] },
    distancia: {type: Number},
    repeticion: { type: Number },
    repeticiones: [{
        numero: { type: Number, required: true },
        distanciaR: {type: Number},
        velocidad: [{type: Number}],
        velPromedio: {type: Number},
        velMax: {type: Number},
        velMin: {type: Number},
    }]
},{
    timestamps: true,
})

pruebaSchema.indexes({username: 1, dateIndex: 1});

const Prueba = mongoose.model('Prueba', pruebaSchema);

module.exports = Prueba;
