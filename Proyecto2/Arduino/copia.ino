

int sensorInterrupt = 0;        // interrupt 0
int sensorPin       = 2;        //Digital Pin 2
unsigned int SetPoint = 400;    //400 milileter
 
/*The hall-effect flow sensor outputs pulses per second per litre/minute of flow.*/
float calibrationFactor = 7.5;  //You can change according to your datasheet
 
volatile byte pulseCount =0;    //Contador de pulsos
 
float flowRate = 0.0;
int prevFlowMilliLitres = 0;
int flowMilliLitres =0;
long totalMilliLitres = 0;
int numToMul = 1;

unsigned long oldTime = 0;
 
void setup()
{
 
  // Initialize a serial connection for reporting values to the host
  Serial.begin(9600);
  pinMode(sensorPin, INPUT);
  digitalWrite(sensorPin, HIGH);
 
  /*The Hall-effect sensor is connected to pin 2 which uses interrupt 0. Configured to trigger on a FALLING state change (transition from HIGH
  (state to LOW state)*/
  attachInterrupt(sensorInterrupt, pulseCounter, FALLING); //you can use Rising or Falling
}
 
void loop()
{
 
   if((millis() - oldTime) > 1000)    // Only process counters once per second
  { 
    // Disable the interrupt while calculating flow rate and sending the value to the host
    detachInterrupt(sensorInterrupt);
 
    // Because this loop may not complete in exactly 1 second intervals we calculate the number of milliseconds 
    //that have passed since the last execution and use that to scale the output. We also apply the 
    //calibrationFactor to scale the output based on the number of pulses per second per units 
    //of measure (litres/minute in this case) coming from the sensor.
    flowRate = ((1000.0 / (millis() - oldTime)) * pulseCount) / calibrationFactor;
 
    // Note the time this processing pass was executed. Note that because we've
    // disabled interrupts the millis() function won't actually be incrementing right
    // at this point, but it will still return the value it was set to just before
    // interrupts went away.
    oldTime = millis();
 
    // Divide the flow rate in litres/minute by 60 to determine how many litres have
    // passed through the sensor in this 1 second interval, then multiply by 1000 to
    // convert to millilitres.
    flowMilliLitres = (flowRate / 60) * 1000;
 
    // Add the millilitres passed in this second to the cumulative total
    totalMilliLitres += flowMilliLitres;
    flowMilliLitres = flowMilliLitres * numToMul;
    if(numToMul != -1){
      if(prevFlowMilliLitres > flowMilliLitres){
        numToMul = numToMul*(-1);
        flowMilliLitres = flowMilliLitres * numToMul;
      }
    }else{
      if(prevFlowMilliLitres < flowMilliLitres){
        numToMul = numToMul*(-1);
        flowMilliLitres = flowMilliLitres * numToMul;
      }
    }
    
 
    unsigned int frac;
 
    // Print the flow rate for this second in litres / minute
    Serial.print("Flow rate: ");
    Serial.print(flowMilliLitres, DEC);  // Print the integer part of the variable
    Serial.print("mL/Second");
    Serial.print("\t");
    // Print the cumulative total of litres flowed since starting
    Serial.print("Output Liquid Quantity: ");        
    Serial.print(flowMilliLitres,DEC);
    Serial.println("mL"); 
    Serial.print("\t");
    prevFlowMilliLitres = flowMilliLitres;
    
// Reset the pulse counter so we can start incrementing again
    pulseCount = 0;
 
    // Enable the interrupt again now that we've finished sending output
    attachInterrupt(sensorInterrupt, pulseCounter, FALLING);
  }
}
 
//Insterrupt Service Routine
 
void pulseCounter()
{
  // Increment the pulse counter
  pulseCount++;
}

/*------------------------------------------------------------------------------*/
22/04/2021 15:09
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
