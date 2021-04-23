#include <SoftwareSerial.h>
SoftwareSerial BTSerial(10,11);

/*
YF‐ S201 Water Flow Sensor
Water Flow Sensor output processed to read in litres/hour
Adaptation Courtesy: hobbytronics.co.uk
*/
volatile int flow_frequency; // Measures flow sensor pulses


float l_minute = 0;               //variable con cuenta de frecuencia medida desde el sensor
float vol = 0;                    //variable del volumen calculado
float prevVolumen = -1;           //Variable temporal que guarda el volumen previo medido
float prevVolumen2 = -1;          //Variable temporal para guardar el anterior del anterior(prevVolumen)
//>>>>HAY 3 VARIABLES DE VOLUMEN PARA HACER COMPROBACIONES Y EVITAR ERRORES AL ENVIAR LOS DATOS
//>>>>ESTO PORQUE EL SENSOR NO ES MUY PRECISO

unsigned char flowsensor = 2;     // Sensor Input
unsigned long currentTime;        //tiempo transcurrido desde que inicio arduino
unsigned long cloopTime;          //tiempo en el ciclo
const float tiempoCause = 0.2;    //(segundos 's')Tiempo transcurrido en la medicion de cause para calculo de volumen
int numToMul = -1;                //Numero para determinar si es positivo o negativo el volumen
const int periodo = 200;          //numero de milisegundos del periodo


void setup()
{
   pinMode(flowsensor, INPUT);
   Serial.begin(9600);
   BTSerial.begin(9600);
   attachInterrupt(digitalPinToInterrupt(flowsensor), flow, RISING); // Setup Interrupt
   currentTime = millis();
   cloopTime = currentTime;
}


void loop ()
{
   //interrupts();
   //delay(periodo);
   //noInterrupts();   
   currentTime = millis();
   // Every second, calculate and print litres/hour
   if(currentTime >= (cloopTime + periodo)){
    cloopTime = currentTime; // Updates cloopTime
    
    // Pulse frequency (Hz) = 7.5Q, Q is flow rate in L/min.
    l_minute = (flow_frequency / 7.5); //
    vol = (l_minute/60)*(tiempoCause)*1000;
    if(vol == 0){//solo para cuando el volumen ha sido cero
      if(prevVolumen != 0){//pero como este hacer cero en mas de una ocacion se verifica que el anterior no lo sea
        if(prevVolumen2 != 0){//ya que a veces hay error se verifica que el anter. del anter. no sea cero tampoco
          numToMul = numToMul*(-1);//Se hace el toggle del signo del volumen
        }
      }
    }
    
    int VOL = (int)(vol*numToMul);
    Serial.println(VOL);
    
    prevVolumen2 = prevVolumen;   //Se transfiere el volumen previo de prevVolumen
    prevVolumen = vol;            //Se tranfiere volumen medido a volumen_previo
    flow_frequency = 0;           // Reset Counter
   }
}

void flow () // Interrupt function
{
   flow_frequency++;
}
