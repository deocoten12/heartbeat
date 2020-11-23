#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include "MAX30100_PulseOximeter.h"
#include <ArduinoJson.h>
#include <HTTPClient.h>

#define REPORTING_PERIOD_MS 2000
PulseOximeter pox;
uint32_t tsLastReport = 0;

// Thông tin về wifi
//#define ssid "Ka Tea"
//#define password "0983548990"
#define ssid "Phong201"
#define password "Tuyenz129@"

#define mqtt_server "192.168.1.116"
//#define mqtt_server "broker.hivemq.com"

const uint16_t mqtt_port = 1883;    //Port của MQTT TCP

#define topic1  "orion-heartbeat"

WiFiClient espClient;
PubSubClient client(espClient);

void onBeatDetected()
{
    Serial.println("Beat!");
}
void setup()
{
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  if (!client.connected()){// Kiểm tra kết nối
    reconnect();
  }

  Serial.print("Initializing pulse oximeter...");
  pox.begin();
  pox.setOnBeatDetectedCallback(onBeatDetected);
}
// Hàm kết nối wifi
void setup_wifi()
{
  Serial.print("Connecting");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {}
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  
}
// Hàm call back để nhận dữ liệu
void callback(char* topic, byte* payload, unsigned int length)
{
  Serial.print("Co tin nhan moi tu topic:");
  Serial.println(topic);
  char p[length + 1];
  memcpy(p, payload, length);
  p[length] = NULL;
  String message(p);
  if(message=="on")
  {

  }
  Serial.println(message);
  Serial.println();
}
// Hàm reconnect thực hiện kết nối lại khi mất kết nối với MQTT Broker
void reconnect()
{
  while(!client.connected()) // Chờ tới khi kết nối
  {
    if (client.connect("ESP32Client"))
    {
      Serial.println("Đã kết nối:");
      //client.subscribe("orion-canhbao");    
    }
    else
    {
            Serial.print("Lỗi:, rc=");
            Serial.print(client.state());
            Serial.println(" try again in 5 seconds");
            delay(5000);
    }
  }
}
void loop()
{
  if (!client.connected())// Kiểm tra kết nối
  {
    reconnect();
  }
  client.loop();
//   Make sure to call update as fast as possible
  pox.update();
  if (millis() - tsLastReport > REPORTING_PERIOD_MS) {
      Serial.print("Heart rate:");
      Serial.print(pox.getHeartRate());
      Serial.print("bpm / SpO2:");
      Serial.print(pox.getSpO2());
      Serial.println("%");
      int a = pox.getHeartRate();
      int b = pox.getSpO2();  
      
      StaticJsonDocument<100> doc;
      doc["Heartbeat"] = a;
      doc["Oxygen"] = b;
      //Serial.println(a);
      //Serial.println(b);
    
      char buffer[100];
      serializeJson(doc, buffer);
      client.publish(topic1, buffer);
      Serial.println(buffer);
      tsLastReport = millis(); 
  }
}
