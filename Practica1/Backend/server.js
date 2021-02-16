const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
    );
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

//const routerRutinas = require('./routes/rutinas');
const routerUsuarios = require('./routes/usuarios');
const routerLogin = require('./routes/login');

//app.use('/rutinas', routerRutinas);
app.use('/usuarios', routerUsuarios);
app.use('/login', routerLogin);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});