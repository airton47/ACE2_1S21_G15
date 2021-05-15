
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
        seccion_Perfil: "Perfil",
        seccion_Rendimiento: "Rendimiento",
        seccion_Historial: "Historiales",
        visorDatosPersonales: "Mis Datos Personales",
        visorDatosDeportivos: "Mis Datos Deportivos",
        visorSalud: "Control de Rendimiento",
        visorCardiaco: "Mi Control de Ritmo Cardiaco",
        visorDetallesRutinas:"Detalles de Rutina",
        visorTemperatura: "Mi Control de Temperatura",
        visorOxigeno: "Mi Control de Oxígeno en la Sangre",
        visorVelocidad: "Mi Control de Aceleración de movimiento atlético",
        visorDistancia: "Mi Control de Elevación (Para Pesas)",
        visorAtletas: "Atletas Asignados:",
        seccionNuevosAtletas: "Atletas no asignados:",
        medicionesHistoriales: "Mis Rutinas",
        tituloDetallesVitales: "Detalles de Signos Vitales",
        tituloDetalleAgiles: "Detalles de Agilidad deportiva",
        tituloDetallesEvaluacion: "Detalles de evaluación"
      },
      estadoVisualizadores: {
        estadoPerfil: true,
        estadoRendimiento: false,
        estadoHistorial: false,
        estadoAtletas: false,
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
        analisisInteligente: 0,
        pulsoActual: 0,
        pulsoPromedio: 0,
        pulsoMaximo: 0,
        pulsoMinimo: 0,
        temperaturaActual: 0,
        temperaturaMaxima: 0,
        temperaturaMinima: 0,
        temperaturaPromedio: 0,
        oxigenoActual: 0,
        oxigenoPromedio: 0,
        oxigenoMaximo: 0,
        oxigenoMinimo: 0,
        indicadorSeguimiento:true,
        velocidadActual: 0,
        velocidadMaxima: 0,
        velocidadMinima: 0,
        velocidadPromedio: 0,
        distanciaActual: 0,
        distanciaTotal: 0,
        distanciaMaxima: 0,
        distanciaMinima: 0,
        calorias: 0,
        tiempoRestante: "03:00",
        milisegundosActividad: 180000
      },
      indicadoresDeSaludHistorial: {
        pulsoPromedio: 0,
        pulsoMaximo: 0,
        pulsoMinimo: 0,
        temperaturaMaxima: 0,
        temperaturaMinima: 0,
        temperaturaPromedio: 0,
        oxigenoPromedio: 0,
        oxigenoMaximo: 0,
        oxigenoMinimo: 0,
        velocidadMaxima: 0,
        velocidadMinima: 0,
        velocidadPromedio: 0,
        distanciaPromedio: 0,
        distanciaMaxima: 0,
        distanciaMinima: 0,
        pesoConsiderado: 0,
        calorias: 0,
        intensidad: "---",
        tiempoRestante: "00:00"
      },
      datosDePerfilEnSesion:{
        tipo: '---',
        username: '---',
        estadoTipo: true, //Coach es true, false es atleta
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
        repeticionPrueba: '',
        medicionGrafico: '',
        medicionGraficoNavetee: '',
        medicionGraficoVO2: '',
        numInhalacionesPrevias: 0,
        numExhalacionesPrevias: 0
      }
    //#endregion DATA
    },
    methods:{
        //#region METHODS
        activarVisorPerfil: function(){
            this.estadoVisualizadores.estadoPerfil = true;
            this.estadoVisualizadores.estadoRendimiento = false;
            this.estadoVisualizadores.estadoHistorial = false;
            this.estadoVisualizadores.estadoAtletas = false;
        },
        activarVisorRendimiento: function(){
            this.estadoVisualizadores.estadoPerfil = false;
            this.estadoVisualizadores.estadoRendimiento = true;
            this.estadoVisualizadores.estadoHistorial = false;
            this.estadoVisualizadores.estadoAtletas = false;
        },
        activarVisorAtletas: function(){
            this.estadoVisualizadores.estadoPerfil = false;
            this.estadoVisualizadores.estadoRendimiento = false;
            this.estadoVisualizadores.estadoHistorial = false;
            this.estadoVisualizadores.estadoAtletas = true;
        },
        activarVisorHistorial: function(){
          this.estadoVisualizadores.estadoPerfil = false;
            this.estadoVisualizadores.estadoRendimiento = false;
            this.estadoVisualizadores.estadoHistorial = true;
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
      },
      reiniciarVisoresMedicionesEnVivo: function(){
          this.indicadoresDeSaludVariables.pulsoActual = 0;
          this.indicadoresDeSaludVariables.pulsoPromedio = 0;
          this.indicadoresDeSaludVariables.pulsoMaximo = 0;
          this.indicadoresDeSaludVariables.pulsoMinimo = 0;
          this.indicadoresDeSaludVariables.temperaturaActual = 0;
          this.indicadoresDeSaludVariables.temperaturaMaxima = 0;
          this.indicadoresDeSaludVariables.temperaturaMinima = 0;
          this.indicadoresDeSaludVariables.temperaturaPromedio = 0;
          this.indicadoresDeSaludVariables.oxigenoActual = 0;
          this.indicadoresDeSaludVariables.oxigenoPromedio = 0;
          this.indicadoresDeSaludVariables.oxigenoMaximo = 0;
          this.indicadoresDeSaludVariables.oxigenoMinimo = 0;
          this.indicadoresDeSaludVariables.velocidadActual = 0;
          this.indicadoresDeSaludVariables.velocidadMaxima = 0;
          this.indicadoresDeSaludVariables.velocidadMinima = 0;
          this.indicadoresDeSaludVariables.velocidadPromedio = 0;
          this.indicadoresDeSaludVariables.distanciaActual = 0;
          this.indicadoresDeSaludVariables.distanciaMaxima = 0;
          this.indicadoresDeSaludVariables.distanciaMinima = 0;
          this.indicadoresDeSaludVariables.distanciaPromedio = 0;
          this.indicadoresDeSaludVariables.calorias = 0;
          this.indicadoresDeSaludVariables.analisisInteligente = 0;
          this.indicadoresDeSaludVariables.indicadorSeguimiento = true;
          //reinicio de gráficos:
          dataRitmoGrafico.splice(0, dataRitmoGrafico.length);
          labelsRitmoGrafico.splice(0, labelsRitmoGrafico.length);
          dataTemperaturaGrafico.splice(0, dataTemperaturaGrafico.length);
          labelsTemperaturaGrafico.splice(0, labelsTemperaturaGrafico.length);
          dataOxigenoGrafico.splice(0, dataOxigenoGrafico.length);
          labelsOxigenoGrafico.splice(0, labelsOxigenoGrafico.length);
          graficoRitmoCardiaco.update();
          graficoOxigeno.update();
          graficoTemperatura.update();
          dataVelocidadGrafico.splice(0, dataVelocidadGrafico.length);
          labelsVelocidadGrafico.splice(0, labelsVelocidadGrafico.length);
          graficoVelocidad.update();
          dataDistanciaGrafico.splice(0, dataDistanciaGrafico.length);
          labelsDistanciaGrafico.splice(0, labelsDistanciaGrafico.length);
          graficoDistancia.update();

      },reiniciarRutinas: function(){
         this.controladoresDeHistoriales.listaRutinas.splice(0, this.controladoresDeHistoriales.listaRutinas.length);
         dataGraficoHistorialActual.splice(0, dataGraficoHistorialActual.length);
        labelsGraficoHistorialActual.splice(0, labelsGraficoHistorialActual.length);
        colorGraficoHistorialActual.splice(0, colorGraficoHistorialActual.length);
        colorHoverGraficoHistorialActual.splice(0, colorHoverGraficoHistorialActual.length);
      },reiniciarTemporizador: function(){
        this.indicadoresDeSaludVariables.tiempoRestante= "03:00";
        this.indicadoresDeSaludVariables.milisegundosActividad= 180000;
     }
      //#endregion METHODS
    }
})


//#region GRAFICOS

//#region RITMO CARDÍACO:

let contenedor_graf_pulso = document.getElementById('visorGraficoRitmoCardiaco');
let dataRitmoGrafico = [];
let labelsRitmoGrafico = [];
let config_graf_pulso = {
    type: 'line',
    data: {
      labels:labelsRitmoGrafico,
      datasets: [{
        label: 'LPM actuales',
        data:dataRitmoGrafico,
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
let dataTemperaturaGrafico = [];
let labelsTemperaturaGrafico = [];
let config_graf_Temperatura = {
  type: 'line',
  data: {
    labels:labelsTemperaturaGrafico,
    datasets: [{
      label: 'Temperaturas actuales',
      data:dataTemperaturaGrafico,
      backgroundColor: 'rgba(104, 164, 164, 1)',
      borderColor: 'rgba(102, 153, 153, 0.4)', //el borde lo interpreta como el color de la linea
      pointBackgroundColor:'rgba(104, 164, 164, 1)',
      fill: false,
      lineTension: 0.6
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
let dataOxigenoGrafico = [];
let labelsOxigenoGrafico = [];
let config_graf_Oxigeno = {
  type: 'line',
  data: {
    labels:labelsOxigenoGrafico,
    datasets: [{
      label: 'Oxigenos actuales',
      data:dataOxigenoGrafico,
      backgroundColor: 'rgba(102,153,153, 1)',
      borderColor: 'rgba(102,153,153, 0.4)', //el borde lo interpreta como el color de la linea
      pointBackgroundColor:'rgba(102,153,153, 1)',
      fill: false,
      lineTension: 0.5
    }]
  },
    options: {}
};


let  graficoOxigeno = new Chart(
  contenedor_graf_Oxigeno,
  config_graf_Oxigeno
);

//#endregion OXIGENO:

//#region VELOCIDAD:

let contenedor_graf_Velocidad = document.getElementById('visorGraficoVelocidad');
let dataVelocidadGrafico = [];
let labelsVelocidadGrafico = [];
let config_graf_Velocidad = {
  type: 'line',
  data: {
    labels:labelsVelocidadGrafico,
    datasets: [{
      label: 'Velocidades actuales',
      data:dataVelocidadGrafico,
      backgroundColor: 'rgba(102,153,153, 1)',
      borderColor: 'rgba(102,153,153, 0.4)', //el borde lo interpreta como el color de la linea
      pointBackgroundColor:'rgba(102,153,153, 1)',
      fill: false,
      lineTension: 0.5
    }]
  },
    options: {}
};


let  graficoVelocidad = new Chart(
  contenedor_graf_Velocidad,
  config_graf_Velocidad
);

//#endregion VELOCIDAD:

//#region DISTANCIA:

let contenedor_graf_Distancia = document.getElementById('visorGraficoDistancia');
let dataDistanciaGrafico = [];
let labelsDistanciaGrafico = [];
let config_graf_Distancia = {
  type: 'line',
  data: {
    labels:labelsDistanciaGrafico,
    datasets: [{
      label: 'Distancias actuales',
      data:dataDistanciaGrafico,
      backgroundColor: 'rgba(102,153,153, 1)',
      borderColor: 'rgba(102,153,153, 0.4)', //el borde lo interpreta como el color de la linea
      pointBackgroundColor:'rgba(102,153,153, 1)',
      fill: false,
      lineTension: 0.5
    }]
  },
    options: {}
};


let  graficoDistancia = new Chart(
  contenedor_graf_Distancia,
  config_graf_Distancia
);

let componentesNaveteeLive = {
  dataVelocidadGrafico: dataVelocidadGrafico,
  labelsVelocidadGrafico: labelsVelocidadGrafico,
  graficoVelocidad: graficoVelocidad,
  dataDistanciaGrafico: dataDistanciaGrafico,
  labelsDistanciaGrafico: labelsDistanciaGrafico,
  graficoDistancia: graficoDistancia
};

//#endregion DISTANCIA:

//#region HISTORIAL RUTINAS ESTÁNDAR

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

//#endregion HISTORIAL RUTINAS ESTÁNDAR


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

//#region Asignación de funciones a botones:

//#region Ventanas
document.getElementById('botonVerAtletas').addEventListener("click", Procesos.mostrarVisorAtletasAsignados);
document.getElementById('botonRegresarPerfil').addEventListener("click", mainApp.activarVisorPerfil);
document.getElementById('botonActualizador').addEventListener("click", Procesos.obtenerHistorialesPersonales);
//#endregion Ventanas

//#region Mensajes
document.getElementById('controladorSesion').addEventListener("click", Mensajes.ejecutarLogOut);

//#endregion Mensajes

//#region Acciones API
document.getElementById('selectorIntensidad').addEventListener("change", Procesos.seleccionarIntensidad); 
document.getElementById('botonInicioEvaluacion').addEventListener("click", Procesos.ejecutarRutinaEnVivo);
/*document.getElementById('botonAgregarAtleta').addEventListener("click", Procesos.asignarAtletaNoAsignado);
document.getElementById('atletasNoAsignados').addEventListener("change", Procesos.obtenerNombresAtletaNoAsignado);
document.getElementById('selectorSemana').addEventListener("change", Procesos.mostrarPruebasFiltradasFecha);
document.getElementById('botonInicioEvaluacion').addEventListener("click", Procesos.ejecutarMedicionEnVivo);
document.getElementById('botonFinEvaluacion').addEventListener("click", Procesos.finalizarMedicionEnVivo);
document.getElementById('botonInicioEspirometro').addEventListener("click", Procesos.ejecutarEspirometroEnVivo);
document.getElementById('botonActualizador').addEventListener("click", Procesos.MostrarSesionesVO2);*/
//#endregion Acciones API

//#endregion Asignación de funciones a botones

export {
  mainApp,
  dataGraficoHistorialActual,
  graficoHistorial,
  labelsGraficoHistorialActual,
  colorGraficoHistorialActual,
  colorHoverGraficoHistorialActual,
  dataRitmoGrafico,
  labelsRitmoGrafico,
  dataTemperaturaGrafico,
  labelsTemperaturaGrafico,
  dataOxigenoGrafico,
  labelsOxigenoGrafico,
  graficoRitmoCardiaco,
  graficoOxigeno,
  graficoTemperatura,
  componentesNaveteeLive
};