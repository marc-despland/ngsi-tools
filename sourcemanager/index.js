#!/usr/bin/env node 
'use strict';
const yargs = require('yargs')
const axios = require('axios');
const { exit } = require('yargs');

var Config = require('./config');
const Updater = require("./updater.js");

var Data = require('./test/data');

const argv = yargs
    .option('orion', {
        alias: 'O',
        description: 'Orion target',
        type: 'string',
        requiresArg: true
    })
    .option('populate', {
        alias: 'p',
        description: 'Populate test data',
        type: 'boolean',
    })
    .option('delete', {
        alias: 'd',
        description: 'Delete test data',
        type: 'boolean',
    })
   .help()
    .alias('help', 'h')
    .argv;

if (!argv.orion) {
    console.log("Missing orion server")
    exit(1);
}

Config.OrionAPI=argv.orion;

//Search matching entities
(async () => {
    if (argv.populate) {
        for( var i=0; i<Data.data.length; i++) {
            await Updater.createEntity(Data.data[i]);
        }
    }
    var found=await Updater.updateVesselCall();
    if (argv.delete) {
        for( var i=0; i<Data.data.length; i++) {
            await Updater.deleteEntity(Data.data[i]);
        }
    }
})().catch(error => {
    console.log("An error occurs : " + error)
});