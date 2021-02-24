
import {mainApp} from "./main-vue";
import {Mensajes} from './Mensajes';
import "regenerator-runtime/runtime.js"; //permite la compilación de Async en Babel

const Procesos = {};

//#region Solicitudes GET
async function obtenerInfoPorAPI(urlAPI, complementoURLAPI){
    try{
        const respuestaRecibida = await fetch(urlAPI + complementoURLAPI);
        const datosEnJSON = await respuestaRecibida.json();
        return datosEnJSON;
    }catch(error){
        swal(Mensajes.mensajeFalloGetAPI);
    }
}

async function obtenerUsernamesSistema(){
    const urlAPI = 'http://ec2-3-129-62-242.us-east-2.compute.amazonaws.com/usuarios/getUsernames';
    const usuariosDelSistema = await obtenerInfoPorAPI(urlAPI, '');
    return usuariosDelSistema;
}

async function obtenerDatosUsuarioEspecifico(username){
    const urlAPI = 'http://ec2-3-129-62-242.us-east-2.compute.amazonaws.com/usuarios/getUsuario/';
    const datosRecibidos = await obtenerInfoPorAPI(urlAPI, username);
    return datosRecibidos;
}

async function obtenerDatosCompletosUsuariosSistema(){
    const urlAPI = 'http://ec2-3-129-62-242.us-east-2.compute.amazonaws.com/usuarios/getUsuarios';
    const datosUsuariosDelSistema = await obtenerInfoPorAPI(urlAPI, '');
    return datosUsuariosDelSistema;
}

async function obtenerAtletasBajoCoach(coach){
    const urlAPI = 'http://ec2-3-129-62-242.us-east-2.compute.amazonaws.com/usuarios/getAtletaFromCoach/';
    const datosAtletas = await obtenerInfoPorAPI(urlAPI, coach);
    return datosAtletas;
}

async function obtenerHistorialesAtleta(atleta){
    const urlAPI = 'http://ec2-3-129-62-242.us-east-2.compute.amazonaws.com/tests/';
    const datosHistorialesAtleta = await obtenerInfoPorAPI(urlAPI, '');
    return datosHistorialesAtleta;
}

function obtenerHistorialesCompletos(){
    let filaActual = this.parentNode; //La fila actual donde se presionó el boton de historial
    let usernameAtleta = filaActual.firstChild.textContent;
    swal({
        title: 'Recolectando historiales de ' + usernameAtleta,
        html: '<b>Cargando mediciones recientes...</b>',
        timer: 2500,
        showConfirmButton: false,
        type: 'info',
        allowEscapeKey: false,
        allowOutsideClick: false,
        backdrop: false
    });

}

async function mostrarAtletasAsignados(coach){
    //Vaciamos la tabla actual
    vaciarBotonesTablaAtletas();
    mainApp.controladoresDeHistorialesCoach.listaAtletas.splice(0, mainApp.controladoresDeHistorialesCoach.listaAtletas.length);
    //recolectamos los atletas con la API
    const atletasRecolectados = await obtenerAtletasBajoCoach(coach);
    //ingresamos los nuevos datos, VUE los mostrará por si solo como se indicó en el HTML
    atletasRecolectados.forEach(elemento => {
        mainApp.controladoresDeHistorialesCoach.listaAtletas.push({
            id: elemento._id,
            username: elemento.username,
            nombre: elemento.nombres.split(' ')[0], //solo el primer nombre
            apellido: elemento.apellidos.split(' ')[0], //solo el primer apellido
            edad:elemento.edad,
            sexo:elemento.genero,
            peso:elemento.peso,
            estatura:elemento.altura
        });  
    }); 
}

function generarBotonesTablaAtletas(){
    document.querySelectorAll('#cuerpoInformativoAtletas tr')
    .forEach(fila =>{
        let contenedorActivadorHistorial = document.createElement('td');
        let iconoVisor = document.createElement('span');
        iconoVisor.className="icon-eye";
        iconoVisor.alt = "Ver Detalles";
        iconoVisor.title = "Ver Detalles";
        contenedorActivadorHistorial.appendChild(iconoVisor);
        contenedorActivadorHistorial.addEventListener("click", Procesos.obtenerHistorialesCompletos);
        fila.appendChild(contenedorActivadorHistorial);
    }); 
}

function vaciarBotonesTablaAtletas(){
    //esta tabla se vacia de esta forma porque es la única que posee botones dinámicos
    document.querySelectorAll('#cuerpoInformativoAtletas tr')
    .forEach(fila =>{
        fila.removeChild(fila.lastChild); //el último hijo es una columna que tiene al boton
    }); 
}

//#endregion Solicitudes GET

//#region Solicitudes POST

async function enviarInfoAPI(informacion, urlAPI, complementoURLAPI){
    try{
        const configuracion = {
            method: 'POST',
            headers:{
                'Content-Type':  'application/json'
            },
            body: JSON.stringify(informacion)
        };   
        const respuestaRecibida = await fetch(urlAPI+complementoURLAPI, configuracion);
        const indicadorEnvio = await respuestaRecibida.json();
        return indicadorEnvio;
    }catch(error){
        swal(Mensajes.mensajeFalloPostAPI);
    }
}

async function crearNuevoAtleta(infoAtleta){
    const urlAPI = 'http://ec2-3-129-62-242.us-east-2.compute.amazonaws.com/usuarios/addAtleta';
    const respuestaEnvio = await enviarInfoAPI(infoAtleta, urlAPI, '');
    return respuestaEnvio;
}

async function crearNuevoCoach(infoCoach){
    const urlAPI = 'http://ec2-3-129-62-242.us-east-2.compute.amazonaws.com/usuarios/addCoach';
    const respuestaEnvio = await enviarInfoAPI(infoCoach, urlAPI, '');
    return respuestaEnvio;
}

async function asignarAtleta(coach, atleta){
    const urlAPI = '';
    const respuestaEnvio = await enviarInfoAPI(atleta, urlAPI, '');
    return respuestaEnvio;
}

//#endregion Solicitudes POST


//#region Acciones



//#endregion Acciones

//#region Otros ejemplos
/* function obtenerInfoPorAPI(urlAPI){
    fetch(urlAPI)
    .then(res =>
        res.json()
    )
    .then(res => {
        res.data.map(user => {
        console.log(`${user.username}: ${user.edad} ${user.genero}`);
        }); 
        console.log(JSON.stringify(res));
    })
    .catch(err => {
        console.log(err);
        swal(Mensajes.mensajeFalloGetAPI);
    });
} */

/* async function obtenerUsernamesSistema(){
    const urlAPI = 'http://ec2-3-129-62-242.us-east-2.compute.amazonaws.com/usuarios/getUsernames';
    let receptor = await obtenerInfoPorAPI(urlAPI, '');
    console.log(JSON.stringify(receptor));
} */
//#endregion Otros ejemplos


Procesos.obtenerUsernamesSistema = obtenerUsernamesSistema;
Procesos.obtenerDatosUsuarioEspecifico = obtenerDatosUsuarioEspecifico;
Procesos.obtenerDatosCompletosUsuariosSistema = obtenerDatosCompletosUsuariosSistema;
Procesos.crearNuevoAtleta = crearNuevoAtleta;
Procesos.obtenerAtletasBajoCoach = obtenerAtletasBajoCoach;
Procesos.mostrarAtletasAsignados = mostrarAtletasAsignados;
Procesos.generarBotonesTablaAtletas = generarBotonesTablaAtletas;
Procesos.obtenerHistorialesCompletos = obtenerHistorialesCompletos;
Procesos.crearNuevoCoach = crearNuevoCoach;

export{Procesos};