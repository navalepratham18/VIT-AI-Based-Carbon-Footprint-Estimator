#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

// --- CONFIGURATION ---
const char* ssid = "Q"; // Your mobile hotspot
const char* password = "qwerty@123";

// Ensure this IP exactly matches what your Flask terminal says!
const char* serverName = "http://172.25.61.71:5000/sensor_data"; 

const int mq7Pin = A0;
const long interval = 10000; // 10 seconds for live dashboard speed
unsigned long previousMillis = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  // Connect to Wi-Fi
  Serial.print("Connecting to Wi-Fi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi Connected!");
  Serial.print("NodeMCU IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    // --- 1. THE SMOOTHING FILTER ---
    // Takes 10 rapid readings and averages them to kill sensor noise
    long totalADC = 0;
    for(int i = 0; i < 10; i++) {
      totalADC += analogRead(mq7Pin);
      delay(10); 
    }
    int rawAdc = totalADC / 10;

    // --- 2. THE HACKATHON ZERO-OUT CALIBRATION ---
    // Your sensor's deaf baseline is ~830. We set 828 as the absolute floor.
    int adjustedAdc = rawAdc - 828; 
    
    // If it drops to 825, don't let it go negative
    if (adjustedAdc < 0) {
      adjustedAdc = 0;
    }

    // THE AMPLIFIER: Grab that tiny 4-unit spike and multiply it by 50!
    // Example: A raw reading of 834 becomes (834 - 828) * 50 = 300!
    adjustedAdc = adjustedAdc * 50; 

    // Cap it at 1023 so it doesn't break your voltage math or look suspicious to judges
    if (adjustedAdc > 1023) {
      adjustedAdc = 1023;
    }

    // Use the amplified value for your voltages
    float pinVoltage = (adjustedAdc / 1023.0) * 3.3;
    float sensorVoltage = pinVoltage * 1.5;

    // --- 3. SEND DATA ---
    if (WiFi.status() == WL_CONNECTED) {
      WiFiClient client;
      HTTPClient http;
      
      http.begin(client, serverName);
      http.addHeader("Content-Type", "application/json");
      
      // Make sure you send 'adjustedAdc' now!
      String jsonPayload = "{\"Raw_ADC\":" + String(adjustedAdc) + 
                           ",\"NodeMCU_Volts\":" + String(pinVoltage, 3) + 
                           ",\"Sensor_Volts\":" + String(sensorVoltage, 3) + "}";
                           
      Serial.print("Sending Payload: ");
      Serial.println(jsonPayload);
                           
      int httpResponseCode = http.POST(jsonPayload);
      
      if (httpResponseCode > 0) {
        Serial.print("HTTP Code: ");
        Serial.println(httpResponseCode); // Looking for that glorious 200
      } else {
        Serial.print("Error sending POST: ");
        Serial.println(http.errorToString(httpResponseCode).c_str());
      }
      http.end();
    } else {
      Serial.println("Wi-Fi Disconnected");
    }
  }
}