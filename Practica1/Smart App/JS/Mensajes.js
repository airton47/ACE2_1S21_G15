
import {mainApp} from "./main-vue";
import {Procesos} from './Procesos';

const Mensajes = {};

//#region Mensajes de Sesion
let mensajeBienvenida = {
  title: 'Bienvenido(a) a Glove Fit!',
  html: '<b>Inicia sesión</b> para poder usar la aplicación o <b>registrate</b> si no posees una cuenta.',
  imageUrl: "Imagenes/portada-login.gif", //es la ruta desde el HTML
  imageWidth: 250,
  imageHeight: 250,
  imageAlt: 'Custom image',
  showConfirmButton: true,
  showCancelButton: true,
  confirmButtonColor: '#669999',
  cancelButtonColor: '#006666',
  confirmButtonText: 'Loguearme',
  cancelButtonText: 'Registrarme',
  allowEscapeKey: false,
  allowOutsideClick: false
}

let mensajeCierreSesion = {
  title: 'Cierre de Sesión',
  html: '¿Realmente desea <b>cerrar su sesión</b>?',
  showConfirmButton: true,
  showCancelButton: true,
  confirmButtonColor: '#669999',
  cancelButtonColor: '#E56220',
  confirmButtonText: 'Cerrar',
  cancelButtonText: 'Cancelar',
  allowEscapeKey: false,
  allowOutsideClick: false
}

let mensajeDespedidaSesion = {
   title: 'Buen viaje...',
   html: '<b>Cerrando su sesión, espere un momento...</b>',
   timer: 2500,
   showConfirmButton: false,
   type: 'info',
   allowEscapeKey: false,
   allowOutsideClick: false
}

//#endregion Mensajes de Sesion

//#region Mensajes fallo API

let mensajeFalloGetAPI = {
  title: 'Fallo de Recepción',
  html: '<b>Los datos no se pudieron obtener del servidor, vuelva a intentarlo después</b>',
  showConfirmButton: true,
  confirmButtonColor: '#E56220',
  confirmButtonText: 'Cerrar',
  allowEscapeKey: false,
  allowOutsideClick: false,
  backdrop: false,
  type: 'error'
}

let mensajeFalloPostAPI = {
  title: 'Fallo de Envio',
  html: '<b>Los datos no se pudieron enviar al servidor, vuelva a intentarlo después</b>',
  showConfirmButton: true,
  confirmButtonColor: '#E56220',
  confirmButtonText: 'Cerrar',
  allowEscapeKey: false,
  allowOutsideClick: false,
  backdrop: false,
  type: 'error'
}

//#endregion fallo API

//#region LogIn y LogOut

function ejecutarLogin(){
  swal(mensajeBienvenida).then(result => {
   if (result.value){
      recolectarCredencialesAcceso();
   }
   else if(result.dismiss === 'cancel' ){
      recolectarDatosRegistro();
   }
 });
}

function ejecutarLogOut(){
  swal(mensajeCierreSesion).then(result => {
   if (result.value){
      mostrarDespedidaSesion();
   }else if(result.dismiss === 'cancel' ){
      console.log("Cierre de sesión cancelado...");
   }
 });
}

function desactivarVisorInicial(){ //quita el fondo para poder visualizar el dashboard cargado
 let visor = document.getElementById("covertor");
 visor.style.display = "none";
}

function activarVisorInicial(){ //activa el fondo para poder ocultar el dashboard de datos
 let visor = document.getElementById("covertor");
 visor.style.display = "block";
}

function regresarPantallaValidacion(){
 activarVisorInicial();
 ejecutarLogin();
}

function mostrarDespedidaSesion(){
 swal(mensajeDespedidaSesion);
 setTimeout(regresarPantallaValidacion, 2500); //se espera la duración dfel mensaje para ejecutar el proceso
}

//#endregion LogIn y LogOut

//#region Recolección de datos Log In y Sign In

async function actualizarDatosSesion(){
  let elemento = await Procesos.obtenerDatosUsuarioEspecifico( mainApp.datosDePerfilEnSesion.username);
  mainApp.datosDePerfilEnSesion.id = elemento._id;
  mainApp.datosDePerfilEnSesion.nombres = elemento.nombres;
  mainApp.datosDePerfilEnSesion.apellidos = elemento.apellidos;
  mainApp.datosDePerfilEnSesion.edad = elemento.edad;
  mainApp.datosDePerfilEnSesion.sexo = elemento.genero;
  mainApp.datosDePerfilEnSesion.peso = elemento.peso;
  mainApp.datosDePerfilEnSesion.estatura = elemento.altura;
  mainApp.datosDePerfilEnSesion.estadoTipo = elemento.coach;
  elemento.coach ? mainApp.datosDePerfilEnSesion.tipo = 'coach' : mainApp.datosDePerfilEnSesion.tipo = 'atleta';
  desactivarVisorInicial(); //mostramos el dashboar quitando el modal quer lo cubre
}

//#region Log In

async function recolectarCredencialesAcceso(){
  let longitudMaximaEntrada = 15; 
  let usuariosActuales = await Procesos.obtenerUsernamesSistema();
  let datosUsuariosActuales = await Procesos.obtenerDatosCompletosUsuariosSistema();
  let acceso;
  swal.queue([
    {
      title: 'Usuario',
      text: 'Ingrese su nombre de usuario:',
      input: 'text',
      inputValidator: (value) => {
          if (value.length == 0) {
              return 'No debe dejar vacio el campo'
          }
          if (isNaN(value) != true) { 
              return 'No puede tener un usuario totalmente numérico'
          }
          if (value.length > longitudMaximaEntrada) {
            return 'Se sobrepasa del máximo'
          }
          else{
            //Hay que verificar que el usuario exista
            let indicadorExistencia = false;
            usuariosActuales.forEach(elemento => {
              if(elemento == value){
                indicadorExistencia = true;
                mainApp.datosDePerfilEnSesion.username = value; //actualizamos el dato de cual usuario estará en sesión
              }
            });
            if(!indicadorExistencia){ /*si es falso no existe el usuario aún*/
              return 'El usuario no existe, verifique su escritura';
            }
          }
      },
      inputPlaceholder: 'Usuario',
      confirmButtonText: 'Next &rarr;',
      progressSteps: ['1', '2'],
      allowEscapeKey: false,
      allowOutsideClick: false
    },
    {
      title: 'Contraseña',
      text: 'Ingrese su contraseña:',
      input: 'password',
      inputValidator: (value) => {
        if (value.length == 0) {
            return 'No debe dejar vacio el campo'
        }else{
          datosUsuariosActuales.forEach(elemento => {
            console.log(elemento);
            if(elemento.username ==  mainApp.datosDePerfilEnSesion.username){
              acceso = elemento.password;
              return true;
            }
          });
          if(acceso != value){
            return 'Su contraseña es incorrecta, revise su escritura';
          }
        }
      },
      inputPlaceholder: 'Contraseña',
      confirmButtonText: 'Next &rarr;',
      progressSteps: ['1', '2'],
      allowEscapeKey: false,
      allowOutsideClick: false
    }
  ]).then( result => {
    const datosIngresados = result.value;
    swal({
        title: 'Bienvenido(a)! ' + datosIngresados[0], //[0] es el usuario
        html: '<b>Cargando dashboard deportivo...</b>',
        timer: 2500,
        showConfirmButton: false,
        type: 'success',
        allowEscapeKey: false,
        allowOutsideClick: false
    });
    setTimeout(actualizarDatosSesion, 2500);
  });
}

//#endregion Log In

//#region Sign In

async function recolectarDatosRegistro(){
  let longitudMaximaEntrada = 35; 
  let usuariosActuales = await Procesos.obtenerUsernamesSistema();
  swal.queue([
    {
      title: 'Paso # 1',
      text: 'Ingrese sus nombres(de pila):',
      input: 'text',
      inputValidator: (value) => {
          if (value.length == 0) {
              return 'No debe dejar vacio el campo'
          }
          if (isNaN(value) != true) { 
              return 'No puede tener numeros en su nombre'
          }
          if (value.length > longitudMaximaEntrada) {
            return 'Se sobrepasa del máximo'
          }
      },
      inputPlaceholder: 'Nombre',
      confirmButtonText: 'Next &rarr;',
      progressSteps: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      progressStepsDistance: '6px',
      allowEscapeKey: false,
      allowOutsideClick: false
    },
    {
      title: 'Paso # 2',
      text: 'Ingrese sus apellidos:',
      input: 'text',
      inputValidator: (value) => {
          if (value.length == 0) {
              return 'No debe dejar vacio el campo'
          }
          if (isNaN(value) != true) { 
              return 'No puede tener numeros en su apellido'
          }
          if (value.length > longitudMaximaEntrada) {
            return 'Se sobrepasa del máximo'
          }
      },
      inputPlaceholder: 'Apellido',
      confirmButtonText: 'Next &rarr;',
      progressSteps: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      progressStepsDistance: '6px',
      allowEscapeKey: false,
      allowOutsideClick: false
    },
    {
      title: 'Paso # 3',
      text: 'Ingrese su nombre(para su usuario):',
      input: 'text',
      inputValidator: (value) => {
          if (value.length == 0) {
              return 'No debe dejar vacio el campo'
          }
          if (isNaN(value) != true) { 
              return 'No puede tener un usuario totalmente numérico'
          }
          if (value.length > longitudMaximaEntrada) {
            return 'Se sobrepasa del máximo'
          }
          else{
            //Hay que verificar que el usuario no exista
            let indicadorExistencia = false;
            usuariosActuales.forEach(elemento => {
              if(elemento == value){
                indicadorExistencia = true; 
              }
            });
            if(indicadorExistencia){ /*si es true ya existe el usuario*/
              return 'El usuario ya existe, escriba un username diferente';
            }
          }
      },
      inputPlaceholder: 'Usuario',
      confirmButtonText: 'Next &rarr;',
      progressSteps: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      progressStepsDistance: '6px',
      allowEscapeKey: false,
      allowOutsideClick: false
    },
    {
      title: 'Paso # 4',
      text: 'Ingrese su contraseña:',
      input: 'password',
      inputValidator: (value) => {
        if (value.length == 0) {
            return 'No debe dejar vacio el campo'
        }
      },
      inputPlaceholder: 'Contraseña',
      progressSteps: ['1', '2', '3', '4', '5', '6', '7', '8','9'],
      progressStepsDistance: '6px',
      allowEscapeKey: false,
      allowOutsideClick: false
    },
    {
      title: 'Paso # 5',
      text: 'Seleccione el tipo de usuario:',
      input: 'select',
      inputOptions: {
        atleta: 'atleta',
        coach: 'coach'
      },
      progressSteps: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      progressStepsDistance: '6px',
      allowEscapeKey: false,
      allowOutsideClick: false
    },
    {
      title: 'Paso # 6',
      text: 'Ingrese su edad:',
      input: 'number',
      inputValidator: (value) => {
          if (value.length == 0) {
              return 'No debe dejar vacio el campo'
          }
          if (isNaN(value) != false) { 
              return 'Debe ingresar una edad válido'
          }
          if (value.length > 3) { //no hay ma de 100 años
            return 'Se sobrepasa del máximo'
          }
      },
      inputPlaceholder: 'Edad',
      confirmButtonText: 'Next &rarr;',
      progressSteps: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      progressStepsDistance: '6px',
      allowEscapeKey: false,
      allowOutsideClick: false
    },
    {
      title: 'Paso # 7',
      text: 'Seleccione su género:',
      input: 'select',
      inputOptions: {
        M: 'M',
        F: 'F'
      },
      progressSteps: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      progressStepsDistance: '6px',
      allowEscapeKey: false,
      allowOutsideClick: false
    },
    {
      title: 'Paso # 8',
      text: 'Ingrese su peso(Lbs):',
      input: 'number',
      inputAttributes:{
        pattern: "^\d*(\.\d{0,2})?$",
        step: "0.01"
      },
      inputValidator: (value) => {
        if (isNaN(value) != false) { 
            return 'Debe ingresar un peso válido'
        }
    },
      progressSteps: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      progressStepsDistance: '6px',
      allowEscapeKey: false,
      allowOutsideClick: false
    },
    {
      title: 'Paso # 9',
      text: 'Ingrese su estatura(en cm):',
      input: 'number',
      inputAttributes:{
        pattern: "^\d*(\.\d{0,2})?$",
        step: "0.01"
      },
      inputValidator: (value) => {
          if (value.length == 0) {
              return 'No debe dejar vacio el campo'
          }
          if (isNaN(value) != false) { 
              return 'La estatura ingresada no es numérica'
          }
      },
      inputPlaceholder: 'Estatura',
      confirmButtonText: 'Next &rarr;',
      progressSteps: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      progressStepsDistance: '6px',
      allowEscapeKey: false,
      allowOutsideClick: false
    },
  ]).then( result => {
    const datosRecolectados = result.value;
    let tipoAtleta;
    datosRecolectados[4] == 'coach' ? tipoAtleta=true : tipoAtleta=false;
    let camposRegistro = {
      username: datosRecolectados[2], password: datosRecolectados[3], nombres: datosRecolectados[0],
      apellidos: datosRecolectados[1], edad: parseFloat(datosRecolectados[5]), genero: datosRecolectados[6],
      peso: parseFloat(datosRecolectados[7]), altura: parseFloat(datosRecolectados[8]), coach: tipoAtleta
    };
    //Actualizamos el usuario sesión
    mainApp.datosDePerfilEnSesion.username = datosRecolectados[2]; 
    //Creamos el usuario
    tipoAtleta ? Procesos.crearNuevoCoach(camposRegistro) : Procesos.crearNuevoAtleta(camposRegistro);
    swal({
        title: 'Usuario Registrado con éxito',
        html: '<b>Bienvenido a la plataforma '+ mainApp.datosDePerfilEnSesion.username +',creando dashboard...</b>',
        timer: 3000,
        showConfirmButton: false,
        type: 'success',
        allowEscapeKey: false,
        allowOutsideClick: false
    });
    setTimeout(actualizarDatosSesion, 3000); //actualizamos los datos de la sesión, lleva un pequeño retraso dada la espera para crear el usuario
  });
}

//#endregion Sign In


//#endregion Recolección de datos Log In y Sign In


//#region Analítica
let mensajePulso = {
  title: 'Pulso evaluado',
  html: '<b>Tu pulso</b> fue evaluado con <b>éxito</b>.',
  imageUrl: "Imagenes/Pulso.gif", //es la ruta desde el HTML
  imageWidth: 250,
  imageHeight: 250,
  imageAlt: 'Pulso: de Storyset',
  showConfirmButton: true,
  confirmButtonColor: '#669999',
  confirmButtonText: 'Aceptar',
  allowEscapeKey: false,
  allowOutsideClick: false,
  
}

function mensajeEvaluacionPulso(){
  swal(mensajePulso);
} 

let mensajeTemperatura = {
  title: 'Temperatura evaluada',
  html: '<b>Tu temperatura</b> fue evaluado con <b>éxito</b>.',
  imageUrl: "Imagenes/Temperatura.gif", //es la ruta desde el HTML
  imageWidth: 250,
  imageHeight: 250,
  imageAlt: 'Temperatura: de Storyset',
  showConfirmButton: true,
  confirmButtonColor: '#669999',
  confirmButtonText: 'Aceptar',
  allowEscapeKey: false,
  allowOutsideClick: false,
}

function mensajeEvaluacionTemperatura(){
  swal(mensajeTemperatura);
} 

let mensajeOxigeno = {
  title: 'Oxígeno evaluado',
  html: '<b>Tu Oxígeno en la sangre</b> fue evaluada con <b>éxito</b>.',
  imageUrl: "Imagenes/Oxigeno_Sangre.gif", //es la ruta desde el HTML
  imageWidth: 250,
  imageHeight: 250,
  imageAlt: 'Oxígeno: de Storyset',
  showConfirmButton: true,
  confirmButtonColor: '#669999',
  confirmButtonText: 'Aceptar',
  allowEscapeKey: false,
  allowOutsideClick: false,
}

function mensajeEvaluacionOxigeno(){
  swal(mensajeOxigeno);
} 
//#endregion Analítica

Mensajes.ejecutarLogin = ejecutarLogin;
Mensajes.recolectarCredencialesAcceso = recolectarCredencialesAcceso;
Mensajes.mensajeEvaluacionOxigeno = mensajeEvaluacionOxigeno;
Mensajes.mensajeEvaluacionPulso = mensajeEvaluacionPulso;
Mensajes.mensajeEvaluacionTemperatura = mensajeEvaluacionTemperatura;
Mensajes.ejecutarLogOut = ejecutarLogOut;
Mensajes.mensajeFalloGetAPI = mensajeFalloGetAPI;
Mensajes.mensajeFalloPostAPI = mensajeFalloPostAPI;

export {Mensajes};