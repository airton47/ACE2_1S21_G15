const router = require('express').Router();
let Test = require('../models/test.model');

router.route('/').get((req, res) => {
    Test.find()
        .then(tests => res.json(tests))
        .catch(err => res.status(400).json('Error: ' + err))
});

router.route('/getTest/:user').get((req, res) => {
    Test.findOne({ username: req.params.user})
        .then(testo => res.json(testo))
        .catch(err => err.status(400).json('Error: ' + err));
});

router.route('/newTest').post((req, res) => {
    const username = req.body.username;
    const temperatura = [];
    const pulso = [];
    const oxigeno = [];

    const newTest = new Test({
        username,
        temperatura, 
        oxigeno,
        pulso
    });

    newTest.save()
        .then(() => res.json('Test creado'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add/:user').post((req, res) => {
    const temperatura = req.body.temperatura;
    const pulso = req.body.pulso;
    const oxigeno = req.body.oxigeno;

    Test.findOne({ username: req.params.user})
        .then(testo => {
            testo.pulso.push(pulso);
            testo.temperatura.push(temperatura);
            testo.oxigeno.push(oxigeno);

            testo.save()
                .then(() => res.json("Mediciones guardados con exito"))
                .catch(err => res.status(400).json('_Error: ' + err))
            
        })
        .catch(err => res.status(400).json('Error: ' + err));

});

module.exports = router;