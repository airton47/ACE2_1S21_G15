const router = require('express').Router();
let Usuario = require('../models/usuario.model');
let Coach = require('../models/coach.model');

router.route('/getUsuarios').get((req, res) => {
    Usuario.find()
        .then(usuarios => res.json(usuarios))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getCoachs').get((req, res) => {
    Coach.find()
        .then(coachs => res.json(coachs))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getAtletas/:id').get((req, res) => {
    Coach.findById(req.params.id).select('atletas -_id')
        .then(function(atletas) {
            
            Usuario.find().where('_id').in(atletas.atletas).select('nombres')
                .then(atl => res.json(atl));
            
            /*let jsonAtletas = [];
            let fuera;

            for(let i = 0; i<atletas.atletas.length; i++){
                let nombre = Usuario.findById(atletas.atletas[i]).select('nombres')
                    .exec(nombre => {
                        return nombre;
                        //res.json(jsonAtletas);
                     });

                console.log(nombre);
                let jsonAtleta = {}
                jsonAtleta.id = atletas.atletas[i];
                jsonAtleta.nombre = 'Testo';

                jsonAtletas.push(jsonAtleta);
            }


            res.json(jsonAtletas);*/
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/addAtleta').post((req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    const nombres = req.body.nombres;
    const apellidos = req.body.apellidos;
    const edad = Number(req.body.edad);
    const genero = req.body.genero;
    const peso = Number(req.body.peso);
    const altura = Number(req.body.altura);
    const coach = req.body.coach;

    const newAtleta = Usuario({
        username,
        password,
        nombres,
        apellidos,
        edad,
        genero,
        peso,
        altura,
        coach
    });

    newAtleta.save()
        .then(() => res.json('Atleta Agregado'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/addCoach').post((req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    const nombres = req.body.nombres;
    const apellidos = req.body.apellidos;
    const edad = Number(req.body.edad);
    const genero = req.body.genero;
    const peso = Number(req.body.peso);
    const altura = Number(req.body.altura);
    const coach = req.body.coach;
    const atletas = [];

    const newCoach = Coach({
        username,
        password,
        nombres,
        apellidos,
        edad,
        genero,
        peso,
        altura,
        coach,
        atletas
    });

    newCoach.save()
        .then(() => res.json('Coach Agregado'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/addAtletaToCoach/:id').post((req,res) => {
    Coach.findById(req.params.id)
        .then(coach => {
            coach.atletas.push(req.body.atleta);

            coach.save()
                .then(() => res.json('Atleta agregado al Coach'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
});

module.exports = router