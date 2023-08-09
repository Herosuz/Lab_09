#include <Arduino.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>
#include <WiFiClient.h>
#include <DHT.h> // Include the DHT library

const char *SSID = "********";
const char *PASSWORD = "********";
const char *URL = "http://xxx.xxx.xxx.xxx:3000/farm";

WiFiMulti WiFiMulti;
WiFiClient client;
HTTPClient http;

#define DHT_PIN 14
DHT dht(DHT_PIN, DHT11);

void setup() {
  Serial.begin(115200);
  Serial.println();
  Serial.println();
  Serial.println();
  for (uint8_t t = 4; t > 0; t--) {
    Serial.printf("[SETUP] WAIT %d...\n", t);
    Serial.flush();
    delay(1000);
  }

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(SSID, PASSWORD);

  Serial.print("Connecting to ");
  while (WiFiMulti.run() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  dht.begin(); // Initialize DHT sensor
}

void postJsonData() {
  Serial.print("Connecting to ");
  if (WiFiMulti.run() == WL_CONNECTED) {
    Serial.println("[HTTP] begin...");
    if (http.begin(client, URL)) { // HTTP
      Serial.println("[HTTP] POST...");
      // Format JSON
      const int capacity = JSON_OBJECT_SIZE(3);
      StaticJsonDocument<capacity> doc;
      // Read data from DHT11 sensor
      float temperature = dht.readTemperature();
      float humidity = dht.readHumidity();
      doc["temperature"] = temperature;
      doc["humid"] = humidity;
      doc["time"] = "2023-08-07T12:34:56.789+00:00";
      char output[128];
      serializeJson(doc, output);

      http.addHeader("Content-Type", "application/json");
      int httpCode = http.POST(output);
      Serial.println(httpCode); // Print HTTP return code

      if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
        String payload = http.getString();
        Serial.println(payload);

        // Parse JSON response
        Serial.println("Begin parse json data ...");
        DynamicJsonDocument docResponse(2048);
        DeserializationError err = deserializeJson(docResponse, payload);
        if (err) {
          Serial.print(F("deserializeJson() failed with code "));
          Serial.println(err.c_str());
        } else {
          String name = docResponse["name"].as<String>();
          Serial.println(name);
        }
      } else {
        Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
      }
      http.end(); // Close connection
      Serial.println("Closing connection");
    }
  }
}

void loop() {
  postJsonData();
  delay(10000);
}