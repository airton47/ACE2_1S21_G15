const router = require('express').Router();
let Usuario = require('../models/usuario.model');

router.route('/').post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

        Usuario.findOne({ username: username})
            .then(usuario => {
                if(!usuario){
                    res.status(401).json('Usuario no existe');
                }else{
                    if(usuario.password === password){
                        res.json(usuario.username);
                    }else{
                        res.status(401).json('Contraseña incorrecta');
                    }
                }
    
            })
            .catch(err => res.status(400).json('Error: ' + err));
    
})

module.exports = router