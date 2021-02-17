const router = require('express').Router();
let Test = require('../models/test.model');

router.route('/').get((req, res) => {
    Test.find()
        .then(tests => res.json(tests))
        .catch(err => res.status(400).json('Error: ' + err))
});

router.route('/getTest/:user').get((req, res) => {
    Test.find({ username: req.params.user})
        .then(testo => res.json(testo))
        .catch(err => err.status(400).json('Error: ' + err));
});

router.route('/getTestByDate/:user').get((req, res) => {
    const fecha = Date.parse(req.body.fecha);

    Test.findOne({username: req.params.user, dateIndex: fecha})
        .then(testo => res.json(testo))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/iniciarTest').post((req, res) => {
    const username = req.body.username;
    const fecha = req.body.fecha;
    const dateIndex = Date.parse(fecha);
    const temperatura = [];
    const pulso = [];
    const oxigeno = [];
    const tempMaxima = 0
    const tempMinima = 0
    const tempPromedio = 0

    const newTest = new Test({
        username,
        fecha,
        dateIndex,
        temperatura, 
        oxigeno,
        pulso,
        tempMaxima,
        tempMinima,
        tempPromedio
    });

    newTest.save()
        .then(() => res.json('Se ha iniciado el Test'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add/:user').post((req, res) => {
    const fecha = Date.parse(req.body.fecha);
    const temperatura = req.body.temperatura;
    const pulso = req.body.pulso;
    const oxigeno = req.body.oxigeno;

    Test.findOne({ username: req.params.user, dateIndex: fecha})
        .then(testo => {
            testo.pulso.push(pulso);
            testo.temperatura.push(temperatura);
            testo.oxigeno.push(oxigeno);

            const temp = testo.temperatura;

            testo.tempMaxima = Math.max(...temp);
            testo.tempMinima = Math.min(...temp);
            testo.tempPromedio = temp.reduce((a,b) => a + b, 0) / temp.length;

            testo.save()
                .then(() => res.json("Mediciones guardados con exito"))
                .catch(err => res.status(400).json('_Error: ' + err))
            
        })
        .catch(err => res.status(400).json('Error: ' + err));

});

module.exports = router;