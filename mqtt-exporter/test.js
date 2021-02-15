const mqtt = require('mqtt')
const SDC = require('statsd-client')

const sdc = new SDC({host: '192.168.10.105', port: 8125});

console.log("moisture-sensor/10/data".replace("/","-").replace("/","-"))
sdc.gauge("moisture-sensor-9-data", "10.1")
