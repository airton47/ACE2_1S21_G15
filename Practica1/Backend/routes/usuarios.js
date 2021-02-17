const router = require('express').Router();
let Usuario = require('../models/usuario.model');
let Coach = require('../models/coach.model');
const { json } = require('express');

router.route('/getUsuarios').get((req, res) => {
    Usuario.find()
        .then(usuarios => res.json(usuarios))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getUsernames').get((req, res) => {
    Usuario.find().select("username -_id")
        .then(usernames => res.json(usernames))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/getUsuario/:user').get((req, res) => {
    Usuario.findOne({username: req.params.user})
        .then(usuario => res.json(usuario));
});

router.route('/getCoachs').get((req, res) => {
    Coach.find()
        .then(coachs => res.json(coachs))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getAtletaFromCoach/:user').get((req, res) => {
    Coach.findOne({username: req.params.user}).select('atletas -_id')
        .then(function(atletas) {

            Usuario.find().where('username').in(atletas.atletas)
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

router.route('/addAtletaToCoach/:user').post((req,res) => {
    Coach.findOne({username: req.params.user})
        .then(coach => {
            coach.atletas.push(req.body.username);

            coach.save()
                .then(() => res.json('Atleta agregado al Coach'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
});

module.exports = router;