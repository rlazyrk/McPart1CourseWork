import serial
import time
from controller import insert


def calculate_crc8(data):
    crc = 0x00
    polynomial = 0x07

    for byte in data:
        crc ^= byte
        for _ in range(8):
            if crc & 0x80:
                crc = (crc << 1) ^ polynomial
            else:
                crc <<= 1
        crc &= 0xFF
    return crc


port = 'COM10'
baud_rate = 9600

try:
    ser = serial.Serial(port, baud_rate, timeout=1)
    print(f"Successfully connected to {port} at {baud_rate} baud rate.")
except serial.SerialException as e:
    print(f"Error opening serial port {port}: {e}")
    ser = None


def read_from_serial():
    if ser is None:
        print("Serial port not available.")
        return
    while True:
        if ser.in_waiting >= 5:
            data = ser.read(5)
            byte1 = int(data[1])
            byte2 = int(data[0])
            byte3 = bool(data[2])
            byte4 = int(data[3])
            received_crc = data[4]
            calculated_crc = calculate_crc8(data[:3])

            if calculated_crc == received_crc:
                insert(byte4, byte1, byte2, byte3)
            else:
                print("CRC mismatch: received {0:02X}, calculated {1:02X}".format(received_crc, calculated_crc))
        time.sleep(1)
