#!/usr/bin/env node 
'use strict';
const yargs = require('yargs')
const axios = require('axios');

var Config= {
    OrionService: "",
    OrionServicePath: ""
}

async function parseHeader(str) {
    var header={
        key: "",
        value: ""
    }
    const words = str.split(':');
    header.key=words[0];
    header.value=words[1];
    return header;
}

async function sendRequest(request) {
    var response;
    try {
        response = await axios.request(request);
    } catch (error) {
        return Promise.reject(error)
    }
    return response;
}


const argv = yargs
    .option('X', {
        alias: 'X',
        description: 'verb',
        type: 'string',
    })
    .option('headers', {
        alias: 'H',
        description: 'header',
        type: 'string',
    })
    .option('v', {
        alias: 'v',
        description: 'verbose',
        type: 'boolean',
    })   .help()
    .alias('help', 'h')
    .argv;

(async () => {
    console.log("Verbe :" +argv.X)
    console.log("Headers :" +argv.headers)
    console.log("URL :" +argv._[0])
    var request = {
        method: argv.X || "GET",
        url: argv._[0],
        headers: {},
        json: true
    };
    if (argv.headers) {
        if (typeof argv.headers === "object" && argv.headers.isArray()) {
            for (const str of argv.headers) {
                var header = await parseHeader(str);
                request.headers[header.key] = header.value
            }
        } else {
            var header = await parseHeader(argv.headers);
            request.headers[header.key] = header.value;
        }
    }
    if (argv.v) {
        console.log(JSON.stringify(request, null, 4));
    }
    try {
        var response= await sendRequest(request);
        if (response.hasOwnProperty("data")) {
            console.log(JSON.stringify(response.data, null, 4));
        }
    } catch (error) {
        console.log("An error occurs : "+error);
    }

})().catch(error => {
    console.log("Pretty-curl generate an error : " + error)
});