
import {mainApp, dataGraficoHistorialActual,graficoHistorial, labelsGraficoHistorialActual,colorGraficoHistorialActual,colorHoverGraficoHistorialActual, dataRitmoGrafico, labelsRitmoGrafico, dataTemperaturaGrafico, labelsTemperaturaGrafico, dataOxigenoGrafico, labelsOxigenoGrafico, graficoRitmoCardiaco, graficoOxigeno, graficoTemperatura} from "./main-vue";
import {Mensajes} from './Mensajes';
import "regenerator-runtime/runtime.js"; //permite la compilación de Async en Babel

const Procesos = {};

const rutaAWS = 'http://ec2-3-141-95-126.us-east-2.compute.amazonaws.com:5000';

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

//#region Pruebas Course-Navetee

async function obtenerEstadosNaveteeAtleta(atleta){
    const urlAPI = rutaAWS + '/pruebas/getIntentos/';
    const datosEstadosAtleta = await obtenerInfoPorAPI(urlAPI, atleta);
    return datosEstadosAtleta;
}

async function obtenerPruebasNaveteeAtleta(atleta){
    const urlAPI = rutaAWS + '/pruebas/getPruebas/';
    const datosPruebasAtleta = await obtenerInfoPorAPI(urlAPI, atleta);
    return datosPruebasAtleta;
}


//#endregion Pruebas Course-Navetee

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

//#endregion Solicitudes POST

//#region Acciones Historiales

function verHistorialPersonal(){
    mainApp.evaluacionAtleta.username = mainApp.datosDePerfilEnSesion.username; 
    /*esto permite que en los usuarios de tipo coach no se mezclen
     sus historiales con los historiales del atleta cuyo análisis está en curso. */
     Procesos.obtenerHistorialesPersonales();
}

function obtenerHistorialesCompletos(){ //lo emplea el coach para obtener el historial del atleta seleccionado
    let filaActual = this.parentNode; //La fila actual donde se presionó el boton de historial
    let usernameAtleta = filaActual.firstChild.textContent;
    mainApp.evaluacionAtleta.username = usernameAtleta;
    swal({
        title: 'Recolectando historiales de ' + usernameAtleta,
        html: '<b>Cargando mediciones recientes...</b>',
        timer: 2500,
        showConfirmButton: false,
        type: 'info',
        allowEscapeKey: false,
        allowOutsideClick: false
    });
    setTimeout(mostrarVisorRutinasyPruebas, 2300);
}

function obtenerHistorialesPersonales(){ //se emplea para saber el historial del usuario en sesión
    swal({
        title: 'Recolectando historiales de ' + mainApp.evaluacionAtleta.username,
        html: '<b>Cargando mediciones recientes...</b>',
        timer: 2500,
        showConfirmButton: false,
        type: 'info',
        allowEscapeKey: false,
        allowOutsideClick: false
    });
    setTimeout(mostrarVisorRutinasyPruebas, 2300);
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

function obtenerDetallesPruebaNavetee(){
    let filaActual = this.parentNode; //La fila actual donde se presionó el boton de historial
    let fechaRutina = filaActual.firstChild.textContent;
    mainApp.evaluacionAtleta.fechaRutina = fechaRutina;
    swal({
        html: '<b>Cargando detalles de Prueba...</b>',
        timer: 2500,
        showConfirmButton: false,
        type: 'info',
        allowEscapeKey: false,
        allowOutsideClick: false
    });
    setTimeout(mostrarDatosRepeticionSeleccionada, 2500);
}

function obtenerDetallesRepeticion(){
    let filaActual = this.parentNode; //La fila actual donde se presionó el boton de historial
    let fechaRutina = filaActual.firstChild.textContent;
    mainApp.evaluacionAtleta.fechaRutina = fechaRutina;
    swal({
        html: '<b>Cargando detalles de Repetición...</b>',
        timer: 2500,
        showConfirmButton: false,
        type: 'info',
        allowEscapeKey: false,
        allowOutsideClick: false
    });
    //setTimeout(, 2500);
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
          Oxigeno: 'Oxígeno'
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

function obtenerGraficoRepeticionNavetee(){
    let filaActual = this.parentNode; //La fila actual donde se presionó el boton de historial
    let fechaRutina = filaActual.firstChild.textContent;
    mainApp.evaluacionAtleta.fechaRutina = fechaRutina;
    swal({
        title: 'Grafico de mediciones',
        text: 'Seleccione cúal medición se graficará:',
        input: 'select',
        inputOptions: {
          Velocidad: 'Velocidad',
          Distancia: 'Distancia',
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

async function obtenerEstadosPruebasAtleta(){
    const estados = await obtenerEstadosNaveteeAtleta(mainApp.evaluacionAtleta.username);
    /* console.log("ESTADOS DE PRUEBAS:");
    console.log(JSON.stringify(estados)); */
    mainApp.indicadoresDeSaludVariables.pruebasFalladas = estados.fallidos;
    mainApp.indicadoresDeSaludVariables.pruebasRendidas = estados.rendidos;
    mainApp.indicadoresDeSaludVariables.pruebasCompletadas = estados.completos;
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

async function mostrarRutinasAtletaActual(){
    //Vaciamos la tabla actual
    vaciarBotonesTablaRutinas();
    mainApp.controladoresDeHistoriales.listaRutinas.splice(0, mainApp.controladoresDeHistoriales.listaRutinas.length);
    //recolectamos los historiales del atleta con la API
    const historialesRecolectados = await obtenerHistorialesAtleta(mainApp.evaluacionAtleta.username);
    //ingresamos los nuevos datos, VUE los mostrará por si solo como se indicó en el HTML
    historialesRecolectados.forEach(elemento => {
        mainApp.controladoresDeHistoriales.listaRutinas.push({
            fecha: elemento.fecha,
        });  
    }); 
}

async function actualizarPruebasNaveteeAtletaActual(){
    //Vaciamos la tabla actual
    mainApp.controladoresDeHistoriales.listaPruebasTotales.splice(0, mainApp.controladoresDeHistoriales.listaPruebasTotales.length);
    //recolectamos los historiales del atleta con la API
    let pruebasRecolectadas = await obtenerPruebasNaveteeAtleta(mainApp.evaluacionAtleta.username);
    //obtenemos las semans que ha realizado pruebas el usuario (especificamente el domingo/inicio de semana)
    //este listado se proyecta en el selctor de semans mediante VUE
    mainApp.controladoresDeHistoriales.listaSemanasActivas = generarSemanasActivas(pruebasRecolectadas);
    mainApp.controladoresDeHistoriales.listaPruebasTotales = pruebasRecolectadas;
    //establecemso el indicador DE SELECCION COMO OPCIÓN PREDETERMINADA
    document.getElementById("selectorSemana").selectedIndex = "0";
    
}

function filtrarPruebasFecha(){
    //establecemos el rango de fecha base
    let selector = document.getElementById("selectorSemana");
    let inicioSemana = selector.options[selector.selectedIndex].text;
    let limiteDeSemana = obtenerProximoInicioSemana(inicioSemana);
    //ingresamos los nuevos datos, VUE los mostrará por si solo como se indicó en el HTML
    limpiarReportesNavetee();
    mainApp.controladoresDeHistoriales.listaPruebasTotales.forEach(elemento => {
        let fechaEstandarizada = elemento.fecha.replace(/-/g, '\/');
        let fechaPrueba = new Date(); fechaPrueba.setTime(Date.parse(fechaEstandarizada));
        let tiempoMinimo = new Date(); tiempoMinimo.setTime(Date.parse(inicioSemana));
        let tiempoMaximo = new Date(); tiempoMaximo.setTime(Date.parse(limiteDeSemana));
        if( fechaPrueba.getTime() >= tiempoMinimo.getTime() && fechaPrueba.getTime() < tiempoMaximo.getTime()){
            mainApp.controladoresDeHistoriales.listaPruebasFiltradas.push({
                fecha: fechaEstandarizada,
                numRepeticiones: elemento.repeticiones.length,
                estadoPrueba: elemento.estado,
                distanciaTotal: elemento.distancia,
                repeticiones: elemento.repeticiones
            });  
            //alert("inicio: " + inicioSemana + "\nfin: " + limiteDeSemana  + "\nfecha normal: " + fechaEstandarizada + "\ntiempo Inicio: " + tiempoMinimo.getTime() + "\ntiempo fin: " + tiempoMaximo.getTime() + "\ntiempo fecha: " + fechaPrueba.getTime());
        } else{
            //alert("NO EQUIVALE \ninicio: " + inicioSemana + "\nfin: " + limiteDeSemana  + "\nfecha normal: " + fechaEstandarizada + "\ntiempo Inicio: " + tiempoMinimo.getTime() + "\ntiempo fin: " + tiempoMaximo.getTime() + "\ntiempo fecha: " + fechaPrueba.getTime());
        }
    }); 
}

async function mostrarPruebasFiltradasFecha(){
    swal({
        html: '<b>Filtrando pruebas... </b>',
        timer: 2500,
        showConfirmButton: false,
        type: 'info',
        allowEscapeKey: false,
        allowOutsideClick: false
    });
    await filtrarPruebasFecha();
    setTimeout(generarBotonesTablaPruebas, 2400);
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
    //esta tabla se vacia de esta forma porque posee botones dinámicos
    /* mainApp.activarVisorHistorial */
    document.querySelectorAll('#cuerpoInformativoAtletas tr')
    .forEach(fila =>{
        fila.removeChild(fila.lastChild); //el último hijo es una columna que tiene al boton
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

function generarBotonesTablaPruebas(){
    document.querySelectorAll('#cuerpoPruebasAtleta tr')
    .forEach(fila =>{
        let contenedorActivadorDetalles = document.createElement('td');
        let iconoVisor = document.createElement('span');
        iconoVisor.className="icon-eye";
        iconoVisor.alt = "Ver Detalles";
        iconoVisor.title = "Ver Detalles";
        contenedorActivadorDetalles.appendChild(iconoVisor);
        contenedorActivadorDetalles.addEventListener("click", Procesos.obtenerDetallesPruebaNavetee);
        fila.appendChild(contenedorActivadorDetalles);
    }); 
}

function generarBotonesTablaRepeticiones(){
    document.querySelectorAll('#cuerpoRepeticionesPrueba tr')
    .forEach(fila =>{
        let contenedorActivadorGraficos = document.createElement('td');
        let iconoGrafico = document.createElement('span');
        iconoGrafico.className="icon-stats-dots";
        iconoGrafico.alt = "Graficar datos";
        iconoGrafico.title = "Graficar Datos";
        contenedorActivadorGraficos.appendChild(iconoGrafico);
        contenedorActivadorGraficos.addEventListener("click", Procesos.obtenerGraficoRepeticionNavetee);
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

function vaciarBotonesTablaPruebas(){
    //esta tabla se vacia de esta forma porque posee botones dinámicos
    /* mainApp.activarVisorHistorial */
    document.querySelectorAll('#cuerpoPruebasAtleta tr')
    .forEach(fila =>{
        fila.removeChild(fila.lastChild); //el último hijo es una columna que tiene al boton
    }); 
}

function vaciarBotonesTablaRepeticiones(){
    //esta tabla se vacia de esta forma porque posee botones dinámicos
    /* mainApp.activarVisorHistorial */
    document.querySelectorAll('#cuerpoRepeticionesPrueba tr')
    .forEach(fila =>{
        fila.removeChild(fila.lastChild); //el último hijo es una columna que tiene al boton
    }); 
}


async function mostrarVisorRutinasyPruebas(){
    mainApp.activarVisorHistorial();
    await mostrarRutinasAtletaActual();
    //generamos los botones para ver los detalles de rutina y la opción de graficarlos
    generarBotonesTablaRutinas();
    //Actualizamos las pruebas navetee realizadas por el atleta, y con ello mostramos las semans de actividad
    await actualizarPruebasNaveteeAtletaActual();
    //mostramos el estado general de las pruebas (fallidas, rendidas y demás)
    obtenerEstadosPruebasAtleta();
    //limpiamos la tabla y el listado de repeticiones
    limpiarReportesNavetee();
}

async function mostrarDetalleRutinaTablas(){
    const historialesRecolectados = await obtenerHistorialesAtleta(mainApp.evaluacionAtleta.username);
    //vaciamos la lsita por si tiene datos previos
    mainApp.controladoresDeHistoriales.listaAnaliticas.splice(0, mainApp.controladoresDeHistoriales.listaAnaliticas.length);
    mainApp.controladoresDeHistoriales.listaMedicionesCardiacas.splice(0, mainApp.controladoresDeHistoriales.listaMedicionesCardiacas.length);
    mainApp.controladoresDeHistoriales.listaMedicionesTemperaturas.splice(0, mainApp.controladoresDeHistoriales.listaMedicionesTemperaturas.length);
    mainApp.controladoresDeHistoriales.listaMedicionesOxigenos.splice(0, mainApp.controladoresDeHistoriales.listaMedicionesOxigenos.length);
    //ingresamos los nuevos datos, VUE los mostrará por si solo como se indicó en el HTML
    historialesRecolectados.forEach(elemento => {
        if(elemento.fecha == mainApp.evaluacionAtleta.fechaRutina){
            mainApp.controladoresDeHistoriales.listaAnaliticas.push({
                ritmoPromedio:elemento.pulsoPromedio,
                temperaturaPromedio:elemento.tempPromedio,
                temperaturaMax:elemento.tempMaxima,
                temperaturaMin:elemento.tempMinima,
                oxigenoPromedio:elemento.oxigenoPromedio
            }); 
            elemento.pulso.forEach(pulso =>{
                mainApp.controladoresDeHistoriales.listaMedicionesCardiacas.push({
                    medicion:pulso
                  }); ;
            });
            elemento.temperatura.forEach(temperatura =>{
                mainApp.controladoresDeHistoriales.listaMedicionesTemperaturas.push({
                    medicion:temperatura
                  }); ;
            });
            elemento.oxigeno.forEach(oxigeno =>{
                mainApp.controladoresDeHistoriales.listaMedicionesOxigenos.push({
                    medicion:oxigeno
                  }); ;
            });
        }
    }); 
}

function mostrarDetallePruebaTablas(){
    let pruebaActual;
    mainApp.controladoresDeHistoriales.listaPruebasFiltradas.forEach(prueba => {
        if (prueba.fecha === mainApp.evaluacionAtleta.fechaRutina){
            pruebaActual = prueba;
        } 
    });
    //vaciamos la lista por si tiene datos previos
    vaciarBotonesTablaRepeticiones();
    mainApp.controladoresDeHistoriales.listaRepeticiones.splice(0, mainApp.controladoresDeHistoriales.listaRepeticiones.length);
    //ingresamos los nuevos datos, VUE los mostrará por si solo como se indicó en el HTML
    console.log("Prueba Seleccionada");
    console.log(JSON.stringify(pruebaActual));
    pruebaActual.repeticiones.forEach(elemento => {
        mainApp.controladoresDeHistoriales.listaRepeticiones.push({
            numRepeticion:elemento.numero,
            velPromedio: elemento.velPromedio,
            velMax: elemento.velMax,
            velMin: elemento.velMin,
            distanciaR: elemento.distanciaR
        }); 
    }); 
}

function limpiarReportesNavetee(){
    /*vacia las tablas y los listados que proyectan la información de las pruebas y repeticiones,
    esto con el fin que no irrumpan en el contenido de próximos análisis*/
    vaciarBotonesTablaRepeticiones();
    mainApp.controladoresDeHistoriales.listaRepeticiones.splice(0, mainApp.controladoresDeHistoriales.listaRepeticiones.length);
    vaciarBotonesTablaPruebas();
    mainApp.controladoresDeHistoriales.listaPruebasFiltradas.splice(0, mainApp.controladoresDeHistoriales.listaPruebasFiltradas.length);
}

async function mostrarDatosRepeticionSeleccionada(){
    await mostrarDetallePruebaTablas();
    generarBotonesTablaRepeticiones();
    /*Se usa await porque asi se espera que la información cargada en tabla
    sea actualizada por Vue, si no se espera entonces buscará agregar los botones de graficado
    previo a que se carguen los datos en la tabla, y al no encontrar nada no agregaria ningún boton */
}


async function mostrarGraficoMedicionesRutina(){
    const historialesRecolectados = await obtenerHistorialesAtleta(mainApp.evaluacionAtleta.username);
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
            } else{
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

//#endregion Acciones Historiales


//#region Control de fecha

function obtenerPrimerDiaSemana(fechaEntrada){
    //FORMATO DE ENTRADA: MM/DD/YYYY Con hora opcional, se fuerza a usar diagonales y no "-"
    let controladorFecha = new Date(fechaEntrada.replace(/-/g, '\/'));
    let diaDomingo = 0;
    let inicioDeMes = 1;
    let mes; let diaMS = 86400000;
    let digitosVista = 2; //cuantos digitos se desean ver del dia o mes (por eso se les concatena un 0)
    while(controladorFecha.getDay() != diaDomingo) {
      //Si el dia actual no es domingo entonces se retrocede hasta encontrarlo
      if(controladorFecha.getDate() == inicioDeMes){
          /*si llegamos a un punto donde nos encontramos en el inicio de mes,
          entonces también debemos reducir un mes, porque si no los dias seguirán reduciendoce
          como deben pero seguiremos en el mismo mes*/
        let fechaNuevaMS = controladorFecha.getTime() - diaMS; //ms
        controladorFecha.setTime(fechaNuevaMS);
      }else{
        controladorFecha.setDate(controladorFecha.getDate() - 1);
      }
    }
    mes = controladorFecha.getMonth()+1; //los meses inician en 0 (Ej: enero mes 0)
    //FORMATO DE SALIDA: MM/DD/YYYY 
    return ('0' + mes.toString()).slice(-digitosVista) + '/' + ('0' + controladorFecha.getDate()).slice(-digitosVista) + '/' + controladorFecha.getFullYear();
}

function obtenerProximoInicioSemana(fechaEntrada){
    //FORMATO DE ENTRADA: MM/DD/YYYY Con hora opcional, se fuerza a usar diagonales y no "-"
    let controladorFecha = new Date(fechaEntrada.replace(/-/g, '\/'));
    let diaDomingo = 0;
    let inicioDeMes = 1;
    let mes; let diaMS= 86400000;
    let digitosVista = 2; //cuantos digitos se desean ver del dia o mes (por eso se les concatena un 0)
    //se incremente un dia con el fin que si se inserta una fecha inicial(domingo) pueda obtenr aún asi el otro domingo 
    controladorFecha.setDate(controladorFecha.getDate() + 1);
    while(controladorFecha.getDay() != diaDomingo) {
      //Si el dia actual no es domingo entonces avanza hasta encontrarlo
        if(controladorFecha.getDate() == inicioDeMes){
            /*si llegamos a un punto donde nos encontramos en el inicio de mes,
            entonces también debemos aumentar un mes, porque si no los dias seguirán aumentandose
            como deben pero seguiremos en el mismo mes*/
            //A la fecha en milisegundos le restamos una dia en milisegundos
            let fechaNuevaMS = controladorFecha.getTime() + diaMS; //ms
            controladorFecha.setTime(fechaNuevaMS);
        }else{
             controladorFecha.setDate(controladorFecha.getDate() + 1);
        }
    }
    mes = controladorFecha.getMonth()+1; //los meses inician en 0 (Ej: enero mes 0)
    //FORMATO DE SALIDA: MM/DD/YYYY 
    return ('0' + mes.toString()).slice(-digitosVista) + '/' + ('0' + controladorFecha.getDate()).slice(-digitosVista) + '/' + controladorFecha.getFullYear();
}

function generarSemanasActivas(listaPruebasAtleta){
    let listaSemanasActivas = [];
    let fechaInicioSemana;
    listaPruebasAtleta.forEach(prueba =>{
        //si la fecha ya existe en la lista no se agrega
        //si no existe se agrega el domingo/inicio de semana de la correspondiente fecha que ingresamos
        fechaInicioSemana = obtenerPrimerDiaSemana(prueba.fecha.replace(/-/g, '\/')).split(" ")[0]; 
        //El split nos permite quedarnos solo con la fecha y omitir la hora, y replace obtener un formato de fecha con "/" y no con "-"
        listaSemanasActivas.includes(fechaInicioSemana) ? console.log("no se agregó la fecha")  : listaSemanasActivas.push(fechaInicioSemana); 
    });
    //listaSemanasActivas.reverse((a)=> new Date(a).getTime());
    return listaSemanasActivas;
}




  
//#endregion Control de fecha

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
    let historialesRecolectados = await obtenerHistorialesAtleta(mainApp.datosDePerfilEnSesion.username);
    //buscamos la medición mas reciente o en vivo(la última)
    let medicionActual = historialesRecolectados[historialesRecolectados.length-1];
    /*Puede ser cualquier medicion ya que siempre se envia la misma cantidad para las 3, 
    se escogio´temperatura ya que su sensor es más estable:*/
    mainApp.indicadoresDeSaludVariables.cantidadMedicionesActual = medicionActual.temperatura.length-1;
    if(mainApp.indicadoresDeSaludVariables.cantidadMedicionesActual != mainApp.indicadoresDeSaludVariables.cantidadMedicionesPrevia){
        //Ritmo Cardiaco
        mainApp.indicadoresDeSaludVariables.pulsoActual = medicionActual.pulso[medicionActual.pulso.length-1];
        mainApp.indicadoresDeSaludVariables.pulsoPromedio = medicionActual.pulsoPromedio;
        dataRitmoGrafico.push(medicionActual.pulso[medicionActual.pulso.length-1]);
        labelsRitmoGrafico.push(medicionActual.pulso[medicionActual.pulso.length-1]);
        graficoRitmoCardiaco.update();
        //Temperatura
        mainApp.indicadoresDeSaludVariables.temperaturaActual = medicionActual.temperatura[medicionActual.temperatura.length-1];
        mainApp.indicadoresDeSaludVariables.temperaturaMaxima = medicionActual.tempMaxima;
        mainApp.indicadoresDeSaludVariables.temperaturaMinima = medicionActual.tempMinima;
        mainApp.indicadoresDeSaludVariables.temperaturaPromedio = medicionActual.tempPromedio;
        dataTemperaturaGrafico.push(medicionActual.temperatura[medicionActual.temperatura.length-1]);
        labelsTemperaturaGrafico.push(medicionActual.temperatura[medicionActual.temperatura.length-1]);
        graficoTemperatura.update();
        //Oxigeno
        mainApp.indicadoresDeSaludVariables.oxigenoActual = medicionActual.oxigeno[medicionActual.oxigeno.length-1];
        mainApp.indicadoresDeSaludVariables.oxigenoPromedio = medicionActual.oxigenoPromedio;
        dataOxigenoGrafico.push(medicionActual.oxigeno[medicionActual.oxigeno.length-1]);
        labelsOxigenoGrafico.push(medicionActual.oxigeno[medicionActual.oxigeno.length-1]);
        graficoOxigeno.update();
        //actualizamos el estado
        mainApp.indicadoresDeSaludVariables.cantidadMedicionesPrevia = medicionActual.temperatura.length;
        mainApp.indicadoresDeSaludVariables.indicadorSeguimiento = true;
    }else{
        mainApp.indicadoresDeSaludVariables.cantidadMedicionesPrevia = medicionActual.temperatura.length;
        mainApp.indicadoresDeSaludVariables.indicadorSeguimiento = false;
    }
}

const timer = ms => new Promise(res => setTimeout(res, ms));

async function ejecutarMedicionEnVivo(){
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
    mainApp.indicadoresDeSaludVariables.cantidadMedicionesPrevia = 0;
    mainApp.indicadoresDeSaludVariables.cantidadMedicionesActual = 0;
    Mensajes.mostrarMensajeMedicionEnVivoFinalizada();
}

//#endregion Mediciones en Vivo


Procesos.obtenerUsernamesSistema = obtenerUsernamesSistema;
Procesos.obtenerDatosUsuarioEspecifico = obtenerDatosUsuarioEspecifico;
Procesos.obtenerDatosCompletosUsuariosSistema = obtenerDatosCompletosUsuariosSistema;
Procesos.crearNuevoAtleta = crearNuevoAtleta;
Procesos.obtenerAtletasBajoCoach = obtenerAtletasBajoCoach;
Procesos.mostrarAtletasAsignados = mostrarAtletasAsignados;
Procesos.generarBotonesTablaAtletas = generarBotonesTablaAtletas;
Procesos.generarBotonesTablaRutinas = generarBotonesTablaRutinas;
Procesos.obtenerHistorialesCompletos = obtenerHistorialesCompletos;
Procesos.obtenerHistorialesPersonales = obtenerHistorialesPersonales;
Procesos.obtenerDetallesRutina = obtenerDetallesRutina;
Procesos.obtenerGraficoRutina = obtenerGraficoRutina;
Procesos.obtenerDetallesRepeticion = obtenerDetallesRepeticion;
Procesos.obtenerGraficoRepeticionNavetee = obtenerGraficoRepeticionNavetee;
Procesos.obtenerDetallesPruebaNavetee = obtenerDetallesPruebaNavetee;
Procesos.crearNuevoCoach = crearNuevoCoach;
Procesos.mostrarPruebasFiltradasFecha = mostrarPruebasFiltradasFecha;
Procesos.asignarAtletaACoach = asignarAtletaACoach;
Procesos.obtenerUsuariosNoAsignados = obtenerUsuariosNoAsignados;
Procesos.mostrarVisorAtletasAsignados = mostrarVisorAtletasAsignados;
Procesos.verHistorialPersonal = verHistorialPersonal;
Procesos.asignarAtletaNoAsignado = asignarAtletaNoAsignado;
Procesos.obtenerNombresAtletaNoAsignado = obtenerNombresAtletaNoAsignado;
Procesos.ejecutarMedicionEnVivo = ejecutarMedicionEnVivo;

export{Procesos};