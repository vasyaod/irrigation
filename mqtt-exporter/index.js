const mqtt = require('mqtt')
const SDC = require('statsd-client')

const client  = mqtt.connect("mqtt://192.168.10.105")
const sdc = new SDC({host: '192.168.10.105', port: 8125});

client.subscribe("moisture-sensor/+/data")

client.on('message', function (topic, message) {
    console.log(topic, message.toString())
    const v = parseFloat(message.toString())
    
    sdc.gauge(topic.replace("/","-").replace("/","-"), v);
})