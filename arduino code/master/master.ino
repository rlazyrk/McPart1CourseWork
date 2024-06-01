#include <Arduino.h>
#include <LiquidCrystal.h>

#define BUFFER_SIZE 4
#define SLAVE_1_ADDRESS 0x57
#define SLAVE_2_ADDRESS 0x34
#define RESER_BUTTON 8

bool isAddress = true;
bool isCommand = false;
bool isFire = false;
bool buttonPressed = false;

byte command;
byte usedAddres;

uint8_t buffer[BUFFER_SIZE];
uint8_t index = 0;
uint8_t timerSec = 0;
uint8_t temperatureData1 = 0;
uint8_t humidityData1 = 0;
uint8_t temperatureData2 = 0;
uint8_t humidityData2 = 0;
uint8_t skipCounter = 0;
uint8_t skipCounter1 = 0;

const int rs = 27, rw = 28, en = 26, a0 = 22, a2 = 23, a3 = 24, a4 = 25;


void writeData();
void setWriteModeRS485();
void requestByTimer(byte address);
void readData();

uint8_t calculateChecksum(uint8_t *data, size_t length);

bool verifyChecksum(uint8_t *data, size_t length, uint8_t checksum);



LiquidCrystal lcd(rs, rw, en, a0, a2, a3, a4);

void setupTimers() {
  noInterrupts();
  TCCR3A = 0x00;
  TCCR3B = (1 << WGM12) | (1 << CS12) | (1 << CS10);
  TIMSK3 = (1 << OCIE1A);
  OCR3A = 0x3D08;
}

ISR(TIMER3_COMPA_vect) {
  timerSec ++;
}
ISR(USART1_TX_vect)
{ 
  PORTD &= ~(1 << PD1);
}


void setWriteModeRS485() {
  PORTD |= 1 << PD1; 
  delay(1);
}



void setup() {
  delay(1000);
  setupTimers();
  DDRD |= 1 << PD1;
  PORTD &= ~(1 << PD1);
  Serial.begin(9600);
  Serial1.begin(9600, SERIAL_8N1);
  Serial1.write("");
  UCSR1B |= (1 << UCSZ12) | (1 << TXCIE1);
  lcd.begin(16, 2);
  interrupts();
}

void loop() {
  if (timerSec == 5 && !isCommand) { 
      requestByTimer(SLAVE_1_ADDRESS);
      isCommand = true;
  }

  if (timerSec == 10 && isCommand) { 
    requestByTimer(SLAVE_2_ADDRESS);
    isCommand = false;
    timerSec = 0;
  }
  readData();
  
}

void requestByTimer(byte address){
  usedAddres = address;
  setWriteModeRS485();
  UCSR1B |= 1 << TXB81;
  Serial1.write(address);
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

void readData(){
  if (Serial1.available()) {
    byte inByte1 = Serial1.read();
    if (index < BUFFER_SIZE) {
      buffer[index++] = inByte1;
    }
    if (index == BUFFER_SIZE) {
      uint8_t receivedChecksum = buffer[BUFFER_SIZE - 1];
      if (calculateCRC8(buffer, 3) == receivedChecksum) {
        isFire = buffer[2];
        uint8_t tempTemperature = buffer[0];
        uint8_t tempHumidity = buffer[1];
        if(usedAddres == SLAVE_1_ADDRESS){
          if(abs(tempTemperature - temperatureData1) >= 5 || abs(tempHumidity - humidityData1) >= 20 || isFire || skipCounter == 10 || tempTemperature >=40 || tempHumidity <=40){
            writeData();
            skipCounter = 0; 
          }else{
            skipCounter++;
          }
          temperatureData1 = buffer[0];
          humidityData1 = buffer[1];
        }
        else{
          if(abs(tempTemperature - temperatureData2) >= 5 || abs(tempHumidity - humidityData2) >= 20 || isFire || skipCounter1 == 10 || tempTemperature >=40 || tempHumidity <=40){
            writeData();
            skipCounter1 = 0; 
          }else{
            skipCounter1++;
          }
          temperatureData2 = buffer[0];
          humidityData2 = buffer[1];
        }
        
        uint8_t tempToPrint = (temperatureData2 == 0) ? temperatureData1   : (temperatureData1 + temperatureData2)/2  ;
        uint8_t humidityToPrint = (humidityData2 == 0) ? humidityData1  : (humidityData1 + humidityData2)/2;
        lcd.clear();
        lcd.print("Temp:");
        lcd.print(tempToPrint);
        lcd.print("C ");
        lcd.print("Hmd:");
        lcd.print(humidityToPrint);
        lcd.print("%");
        lcd.setCursor(0, 1);
        if(humidityToPrint <= 30 && !isFire){
          lcd.print("Satus: dng hmd");
        } else if(tempToPrint >= 50){
          lcd.print("Status:FIRE");
        }else if(isFire){
          lcd.print("Status:FIRE");
        }else{
          lcd.print("Status:OK");
        }
      } else {
        requestByTimer(usedAddres);
      }
      index = 0;
    }
  }
}

void writeData(){
  for(int i = 0; i<2; i++){
    Serial.write(buffer[i]);
  }
  Serial.write(isFire);
  Serial.write(usedAddres);
  Serial.write(calculateCRC8(buffer, 3));
}