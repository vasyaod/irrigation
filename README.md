# Irrigation system improvements

## Valve V2

Controller based on ESP32.

For switching of buttons the nest pins are used
  - GPIO16
  - GPIO17
  - GPIO21

Indicator is using GPIO2

## Uploading firmware

```
esphome valve-v2.yaml run
```

## Testing

For this purpose the tool is required https://hivemq.github.io/mqtt-cli/

### Test switching of valve

Enable channel #1 for one minute

```
mqtt pub -h 192.168.10.105 -t valve/channel/1 -m "1"
```

Enable channel #2 for three minutes

```
mqtt pub -h 192.168.10.105 -t valve/channel/2 -m "3"
```
### Test moisture sensors

Subscribe to moisture-sensor data by
```
mqtt sub -t moisture-sensor/1/data -h 192.168.10.105
```

## Links and references
  - https://hivemq.github.io/mqtt-cli/ Mqtt CLI
  - https://esphome.io/api/helpers_8cpp_source.html Useful common functions
  - https://docs.platformio.org/en/latest/platforms/espressif32.html
  
# MQTT exporter

Mqtt exporter copies data from mqtt server to Graphite server by statsd interface.

```
npm install
node index.js
```

# Valve controller

Application controls valve based on latest moisture sensor values

```
npm install
node index.js
```