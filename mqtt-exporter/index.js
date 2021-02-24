const mqtt = require('mqtt')
const SDC = require('statsd-client')
require('console-stamp')(console, { pattern: 'yyyy/mm/dd HH:MM:ss.l' });

const sdc = new SDC({host: '192.168.10.105', port: 8125});

function fixTopic(topic) {
    return topic.replace("/","-").replace("/","-")
}

function subscribe(topic, f) {
    const client = mqtt.connect("mqtt://192.168.10.105")

    client.subscribe(topic)
    
    client.on('message', function (topic, message) {
        f(topic, message)
    })
}

subscribe("moisture-sensor/+/data",  function (topic, message) {
    console.log("Data", topic, message.toString())
    const v = parseFloat(message.toString())
    
    sdc.gauge(fixTopic(topic), v);
})

subscribe("moisture-sensor/+/status",  function (topic, message) {
    console.log("Status", topic, message.toString())
    sdc.counter(fixTopic(topic), 1);
})

subscribe("valve/+/status",  function (topic, message) {
    console.log("Status", topic, message.toString())
    sdc.counter(fixTopic(topic), 1);
})