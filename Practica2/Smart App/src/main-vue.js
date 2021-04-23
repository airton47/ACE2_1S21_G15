
import {Mensajes} from './Mensajes';
import {Procesos} from './Procesos';

var encabezador = new Vue({
	el: '#encabezado',
	data: {
	  titulo: "Smart App",
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
        seccionVO2MAX: "VO2MAX",
        visorDatosPersonales: "Mis Datos Personales",
        visorDatosDeportivos: "Mis Datos Deportivos",
        visorSalud: "Control de Rendimiento",
        visorCardiaco: "Mi Control de Ritmo Cardiaco",
        visorDetallesRutinas:"Detalles de Rutina",
        visorTemperatura: "Mi Control de Temperatura",
        visorOxigeno: "Mi Control de Oxígeno en la Sangre",
        visorVelocidad: "Mi Control de Velocidad",
        visorDistancia: "Mi Control de Distancia",
        visorAtletas: "Atletas Asignados:",
        visorVO2: "Control de VO2 MAX",
        seccionNuevosAtletas: "Atletas no asignados:",
        visorAtletasHistorialCardiaco: "Ritmo Cardíaco:",
        visorAtletasHistorialTemperatura: "Temperatura:",
        visorAtletasHistorialOxígeno: "Oxígeno:",
        medicionesHistoriales: "Mis Rutinas",
        medicionesNavetee: "Mis Pruebas Course-Navetee",
        medicionesSemana: "Detalle Semanal",
        detalleGeneralNavetee: "Detalle General",
        tituloDetalleMinuto: "Promedios por Minuto",
        tituloDetalleVolumenes: "Detalles de inhalación y exhalación"
      },
      estadoVisualizadores: {
        estadoPerfil: true,
        estadoRendimiento: false,
        estadoHistorial: false,
        estadoAtletas: false,
        estadoHistorialPropio: false,
        estadoVO2MAX: false
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
        listaAnaliticas: [],
        listaPruebasTotales: [],
        listaPruebasFiltradas: [],
        listaRepeticiones: [],
        listaSemanasActivas: [],
        listaSesionesVO2: [],
        listaPromediosMinutosVO2: []
      },
      indicadoresSesionVO2: {
        inhalacionMin: 0,
        inhalacionMax: 0,
        inhalacionProm: 0,
        exhalacionMin: 0,
        exhalacionMax: 0,
        exhalacionProm: 0
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
        oxigenoPromedio: 0,
        indicadorSeguimiento:true,
        velocidadActual: 0,
        velocidadMaxima: 0,
        velocidadMinima: 0,
        velocidadPromedio: 0,
        distanciaActual: 0,
        distanciaTotal: 0,
        pruebasCompletadas: 0,
        pruebasFalladas: 0,
        pruebasRendidas: 0,
        repeticionesPromedioSemana: 0,
        repeticionesMinSemana: 0,
        repeticionesMaxSemana: 0,
        inhalacionActual: 0,
        exhalacionActual: 0,
        vo2Actual: 0,
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
            this.estadoVisualizadores.estadoHistorialPropio = false;
            this.estadoVisualizadores.estadoVO2MAX = false;
        },
        activarVisorRendimiento: function(){
            this.estadoVisualizadores.estadoPerfil = false;
            this.estadoVisualizadores.estadoRendimiento = true;
            this.estadoVisualizadores.estadoHistorial = false;
            this.estadoVisualizadores.estadoAtletas = false;
            this.estadoVisualizadores.estadoHistorialPropio = false;
            this.estadoVisualizadores.estadoVO2MAX = false;
        },
        activarVisorAtletas: function(){
            this.estadoVisualizadores.estadoPerfil = false;
            this.estadoVisualizadores.estadoRendimiento = false;
            this.estadoVisualizadores.estadoHistorial = false;
            this.estadoVisualizadores.estadoAtletas = true;
            this.estadoVisualizadores.estadoHistorialPropio = false;
            this.estadoVisualizadores.estadoVO2MAX = false;
        },
        activarVisorVO2MAX: function(){
          this.estadoVisualizadores.estadoPerfil = false;
          this.estadoVisualizadores.estadoRendimiento = false;
          this.estadoVisualizadores.estadoHistorial = false;
          this.estadoVisualizadores.estadoAtletas = false;
          this.estadoVisualizadores.estadoHistorialPropio = false;
          this.estadoVisualizadores.estadoVO2MAX = true;
      },
        activarVisorHistorial: function(){
          this.estadoVisualizadores.estadoPerfil = false;
          this.estadoVisualizadores.estadoRendimiento = false;
          this.estadoVisualizadores.estadoAtletas = false;
          this.estadoVisualizadores.estadoVO2MAX = false;
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
      reiniciarElementosVO2MAXLive: function(){
        //vo2max
        this.indicadoresDeSaludVariables.inhalacionActual = 0;
        this.indicadoresDeSaludVariables.exhalacionActual = 0;
        this.indicadoresDeSaludVariables.vo2Actual = 0;
        this.indicadoresDeSaludVariables.tiempoRestante= "05:00";
        this.evaluacionAtleta.numExhalacionesPrevias = 0;
        this.evaluacionAtleta.numInhalacionesPrevias = 0;
        componentesVolumnenesLive.dataVolumenesGrafico.splice(0, componentesVolumnenesLive.dataVolumenesGrafico.length);
        componentesVolumnenesLive.labelsVolumenesGrafico.splice(0, componentesVolumnenesLive.labelsVolumenesGrafico.length);
        componentesVolumnenesLive.graficoVO2.update();
      },
      reiniciarHistorialVO2MAX: function(){
        //vo2max
        this.indicadoresSesionVO2.inhalacionMin = 0;
        this.indicadoresSesionVO2.inhalacionMax = 0;
        this.indicadoresSesionVO2.inhalacionProm = 0;
        this.indicadoresSesionVO2.exhalacionMin = 0;
        this.indicadoresSesionVO2.exhalacionMax = 0;
        this.indicadoresSesionVO2.exhalacionProm = 0;
        this.controladoresDeHistoriales.listaSesionesVO2.splice(0, this.controladoresDeHistoriales.listaSesionesVO2.length);
        componentesVolumnenesLive.dataVolumenesGrafico_hist.splice(0, componentesVolumnenesLive.dataVolumenesGrafico_hist.length);
        componentesVolumnenesLive.labelsVolumenesGrafico_hist.splice(0, componentesVolumnenesLive.labelsVolumenesGrafico_hist.length);
        this.controladoresDeHistoriales.listaSesionesVO2.splice(0, mainApp.controladoresDeHistoriales.listaSesionesVO2.length);
        this.controladoresDeHistoriales.listaPromediosMinutosVO2.splice(0, mainApp.controladoresDeHistoriales.listaPromediosMinutosVO2.length);
        componentesVolumnenesLive.graficoVO2Hist.update();
      },
      reiniciarGraficoVO2MAXHistorial: function(){
        componentesVolumnenesLive.dataVolumenesGrafico_hist.splice(0, componentesVolumnenesLive.dataVolumenesGrafico_hist.length);
        componentesVolumnenesLive.labelsVolumenesGrafico_hist.splice(0, componentesVolumnenesLive.labelsVolumenesGrafico_hist.length);
        componentesVolumnenesLive.graficoVO2Hist.update();
      },
      reiniciarVisoresMedicionesEnVivo: function(){
          this.indicadoresDeSaludVariables.pulsoActual = 0;
          this.indicadoresDeSaludVariables.pulsoPromedio = 0;
          this.indicadoresDeSaludVariables.temperaturaActual = 0;
          this.indicadoresDeSaludVariables.temperaturaMaxima = 0;
          this.indicadoresDeSaludVariables.temperaturaMinima = 0;
          this.indicadoresDeSaludVariables.temperaturaPromedio = 0;
          this.indicadoresDeSaludVariables.oxigenoActual = 0;
          this.indicadoresDeSaludVariables.oxigenoPromedio = 0;
          this.indicadoresDeSaludVariables.indicadorSeguimiento = true;
          this.indicadoresDeSaludVariables.inhalacionActual = 0;
          this.indicadoresDeSaludVariables.exhalacionActual = 0;
          this.indicadoresDeSaludVariables.tiempoRestante= "00:00";
          //reinicio de gráficos:
          dataRitmoGrafico.splice(0, dataRitmoGrafico.length);
          labelsRitmoGrafico.splice(0, labelsRitmoGrafico.length);
          dataTemperaturaGrafico.splice(0, dataTemperaturaGrafico.length);
          labelsTemperaturaGrafico.splice(0, labelsTemperaturaGrafico.length);
          dataOxigenoGrafico.splice(0, dataOxigenoGrafico.length);
          labelsOxigenoGrafico.splice(0, labelsOxigenoGrafico.length);
          componentesNaveteeLive.dataVelocidadGrafico.splice(0,componentesNaveteeLive.dataVelocidadGrafico.length);
          componentesNaveteeLive.labelsVelocidadGrafico.splice(0,componentesNaveteeLive.labelsVelocidadGrafico.length);
          componentesNaveteeLive.dataDistanciaGrafico.splice(0,componentesNaveteeLive.dataDistanciaGrafico.length);
          componentesNaveteeLive.labelsDistanciaGrafico.splice(0,componentesNaveteeLive.labelsDistanciaGrafico.length);
          graficoRitmoCardiaco.update();
          graficoOxigeno.update();
          graficoTemperatura.update();
          componentesNaveteeLive.graficoVelocidad.update();
          componentesNaveteeLive.graficoDistancia.update();
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

//#region HISTORIAL PRUEBAS COURSE-NAVETEE

let contenedor_graf_course_navetee = document.getElementById('visorGraficoNavetee');
let dataGraficoHistorialNaveteeActual = [];
let labelsGraficoHistorialNaveteeActual = [];
let colorGraficoHistorialNaveteeActual = [];
let colorHoverGraficoHistorialNaveteeActual = [];
let config_graf_historial_navetee= {
    type: 'bar',
    data: {
      labels:labelsGraficoHistorialNaveteeActual,
      datasets:[{
        label: 'Mediciones de Course-Navetee',
        backgroundColor:colorGraficoHistorialNaveteeActual,
        hoverBackgroundColor: colorHoverGraficoHistorialNaveteeActual,
        data: dataGraficoHistorialNaveteeActual
      }]
    },
    options: {}
};

let  graficoHistorialNavetee = new Chart(
  contenedor_graf_course_navetee,
  config_graf_historial_navetee
);

let componentesGrafNavetee = {
  dataGraficoHistorialNaveteeActual: dataGraficoHistorialNaveteeActual,
  labelsGraficoHistorialNaveteeActual: labelsGraficoHistorialNaveteeActual,
  colorGraficoHistorialNaveteeActual: colorGraficoHistorialNaveteeActual,
  colorHoverGraficoHistorialNaveteeActual: colorHoverGraficoHistorialNaveteeActual,
  graficoHistorialNavetee: graficoHistorialNavetee
};

//#endregion HISTORIAL PRUEBAS COURSE-NAVETEE

//#region VO2MAX:

let contenedor_graf_vo2 = document.getElementById('visorGraficoVO2MAX');
let dataVolumenesGrafico = [];
let labelsVolumenesGrafico = [];
let config_graf_Volumenes = {
  type: 'line',
  data: {
    labels:labelsVolumenesGrafico,
    datasets: [{
      label: 'Volúmenes Actuales',
      data:dataVolumenesGrafico,
      backgroundColor: 'rgba(102,153,153, 1)',
      borderColor: 'rgba(102,153,153, 0.4)', //el borde lo interpreta como el color de la linea
      pointBackgroundColor:'rgba(102,153,153, 1)',
      fill: false,
      lineTension: 0.5
    }]
  },
    options: {}
};


let  graficoVO2 = new Chart(
  contenedor_graf_vo2,
  config_graf_Volumenes
);

let contenedor_graf_vo2_hist = document.getElementById('visorSesionesVO2MAX');
let dataVolumenesGrafico_hist = [];
let labelsVolumenesGrafico_hist = [];
let config_graf_Volumenes_hist = {
  type: 'line',
  data: {
    labels:labelsVolumenesGrafico_hist,
    datasets: [{
      label: 'Volúmenes de Sesión (ml)',
      data:dataVolumenesGrafico_hist,
      backgroundColor: 'rgba(102,153,153, 1)',
      borderColor: 'rgba(102,153,153, 0.4)', //el borde lo interpreta como el color de la linea
      pointBackgroundColor:'rgba(102,153,153, 1)',
      fill: false,
      lineTension: 0.5
    }]
  },
    options: {}
};


let  graficoVO2Hist = new Chart(
  contenedor_graf_vo2_hist,
  config_graf_Volumenes_hist
);

let componentesVolumnenesLive = {
  dataVolumenesGrafico: dataVolumenesGrafico,
  labelsVolumenesGrafico: labelsVolumenesGrafico,
  graficoVO2: graficoVO2,
  dataVolumenesGrafico_hist: dataVolumenesGrafico_hist,
  labelsVolumenesGrafico_hist: labelsVolumenesGrafico_hist,
  graficoVO2Hist: graficoVO2Hist
};



//#endregion VO2MAX:

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
document.getElementById('opcionHistorial').addEventListener("click", Procesos.obtenerHistorialesPersonales);
//#endregion Ventanas

//#region Mensajes
document.getElementById('controladorSesion').addEventListener("click", Mensajes.ejecutarLogOut);

//#endregion Mensajes

//#region Acciones API
document.getElementById('botonAgregarAtleta').addEventListener("click", Procesos.asignarAtletaNoAsignado);
document.getElementById('atletasNoAsignados').addEventListener("change", Procesos.obtenerNombresAtletaNoAsignado);
document.getElementById('selectorSemana').addEventListener("change", Procesos.mostrarPruebasFiltradasFecha);
document.getElementById('botonInicioEvaluacion').addEventListener("click", Procesos.ejecutarMedicionEnVivo);
document.getElementById('botonFinEvaluacion').addEventListener("click", Procesos.finalizarMedicionEnVivo);
document.getElementById('botonInicioEspirometro').addEventListener("click", Procesos.ejecutarEspirometroEnVivo);
document.getElementById('botonActualizador').addEventListener("click", Procesos.MostrarSesionesVO2);
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
  componentesGrafNavetee,
  componentesNaveteeLive,
  componentesVolumnenesLive
};