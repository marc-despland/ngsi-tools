'use strict';
const yargs = require('yargs')
var kafka = require('kafka-node')
var Consumer = kafka.Consumer;

const argv = yargs
    .option('kafka', {
        alias: 'k',
        description: 'Kafka host',
        type: 'string',
    })
    .help()
    .alias('help', 'h')
    .argv;

(async () => {
    if (argv.kafka) {
        try {
            Consumer = kafka.Consumer;
            const client = new kafka.KafkaClient({ kafkaHost: argv.kafka });

            var consumer = new Consumer(
                client,
                [
                    { topic: 'data', partition: 100 }
                ],
                {
                    autoCommit: false
                }
            );
            consumer.on('message', function (message) {
                console.log("Message : "+message);
            });
            consumer.on('error', function (err) {
                console.log("Error : "+err)
            })
        } catch (error) {
            console.log("An error occurs : " + error)
        }
    }

})().catch(error => {
    console.log("Schema Validator generate an error : " + error)
});