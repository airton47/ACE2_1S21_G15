
import {Mensajes} from './Mensajes';
import {Procesos} from './Procesos';

var encabezador = new Vue({
	el: '#encabezado',
	data: {
	  titulo: "Glove Fit",
    fecha: '00/00/0000',
    hora: '00:00'
  }
})

var mainApp = new Vue({
	el: '#main',
	data: {
    //#region DATA
	    titulos: {
        secccion_Perfil: "Perfil",
        secccion_Ritmo_Cardiaco: "Ritmo Cardíaco",
        secccion_Temperatura: "Temperatura",
        seccion_Oxigeno: "Oxígeno",
        visorDatosPersonales: "Mis Datos Personales",
        visorDatosDeportivos: "Mis Datos Deportivos",
        visorCardiaco: "Mi Control de Ritmo Cardiaco",
        seccion_indicadoresPulso: "Indicadores de Ritmo Cardiaco:",
        seccion_indicadoresTemperatura: "Indicadores de Temperatura:",
        seccion_indicadoresOxigeno: "Indicadores de Oxígeno:",
        visorHistorial:"Mis Historiales",
        visorDetallesRutinas:"Mis Detalles",
        visorTemperatura: "Mi Control de Temperatura",
        visorOxigeno: "Mi Control de Oxígeno en la Sangre",
        visorAtletas: "Atletas Asignados:",
        seccionNuevosAtletas: "Atletas no asignados:",
        visorAtletasHistorialCardiaco: "Ritmo Cardíaco:",
        visorAtletasHistorialTemperatura: "Temperatura:",
        visorAtletasHistorialOxígeno: "Oxígeno:",
        medicionesHistoriales: "Rutinas Guardadas"
      },
      estadoVisualizadores: {
        estadoPerfil: true,
        estadoRitmoCardiaco: false,
        estadoTemperatura: false,
        estadoOxigeno: false,
        estadoHistorial: false,
        estadoAtletas: false
      },
      estiloActual:{
        activo: "opcionesMenu",
        inactivo: "opcionesMenuDesactivadas"
      },
      controladoresDeHistoriales: {
        listaMedicionesCardiacas: [],
        listaMedicionesTemperaturas: [],
        listaMedicionesOxigenos: [],
        listaRutinas: [],
        listaAnaliticas: []
      },
      controladoresDeHistorialesCoach: {
        listaAtletas: []
      },
      indicadoresDeSaludVariables: {
        pulsoActual: 0,
        pulsoPromedio: 0,
        temperaturaActual: 0,
        temperaturaMaxima: 0,
        temperaturaMinima: 0,
        temperaturaPromedio: 0,
        oxigenoActual: 0,
        oxigenoPromedio: 0
      },
      datosDePerfilEnSesion:{
        tipo: '---',
        username: '---',
        estadoTipo: false, //Coach es true, false es atleta
        id: '---',
        nombres: '----',
        apellidos: '----',
        edad: '---',
        sexo: '---',
        peso: '---',
        estatura: '---'
      },
      //Mantiene guardado qué atleta esta evaluando el coach actualmente
      evaluacionAtleta:{
        username: '---',
        nombreAtleta: '---',
        apellidoAtleta: '---',
        fechaRutina: '',
        medicionGrafico: ''
      }
    //#endregion DATA
    },
    methods:{
        //#region METHODS
        activarVisorPerfil: function(){
            this.estadoVisualizadores.estadoPerfil = true;
            this.estadoVisualizadores.estadoRitmoCardiaco = false;
            this.estadoVisualizadores.estadoHistorial = false;
            this.estadoVisualizadores.estadoTemperatura = false;
            this.estadoVisualizadores.estadoOxigeno = false;
            this.estadoVisualizadores.estadoAtletas = false;
        },
        activarVisorRitmoCardiaco: function(){
            this.estadoVisualizadores.estadoPerfil = false;
            this.estadoVisualizadores.estadoRitmoCardiaco = true;
            this.estadoVisualizadores.estadoHistorial = false;
            this.estadoVisualizadores.estadoTemperatura = false;
            this.estadoVisualizadores.estadoOxigeno = false;
            this.estadoVisualizadores.estadoAtletas = false;
        },
        activarVisorTemperatura: function(){
            this.estadoVisualizadores.estadoPerfil = false;
            this.estadoVisualizadores.estadoRitmoCardiaco = false;
            this.estadoVisualizadores.estadoHistorial = false;
            this.estadoVisualizadores.estadoTemperatura = true;
            this.estadoVisualizadores.estadoOxigeno = false;
            this.estadoVisualizadores.estadoAtletas = false;
        },
        activarVisorOxigeno: function(){
            this.estadoVisualizadores.estadoPerfil = false;
            this.estadoVisualizadores.estadoRitmoCardiaco = false;
            this.estadoVisualizadores.estadoHistorial = false;
            this.estadoVisualizadores.estadoTemperatura = false;
            this.estadoVisualizadores.estadoOxigeno = true;
            this.estadoVisualizadores.estadoAtletas = false;
        },
        activarVisorAtletas: function(){
            this.estadoVisualizadores.estadoPerfil = false;
            this.estadoVisualizadores.estadoRitmoCardiaco = false;
            this.estadoVisualizadores.estadoHistorial = false;
            this.estadoVisualizadores.estadoTemperatura = false;
            this.estadoVisualizadores.estadoOxigeno = false;
            this.estadoVisualizadores.estadoAtletas = true;
        },
        activarVisorHistorial: function(){
          this.estadoVisualizadores.estadoPerfil = false;
          this.estadoVisualizadores.estadoRitmoCardiaco = false;
          this.estadoVisualizadores.estadoHistorial = true;
          this.estadoVisualizadores.estadoTemperatura = false;
          this.estadoVisualizadores.estadoOxigeno = false;
          this.estadoVisualizadores.estadoAtletas = false;
          //Reiniciamos los gráficos y tablas:
          dataGraficoHistorialActual.splice(0, dataGraficoHistorialActual.length);
          labelsGraficoHistorialActual.splice(0, labelsGraficoHistorialActual.length);
          colorGraficoHistorialActual.splice(0, colorGraficoHistorialActual.length);
          colorHoverGraficoHistorialActual.splice(0, colorHoverGraficoHistorialActual.length);
          graficoHistorial.update();
          mainApp.controladoresDeHistoriales.listaAnaliticas.splice(0, mainApp.controladoresDeHistoriales.listaAnaliticas.length);
          mainApp.controladoresDeHistoriales.listaMedicionesCardiacas.splice(0, mainApp.controladoresDeHistoriales.listaMedicionesCardiacas.length);
          mainApp.controladoresDeHistoriales.listaMedicionesTemperaturas.splice(0, mainApp.controladoresDeHistoriales.listaMedicionesTemperaturas.length);
          mainApp.controladoresDeHistoriales.listaMedicionesOxigenos.splice(0, mainApp.controladoresDeHistoriales.listaMedicionesOxigenos.length);
      }
      //#endregion METHODS
    }
})


//#region GRAFICOS

//#region RITMO CARDÍACO:

let contenedor_graf_pulso = document.getElementById('visorGraficoRitmoCardiaco');
let config_graf_pulso = {
    type: 'line',
    data: {
      labels:['# 1','# 2','# 3', '#4', '#5', '#6'],
      datasets: [{
        label: 'Mediciones actuales',
        data:[0,0,25,-15, 0, 0],
        backgroundColor: 'rgba(236,46,46,1)',/*Color con tono rojo */
        borderColor: 'rgba(236,46,46,0.6)', //el borde lo interpreta como el color de la linea
        pointBackgroundColor:'rgba(236,46,46,1)',
        fill: false,
        lineTension: 0
      }]
    },
    options: {}
};


let  graficoRitmoCardiaco = new Chart(
  contenedor_graf_pulso,
  config_graf_pulso
);

//#endregion RITMO CARDÍACO:

//#region TEMPERATURA:

let contenedor_graf_Temperatura = document.getElementById('visorGraficoTemperatura');
let config_graf_Temperatura = {
    type: 'bar',
    data: {
      labels:['# 1','# 2','# 3', '#4'],
      datasets:[{
        label: 'Mediciones Actuales',
        backgroundColor:[
          'rgba(0, 0, 0, 0.2)',
          'rgba(153, 153, 255, 0.3)',
          'rgba(102, 255, 102, 0.4)',
          'rgba(255,51,51, 0.5)'],
        hoverBackgroundColor:[
          'rgb(0, 0, 0)',
          'rgb(153, 153, 255)',
          'rgb(102, 255, 102)',
          'rgb(255,51,51)'],
        data:[0,20,30,40]
      }]
    },
    options: {}
};


let  graficoTemperatura = new Chart(
  contenedor_graf_Temperatura,
  config_graf_Temperatura
);

//#endregion TEMPERATURA:

//#region OXIGENO:

let contenedor_graf_Oxigeno = document.getElementById('visorGraficoOxigeno');
let config_graf_Oxigeno = {
    type: 'bar',
    data: {
      labels:['# 1','# 2','# 3', '#4'],
      datasets:[{
        label: 'Mediciones Actuales',
        backgroundColor:[
          'rgba(0, 0, 0, 0.2)',
          'rgba(153, 153, 255, 0.3)',
          'rgba(102, 255, 102, 0.4)',
          'rgba(255,51,51, 0.5)'],
        hoverBackgroundColor:[
          'rgb(0, 0, 0)',
          'rgb(153, 153, 255)',
          'rgb(102, 255, 102)',
          'rgb(255,51,51)'],
        data:[0,20,30,40]
      }]
    },
    options: {}
};


let  graficoOxigeno = new Chart(
  contenedor_graf_Oxigeno,
  config_graf_Oxigeno
);

//#endregion OXIGENO:

//#region HISTORIAL

let contenedor_graf_historial = document.getElementById('visorGraficoHistorial');
let dataGraficoHistorialActual = [];
let labelsGraficoHistorialActual = [];
let colorGraficoHistorialActual = [];
let colorHoverGraficoHistorialActual = [];
let config_graf_historial= {
    type: 'bar',
    data: {
      labels:labelsGraficoHistorialActual,
      datasets:[{
        label: 'Mediciones de Rutina',
        backgroundColor:colorGraficoHistorialActual,
        hoverBackgroundColor: colorHoverGraficoHistorialActual,
        data: dataGraficoHistorialActual
      }]
    },
    options: {}
};

let  graficoHistorial = new Chart(
  contenedor_graf_historial,
  config_graf_historial
);

//#endregion HISTORIAL

//#endregion GRAFICOS

//#region Push de prueba

/* mainApp.controladoresDeHistoriales.listaMedicionesCardiacas.push({
  medicion:'000'
}); 

mainApp.controladoresDeHistoriales.listaMedicionesTemperaturas.push({
  medicion:'001'
}); 

mainApp.controladoresDeHistoriales.listaMedicionesOxigenos.push({
  medicion:'002'
}); 

mainApp.controladoresDeHistoriales.listaAnaliticas.push({
  ritmoPromedio:'004',
  temperaturaPromedio:'005',
  temperaturaMax:'006',
  temperaturaMin:'007',
  oxigenoPromedio:'008'
}); 

mainApp.controladoresDeHistorialesCoach.listaAtletas.push({
  id: '000',
  nombre: 'Lorem',
  apellido: 'Ipsum',
  edad:'00',
  sexo:'M',
  peso:'000',
  estatura:'000'
}); 

mainApp.controladoresDeHistoriales.listaRutinas.push({
  fecha: '00/00/00  00:00:00'
});  */

//#endregion Push de prueba 


//Ejecución de Login y Registro
actualizarFecha();
ejecutarReloj();
Mensajes.ejecutarLogin();

//#region Control de Fecha y Hora

function actualizarFecha(){
  let controladorTiempo = new Date();
  encabezador.fecha = controladorTiempo.getDate() + '/' + (controladorTiempo.getMonth()+1) + '/' + controladorTiempo.getFullYear();
}

function actualizarHora(){
  let controladorTiempo = new Date();
  encabezador.hora = String(controladorTiempo.getHours()).padStart(2, "0") + ':' + String(controladorTiempo.getMinutes()).padStart(2, "0")  + ':' + String(controladorTiempo.getSeconds()).padStart(2, "0");
}

function ejecutarReloj(){
  setInterval(actualizarHora, 1000);
}

//#endregion Control de Fecha y Hora

async function mostrarVisorAtletasAsignados(){
  mainApp.activarVisorAtletas();
  await Procesos.mostrarAtletasAsignados(mainApp.datosDePerfilEnSesion.username);
  //generamos los botones para ver los historiales individuales de cada atleta
  Procesos.generarBotonesTablaAtletas();
}

function verHistorialPersonal(){
  mainApp.evaluacionAtleta.username = mainApp.datosDePerfilEnSesion.username; 
  /*esto permite que en los usuarios de tipo coach no se mezclen
   sus historiales con los historiales del atleta cuyo análisis está en curso. */
   Procesos.obtenerHistorialesPersonales();
}


 async function probarAPIS(){
  //console.log(JSON.stringify(await Procesos.obtenerUsernamesSistema()));
  //console.log(JSON.stringify(Procesos.obtenerDatosUsuarioEspecifico('giossan')));
  //console.log(JSON.stringify(await Procesos.obtenerDatosCompletosUsuariosSistema()));
  //let informacion = '{"username": "Caliss", "password": "1001", "nombres": "Candida Lisseth", "apellidos": "Aroca Estrada","edad": 23,"genero": "F","peso": 158, "altura": 167,"coach": false}';
  //console.log(JSON.stringify(Procesos.crearNuevoAtleta(JSON.parse(informacion))));
}

//#region Asignación de funciones a botones:

//#region Ventanas
document.getElementById('botonVerHistorialPulso').addEventListener("click", verHistorialPersonal);
document.getElementById('botonVerHistorialTemperatura').addEventListener("click", verHistorialPersonal);
document.getElementById('botonVerHistorialOxigeno').addEventListener("click", verHistorialPersonal);
document.getElementById('botonVerAtletas').addEventListener("click", mostrarVisorAtletasAsignados);
document.getElementById('botonRegresarPerfil').addEventListener("click", mainApp.activarVisorPerfil);
//#endregion Ventanas

//#region Mensajes
document.getElementById('botonEjecucionPulso').addEventListener("click", Mensajes.mensajeEvaluacionPulso);
document.getElementById('controladorSesion').addEventListener("click", Mensajes.ejecutarLogOut);

//#endregion Mensajes

//#region Acciones API
//document.getElementById('controladorSesion').addEventListener("click", probarAPIS);
//#endregion Acciones API

//#endregion Asignación de funciones a botones

export {
  mainApp,
  dataGraficoHistorialActual,
  graficoHistorial,
  labelsGraficoHistorialActual,
  colorGraficoHistorialActual,
  colorHoverGraficoHistorialActual,
};