const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Usuario = require('./usuario.model');

const coachSchema = Usuario.discriminator('Coach', new Schema({
    atletas: [ {type: String} ]
 }),
);

const Coach = mongoose.model('Coach');

module.exports = Coach;