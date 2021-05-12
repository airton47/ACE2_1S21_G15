const router = require('express').Router();
let Rutina = require('../models/rutina.model');

router.route('/').get((req, res) => {
    Rutina.find()
        .then(rutinas => res.json(rutinas))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/get/:user').get((req, res) => {
    Rutina.find({username: req.params.user})
        .then(rut => res.json(rut))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getByIntensidad/:user').get((req, res) => {
    const intensidad = req.body.intensidad;

    Rutina.find({username: req.params.user, intensidad: intensidad})
        .then(rut => res.json(rut))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getByDate/:user').get((req, res) => {
    const fecha = Date.parse(req.body.fecha);

    Rutina.findOne({username: req.params.user, dateIndex: fecha})
        .then(rut => res.json(rut))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/iniciar').post((req, res) => {
    const username = req.body.username;
    const fecha = req.body.fecha;
    const dateIndex = Date.parse(fecha);
    const peso = req.body.peso;
    const calorias = 0;
    const pulso = [];
    const maxPulso = 0;
    const minPulso = 0;
    const promPulso = 0;
    const oxigeno = [];
    const maxOxigeno = 0;
    const minOxigeno = 0;
    const promOxigeno = 0;
    const temperatura = [];
    const maxTemperatura = 0;
    const minTemperatura = 0;
    const promTemperatura = 0;
    const velocidad = [];
    const maxVelocidad = 0;
    const minVelocidad = 0;
    const promVelocidad = 0;
    const distancia = [];
    const maxDistancia = 0;
    const minDistancia = 0;
    const promDistancia = 0;
    const activo = true;
    const intensidad = req.body.intensidad;

    const newRutina = new Rutina({
        username,
        fecha,
        dateIndex,
        peso,
        calorias,
        pulso,
        maxPulso,
        minPulso,
        promPulso,
        oxigeno,
        maxOxigeno,
        minOxigeno,
        promOxigeno,
        temperatura,
        maxTemperatura,
        minTemperatura,
        promTemperatura,
        velocidad,
        maxVelocidad,
        minVelocidad,
        promVelocidad,
        distancia,
        maxDistancia,
        minDistancia,
        promDistancia,
        activo,
        intensidad
    });

    newRutina.save()
        .then(() => res.json('Se ha iniciado una nueva Rutina'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add/:user').post((req, res) => {
    const fecha = Date.parse(req.body.fecha);
    const pulso = req.body.pulso;
    const oxigeno = req.body.oxigeno;
    const temperatura = req.body.temperatura;
    const velocidad = req.body.velocidad;
    const distancia = req.body.distancia;

    Rutina.findOne({ username: req.params.user, dateIndex: fecha})
        .then(rut => {
            rut.pulso.push(pulso);
            rut.oxigeno.push(oxigeno);
            rut.temperatura.push(temperatura);
            rut.velocidad.push(velocidad);
            rut.distancia.push(distancia);

            const pulsos = rut.pulso;
            const oxigenos = rut.oxigeno; 
            const temperaturas = rut.temperatura; 
            const velocidades = rut.velocidad; 
            const distancias = rut.distancia; 

            rut.maxPulso = Math.max(...pulsos);
            rut.minPulso = Math.min(...pulsos);
            rut.promPulso = pulsos.reduce((a,b) => a + b, 0) / pulsos.length;

            rut.maxOxigeno = Math.max(...oxigenos);
            rut.minOxigeno = Math.min(...oxigenos);
            rut.promOxigeno = oxigenos.reduce((a,b) => a + b, 0) / oxigenos.length;

            rut.maxTemperatura = Math.max(...temperaturas);
            rut.minTemperatura = Math.min(...temperaturas);
            rut.promTemperatura = temperaturas.reduce((a,b) => a + b, 0) / temperaturas.length;

            rut.maxVelocidad = Math.max(...velocidades);
            rut.minVelocidad = Math.min(...velocidades);
            rut.promVelocidad = velocidades.reduce((a,b) => a + b, 0) / velocidades.length;

            rut.maxDistancia = Math.max(...distancias);
            rut.minDistancia = Math.min(...distancias);
            rut.promDistancia = distancias.reduce((a,b) => a + b, 0) / distancias.length;

            rut.save()
                .then(() => res.json("Mediciones guardadas con exito"))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/addPulso/:user').post((req, res) => {
    const fecha = Date.parse(req.body.fecha);
    const pulso = req.body.pulso;

    Rutina.findOne({ username: req.params.user, dateIndex: fecha})
        .then(rut => {
            rut.pulso.push(pulso);

            const pulsos = rut.pulso;

            rut.maxPulso = Math.max(...pulsos);
            rut.minPulso = Math.min(...pulsos);
            rut.promPulso = pulsos.reduce((a,b) => a + b, 0) / pulsos.length;

            rut.save()
                .then(() => res.json("Mediciones guardadas con exito"))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/addOxigeno/:user').post((req, res) => {
    const fecha = Date.parse(req.body.fecha);
    const oxigeno = req.body.oxigeno;

    Rutina.findOne({ username: req.params.user, dateIndex: fecha})
        .then(rut => {
            rut.oxigeno.push(oxigeno);

            const oxigenos = rut.oxigeno; 

            rut.maxOxigeno = Math.max(...oxigenos);
            rut.minOxigeno = Math.min(...oxigenos);
            rut.promOxigeno = oxigenos.reduce((a,b) => a + b, 0) / oxigenos.length;

            rut.save()
                .then(() => res.json("Mediciones guardadas con exito"))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/addTemperatura/:user').post((req, res) => {
    const fecha = Date.parse(req.body.fecha);
    const temperatura = req.body.temperatura;

    Rutina.findOne({ username: req.params.user, dateIndex: fecha})
        .then(rut => {
            rut.temperatura.push(temperatura);

            const temperaturas = rut.temperatura; 

            rut.maxTemperatura = Math.max(...temperaturas);
            rut.minTemperatura = Math.min(...temperaturas);
            rut.promTemperatura = temperaturas.reduce((a,b) => a + b, 0) / temperaturas.length;

            rut.save()
                .then(() => res.json("Mediciones guardadas con exito"))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/addVelocidad/:user').post((req, res) => {
    const fecha = Date.parse(req.body.fecha);
    const velocidad = req.body.velocidad;

    Rutina.findOne({ username: req.params.user, dateIndex: fecha})
        .then(rut => {
            rut.velocidad.push(velocidad);

            const velocidades = rut.velocidad; 

            rut.maxVelocidad = Math.max(...velocidades);
            rut.minVelocidad = Math.min(...velocidades);
            rut.promVelocidad = velocidades.reduce((a,b) => a + b, 0) / velocidades.length;

            rut.save()
                .then(() => res.json("Mediciones guardadas con exito"))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/addDistancia/:user').post((req, res) => {
    const fecha = Date.parse(req.body.fecha);
    const distancia = req.body.distancia;

    Rutina.findOne({ username: req.params.user, dateIndex: fecha})
        .then(rut => {
            rut.distancia.push(distancia);

            const distancias = rut.distancia; 

            rut.maxDistancia = Math.max(...distancias);
            rut.minDistancia = Math.min(...distancias);
            rut.promDistancia = distancias.reduce((a,b) => a + b, 0) / distancias.length;

            rut.save()
                .then(() => res.json("Mediciones guardadas con exito"))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/finalizar/:user').post((req,res) => {
    const fecha = Date.parse(req.body.fecha);

    Rutina.findOne({ username: req.params.user, dateIndex: fecha})
        .then(rut => {

            rut.activo = false;
            rut.calorias = (rut.peso * 3)/60

            rut.save()
                .then(() => res.json("Rutina finalizada"))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/estado/:user').post((req,res) => {
    const fecha = Date.parse(req.body.fecha);
    const activa = req.body.estado;

    Rutina.findOne({ username: req.params.user, dateIndex: fecha})
        .then(rut => {

            rut.activo = activa;

            rut.save()
                .then(() => res.json("Estado de rutina actualizada"))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/intensidad/:user').post((req,res) => {
    const fecha = Date.parse(req.body.fecha);
    const intensidad = req.body.intensidad;

    Rutina.findOne({ username: req.params.user, dateIndex: fecha})
        .then(rut => {

            rut.intensidad = intensidad

            rut.save()
                .then(() => res.json("Intensidad de Rutina actualizada"))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;