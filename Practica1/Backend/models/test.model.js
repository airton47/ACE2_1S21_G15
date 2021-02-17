const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSchema = new Schema({
    username: { type: String, required: true },
    temperatura: [ {type: Number} ],
    oxigeno: [{type: Number}],
    pulso: [{type: Number}]
},{
    timestamps: true,
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;