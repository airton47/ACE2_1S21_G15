
//Alertas emergentes editadas

const Mensajes = {};

//Mensajes Bases para Smart App y Analítica:

let mensajeBienvenida = {
  title: 'Bienvenido a Glove Fit!',
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
  allowOutsideClick: false,
  backdrop: false
}

function ejecutarLogOut(){
  swal(mensajeCierreSesion).then(result => {
   if (result.value){
      /* swal({
        title: 'Buen viaje...',
        html: '<b>Cerrando su sesión, espere un momento...</b>',
        timer: 2500,
        showConfirmButton: false,
        type: 'info',
        allowEscapeKey: false,
        allowOutsideClick: false,
        backdrop: false
      }); */
      console.log("Cerrando sesión...");
      ejecutarLogin();
   }
 });
}

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
  backdrop: false
  
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
  backdrop: false
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
  backdrop: false
}

function mensajeEvaluacionOxigeno(){
  swal(mensajeOxigeno);
} 


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


function recolectarCredencialesAcceso(){
  let longitudMaximaEntrada = 15; 
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
          if (value != 'admin') {
            return 'El usuario ingresado no existe, revise su escritura '
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
        }
        if (value != '1234') {
          return 'Su contraseña es incorrecta, revise su escritura '
        }
      },
      inputPlaceholder: 'Contraseña',
      confirmButtonText: 'Next &rarr;',
      progressSteps: ['1', '2'],
      allowEscapeKey: false,
      allowOutsideClick: false
    }
  ]).then( result => {
    const datosRecolectados = result.value;
    console.log(JSON.stringify(datosRecolectados));
    swal({
        title: 'Bienvenido! ' + datosRecolectados[0], //[0] es el usuario
        html: '<b>Cargando dashboard deportivo...</b>',
        timer: 2500,
        showConfirmButton: false,
        type: 'success',
        allowEscapeKey: false,
        allowOutsideClick: false
    })
  });
}

function recolectarDatosRegistro(){
  let longitudMaximaEntrada = 20; 
  swal.queue([
    {
      title: 'Paso # 1',
      text: 'Ingrese su nombre(de pila):',
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
      text: 'Ingrese su apellido:',
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
          if (value == 'admin') {
            return 'El usuario ingresado ya existe, escriba uno nuevo'
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
      text: 'Ingrese su peso(Kg):',
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
      text: 'Ingrese su estatura(en metros):',
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
    console.log(JSON.stringify(datosRecolectados));
    swal({
        title: 'Usuario Registrado con éxito',
        html: '<b>Bienvenido a la plataforma, creando dashboard...</b>',
        timer: 3000,
        showConfirmButton: false,
        type: 'success',
        allowEscapeKey: false,
        allowOutsideClick: false
    })
  });
}

Mensajes.ejecutarLogin = ejecutarLogin;
Mensajes.recolectarCredencialesAcceso = recolectarCredencialesAcceso;
Mensajes.mensajeEvaluacionOxigeno = mensajeEvaluacionOxigeno;
Mensajes.mensajeEvaluacionPulso = mensajeEvaluacionPulso;
Mensajes.mensajeEvaluacionTemperatura = mensajeEvaluacionTemperatura;
Mensajes.ejecutarLogOut = ejecutarLogOut;

export {Mensajes};