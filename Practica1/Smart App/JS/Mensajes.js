
//Alertas emergentes editadas

const Mensajes = {};

//Mensajes Bases para Smart App y Analítica:

let mensajeIconoInfo = {
    title: "Titulo Informativo",
    text: "Mensaje Informativo.",
    icon: "info",
    button: "Aceptar"
}
  
  
let mensajeIconoExitoso = {
    title: "Titulo de éxito",
    text: "Mensaje de proceso exitoso.",
    icon: "success",
    button: "Aceptar"
}
  
  
let mensajeIconoFallida = {
    title: "Titulo de error",
    text: "Mensaje de error.",
    icon: "error",
    button: "Aceptar"
}


let mensajeIconoAdvertencia = {
    title: "Titulo de advertencia",
    text: "Mensaje de advertencia",
    icon: "warning",
    button: "Aceptar"
}

let mensajeIconoPregunta = {
  title: "Titulo de pregunta",
  text: "Mensaje de pregunta",
  icon: "question",
  button: "Aceptar"
}


let mensajeDividido = {
    mensaje: "Con estos mensajes se puede elegir entre varias opciónes a realizar.",
    opciones:{
      buttons: {
        proceso: {
          text: "Ejecutar proceso",
          value: "ejecutar",
        },cancel: "Cancelar Ejecución"
      },
      title: "Advertencia de ejecución de proceso",
      icon: "warning"
    }
};

function mostrarMensajeDividido(){
    swal(mensajeDividido.mensaje, mensajeDividido.opciones)
    .then((value) => {
      switch (value) {
        case "ejecutar":
          swal("Iniciando Ejecución", "Se iniciará el proceso", "info");
          //Ejecución dada la entrada de traducción
          break;
        default:
          swal("Proceso cancelado!");
      }
    });
}


function mostrarMensajeInformativo(){
    swal(mensajeIconoInfo);
}

Mensajes.mostrarMensajeDividido = mostrarMensajeDividido;
Mensajes.mostrarMensajeInformativo = mostrarMensajeInformativo;

export {Mensajes};