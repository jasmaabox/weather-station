# Adapted from: https://learn.adafruit.com/adafruit-airlift-featherwing-esp32-wifi-co-processor-featherwing/circuitpython-wifi
import time
import json
import board
import busio
from digitalio import DigitalInOut, Direction
import adafruit_requests as requests
import adafruit_esp32spi.adafruit_esp32spi_socket as socket
from adafruit_esp32spi import adafruit_esp32spi
import adafruit_dht
from utils import timestamp2key, build_multipart_form

# Turn led on when program is running
led = DigitalInOut(board.LED)
led.direction = Direction.OUTPUT
led.value = True

TIME_API_URL = "http://worldtimeapi.org"
CF_API_URL = "https://api.cloudflare.com/client/v4"

try:
    from secrets import secrets
except ImportError:
    print("Please put WiFi secrets in secrets.py")
    raise

esp32_cs = DigitalInOut(board.GP13)
esp32_ready = DigitalInOut(board.GP14)
esp32_reset = DigitalInOut(board.GP15)
dht = adafruit_dht.DHT11(board.GP16)

spi = busio.SPI(board.GP10, board.GP11, board.GP12)
esp = adafruit_esp32spi.ESP_SPIcontrol(spi, esp32_cs, esp32_ready, esp32_reset)

requests.set_socket(socket, esp)

if esp.status == adafruit_esp32spi.WL_IDLE_STATUS:
    print("ESP32 found and in idle mode")
print("Firmware vers.", esp.firmware_version)
print("MAC addr:", [hex(i) for i in esp.MAC_address])

print("Connecting to AP...")
while not esp.is_connected:
    try:
        esp.connect_AP(secrets["ssid"], secrets["password"])
    except OSError as e:
        print("could not connect to AP, retrying: ", e)
        continue
print("Connected to", str(esp.ssid, "utf-8"), "\tRSSI:", esp.rssi)

while True:
    temperature = dht.temperature
    humidity = dht.humidity
    print(f"Temperature: {temperature}")
    print(f"Humidity: {humidity}")

    print("Getting time...")
    r = requests.get(f"{TIME_API_URL}/api/timezone/{secrets['timezone']}")
    time_ms = r.json()['unixtime'] * 1000

    print("Putting data in table...")
    key = timestamp2key(time_ms)
    form_boundary = "someBoundary"
    data, _ = build_multipart_form({
        "value": "picoValue",
        "metadata": json.dumps({
            "temperature": temperature,
            "humidity": humidity,
        }),
    }, boundary=form_boundary)
    r = requests.put(
        f"{CF_API_URL}/accounts/{secrets['cf_account_id']}/storage/kv/namespaces/{secrets['cf_namespace_id']}/values/{key}",
        data=data,
        headers={
            "Authorization": f"Bearer {secrets['cf_access_token']}",
            "Content-Type": f"multipart/form-data; boundary={form_boundary}",
        },
    )
    print("Done!")

    # Update every hour
    time.sleep(3600)
