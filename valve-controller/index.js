const mqtt = require('mqtt')

const client = mqtt.connect("mqtt://192.168.10.105")

client.subscribe("valve/1/status")

client.on('message', function (topic, message) {
    console.log("!!!!", topic, message)
    client.publish('valve/1/sleep', '')
})