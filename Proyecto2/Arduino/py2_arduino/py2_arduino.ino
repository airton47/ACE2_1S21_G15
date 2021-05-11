#include <SoftwareSerial.h>       //Libreria para el modulo bluetooth
SoftwareSerial BTSerial(10,11);   //Seteo de la comunicacion en serie del bluetooth

/*
YF‐ S201 Water Flow Sensor
*/
volatile int flow_frequency;      //variable con cuenta de frecuencia medida desde el sensor

float l_minute = 0;               //variable con el cause obtenido en un periodo de tiempo
float vol = 0;                    //variable del volumen calculado en un periodo de tiempo
float prevVolumen = -1;           //Variable temporal que guarda el volumen previo medido
float prevVolumen2 = -1;          //Variable temporal para guardar el anterior del anterior(prevVolumen)
//>>>>HAY 3 VARIABLES DE VOLUMEN PARA HACER COMPROBACIONES Y EVITAR ERRORES AL ENVIAR LOS DATOS
//>>>>ESTO PORQUE EL SENSOR NO ES MUY PRECISO

unsigned char flowsensor = 2;     //pin de Sensor(YF-S201) Input
unsigned long currentTime;        //tiempo transcurrido desde que inicio arduino
unsigned long cloopTime;          //tiempo transcurrido en el ciclo
const float tiempoCause = 0.2;    //(segundos 's')Tiempo transcurrido en la medicion de cause para calculo de volumen
int numToMul = -1;                //Numero para determinar si es positivo o negativo el volumen
const int periodo = 200;          //numero de milisegundos del periodo


void setup()
{
   pinMode(flowsensor, INPUT);    //modalidad de pin de sensor
   Serial.begin(9600);            //establecer velocidad de comunicacion serial
   BTSerial.begin(9600);          //establecer velocidad de comunicacion serial de bluetooth
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
   // cada periodo de tiempo, calcual el cause en el sensor
   if(currentTime >= (cloopTime + periodo)){
    cloopTime = currentTime; // Updates cloopTime
    
    // Pulse frequency (Hz) = 7.5Q, Q is flow rate in L/min. (factor de conversion, especifico para YF-S2001 de media pulgada)
    l_minute = (flow_frequency / 7.5);        //Calculo de cause->(L/m)
    vol = (l_minute/60)*(tiempoCause)*1000;   //Calculo de volumen, convirtiendo L en mL->((L/m)*60s)*(s)*(mL)
    
    if(vol == 0){                   //solo para cuando el volumen ha sido cero se debe cambiar el signo
      if(prevVolumen != 0){         //pero como este se puede medir cero en mas de una ocacion en el periodo de tiempo se verifica que el anterior no lo sea
        if(prevVolumen2 != 0){      //ya que a veces hay error se verifica que el anterior del anterior no sea cero tampoco
          numToMul = numToMul*(-1); //Se hace el toggle del signo del volumen
        }
      }
    }
    
    int VOL = (int)(vol*numToMul);  //casteo de volumne como un numero entero
    Serial.println(VOL);            //Se envia volumen por serial a traves del bluetooth
    
    prevVolumen2 = prevVolumen;     //Se transfiere el volumen previo de prevVolumen
    prevVolumen = vol;              //Se tranfiere volumen medido a volumen_previo
    flow_frequency = 0;             // Reset Counter
   }
}

void flow () // Interrupt function
{
   flow_frequency++;
}
