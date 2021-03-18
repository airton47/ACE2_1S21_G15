#include <SoftwareSerial.h>
SoftwareSerial BTSerial(2, 3);
#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"

const int Sensor = A0 ;             // Pin que lee la temperatura


String miCadena;

void setup()
   {    
    Serial.begin(9600);
    BTSerial.begin(9600);     
    }

void loop()
   {    
      int rawvoltage = analogRead(Sensor);
      float millivolts= (rawvoltage/1024.0) * 5000;
      float fahrenheit= millivolts/10;      
      float temperatura= (fahrenheit - 32) * (5.0/9.0);
      float pulso = temperatura*2.7;
      float oxigeno = 90;
      Serial.print(temperatura);
      Serial.print(",");
      Serial.print(pulso);
      Serial.print(",");
      Serial.print(oxigeno);
      Serial.println();
      delay(7000);
   }
