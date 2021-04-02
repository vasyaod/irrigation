const mqtt = require('mqtt')
const { List } = require('immutable');
const CronJob = require('cron').CronJob;
const SDC = require('statsd-client')
require('console-stamp')(console, { pattern: 'yyyy/mm/dd HH:MM:ss.l' });

const sdc = new SDC({host: '192.168.10.105', port: 8125});

let queue = List([])
let isOn = true

function subscribe(topic, f) {
    const client = mqtt.connect("mqtt://192.168.10.105")

    client.subscribe(topic)
    console.log("Subscribed to", topic)
    
    client.on('message', function (topic, message) {
        f(topic, message, client)
    })
}

function pushToQueue(value) {
    if (isOn) {
        queue = queue.push(value)
        sdc.gauge("valve-controller/queue-size", queue.size)
    }
}

console.log("Valve controller started", new Date())

subscribe("valve/+/status",  function (topic, message, client) {
    console.log("Valve awake", topic, message.toString())

    if (queue.size > 0) {
        const nextTask = queue.first()
        queue = queue.shift()

        console.log("A new task is available", nextTask.topic, nextTask.value)
        client.publish(nextTask.topic, nextTask.value)

        sdc.gauge("valve-controller/queue-size", queue.size)
    } else {
        console.log("No tasks, the valve should sleep")
        client.publish('valve/1/sleep', '')
    }
})

subscribe("valve/+/status",  function (topic, message) {
    console.log("Status", topic, message.toString())
})

// {"topic": "valve/1/channel/2", "value": "1"}
subscribe("valve-controller/add-task",  function (topic, message) {
    console.log("Debug method to valve controller", message.toString())
    pushToQueue(JSON.parse(message.toString()))
})

subscribe("valve-controller/on",  function (topic, message) {
    isOn = true
})

subscribe("valve-controller/off",  function (topic, message) {
    isOn = false
})

subscribe("moisture-sensor/+/data",  function (topic, message) {
    console.log("Moisture-sensor status", topic, message.toString())
})

const job1 = new CronJob('0 0 16 * * *', function() {
    pushToQueue({
        topic: "valve/1/channel/3",
        value: "1"
    })

    pushToQueue({
        topic: "valve/1/channel/4",
        value: "3"
    })

    pushToQueue({
        topic: "valve/1/channel/2",
        value: "2"
    })
})
job1.start();

const job2 = new CronJob('0 0 17 */3 * *', function() {
    pushToQueue({
        topic: "valve/1/channel/1",
        value: "4"
    })
})
job2.start();
