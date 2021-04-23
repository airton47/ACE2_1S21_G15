const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vo2maxSchema = new Schema({
    username: {type: String, required: true},
    fecha: {type: String, required: true},
    dateIndex: {type: Date},
    peso: {type: Number},
    volExhalado: [{type: Number}],
    volInhalado: [{type: Number}],
    promsExhalado: [{type: Number}],
    promsInhalado: [{type: Number}],
    volMaxExhalado: {type: Number},
    volMinExhalado: {type: Number},
    volMaxInhalado: {type: Number},
    volMinInhalado: {type: Number},
    volPromExhalado: {type: Number},
    volPromInhalado: {type: Number},
    vo2: {type: Number},
    min: {type: Number},
},{
    timestamps: true,
})

vo2maxSchema.indexes({username: 1, dateIndex: 1});

const VO2 = mongoose.model('VO2', vo2maxSchema);

module.exports = VO2;