#include <SoftwareSerial.h>
SoftwareSerial BTSerial(10,11);
int PinSensor = 2;              //Sensor conectado en el pin 2

volatile int NumPulsos;         //variable para la cantidad de pulsos recibidos
float factor_conversion=7.11;   //para convertir de frecuencia a caudal
float volumen=0;                //Variable que guarda el volumen que se registra en un periodo de tiempo
float prevVolumen = -1;           //Variable temporal que guarda el volumen previo medido
float prevVolumen2 = -1;        //Variable temporal para guardar el anterior del anterior(prevVolumen)
long dt=0;                      //variación de tiempo por cada bucle
long t0=0;                      //millis() del bucle anterior
int numToMul = 1;               //Numero para determinar si es positivo o negativo el volumen
const float tiempoCause = 0.1;          //en segundos 's')Tiempo transcurrido en la medicion de cause para calculo de volumen
const int periodo = 0;             //Periodo de tiempo para hacer retardo con millis()
unsigned long tiempoAhora = 0;  //Tiempo actual, para calculo de periodo de tiempo en retardo con millis()

void setup() 
{  
  Serial.begin(9600);
  BTSerial.begin(9600);
  pinMode(PinSensor, INPUT); 
  attachInterrupt(0,ContarPulsos,RISING);//(Interrupción 0(Pin2),función,Flanco de subida)
  //t0=millis();
} 

void loop ()    
{
  //if (Serial.available()) {
  //  if(Serial.read()=='r')volumen=0;//restablecemos el volumen si recibimos 'r'
  //}
  float frecuencia=ObtenerFrecuecia(); //obtenemos la frecuencia de los pulsos en Hz
  float caudal_L_m=frecuencia/factor_conversion; //calculamos el caudal en L/m
  //dt=millis()-t0; //calculamos la variación de tiempo
  //t0=millis();
  //volumen=(caudal_L_m/60)*(dt/1000)*1000; // volumen(mL)=caudal(L/s)*tiempo(s)*1000
  volumen=(caudal_L_m/60)*(tiempoCause)*1000; // volumen(mL)=caudal(L/s)*tiempo(s)*1000

  //condicion para cambiar el signo del volumen
  if(volumen == 0){//solo para cuando el volumen ha sido cero
    if(prevVolumen !=0){//pero como este hacer cero en mas de una ocacion se verifica que el anterior no lo sea
      if(prevVolumen2 != 0){//ya que a veces hay error se verifica que el anter. del anter. no sea cero tampoco
        numToMul = numToMul*(-1);
      }
    }
  }
  
  //Serial.print ("Caudal: ");
  //Serial.print (caudal_L_m,3);
  //Serial.print ("L/min\tVolumen: "); 
  /*ENVIO DE DATOS AL BLUETOOTH*/  
  //if(millis() > tiempoAhora + periodo){
  //  tiempoAhora = millis();
    
    //Serial.println();
    //Serial.println(" mL");
  //}
  
  prevVolumen2 = prevVolumen;
  prevVolumen = volumen;
  Serial.print((int)volumen*numToMul);
  delay(100);
}

//Función que se ejecuta en interrupción
void ContarPulsos ()  
{ 
  NumPulsos++;  //incrementamos la variable de pulsos
} 

//Función para obtener frecuencia de los pulsos
int ObtenerFrecuecia() 
{
  int frecuencia;
  NumPulsos = 0;      //Ponemos a 0 el número de pulsos
  interrupts();       //Habilitamos las interrupciones
  delay(100);         //muestra de 1 segundo
  noInterrupts();     //Deshabilitamos  las interrupciones
  frecuencia=NumPulsos; //Hz(pulsos por segundo)
  return frecuencia/0.1;
}
