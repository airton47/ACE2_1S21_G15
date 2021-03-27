#include <SoftwareSerial.h>
SoftwareSerial MySerial(10, 11); // pin 10 connects to TX of HC-05 | pin 11 connects to RX of HC-05
int x,y;
int count =0;
float distance;

//  Variables
int PulseSensor = A0 ;        // Conecte el cable rojo del sensor en pin analogico cero
int Signal = 0;                
int Threshold = 520;           //Dato analogico considerado como un pulso     




void setup() {
  Serial.begin(9600);   
}


void loop() {

    Signal = analogRead(A0);  //Lectura de datos del sensor de ritmo cardiaco                                      
    x = analogRead(A1);
    y = analogRead(A2);
    if ( x <= 450 && y>=390)
    { count++;
    //MySerial.print(count);
    delay(200);
    }
    if ( x >= 460 && y<=370)
    {
    count++;
    // MySerial.print(count);
    delay(200);
    }
    distance = count * 0.6; // My step it is on average 60cm. 
    Serial.print(Signal);
    Serial.print(",");
    Serial.print(distance);
    Serial.print(";");
    Serial.println();
    MySerial.print(Signal);
    MySerial.print(",");
    MySerial.print(distance);
    MySerial.print(";");
    MySerial.println();
    delay(3000);    
}
