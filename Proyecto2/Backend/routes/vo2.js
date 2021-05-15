const router = require('express').Router();
let VO2 = require('../models/vo2max.model');

router.route('/').get((req, res) => {
    VO2.find()
        .then(vo => res.json(vo))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/get/:user').get((req, res) => {
    VO2.find({username: req.params.user})
        .then(vo => res.json(vo))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getByDate/:user').get((req, res) => {
    const fecha = Date.parse(req.body.fecha);

    VO2.findOne({username: req.params.user, dateIndex: fecha})
        .then(vo => res.json(vo))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/iniciar').post((req, res) => {
    const username = req.body.username;
    const fecha = req.body.fecha;
    const dateIndex = Date.parse(fecha);
    const peso = req.body.peso;
    const volExhalado = [];
    const volInhalado = [];
    const promsExhalado = [0,0,0,0,0,0];
    const promsInhalado = [0,0,0,0,0,0];
    const volMaxExhalado = 0;
    const volMinExhalado = 0;
    const volMaxInhalado = 0;
    const volMinInhalado = 0;
    const volPromExhalado = 0;
    const volPromInhalado = 0;
    const vo2 = 0;
    const min = 0;

    const newVO2 = new VO2({
        username,
        fecha,
        dateIndex,
        peso,
        volExhalado,
        volInhalado,
        promsExhalado,
        promsInhalado,
        volMaxExhalado,
        volMinExhalado,
        volMaxInhalado,
        volMinInhalado,
        volPromExhalado,
        volPromInhalado,
        vo2,
        min
    });

    newVO2.save()
        .then(() => res.json('Se ha iniciado la medición del VO2'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/addVols/:user').post((req, res) => {
    const fecha = Date.parse(req.body.fecha);
    const exhalado = req.body.volExhalado;
    const inhalado = req.body.volInhalado;

    VO2.findOne({ username: req.params.user, dateIndex: fecha})
        .then(vo => {
            vo.volExhalado.push(exhalado);
            vo.volInhalado.push(inhalado);

            const voE = vo.volExhalado;
            const voI = vo.volInhalado;

            vo.volMaxExhalado = Math.max(...voE);
            vo.volMinExhalado = Math.min(...voE);
            vo.volMaxInhalado = Math.max(...voI);
            vo.volMinInhalado = Math.min(...voI);
            vo.volPromExhalado = voE.reduce((a,b) => a + b, 0) / voE.length;
            vo.volPromInhalado = voI.reduce((a,b) => a + b, 0) / voI.length;

            vo.save()
                .then(() => res.json("Mediciones guardadas con exito"))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/addVolExhalado/:user').post((req, res) => {
    const fecha = Date.parse(req.body.fecha);
    const exhalado = req.body.volumen;

    VO2.findOne({ username: req.params.user, dateIndex: fecha})
        .then(vo => {
            vo.volExhalado.push(exhalado);

            const voE = vo.volExhalado;

            vo.volMaxExhalado = Math.max(...voE);
            vo.volMinExhalado = Math.min(...voE);
            vo.volPromExhalado = voE.reduce((a,b) => a + b, 0) / voE.length;
        
            const proms = vo.promsExhalado.toObject();
            proms[vo.min] += exhalado;
            proms[5]++;

            vo.promsExhalado = proms;

            vo.save()
                .then(() => res.json("Mediciones guardadas con exito"))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/addVolInhalado/:user').post((req, res) => {
    const fecha = Date.parse(req.body.fecha);
    const inhalado = req.body.volumen;

    VO2.findOne({ username: req.params.user, dateIndex: fecha})
        .then(vo => {
            vo.volInhalado.push(inhalado);

            const voI = vo.volInhalado;

            vo.volMaxInhalado = Math.max(...voI);
            vo.volMinInhalado = Math.min(...voI);
            vo.volPromInhalado = voI.reduce((a,b) => a + b, 0) / voI.length;

            const proms = vo.promsInhalado.toObject();
            proms[vo.min] += inhalado;
            proms[5]++;

            vo.promsInhalado = proms;

            vo.save()
                .then(() => res.json("Mediciones guardadas con exito"))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/minuto/:user').post((req, res) => {
    const fecha = Date.parse(req.body.fecha);
    VO2.findOne({ username: req.params.user, dateIndex: fecha})
        .then(vo => {
            const promsE = vo.promsExhalado.toObject();
            const promsI = vo.promsInhalado.toObject();

            promsE[vo.min] = promsE[vo.min] / promsE[5];
            promsI[vo.min] = promsI[vo.min] / promsI[5];  
            
            promsE[5] = 0;
            promsI[5] = 0;

            vo.promsExhalado = promsE;
            vo.promsInhalado = promsI;
            
            vo.min++;

            vo.save()
                .then(() => res.json("Siguiente Minuto"))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/finalizar/:user').post((req, res) => {
    const fecha = Date.parse(req.body.fecha);

    VO2.findOne({ username: req.params.user, dateIndex: fecha})
        .then(vo => {

            const promsE = vo.promsExhalado.toObject();
            const promsI = vo.promsInhalado.toObject();

            promsE[vo.min] = promsE[vo.min] / promsE[5];
            promsI[vo.min] = promsI[vo.min] / promsI[5]; 

            promsE[5] = 0;
            promsI[5] = 0; 

            vo.promsExhalado = promsE;
            vo.promsInhalado = promsI;

            vo.min++;

            //const vo2max = ((promsDeProms * 0.21))/vo.peso;

            //vo.vo2 = vo2max;

            const volInhalado = vo.volInhalado.reduce((a,b) => a + b, 0);
            const vo2max = (((volInhalado * 0.21)/5)/vo.peso) * -60 ;

            vo.vo2 = vo2max;

            vo.save()
                .then(() => res.json("Medición de VO2 finalizada"))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;