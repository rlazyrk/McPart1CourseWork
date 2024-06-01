#include <Arduino.h>
#include <DHT11.h>


#define SLAVE_ADDRESS 0x34
#define TEMPHMD_PIN 9
#define GAS_PIN 10

byte address;
bool gasDetected = false;
int temperature = 0;
int humidity = 0;

DHT11 dht11(TEMPHMD_PIN);


void writeData();

void setWriteModeRS485() {
  PORTD |= 1 << PD2;
  delay(1);
}

ISR(USART_TX_vect) {
  PORTD &= ~(1 << PD2);
}

void setup() {
  delay(1000);
  DDRD = 0b00000111;
  PORTD = 0b11111000;

  Serial.begin(9600, SERIAL_8N1);
  UCSR0B |= (1 << UCSZ02) | (1 << TXCIE0);
  UCSR0A |= (1 << MPCM0);
  delay(1);
}

void loop() {
  if (Serial.available()) {
    byte inByte = Serial.read();
    if (SLAVE_ADDRESS == inByte) {
      UCSR0A &= ~(1 << MPCM0);
      setWriteModeRS485();
      writeData();
      delay(200);
    }
  }
  if(digitalRead(GAS_PIN) == HIGH){
    gasDetected = true;
  }
  else{
    gasDetected = false;
  }
}

void writeData() {
  temperature = dht11.readTemperature();
  humidity = dht11.readHumidity();
  
  if (isnan(temperature) || isnan(humidity)) {
    writeData();
    return;
  }



  uint8_t data[4];
  data[0] = temperature;
  data[1] = humidity;
  data[2] = gasDetected;
  data[3] = calculateCRC8(data, 3);
  for (int i = 0; i < 4; i++) {
    Serial.write(data[i]);
  }
}

uint8_t calculateCRC8(const uint8_t *data, int length) {
    uint8_t crc = 0x00;
    uint8_t polynomial = 0x07; 

    for (int i = 0; i < length; ++i) {
        crc ^= data[i];

        for (int j = 0; j < 8; ++j) {
            if (crc & 0x80) {
                crc = (crc << 1) ^ polynomial;
            } else {
                crc <<= 1;
            }
        }
    }

    return crc;
}



