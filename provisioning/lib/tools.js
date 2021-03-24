'use strict';
const fs = require('fs');

module.exports = {
    readSecret(key, value) {
        var result = "";
        if (process.env.hasOwnProperty(key + "_FILE")) {
            try {
                result = fs.readFileSync(process.env[key + "_FILE"], "utf8");
            } catch (error) {
                console.log("Can't read secret file for "+key+ " : "+ process.env[key + "_FILE"]);
                result= value;
            }
        } else {
            if (process.env.hasOwnProperty(key)) {
                result = process.env[key];
            } else {
                result= value;
            }
        }
        return result;
    },
    readBoolean(key, value) {
        var result = "";
        if (process.env.hasOwnProperty(key)) {
            if (process.env[key].toUpperCase() === "TRUE" || process.env[key].toUpperCase() === "YES") {
                result = true;
            } else {
                result = false;
            }
        } else {
            result = value;
        }
        return result;
    },
    makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}