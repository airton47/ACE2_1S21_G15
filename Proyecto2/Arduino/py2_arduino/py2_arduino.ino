#include <SoftwareSerial.h>
SoftwareSerial BTSerial(10,11);   //Seteo de la comunicacion en serie del bluetooth
#define USE_ARDUINO_INTERRUPTS true
#include <PulseSensorPlayground.h>
#include "ADXL335.h"

const int OUTPUT_TYPE = SERIAL_PLOTTER;

/*PINES DE SENSOR | ACELEROMETRO: ADXL335-GY61*/
const int px = A0;                       //pin de 'x' en acelerometro
const int py = A1;                       //pin de 'y' en acelerometro
const int pz = A2;                       //pin de 'z' en acelerometro
/*PINES DE SENSOR | TEMPERATURA: LM34*/
const int ptemp = A5;                    //pin de sensor temperatura
/*PINES DE SENSOR | PULSO_CARDIACO*/
const int prtmo = A4;                    //pin de sensor de pulso cardiaco

float velocidad_z = 0;            //variable que almacena medida de la velocidad a la que asciende el brazo
float temperatura = 0;            //variable con medida de temperatura corporal
int ritmo = 0;                    //variable con medida de ritmo cardiaco
int oxigeno = 80;                 //variable con nivel de oxigeno en la sangre
int porcentaje = 0;               //variable que almacena el porcentaje de flexion del brazo
int porcentajePrev = 0;           //variable que guarda el porcentaje anterior
int repeticion = 0;               //variable para indicar si al enviar dato se toma coma una repeticion del ejercicio
bool togle_f = false;                     //variable para saber cuando hacer una medicion

float x = 0;                      //variable con medida de distancia recorrida en eje 'x'
float y = 0;                      //variable con medida de distancia recorrida en eje 'y'
float z = 0;                      //variable con medida de distancia recorrida en eje 'z'

unsigned long currentTime;        //tiempo transcurrido desde que inicio arduino
unsigned long cloopTime;          //tiempo transcurrido en el ciclo
const int periodo = 1000;          //numero de milisegundos del periodo/intervalo hasta nueva repeticion
float zero_G = 512.0;             //ADC is 0~1023 the zero g output equal to Vs/2
float escala = 102.3;              //ADXL335330 Sensitivity is 330mv/g
int Threshold = 570;              //determina el limite que contara como un latido
const int PULSE_FADE = 5;
long randNumber;

ADXL335 accelerometer;
PulseSensorPlayground pulseSensor;


void setup()
{
   Serial.begin(9600);            //establecer velocidad de comunicacion serial
   BTSerial.begin(9600);          //establecer velocidad de comunicacion serial de bluetooth
   
   currentTime = millis();
   cloopTime = currentTime;
   randomSeed(analogRead(A3));    //To generate a random number with a analog input as Seed

   //Inicializacion de objeto de libreria
   accelerometer.begin();

   //Seteo de pines de acelerometro
   pinMode(px, INPUT);
   pinMode(py, INPUT);
   pinMode(pz, INPUT);

   //Ajustes para sensor de pulso
   pulseSensor.fadeOnPulse(PULSE_FADE);
   pulseSensor.setSerial(Serial);
   pulseSensor.setOutputType(OUTPUT_TYPE);
   pulseSensor.analogInput(prtmo); 
   pulseSensor.setThreshold(Threshold);
   if (pulseSensor.begin()) {
    Serial.println("We created a pulseSensor Object !");  //This prints one time at Arduino power-up,  or on Arduino reset.  
  }
   
   
}


void loop ()
{
  currentTime = millis();

  //toma de datos para acelerometro
  x = analogRead(px);
  int xval = map(x, 267, 400, -100, 100);
  y = analogRead(py);
  int yval = map(y, 267, 400, -100, 100);
  z = analogRead(pz);
  int zval = map(z, 267, 400, -100, 100);

  //datos de accelerometro
  float x_printable = (float)xval/(-100.00); 
  float y_printable = (float)yval/(-100.00);
  float z_printable = (float)yval/(-100.00);
  
  //toma de datos para temperatura
  int rawvoltage = analogRead(ptemp);
  float millivolts = (rawvoltage * 1024) / 5000;
  float fahrenheit = millivolts / 10;      
    
  //toma de datos para ritmo cardiaco
  int myBPM = pulseSensor.getBeatsPerMinute();
  if (pulseSensor.sawStartOfBeat()){
    ritmo = myBPM;
  }  

  //calculo de porcentaje de distancia recorrid por brazo
  porcentaje = getPorc(z_printable);
  
  //Toma de datos para de niveles de oxigeno
  oxigeno = getOxigen(ritmo);
  
  if( (millis() - cloopTime >= periodo) ){//envio de datos cuando ha pasado un periodod de tiempo
    
    
    //datos de temperatura
    temperatura = abs((fahrenheit - 32.0) * (5.0/9.0)) + detNum(ritmo);    //En grados °C
    
    
    if(ritmo > 200){
      ritmo = ritmo - 50;
    }
    //
    int xm, ym, zm;
    accelerometer.getXYZ(&xm, &ym, &zm);    

    //Determinar cuando fue una repeticion
    
    if(porcentaje >= 75){
      repeticion = 1;
    }else if(porcentaje >= 10 & porcentaje < 75){
      repeticion = 2;
    }else{
      repeticion = 0;
    }

    //Verifico que no estoy leyendo 2 veces la misma repeticion o una repeticion inconclusa
    if(porcentajePrev != 0){
      repeticion = 0;
    }
    
    //cadena: { ritmo,temperatura,oxigeno,z,vel,rep }    
    Serial.print(ritmo);          //ritmo cardiao
    Serial.print(",");
    Serial.print(temperatura);    //temperatura en °C
    Serial.print(",");
    Serial.print(oxigeno);        //nivel de oxigeno
    Serial.print(",");
    Serial.print(porcentaje);     //porcentaje
    Serial.print(",");    
    Serial.print(zm);             //aceleracion
    Serial.print(",");
    Serial.print(repeticion);     //bandera que determina si es repeticion
    //ultimo dato 'z' representa la velocidad o intesidad y el 'z_printable la distancia'
    Serial.println();
    while(millis() < cloopTime+500){
    // espere [periodo] milisegundos
    }
    togle_f = false;
    porcentajePrev = porcentaje;
    cloopTime = millis(); // Updates cloopTime
  }

  //Reseto de variables
    ritmo,temperatura,x,y,z = 0;
}

int getOxigen(int i){
  randNumber = random(80,90);
  int oxigen = randNumber;
  return oxigen;
}

int getPorc(float medida){//Funcion que calcula el porcentaje de la flexion del brazo
  int porcentaje = 0;
  //.30  .40 | -.70
  if( medida >= 0.25 & medida <= 0.35 ){
    porcentaje = 10;
  }else if( medida <= 0.24 & medida >= -0.05 ){
    porcentaje = 25;
  }else if( medida <= 0.04 & medida >= -0.34 ){
    porcentaje = 50;
  }else if( medida <= -0.35 & medida >=-0.59 ){
    porcentaje = 75;
  }else if( medida <= -0.60 ){
    porcentaje = 100;
  }else{
    porcentaje = 0;
  }
  return porcentaje;
}

int detNum(int rt){//Determina numero para ajustar temperatura
  if(rt == 0 | rt < 30){
    return 10;
  }else{
    if(rt < 100){
      return random(15,17.5);
    }else{
      return random(17,19.5);
    }
  }
}
