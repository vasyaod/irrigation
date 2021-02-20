const mqtt = require('mqtt')
const SDC = require('statsd-client')

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
    sdc.increment(fixTopic(topic));
})

subscribe("valve/+/status",  function (topic, message) {
    console.log("Status", topic, message.toString())
    sdc.increment(fixTopic(topic));
})