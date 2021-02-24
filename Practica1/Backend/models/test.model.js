const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSchema = new Schema({
    username: { type: String, required: true },
    fecha: {type: String, required: true},
    dateIndex: {type: Date},
    temperatura: [ {type: Number} ],
    oxigeno: [{type: Number}],
    pulso: [{type: Number}],
    tempMaxima: {type: Number},
    tempMinima: {type: Number},
    tempPromedio: {type: Number},
    oxigenoPromedio: {type: Number},
    pulsoPromedio: {type: Number}
},{
    timestamps: true,
});

testSchema.indexes({username: 1, dateIndex: 1});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;