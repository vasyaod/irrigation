# Irrigation system improvements

## Common ESP32 notes

Strapping PinsThere are five strapping pins:
  • MTDI
  • GPIO0
  • GPIO2
  • MTDO
  • GPIO5
Software can read the values of these five bits from register ”GPIO_STRAPPING”, 

## Valve V2

Controller based on ESP32.

For switching of buttons the nest pins are used
  - GPIO12/P12
  - GPIO13/P13
  - GPIO27/P27

Indicator is using GPIO2

## Uploading firmware

```
esphome valve-v2.yaml run
```

## Test of valve

For this purpose the tool is required https://hivemq.github.io/mqtt-cli/

Enable channel #1 for one second

```
mqtt pub -h 192.168.10.105 -t valve/channel/1 -m "1"
```

Enable channel #2 for three seconds

```
mqtt pub -h 192.168.10.105 -t valve/channel/2 -m "3"
```

## Links and references

  - https://docs.platformio.org/en/latest/platforms/espressif32.html
  