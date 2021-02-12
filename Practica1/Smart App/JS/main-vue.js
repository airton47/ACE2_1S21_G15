
import {Mensajes} from './Mensajes';

var encabezador = new Vue({
	el: '#encabezado',
	data: {
	  titulo: "Mi TVE"
  }
})

var mainApp = new Vue({
	el: '#main',
	data: {
	    titulos: {
        secccion_Perfil: "Perfil",
        secccion_Ritmo_Cardiaco: "Ritmo Cardíaco",
        secccion_Temperatura: "Temperatura",
        seccion_Oxigeno: "Oxígeno",
        visorPerfil: "Mis Datos",
        visorCardiaco: "Mi Control de Ritmo Cardiaco",
        visorHistorialCardiaco:"Mi Historial de Ritmo Cardiaco",
        visorTemperatura: "Mi Control de Temperatura",
        visorOxigeno: "Mi Control de Oxígeno en la Sangre"
      },
      estadoVisualizadores: {
        estadoPerfil: true,
        estadoRitmoCardiaco: false,
        estadoHistorialRitmoCardiaco: false,
        estadoTemperatura: false,
        estadoOxigeno: false
      },
      estiloActual:{
        activo: "opcionesMenu",
        inactivo: "opcionesMenuDesactivadas"
      },
      controladoresDeHistoriales: {
          listaHistorialCardiaco: [],
          listaHistorialTemperatura: [],
          listaHistorialOxigeno: []
      }
    },
    methods:{
        activarVisorPerfil: function(){
            this.estadoVisualizadores.estadoPerfil = true;
            this.estadoVisualizadores.estadoRitmoCardiaco = false;
            this.estadoVisualizadores.estadoHistorialRitmoCardiaco = false;
            this.estadoVisualizadores.estadoTemperatura = false;
            this.estadoVisualizadores.estadoOxigeno = false;
        },
        activarVisorRitmoCardiaco: function(){
            this.estadoVisualizadores.estadoPerfil = false;
            this.estadoVisualizadores.estadoRitmoCardiaco = true;
            this.estadoVisualizadores.estadoHistorialRitmoCardiaco = false;
            this.estadoVisualizadores.estadoTemperatura = false;
            this.estadoVisualizadores.estadoOxigeno = false;
        },
        activarVisorHistorialRitmoCardiaco: function(){
            this.estadoVisualizadores.estadoPerfil = false;
            this.estadoVisualizadores.estadoRitmoCardiaco = false;
            this.estadoVisualizadores.estadoHistorialRitmoCardiaco = true;
            this.estadoVisualizadores.estadoTemperatura = false;
            this.estadoVisualizadores.estadoOxigeno = false;
            
        },
        activarVisorTemperatura: function(){
            this.estadoVisualizadores.estadoPerfil = false;
            this.estadoVisualizadores.estadoRitmoCardiaco = false;
            this.estadoVisualizadores.estadoHistorialRitmoCardiaco = false;
            this.estadoVisualizadores.estadoTemperatura = true;
            this.estadoVisualizadores.estadoOxigeno = false;
        },
        activarVisorOxigeno: function(){
            this.estadoVisualizadores.estadoPerfil = false;
            this.estadoVisualizadores.estadoRitmoCardiaco = false;
            this.estadoVisualizadores.estadoHistorialRitmoCardiaco = false;
            this.estadoVisualizadores.estadoTemperatura = false;
            this.estadoVisualizadores.estadoOxigeno = true;
        },
    }
})

//CONFIGURACIONES DE GRAFICOS:´

//#region Graficos

let contenedor_graf_hist_pulso = document.getElementById('visorGraficoHistorialRitmoCardiaco');
let config_graf_hist_pulso = {
    type: 'bar',
    data: {
      labels:['# 1','# 2','# 3', '#4'],
      datasets:[{
        label: 'Mediciones en Grados Centígrados',
        data:[0,20,30,40],
        backgroundColor:['#rgba(0, 0, 0, 0.2)', '#rgba(153, 153, 255, 0.3)','rgba(102, 255, 102, 0.4)','rgba(255,51,51, 0.5)'],
        hoverBackgroundColor:['#rgb(0, 0, 0)', '#rgb(153, 153, 255)','rgb(102, 255, 102)','rgb(255,51,51)']
      }]
    },
    options: {}
};


let  graficoHistorialRitmoCardiaco = new Chart(
  contenedor_graf_hist_pulso,
  config_graf_hist_pulso
);

let contenedor_graf_pulso = document.getElementById('visorGraficoRitmoCardiaco');
let config_graf_pulso = {
    type: 'line',
    data: {
      labels:['# 1','# 2','# 3', '#4', '#5', '#6'],
      datasets: [{
        label: 'Mediciones en Milivoltios',
        data:[0,-10,25,5, 12, 0],
      }]
    },
    options: {}
};

let  graficoRitmoCardiaco = new Chart(
  contenedor_graf_pulso,
  config_graf_pulso
);
//#endregion


mainApp.controladoresDeHistoriales.listaHistorialCardiaco.push({
  fecha: '09-02-2021',
  detalles: 'quede'
});

//Prueba de Mensaje:
Mensajes.mostrarMensajeDividido();



//Asignación de funciones a botones:

document.getElementById('botonVerHistorialPulso').addEventListener("click", mainApp.activarVisorHistorialRitmoCardiaco);

export {
  mainApp
};