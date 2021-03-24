'use strict';
const fs = require('fs');

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

var myArgs = process.argv.slice(2);

console.log('Generating secrets for  ', myArgs);

try {

    fs.readdirSync(myArgs[0]).forEach(file => {
        var id=makeid(12);
        fs.writeFileSync(myArgs[0]+"/"+file, id);
        console.log(file +" : done")
    });
} catch (error) {
    console.log("Secret folder "+myArgs[0]+" doesn't exists")
}   