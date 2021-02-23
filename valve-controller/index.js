const mqtt = require('mqtt')
const { List } = require('immutable');
const CronJob = require('cron').CronJob;

let queue = List([])

function subscribe(topic, f) {
    const client = mqtt.connect("mqtt://192.168.10.105")

    client.subscribe(topic)
    
    client.on('message', function (topic, message) {
        f(topic, message)
    })
}

subscribe("valve/1/status",  function (topic, message) {
    console.log("Valve awake", topic, message.toString())

    if (queue.size > 0) {
        const nextTask = queue.first()
        queue = queue.shift()

        console.log("A new task is available", nextTask.topic, nextTask.value)
        client.publish(nextTask.topic, nextTask.value)
    } else {
        console.log("No tasks, the valve should sleep")
        client.publish('valve/1/sleep', '')
    }
})

subscribe("valve-controller",  function (topic, message) {
    console.log("Debug method to valve controller", message.toString())
    queue = queue.push(JSON.parse(message.toString()))
})

const job = new CronJob('0 0 9 * * *', function() {
    console.log('Add a task to schedule')
    queue = queue.push({
        topic: "valve/1/channel/2",
        value: 1
    })
});
job.start();