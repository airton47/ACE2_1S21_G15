
import {mainApp, dataGraficoHistorialActual,graficoHistorial, labelsGraficoHistorialActual,colorGraficoHistorialActual,colorHoverGraficoHistorialActual, dataRitmoGrafico, labelsRitmoGrafico, dataTemperaturaGrafico, labelsTemperaturaGrafico, dataOxigenoGrafico, labelsOxigenoGrafico, graficoRitmoCardiaco, graficoOxigeno, graficoTemperatura, componentesNaveteeLive} from "./main-vue";
import {Mensajes} from './Mensajes';
import "regenerator-runtime/runtime.js"; //permite la compilación de Async en Babel

const Procesos = {};

const rutaAWS = 'http://ec2-18-117-15-152.us-east-2.compute.amazonaws.com:5000';

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
    const urlAPI = rutaAWS + '/usuarios/getUsernames';
    const usuariosDelSistema = await obtenerInfoPorAPI(urlAPI, '');
    return usuariosDelSistema;
}

async function obtenerDatosUsuarioEspecifico(username){
    const urlAPI = rutaAWS + '/usuarios/getUsuario/';
    const datosRecibidos = await obtenerInfoPorAPI(urlAPI, username);
    return datosRecibidos;
}

async function obtenerDatosCompletosUsuariosSistema(){
    const urlAPI = rutaAWS + '/usuarios/getUsuarios';
    const datosUsuariosDelSistema = await obtenerInfoPorAPI(urlAPI, '');
    return datosUsuariosDelSistema;
}

async function obtenerAtletasBajoCoach(coach){
    const urlAPI = rutaAWS + '/usuarios/getAtletaFromCoach/';
    const datosAtletas = await obtenerInfoPorAPI(urlAPI, coach);
    return datosAtletas;
}

async function obtenerHistorialesAtleta(atleta){
    const urlAPI = rutaAWS + '/tests/getTest/';
    const datosHistorialesAtleta = await obtenerInfoPorAPI(urlAPI, atleta);
    return datosHistorialesAtleta;
}

async function obtenerRutinasAtleta(atleta){
    const urlAPI = rutaAWS + '/rutinas/get/';
    const datosRutinasAtleta = await obtenerInfoPorAPI(urlAPI, atleta);
    return datosRutinasAtleta;
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
    const urlAPI = rutaAWS + '/usuarios/addAtleta';
    const respuestaEnvio = await enviarInfoAPI(infoAtleta, urlAPI, '');
    return respuestaEnvio;
}

async function crearNuevoCoach(infoCoach){
    const urlAPI = rutaAWS + '/usuarios/addCoach';
    const respuestaEnvio = await enviarInfoAPI(infoCoach, urlAPI, '');
    return respuestaEnvio;
}

async function asignarAtletaACoach(coach, atleta){
    const urlAPI = rutaAWS + '/usuarios/addAtletaToCoach/';
    const respuestaEnvio = await enviarInfoAPI(atleta, urlAPI, coach);
    return respuestaEnvio;
}

async function cambiarEstadoRutina(informacion, atleta){
    const urlAPI = rutaAWS + '/rutinas/estado/';
    const respuestaEnvio = await enviarInfoAPI(informacion, urlAPI, atleta);
    return respuestaEnvio;
}

async function cambiarIntensidadRutina(informacion, atleta){
    const urlAPI = rutaAWS + '/rutinas/intensidad/';
    const respuestaEnvio = await enviarInfoAPI(informacion, urlAPI, atleta);
    return respuestaEnvio;
}

async function cambiarEstadoRutinaActual(fecha){
    let cambioEstadoRutina = '{"fecha":"'+fecha+'","estado":false}';
    let respuesta = await cambiarEstadoRutina(JSON.parse(cambioEstadoRutina), mainApp.datosDePerfilEnSesion.username);
    console.log(respuesta);
}

async function cambiarIntensidadRutinaActual(fecha, intensidad){
    let cambioEstadoRutina = '{"fecha":"'+fecha+'","intensidad":"'+intensidad+'"}';
    let respuesta = await cambiarIntensidadRutina(JSON.parse(cambioEstadoRutina), mainApp.datosDePerfilEnSesion.username);
    console.log(respuesta);
}

//#endregion Solicitudes POST

//#region Acciones Historiales

function verHistorialPersonal(){
    mainApp.evaluacionAtleta.username = mainApp.datosDePerfilEnSesion.username; 
    /*esto permite que en los usuarios de tipo coach no se mezclen
     sus historiales con los historiales del atleta cuyo análisis está en curso. */
     Procesos.obtenerHistorialesPersonales();
}

function obtenerHistorialesPersonales(){ //se emplea para saber el historial del usuario en sesión
    //mainApp.estadoVisualizadores.estadoHistorialPropio = true;
    mainApp.evaluacionAtleta.username = mainApp.datosDePerfilEnSesion.username;
    swal({
        title: 'Recolectando historiales de ' + mainApp.evaluacionAtleta.username,
        html: '<b>Cargando mediciones recientes...</b>',
        timer: 2500,
        showConfirmButton: false,
        type: 'info',
        allowEscapeKey: false,
        allowOutsideClick: false
    });
    setTimeout(mostrarRutinasEnTabla, 2300);
}

function obtenerDetallesRutina(){
    let filaActual = this.parentNode; //La fila actual donde se presionó el boton de historial
    let fechaRutina = filaActual.firstChild.textContent;
    mainApp.evaluacionAtleta.fechaRutina = fechaRutina;
    swal({
        html: '<b>Cargando detalles de rutina...</b>',
        timer: 2500,
        showConfirmButton: false,
        type: 'info',
        allowEscapeKey: false,
        allowOutsideClick: false
    });
    setTimeout(mostrarDetalleRutinaTablas, 2500);
}

function obtenerGraficoRutina(){
    let filaActual = this.parentNode; //La fila actual donde se presionó el boton de historial
    let fechaRutina = filaActual.firstChild.textContent;
    mainApp.evaluacionAtleta.fechaRutina = fechaRutina;
    swal({
        title: 'Grafico de mediciones',
        text: 'Seleccione cúal medición se graficará:',
        input: 'select',
        inputOptions: {
          Ritmo: 'Ritmo Cardíaco',
          Temperatura: 'Temperatura',
          Oxigeno: 'Oxígeno',
          Velocidad: 'Velocidad',
          Distancia: 'Distancia'
        },
        allowEscapeKey: false,
        allowOutsideClick: false
      }).then( result => {
        const medicionSeleccionada = result.value;
        mainApp.evaluacionAtleta.medicionGrafico = medicionSeleccionada;
        swal({
            html: '<b>Generando gráfico de  '+ medicionSeleccionada+'</b>',
            timer: 2500,
            showConfirmButton: false,
            type: 'success',
            allowEscapeKey: false,
            allowOutsideClick: false
        });
        setTimeout(mostrarGraficoMedicionesRutina, 2500);
      });
}

async function mostrarRutinasAtletaActual(){
    //Vaciamos la tabla actual
    vaciarBotonesTablaRutinas();
    mainApp.controladoresDeHistoriales.listaRutinas.splice(0, mainApp.controladoresDeHistoriales.listaRutinas.length);
    //recolectamos los historiales del atleta con la API
    const historialesRecolectados = await obtenerRutinasAtleta(mainApp.evaluacionAtleta.username);
    //ingresamos los nuevos datos, VUE los mostrará por si solo como se indicó en el HTML
    historialesRecolectados.forEach(elemento => {
        mainApp.controladoresDeHistoriales.listaRutinas.push({
            fecha: elemento.fecha,
        });  
    }); 
}


function generarBotonesTablaRutinas(){
    document.querySelectorAll('#cuerpoRutinasAtleta tr')
    .forEach(fila =>{
        let contenedorActivadorDetalles = document.createElement('td');
        let iconoVisor = document.createElement('span');
        iconoVisor.className="icon-eye";
        iconoVisor.alt = "Ver Detalles";
        iconoVisor.title = "Ver Detalles";
        contenedorActivadorDetalles.appendChild(iconoVisor);
        contenedorActivadorDetalles.addEventListener("click", Procesos.obtenerDetallesRutina);
        fila.appendChild(contenedorActivadorDetalles);
        let contenedorActivadorGraficos = document.createElement('td');
        let iconoGrafico = document.createElement('span');
        iconoGrafico.className="icon-stats-dots";
        iconoGrafico.alt = "Graficar datos";
        iconoGrafico.title = "Graficar Datos";
        contenedorActivadorGraficos.appendChild(iconoGrafico);
        contenedorActivadorGraficos.addEventListener("click", Procesos.obtenerGraficoRutina);
        fila.appendChild(contenedorActivadorGraficos);
    }); 
}

function vaciarBotonesTablaRutinas(){
    //esta tabla se vacia de esta forma porque posee botones dinámicos
    /* mainApp.activarVisorHistorial */
    document.querySelectorAll('#cuerpoRutinasAtleta tr')
    .forEach(fila =>{
        fila.removeChild(fila.lastChild); //el último hijo es una columna que tiene al boton
    }); 
}


async function mostrarRutinasEnTabla(){
    mainApp.activarVisorHistorial();
    await mostrarRutinasAtletaActual();
    //generamos los botones para ver los detalles de rutina y la opción de graficarlos
    generarBotonesTablaRutinas();
    limpiarTablasDetalleRutina();
}

function limpiarTablasDetalleRutina(){
    //Ritmo Cardiaco
    mainApp.indicadoresDeSaludHistorial.pulsoPromedio = 0;
    mainApp.indicadoresDeSaludHistorial.pulsoMaximo = 0;
    mainApp.indicadoresDeSaludHistorial.pulsoMinimo = 0;
    //Temperatura
    mainApp.indicadoresDeSaludHistorial.temperaturaPromedio = 0;
    mainApp.indicadoresDeSaludHistorial.temperaturaMaxima = 0;
    mainApp.indicadoresDeSaludHistorial.temperaturaMinima = 0;
    //Oxigeno en la Sangre
    mainApp.indicadoresDeSaludHistorial.oxigenoPromedio = 0;
    mainApp.indicadoresDeSaludHistorial.oxigenoMaximo = 0;
    mainApp.indicadoresDeSaludHistorial.oxigenoMinimo = 0;
    //Velocidades
    mainApp.indicadoresDeSaludHistorial.velocidadPromedio = 0;
    mainApp.indicadoresDeSaludHistorial.velocidadMaxima = 0;
    mainApp.indicadoresDeSaludHistorial.velocidadMinima = 0;
    //Distancias de elevación de pesa
    mainApp.indicadoresDeSaludHistorial.distanciaPromedio = 0;
    mainApp.indicadoresDeSaludHistorial.distanciaMaxima = 0;
    mainApp.indicadoresDeSaludHistorial.distanciaMinima = 0;
    //Datos calculados por analitica
    mainApp.indicadoresDeSaludHistorial.pesoConsiderado = 0;
    mainApp.indicadoresDeSaludHistorial.calorias = 0;
    mainApp.indicadoresDeSaludHistorial.intensidad = "---";
}

async function mostrarDetalleRutinaTablas(){
    const historialesRecolectados = await obtenerRutinasAtleta(mainApp.evaluacionAtleta.username);
    //vaciamos la lsita por si tiene datos previos
    historialesRecolectados.forEach(elemento =>{
        if(mainApp.evaluacionAtleta.fechaRutina == elemento.fecha){
            console.log("el que coincide es: " + JSON.stringify(elemento));
        //Ritmo Cardiaco
        mainApp.indicadoresDeSaludHistorial.pulsoPromedio = elemento.promPulso.toFixed(2);
        mainApp.indicadoresDeSaludHistorial.pulsoMaximo = elemento.maxPulso;
        mainApp.indicadoresDeSaludHistorial.pulsoMinimo = elemento.minPulso;
        //Temperatura
        mainApp.indicadoresDeSaludHistorial.temperaturaPromedio = elemento.promTemperatura.toFixed(2);
        mainApp.indicadoresDeSaludHistorial.temperaturaMaxima = elemento.maxTemperatura;
        mainApp.indicadoresDeSaludHistorial.temperaturaMinima = elemento.minTemperatura;
        //Oxigeno en la Sangre
        mainApp.indicadoresDeSaludHistorial.oxigenoPromedio = elemento.promOxigeno.toFixed(2);
        mainApp.indicadoresDeSaludHistorial.oxigenoMaximo = elemento.maxOxigeno;
        mainApp.indicadoresDeSaludHistorial.oxigenoMinimo = elemento.minOxigeno;
        //Velocidades
        mainApp.indicadoresDeSaludHistorial.velocidadPromedio = elemento.promVelocidad.toFixed(2);
        mainApp.indicadoresDeSaludHistorial.velocidadMaxima = elemento.maxVelocidad;
        mainApp.indicadoresDeSaludHistorial.velocidadMinima = elemento.minVelocidad;
        //Distancias de elevación de pesa
        mainApp.indicadoresDeSaludHistorial.distanciaPromedio = elemento.promDistancia.toFixed(2);
        mainApp.indicadoresDeSaludHistorial.distanciaMaxima = elemento.maxDistancia;
        mainApp.indicadoresDeSaludHistorial.distanciaMinima = elemento.minDistancia;
        //Datos calculados por analitica
        mainApp.indicadoresDeSaludHistorial.pesoConsiderado = elemento.peso;
        mainApp.indicadoresDeSaludHistorial.calorias = elemento.calorias;
        mainApp.indicadoresDeSaludHistorial.intensidad = obtenerIntensidad(elemento.intensidad);
        }
    });
}

function obtenerIntensidad(intensidad){
    if(intensidad == "S"){
        return "Suave";
    } else if(intensidad == "M"){
        return "Medio";
    } else{
        return "Intenso";
    }
}

async function mostrarGraficoMedicionesRutina(){
    const historialesRecolectados = await obtenerRutinasAtleta(mainApp.evaluacionAtleta.username);
    //vaciamos los elementos del gráfico por si tiene datos previos
    dataGraficoHistorialActual.splice(0, dataGraficoHistorialActual.length);
    labelsGraficoHistorialActual.splice(0, labelsGraficoHistorialActual.length);
    colorGraficoHistorialActual.splice(0, colorGraficoHistorialActual.length);
    colorHoverGraficoHistorialActual.splice(0, colorHoverGraficoHistorialActual.length);
    //ingresamos los nuevos datos, VUE los mostrará por si solo como se indicó en el HTML
    historialesRecolectados.forEach(elemento => {
        if(elemento.fecha == mainApp.evaluacionAtleta.fechaRutina){
            if(mainApp.evaluacionAtleta.medicionGrafico == 'Ritmo'){
                elemento.pulso.forEach(pulso =>{
                    dataGraficoHistorialActual.push(pulso); 
                    labelsGraficoHistorialActual.push(pulso); 
                    /*rojo*/
                    colorGraficoHistorialActual.push('rgba(255,51,51, 0.5)'); 
                    colorHoverGraficoHistorialActual.push('rgb(255,51,51)'); 
                });
            } else if(mainApp.evaluacionAtleta.medicionGrafico == 'Temperatura'){
                elemento.temperatura.forEach(temperatura =>{
                    dataGraficoHistorialActual.push(temperatura); 
                    labelsGraficoHistorialActual.push(temperatura); 
                    /*azul*/
                    colorGraficoHistorialActual.push('rgba(153, 153, 255, 0.3)'); 
                    colorHoverGraficoHistorialActual.push('rgb(153, 153, 255)'); 
                });
            } else if(mainApp.evaluacionAtleta.medicionGrafico == 'Velocidad'){
                elemento.velocidad.forEach(velocidad =>{
                    dataGraficoHistorialActual.push(velocidad); 
                    labelsGraficoHistorialActual.push(velocidad); 
                    /*amarillo*/
                    colorGraficoHistorialActual.push('rgba(243, 207, 26, 0.3)'); 
                    colorHoverGraficoHistorialActual.push('rgb(243, 207, 26)'); 
                });
            } else if(mainApp.evaluacionAtleta.medicionGrafico == 'Distancia'){
                elemento.distancia.forEach(distancia =>{
                    dataGraficoHistorialActual.push(distancia); 
                    labelsGraficoHistorialActual.push(distancia); 
                    /*morado*/
                    colorGraficoHistorialActual.push('rgba(152, 74, 147, 0.3)'); 
                    colorHoverGraficoHistorialActual.push('rgb(152, 74, 147)'); 
                });
            }else{
                elemento.oxigeno.forEach(oxigeno =>{
                    dataGraficoHistorialActual.push(oxigeno); 
                    labelsGraficoHistorialActual.push(oxigeno); 
                    /*verde*/
                    colorGraficoHistorialActual.push('rgba(102, 255, 102, 0.4)'); 
                    colorHoverGraficoHistorialActual.push('rgb(102, 255, 102)'); 
                });
            }
        }
    }); 
    graficoHistorial.update();
}


function empujarDatosLiveVO2(dato, elemento, indicador){
    componentesVolumnenesLive.dataVolumenesGrafico.push(dato); 
    componentesVolumnenesLive.labelsVolumenesGrafico.push(dato); 
    if(indicador){
        mainApp.indicadoresDeSaludVariables.inhalacionActual = dato;
    }else{
        mainApp.indicadoresDeSaludVariables.exhalacionActual = dato;
    }
    mainApp.indicadoresDeSaludVariables.vo2Actual = elemento.vo2;
    componentesVolumnenesLive.graficoVO2.update();
}

//#endregion Acciones Historiales

//#region Acciones sobre Coach y Atletas

async function mostrarVisorAtletasAsignados(){
    //reiniciamos los visores de datos
    mainApp.evaluacionAtleta.nombreAtleta = '---';
    mainApp.evaluacionAtleta.apellidoAtleta = '---';
    await mostrarAtletasAsignados(mainApp.datosDePerfilEnSesion.username);
    //generamos los botones para ver los historiales individuales de cada atleta
    generarBotonesTablaAtletas();
    obtenerUsuariosNoAsignados();
    mainApp.activarVisorAtletas();
}

async function obtenerUsuariosNoAsignados(){
    let selector = document.getElementById('atletasNoAsignados');
    //vaciamso el selector de usernames:
    while (selector.firstChild){
        selector.removeChild(selector.firstChild);
      };
    const usuariosActualesSistema = await obtenerUsernamesSistema();
    const datosUsuariosBajoCoachActual = await obtenerAtletasBajoCoach(mainApp.datosDePerfilEnSesion.username);
    let usuariosBajoCoachActual = [];
    datosUsuariosBajoCoachActual.forEach(elemento =>{
        usuariosBajoCoachActual.push(elemento.username);
    });
    const diferenciaDeArreglos = (arr1, arr2) => {
        return arr1.filter(elemento => arr2.indexOf(elemento) == -1);
    }
    let usuarioNoAsignados = diferenciaDeArreglos(usuariosActualesSistema, usuariosBajoCoachActual);
    //eliminamos al coach en sesión (ya que el no se púede asignar a si mismo)
    let indiceCoach = usuarioNoAsignados.indexOf(mainApp.datosDePerfilEnSesion.username); // obtenemos el indice
    usuarioNoAsignados.splice(indiceCoach, 1);
    //Los mostramos en el selector de usernames
    usuarioNoAsignados.forEach(elemento =>{
        let opcionSelector = document.createElement('option');
        opcionSelector.textContent = elemento;
        selector.appendChild(opcionSelector);
    });
}

async function asignarAtletaNoAsignado(){
    let atletaSeleccionado = document.getElementById('atletasNoAsignados').value;
    let envioAtleta = '{"username":"'+atletaSeleccionado+'"}';
    await asignarAtletaACoach(mainApp.datosDePerfilEnSesion.username , JSON.parse(envioAtleta));
    swal({
        title: 'Atleta asignado',
        html: '<b>Ahora podrás ver sus historiales...</b>',
        timer: 2500,
        showConfirmButton: false,
        type: 'success',
        allowEscapeKey: false,
        allowOutsideClick: false
    });
    setTimeout(mostrarVisorAtletasAsignados, 2300);
}

async function obtenerNombresAtletaNoAsignado(){
    let atletaSeleccionado = document.getElementById('atletasNoAsignados').value;
    let datosUsuario = await obtenerDatosUsuarioEspecifico(atletaSeleccionado);
    mainApp.evaluacionAtleta.nombreAtleta = datosUsuario.nombres.split(' ')[0]; //solo el primer nombre
    mainApp.evaluacionAtleta.apellidoAtleta = datosUsuario.apellidos.split(' ')[0]; //solo el primer apellido
}

//#endregion Acciones sobre Coach

//#region Mediciones en Vivo

async function medirEnVivo(){
    let rutinasRecolectadas = await obtenerRutinasAtleta(mainApp.datosDePerfilEnSesion.username);
    if(rutinasRecolectadas.length != 0){
        let medicionActual = rutinasRecolectadas[rutinasRecolectadas.length-1];
    try{
        //Ritmo Cardiaco
        mainApp.indicadoresDeSaludVariables.pulsoActual = medicionActual.pulso[medicionActual.pulso.length-1];
        mainApp.indicadoresDeSaludVariables.pulsoPromedio = medicionActual.promPulso;
        mainApp.indicadoresDeSaludVariables.pulsoMaximo = medicionActual.maxPulso;
        mainApp.indicadoresDeSaludVariables.pulsoMinimo = medicionActual.minPulso;
        dataRitmoGrafico.push(medicionActual.pulso[medicionActual.pulso.length-1]);
        labelsRitmoGrafico.push(medicionActual.pulso[medicionActual.pulso.length-1]);
        graficoRitmoCardiaco.update();
        //Temperatura
        mainApp.indicadoresDeSaludVariables.temperaturaActual = medicionActual.temperatura[medicionActual.temperatura.length-1];
        mainApp.indicadoresDeSaludVariables.temperaturaPromedio = medicionActual.promTemperatura;
        mainApp.indicadoresDeSaludVariables.temperaturaMaximo = medicionActual.maxTemperatura;
        mainApp.indicadoresDeSaludVariables.temperaturaMinimo = medicionActual.minTemperatura;
        dataTemperaturaGrafico.push(medicionActual.temperatura[medicionActual.temperatura.length-1]);
        labelsTemperaturaGrafico.push(medicionActual.temperatura[medicionActual.temperatura.length-1]);
        graficoTemperatura.update();
        //Oxigeno
        mainApp.indicadoresDeSaludVariables.oxigenoActual = medicionActual.oxigeno[medicionActual.oxigeno.length-1];
        mainApp.indicadoresDeSaludVariables.oxigenoPromedio = medicionActual.promOxigeno;
        mainApp.indicadoresDeSaludVariables.oxigenoMaximo = medicionActual.maxOxigeno;
        mainApp.indicadoresDeSaludVariables.oxigenoMinimo = medicionActual.minOxigeno;
        dataOxigenoGrafico.push(medicionActual.oxigeno[medicionActual.oxigeno.length-1]);
        labelsOxigenoGrafico.push(medicionActual.oxigeno[medicionActual.oxigeno.length-1]);
        graficoOxigeno.update();
        //Velocidad
        mainApp.indicadoresDeSaludVariables.velocidadActual = medicionActual.velocidad[medicionActual.velocidad.length-1];
        mainApp.indicadoresDeSaludVariables.velocidadMaxima = medicionActual.maxVelocidad;
        mainApp.indicadoresDeSaludVariables.velocidadMinima = medicionActual.minVelocidad;
        mainApp.indicadoresDeSaludVariables.velocidadPromedio = medicionActual.promVelocidad;
        componentesNaveteeLive.dataVelocidadGrafico.push(mainApp.indicadoresDeSaludVariables.velocidadActual);
        componentesNaveteeLive.labelsVelocidadGrafico.push(mainApp.indicadoresDeSaludVariables.velocidadActual);
        componentesNaveteeLive.graficoVelocidad.update();
        //Distancia
        mainApp.indicadoresDeSaludVariables.distanciaActual = medicionActual.distancia[medicionActual.distancia.length-1];
        mainApp.indicadoresDeSaludVariables.distanciaMaxima = medicionActual.maxDistancia;
        mainApp.indicadoresDeSaludVariables.distanciaMinima = medicionActual.minDistancia;
        mainApp.indicadoresDeSaludVariables.distanciaPromedio = medicionActual.promDistancia;
        componentesNaveteeLive.dataDistanciaGrafico.push(mainApp.indicadoresDeSaludVariables.distanciaActual);
        componentesNaveteeLive.labelsDistanciaGrafico.push(mainApp.indicadoresDeSaludVariables.distanciaActual);
        componentesNaveteeLive.graficoDistancia.update();
        //Datos calculados:
        mainApp.indicadoresDeSaludVariables.calorias = medicionActual.calorias;
    }catch(exception){
        console.log("hubo un fallo al obtener los datos");
    }
    }
}

const timer = ms => new Promise(res => setTimeout(res, ms));

async function ejecutarMedicionEnVivo(){
    habilitarBotonFinEvaluacion();
    let tiempoEspera = 7000; //milisegundos
    mainApp.reiniciarVisoresMedicionesEnVivo();
    swal({
        html: '<b>Iniciando proyección de datos...</b>',
        timer: 1500,
        showConfirmButton: false,
        type: 'info',
        allowEscapeKey: false,
        allowOutsideClick: false
    });
    do{
        await timer(tiempoEspera); 
        medirEnVivo();
    }while(mainApp.indicadoresDeSaludVariables.indicadorSeguimiento);
    Mensajes.mostrarMensajeMedicionEnVivoFinalizada(); 
}

function finalizarMedicionEnVivo(){
    mainApp.indicadoresDeSaludVariables.indicadorSeguimiento = false;
    habilitarBotonInicioEvaluacion();
}

function notificarAumentoCardiaco(){
    Mensajes.mostrarMensajeAumentoCardiaco();
    finalizarMedicionEnVivo();
}

function habilitarBotonInicioEvaluacion(){
    let botonInicio = document.getElementById('botonInicioEvaluacion');
    let botonFin = document.getElementById('botonFinEvaluacion');
    botonFin.disabled = true;
    botonInicio.disabled = false;
}

function habilitarBotonFinEvaluacion(){
    let botonInicio = document.getElementById('botonInicioEvaluacion');
    let botonFin = document.getElementById('botonFinEvaluacion');
    botonFin.disabled = false;
    botonInicio.disabled = true;
}

function seleccionarIntensidad(){
    let selectorIntensidad = document.getElementById("selectorIntensidad");
    let intensidadElegida = selectorIntensidad.options[selectorIntensidad.selectedIndex].value;
    if(intensidadElegida == "Suave"){
        mainApp.indicadoresDeSaludVariables.tiempoRestante = "03:00";
        mainApp.indicadoresDeSaludVariables.milisegundosActividad = 180000;
        Mensajes.mostrarMensajeIntensidadSuave();

    }else if(intensidadElegida == "Medio"){
        mainApp.indicadoresDeSaludVariables.tiempoRestante = "07:00";
        mainApp.indicadoresDeSaludVariables.milisegundosActividad = 420000;
        Mensajes.mostrarMensajeIntensidadMedia();
    }else{ //Intenso
        mainApp.indicadoresDeSaludVariables.tiempoRestante = "20:00";
        mainApp.indicadoresDeSaludVariables.milisegundosActividad = 1200000;
        Mensajes.mostrarMensajeIntensidadSuperIntensa();
    }
}


function analizarRitmosActuales(){
    while(true){
        if(mainApp.indicadoresDeSaludVariables.pulsoActual > 180){
            Mensajes.mostrarMensajeAumentoCardiaco();
            break;
        }else{
            Mensajes.mostrarRecordatorioRespiracion();
            break;
        }
    }
}

function analizarTemperaturasActuales(){
    while(true){
        if(mainApp.indicadoresDeSaludVariables.temperaturaActual > 39){
            Mensajes.mostrarMensajeAumentoTemperatura();
            break;
        } else if(mainApp.indicadoresDeSaludVariables.temperaturaActual < 32){
            Mensajes.mostrarMensajeDisminucionTemperatura();
            break;
        } else{
            Mensajes.mostrarRecordatorioRespiracion();
            break;
        }
    }
}

function analizarElevacionesActuales(){
    while(true){
        if(mainApp.indicadoresDeSaludVariables.distanciaActual >= 75){
            Mensajes.mostrarElevacionExitosa();
            break;
        }else{
            Mensajes.mostrarElevacionFallida();
            break;
        }
    }
}

function analizarElementosActuales(){
    switch (mainApp.indicadoresDeSaludVariables.analisisInteligente) {
        case 0:
            analizarElevacionesActuales();
            mainApp.indicadoresDeSaludVariables.analisisInteligente = mainApp.indicadoresDeSaludVariables.analisisInteligente + 1;
          break;
        case 1:
            analizarTemperaturasActuales();
            mainApp.indicadoresDeSaludVariables.analisisInteligente = mainApp.indicadoresDeSaludVariables.analisisInteligente + 1;
          break;
        default:
            analizarRitmosActuales();
            mainApp.indicadoresDeSaludVariables.analisisInteligente = 0;
          break;
      }
}

async function emplearActualizacionDatosRutina(){
    let rutinasRecolectadas = await obtenerRutinasAtleta(mainApp.datosDePerfilEnSesion.username);
    if(rutinasRecolectadas.length != 0){
        let rutinaActual = rutinasRecolectadas[rutinasRecolectadas.length-1];
        //Se cambia el estado de la rutina y la intensidad de rutina
        cambiarEstadoRutinaActual(rutinaActual.fecha);
        let selectorIntensidad = document.getElementById("selectorIntensidad");
        let intensidadElegida = selectorIntensidad.options[selectorIntensidad.selectedIndex].value;
        if(intensidadElegida == "Suave"){
            cambiarIntensidadRutinaActual(rutinaActual.fecha, "S");
        }else if(intensidadElegida == "Medio"){
            cambiarIntensidadRutinaActual(rutinaActual.fecha, "M");
        }else{ //Intenso
            cambiarIntensidadRutinaActual(rutinaActual.fecha, "I");
        }
    }
}

async function ejecutarRutinaEnVivo(){
    let tiempoEspera = 1000; //milisegundos  (1 segundo)
    let tiempoAnalitica = 27000 //es impar para que en los ultimos wgundos no interfiera con el resumen de análisis;
    let TiempoSesion = mainApp.indicadoresDeSaludVariables.milisegundosActividad; //milisegundos (tiempo de la rutina elegida)
    let tiempoElegido = mainApp.indicadoresDeSaludVariables.tiempoRestante;
    let tiempoRecopilacionDatos = 1000; //1 segundo
    mainApp.reiniciarVisoresMedicionesEnVivo();
    bloquearElementosAccionadores();
    swal({
        html: '<b>Iniciando sesión de análisis...</b>',
        timer: 1500,
        showConfirmButton: false,
        type: 'info',
        allowEscapeKey: false,
        allowOutsideClick: false
    });
    mostrarTiemposRestante(TiempoSesion);
    do{
        let tiempoInicial = 0;
        while(tiempoInicial < tiempoEspera){
            await timer(tiempoRecopilacionDatos);
            //recopilar datos
            //actualizarLiveVO2MAX();
            tiempoInicial = tiempoInicial + tiempoRecopilacionDatos;
        } 
        TiempoSesion = TiempoSesion - 1000; //1 segundo
        tiempoAnalitica = tiempoAnalitica -1000;
        if(tiempoAnalitica == 0){
            analizarElementosActuales();
            tiempoAnalitica = 27000;
        }
        mostrarTiemposRestante(TiempoSesion);
        medirEnVivo();
    }while(TiempoSesion > 0);
    //Mensajes.mostrarMensajeMedicionEnVivoFinalizada(); 
    emplearActualizacionDatosRutina();
    actualizarResumenAnalitico();
    mainApp.indicadoresDeSaludVariables.tiempoRestante = tiempoElegido;
    desbloquearElementosAccionadores();
}

function bloquearElementosAccionadores(){
    let botonInicio = document.getElementById('botonInicioEvaluacion');
    let selector = document.getElementById('selectorIntensidad');
    botonInicio.disabled = true;
    selector.disabled = true;
}

function desbloquearElementosAccionadores(){
    let botonInicio = document.getElementById('botonInicioEvaluacion');
    let selector = document.getElementById('selectorIntensidad');
    botonInicio.disabled = false;
    selector.disabled = false;
}

function obtenerAnalisisRutina(){
    let analisis = "<ol>";
    analisis = analisis + analizarCalorias() + analizarRitmosCardiacos() + analizarTemperaturas();
    analisis = analisis + "</ol>";
    return analisis;
}

function analizarRitmosCardiacos(){
    let pulsoMinimo = mainApp.indicadoresDeSaludVariables.pulsoMinimo;
    let pulsoMaximo = mainApp.indicadoresDeSaludVariables.pulsoMaximo;
    let analisis = "<li>Dado el <b>pulso minimo de " + pulsoMinimo + " lpm</b> y el <b>pulso máximo de "+ pulsoMaximo + " lpm</b> ";
    if(pulsoMinimo === 0 && pulsoMaximo === 0 ){
        analisis = analisis + "se recomienda <b>ajustar el guante de manera correcta</b>, ya que <b>no se detectaron ritmos</b> durante la rutina";
    } else if(pulsoMinimo < 75 && pulsoMaximo < 175 ){
        analisis = analisis + "se recomienda un <b>chequeo médico</b> ya que el pulso minimo estuvo muy por debajo del estándar";
    } else if(pulsoMinimo > 75 && pulsoMaximo > 175 ){
        analisis = analisis + "se recomienda un <b>chequeo médico</b> ya que el pulso máximo estuvo muy por encima del estándar";
    } else if(pulsoMinimo < 75 && pulsoMaximo > 175 ){
        analisis = analisis + "se han presentado desbalances cardiacos a lo largo de la rutina, se recomienda un <b>ejercicio más ligero</b>";
    } else{
        analisis = analisis + "la rutina <b>es adecuada</b> para el atleta";
    }
    analisis = analisis + "</li>";
    return analisis;
}

function analizarTemperaturas(){
    let temperaturaMinima = mainApp.indicadoresDeSaludVariables.temperaturaMinima;
    let temperaturaMaxima = mainApp.indicadoresDeSaludVariables.temperaturaMaxima;
    let analisis = "<li>";
    if(temperaturaMinima < 36 ){
        analisis = analisis + "Dada una temperatura minima de <b>"+temperaturaMinima+" C°</b>, se recomienda <b>hacer un precalentamiento</b> previo a próximas rutinas en el futuro";
    } else if(temperaturaMaxima > 41 ){
        analisis = analisis + "Dada una temperatura máxima de  <b>"+ temperaturaMaxima +" C°</b> se recomienda <b>tomar una bebida hidratante de inmediato</b>";
    } else{
        analisis = analisis + "La temperatura se mantuvo en un rango estándar estable durante la rutina";
    }
    analisis = analisis + "</li>";
    return analisis;
}

function analizarCalorias(){
    let caloriasQuemadas = mainApp.indicadoresDeSaludVariables.calorias;
    let analisis = "<li>Se ha quemado una cantidad de <b>" + caloriasQuemadas + " calorías</b>";
    analisis = analisis + "</li>";
    return analisis;
}

function actualizarResumenAnalitico(){
    let mensaje = Mensajes.mensajeMedicionFinalizada;
    mensaje.html = obtenerAnalisisRutina();
    swal(mensaje);
}

//#endregion Mediciones en Vivo

//#region Espirómetro en Vivo

async function ejecutarEspirometroEnVivo(){
    let tiempoEspera = 1000; //milisegundos  (1 segundo)
    let TiempoSesion = 300000; //milisegundos (5 minutos)
    let tiempoRecopilacionDatos = 200; //0.20 segundos
    mainApp.reiniciarElementosVO2MAXLive();
    swal({
        html: '<b>Iniciando sesión de análisis...</b>',
        timer: 1500,
        showConfirmButton: false,
        type: 'info',
        allowEscapeKey: false,
        allowOutsideClick: false
    });
    mostrarTiemposRestante(TiempoSesion);
    do{
        let tiempoInicial = 0;
        while(tiempoInicial < tiempoEspera){
            await timer(tiempoRecopilacionDatos);
            //recopilar datos
            actualizarLiveVO2MAX();
            tiempoInicial = tiempoInicial + tiempoRecopilacionDatos;
        } 
        TiempoSesion = TiempoSesion - 1000; //1 segundo
        mostrarTiemposRestante(TiempoSesion);
        //medirEnVivo();
    }while(TiempoSesion > 0);
    mainApp.evaluacionAtleta.numExhalacionesPrevias = 0;
    mainApp.evaluacionAtleta.numInhalacionesPrevias = 0;
    Mensajes.mostrarMensajeMedicionEnVivoFinalizada(); 
}

function calcularTiempos(milisegundos) {
    let segundos = (milisegundos / 1000).toFixed(0);
    let minutos = Math.floor(segundos / 60);
    let segundosPorMinuto =   Math.floor(segundos % 60);
    let tiempos = {
        segundos: segundosPorMinuto,
        minutos: minutos
    }
    return tiempos;
}

function proyectarTemporizador(minutos, segundos){
    mainApp.indicadoresDeSaludVariables.tiempoRestante = String(minutos).padStart(2,"0") + ":" + String(segundos).padStart(2,"0");
}

function mostrarTiemposRestante(TiempoSesion){
    let tiempos = calcularTiempos(TiempoSesion);
    proyectarTemporizador(tiempos.minutos, tiempos.segundos);
}

async function actualizarLiveVO2MAX(){
    const sesionesRecolectadas = await obtenerSesionesVO2Atleta(mainApp.datosDePerfilEnSesion.username);
    if(sesionesRecolectadas.length != 0){
        let sesionActual = sesionesRecolectadas[sesionesRecolectadas.length-1];
        console.log(sesionActual);
        if(sesionActual.volInhalado.length > mainApp.evaluacionAtleta.numInhalacionesPrevias && sesionActual.volInhalado.length > 0){
            //Actualmente se esta inhalando
            empujarDatosLiveVO2(sesionActual.volInhalado[sesionActual.volInhalado.length-1], sesionActual, true);
            mainApp.evaluacionAtleta.numInhalacionesPrevias = sesionActual.volInhalado.length;
        }if(sesionActual.volExhalado.length> mainApp.evaluacionAtleta.numExhalacionesPrevias && sesionActual.volExhalado.length > 0){
            //Actualmente se esta exhalando
            empujarDatosLiveVO2(sesionActual.volExhalado[sesionActual.volExhalado.length-1], sesionActual, false);
            mainApp.evaluacionAtleta.numExhalacionesPrevias = sesionActual.volExhalado.length;
        }
    }
    
}

async function obtenerSesionesVO2 (){
    
    //recolectamos los historiales del atleta con la API
    const sesionesRecolectadas = await obtenerSesionesVO2Atleta(mainApp.datosDePerfilEnSesion.username);
    //ingresamos los nuevos datos, VUE los mostrará por si solo como se indicó en el HTML
    sesionesRecolectadas.forEach(elemento => {
        mainApp.controladoresDeHistoriales.listaSesionesVO2.push({
            fecha: elemento.fecha,
            volExhalado: elemento.volExhalado,
            volInhalado: elemento.volInhalado,
            vo2Max: elemento.vo2.toFixed(3),
            volMaxExhalado: elemento.volMaxExhalado,
            volMinExhalado: elemento.volMinExhalado,
            volMaxInhalado: elemento.volMaxInhalado,
            volMinInhalado: elemento.volMinInhalado,
            volPromExhalado: elemento.volPromExhalado.toFixed(3),
            volPromInhalado: elemento.volPromInhalado.toFixed(3),
            volExhalado: elemento.volExhalado,
            volInhalado: elemento.volInhalado, 
            promsInhalado: elemento.promsInhalado,
            promsExhalado: elemento.promsExhalado
        });  
    }); 
}

async function MostrarSesionesVO2(){
    limpiarSesionesVO2();
    console.log("lol");
    await obtenerSesionesVO2();
    generarBotonesTablaSesiones();
    console.log("ultra paso");
    swal({
        title: 'Sesiones actualizadas',
        timer: 2500,
        showConfirmButton: false,
        type: 'info',
        allowEscapeKey: false,
        allowOutsideClick: false
    });
}

function plasmarDetallesSesion(){
    mainApp.controladoresDeHistoriales.listaPromediosMinutosVO2.splice(0, mainApp.controladoresDeHistoriales.listaPromediosMinutosVO2.length);
    let filaActual = this.parentNode; //La fila actual donde se presionó el boton de historial
    let fechaSesionEscogida = filaActual.firstChild.textContent;
    mainApp.controladoresDeHistoriales.listaSesionesVO2.forEach(elemento =>{
        if(elemento.fecha == fechaSesionEscogida){
            /*mainApp.indicadoresSesionVO2.inhalacionMin = elemento.volMinInhalado;
            mainApp.indicadoresSesionVO2.inhalacionMax = elemento.volMaxInhalado;
            mainApp.indicadoresSesionVO2.inhalacionProm = parseFloat(elemento.volPromInhalado).toFixed(3);
            mainApp.indicadoresSesionVO2.exhalacionMin = elemento.volMinExhalado;
            mainApp.indicadoresSesionVO2.exhalacionMax = elemento.volMaxExhalado;
            mainApp.indicadoresSesionVO2.exhalacionProm = parseFloat(elemento.volPromExhalado).toFixed(3);*/
            //mostramos los promedios por minuto
            for(let desplazador = 0; desplazador < elemento.promsInhalado.length; desplazador++){
                mainApp.controladoresDeHistoriales.listaPromediosMinutosVO2.push({
                    numMinuto: desplazador + 1,
                    promInhalacion: elemento.promsInhalado[desplazador].toFixed(3),
                    promExhalacion: elemento.promsExhalado[desplazador].toFixed(3)
                });
            }
        }
    });
    swal({
        title: 'Cargando detalles...',
        timer: 2500,
        showConfirmButton: false,
        type: 'info',
        allowEscapeKey: false,
        allowOutsideClick: false
    });
}

function graficarDetallesSesion(){
    let filaActual = this.parentNode; //La fila actual donde se presionó el boton de historial
    let fechaSesionEscogida = filaActual.firstChild.textContent;
    mainApp.evaluacionAtleta.fechaRutina = fechaSesionEscogida;
    swal({
        title: 'Grafico de mediciones',
        text: 'Seleccione cúal medición se graficará:',
        input: 'select',
        inputOptions: {
          inhalacion: 'Inhalaciones',
          exhalacion: 'Exhalaciones',
        },
        allowEscapeKey: false,
        allowOutsideClick: false
      }).then( result => {
        const medicionSeleccionada = result.value;
        mainApp.evaluacionAtleta.medicionGraficoVO2 = medicionSeleccionada;
        swal({
            html: '<b>Generando gráfico de  '+ medicionSeleccionada+'</b>',
            timer: 2500,
            showConfirmButton: false,
            type: 'success',
            allowEscapeKey: false,
            allowOutsideClick: false
        });
        setTimeout(mostrarGraficoSesionesVO2, 2500);
      });
}

//#endregion Espirómetro en Vivo


Procesos.obtenerUsernamesSistema = obtenerUsernamesSistema;
Procesos.obtenerDatosUsuarioEspecifico = obtenerDatosUsuarioEspecifico;
Procesos.obtenerDatosCompletosUsuariosSistema = obtenerDatosCompletosUsuariosSistema;
Procesos.crearNuevoAtleta = crearNuevoAtleta;
Procesos.obtenerAtletasBajoCoach = obtenerAtletasBajoCoach;
Procesos.generarBotonesTablaRutinas = generarBotonesTablaRutinas;
Procesos.obtenerHistorialesPersonales = obtenerHistorialesPersonales;
Procesos.obtenerDetallesRutina = obtenerDetallesRutina;
Procesos.obtenerGraficoRutina = obtenerGraficoRutina;
Procesos.crearNuevoCoach = crearNuevoCoach;
Procesos.asignarAtletaACoach = asignarAtletaACoach;
Procesos.obtenerUsuariosNoAsignados = obtenerUsuariosNoAsignados;
Procesos.mostrarVisorAtletasAsignados = mostrarVisorAtletasAsignados;
Procesos.verHistorialPersonal = verHistorialPersonal;
Procesos.asignarAtletaNoAsignado = asignarAtletaNoAsignado;
Procesos.obtenerNombresAtletaNoAsignado = obtenerNombresAtletaNoAsignado;
Procesos.ejecutarMedicionEnVivo = ejecutarMedicionEnVivo;
Procesos.finalizarMedicionEnVivo = finalizarMedicionEnVivo;
Procesos.ejecutarEspirometroEnVivo = ejecutarEspirometroEnVivo;
Procesos.MostrarSesionesVO2 = MostrarSesionesVO2;
Procesos.plasmarDetallesSesion = plasmarDetallesSesion;
Procesos.graficarDetallesSesion = graficarDetallesSesion;
Procesos.limpiarTablasDetalleRutina = limpiarTablasDetalleRutina;
Procesos.seleccionarIntensidad = seleccionarIntensidad;
Procesos.ejecutarRutinaEnVivo = ejecutarRutinaEnVivo;
Procesos.obtenerAnalisisRutina = obtenerAnalisisRutina;

export{Procesos};