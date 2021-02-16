const router = require('express').Router();
let Usuario = require('../models/usuario.model');

router.route('/').post((req, res) => {
    const username = req.body.username;

        Usuario.find({ username: username})
            .then(usuario => {
                if(!usuario.length){
                    res.json('Usuario no existe');
                }else{
                    res.json(usuario[0]._id);
                }
    
            })
            .catch(err => res.status(400).json('Error: ' + err));
    
})

module.exports = router