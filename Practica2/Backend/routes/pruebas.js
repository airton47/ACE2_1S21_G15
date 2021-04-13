const router = require('express').Router();
let Prueba = require('../models/prueba.model');

router.route('/').get((req, res) => {
    Prueba.find()
        .then(pruebas => res.json(pruebas))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getPruebas/:user').get((req, res) =>{
    Prueba.find({ username: req.params.user })
        .then(prueba => res.json(prueba))
        .catch(err => err.status(400).json('Error: ' + err));
});

router.route('/getPruebaByDate/:user').get((req, res) => {
    const fecha = Date.parse(req.body.fecha);

    Prueba.findOne({ username: req.params.user, dateIndex: fecha})
        .then(prueba => res.json(prueba))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getRepeticiones/:user').get((req, res) => {
    const fecha = Date.parse(req.body.fecha);

    Prueba.findOne({ username: req.params.user, dateIndex: fecha})
        .then(prueba => res.json(prueba.repeticiones))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getRepeticion/:user').get((req, res) => {
    const fecha = Date.parse(req.body.fecha);
    const noRep = req.body.repeticion;

    Prueba.findOne({ username: req.params.user, dateIndex: fecha})
        .then(prueba => res.json(prueba.repeticiones[noRep - 1]))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getPruebaByRango/:user').get((req, res) => {
    const fechaInicio = Date.parse(req.body.fechaInicio);
    const fechaFin = Date.parse(req.body.fechaFin);

    Prueba.find({
        username: req.params.user,
        dateIndex: {
            $gte: fechaInicio,
            $lt: fechaFin
        }
    })
    .then(prueba => res.json(prueba))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getIntentos/:user').get((req, res) =>{
    Prueba.find({ username: req.params.user })
        .then(pruebas => {
            let contTotal = pruebas.length;
            let contFallos = 0;
            let contRendidos = 0;
            let contCompletos = 0;

            pruebas.forEach(prueba => {
                if(prueba.estado === "C"){
                    contCompletos++;
                }else if(prueba.estado === "F"){
                    contFallos++;
                }else if(prueba.estado === "R"){
                    contRendidos++;
                }
            });

            let intentos = {
                completos: contCompletos,
                fallidos: contFallos,
                rendidos: contRendidos,
                totales: contTotal
            }
            
            res.json(intentos);
        })
        .catch(err => err.status(400).json('Error: ' + err));
});

router.route('/iniciarPrueba').post((req, res) => {
    const username = req.body.username;
    const fecha = req.body.fecha;
    const dateIndex = Date.parse(req.body.fecha);
    const estado = "P";
    const distancia = 0;
    const repeticion = 1;
    const newRep = {
        numero: 1,
        distanciaR: 0,
        velocidad: [],
        velPromedio: 0,
        velMax: 0,
        velMin: 0,
    };
    const repeticiones = [newRep];

    const newPrueba = new Prueba({
        username,
        fecha,
        dateIndex,
        estado,
        distancia,
        repeticion,
        repeticiones
    })

    newPrueba.save()
        .then(() => res.json('Se ha iniciado la prueba'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/addRep/:user').post((req, res) => {
    const fecha = Date.parse(req.body.fecha);

    Prueba.findOne({ username: req.params.user, dateIndex: fecha})
        .then(prueba => {
            prueba.repeticion += 1;
            
            const newRep = {
                numero: prueba.repeticion,
                distanciaR: 0,
                velocidad: [],
                velPromedio: 0,
                velMax: 0,
                velMin: 0,
            };

            prueba.repeticiones.push(newRep);

            prueba.save()
                .then(() => res.json("Nueva repetición agregada"))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add/:user').post((req, res) => {
    const fecha = Date.parse(req.body.fecha);
    const noRep = req.body.repeticion;
    const vel = req.body.velocidad;
    const dist = req.body.distancia;

    Prueba.findOne({ username: req.params.user, dateIndex: fecha})
    .then(prueba => {
        let distAnterior = prueba.distancia;
        prueba.distancia = dist;
        
        prueba.repeticiones[noRep - 1].distanciaR += prueba.distancia - distAnterior;
        prueba.repeticiones[noRep - 1].velocidad.push(vel);

        const vels = prueba.repeticiones[noRep - 1].velocidad;

        prueba.repeticiones[noRep - 1].velMax = Math.max(...vels);
        prueba.repeticiones[noRep - 1].velMin = Math.min(...vels);
        prueba.repeticiones[noRep - 1].velPromedio = vels.reduce((a,b) => a + b, 0) / vels.length;

        prueba.save()
            .then(() => res.json("Mediciones guardados con exito"))
            .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/endPrueba/:user').post((req, res) =>{
    const fecha = Date.parse(req.body.fecha);
    const estado = req.body.estado;

    Prueba.findOne({ username: req.params.user, dateIndex: fecha})
    .then(prueba => {
        prueba.estado = estado;

        prueba.save()
            .then(() => res.json("Prueba terminada"))
            .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});



module.exports = router;
