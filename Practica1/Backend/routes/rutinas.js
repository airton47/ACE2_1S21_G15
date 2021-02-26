const router = require('express').Router();
let Usuario = require('../models/usuario.model');
let Rutina = require('../models/rutina.model');

router.route('/').get((req, res) => {
    Rutina.find()
        .then(rutinas => res.json(rutinas))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const username = req.body.username;
    const fechaInicio = req.body.fechaInicio;
    const pulso = [];
    const oxigeno = [];
    const temperatura = [];

    const newRutina = Rutina({
        userId,
        username,
        fechaInicio,
        pulso,
        oxigeno,
        temperatura
    });

    newRutina.save()
        .then(() => res.json('Rutina Creada'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;