'use strict';

var Config = require('./config');
const axios = require('axios');


module.exports = {
    createEntity,
    deleteEntity,
    getEntity,
    createUpdateAttribute,
    updateAttribute, 
    countObject,
    updatePage,
    update,
    countSearchNoVersion,
    searchObject
}

async function sendRequest(request, expected) {
    var response;
    if (Config.OrionService != "") request.headers["Fiware-Service"] = Config.OrionService;
    if (Config.OrionServicePath != "") request.headers["Fiware-ServicePath"] = Config.OrionServicePath;
    try {
        response = await axios.request(request);
    } catch (error) {
        return Promise.reject(error)
    }
    if (response.status === expected) {
        return response;
    } else {
        return Promise.reject(response.status + " " + response.statusText)
    }
}

async function createEntity(entity) {
    var orion = Config.OrionAPI;
    var request = {
        method: 'POST',
        url: orion + "/v2/entities",
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify(entity),
        json: true
    };
    try {
        var response = await sendRequest(request, 201);
        return true;
    } catch (error) {
        return Promise.reject("Can't update entity: " + error)
    }
}


async function getEntity(entity) {
    var orion = Config.OrionAPI;
    var request = {
        method: 'GET',
        url: orion + "/v2/entities/" + entity.id,
        headers: {
        },
        json: true
    };
    try {
        var response = await sendRequest(request, 200);
        return response.data;
    } catch (error) {
        return Promise.reject("Can't get entity: " + error)
    }
}
async function deleteEntity(entity) {
    var orion = Config.OrionAPI;
    var request = {
        method: 'DELETE',
        url: orion + "/v2/entities/" + entity.id,
        headers: {
        },
        json: true
    };
    try {
        var response = await sendRequest(request, 204);
        return true;
    } catch (error) {
        return Promise.reject("Can't update entity: " + error)
    }
}


async function deleteAttribute(entity, attr) {
    var orion = Config.OrionAPI;
    var request = {
        method: 'DELETE',
        url: orion + "/v2/entities/" + entity.id + "/attrs/" + attr,
        headers: {
        },
        json: true
    };
    try {
        var response = await sendRequest(request, 204);
        return true;
    } catch (error) {
        return Promise.reject("Can't delete attribute: " + error)
    }
}


async function countObject(type) {
    var orion = Config.OrionAPI;
    var request = {
        method: 'GET',
        url: orion + "/v2/entities?type="+type+"&options=count",
        headers: {},
        json: true
    };
    try {
        var response = await sendRequest(request, 200);
        if (response.headers.hasOwnProperty("fiware-total-count")) {
            return parseInt(response.headers["fiware-total-count"]);
        } else {
            return Promise.reject("Missing fiware-total-count header");
        }
    } catch (error) {
        return Promise.reject("Can't update entity: " + error)
    }
}

async function countSearchNoVersion(type, attr) {
    var orion = Config.OrionAPI;
    var request = {
        method: 'GET',
        url: orion + "/v2/entities?type="+type+"&options=count&mq=!"+attr+".version",
        headers: {},
        json: true
    };
    try {
        var response = await sendRequest(request, 200);
        if (response.headers.hasOwnProperty("fiware-total-count")) {
            return parseInt(response.headers["fiware-total-count"]);
        } else {
            return Promise.reject("Missing fiware-total-count header");
        }
    } catch (error) {
        return Promise.reject("Can't update entity: " + error)
    }
}


async function searchObject(type, attr, version) {
    var orion = Config.OrionAPI;
    var request = {
        method: 'GET',
        url: orion + "/v2/entities?type="+type+"&options=count&mq=!"+attr+".version",
        headers: {},
        json: true
    };
    try {
        var response = await sendRequest(request, 200);
        if (response.data.length>0) {
            return response.data;
        } else {
            request = {
                method: 'GET',
                url: orion + "/v2/entities?type="+type+"&options=count&mq="+attr+".version!='"+version+"'",
                headers: {},
                json: true
            };
            response = await sendRequest(request, 200);
            return response.data;
        }
    } catch (error) {
        return Promise.reject("Can't search entity: " + error)
    }
}

async function updatePage(type, attr, version, page, items) {
    var orion = Config.OrionAPI;
    var request = {
        method: 'GET',
        url: orion + "/v2/entities?type="+type+"&options=count&limit=" + items + "&offset=" + (items * page),
        headers: {},
        json: true
    };
    try {
        var response = await sendRequest(request, 200);
        for (var i = 0; i < response.data.length; i++) {
            await updateAttribute(response.data[i], attr, version);
        }
        return (response.data.length);
    } catch (error) {
        return Promise.reject("Can't update entity: " + error)
    }
}

async function update(type, attr, version) {
    var count=0;
    try {
        var list= await searchObject(type, attr, version);
        while (list.length>0) {
            console.log("First element : "+list[0].id)
            for (var i=0; i<list.length;i++) {
                await updateAttribute(list[i], attr, version)
            }
            console.log("Updated "+list.length+" elements");
            count+=list.length;
            list= await searchObject(type, attr, version);
        }
        return count;
    } catch (error) {
        return Promise.reject("Can't update entity: " + error)
    }
}


async function updateAttribute(entity, attr, version) {
    var value=createUpdateAttribute(entity, attr, version);
    if (value !==null) {
        var orion = Config.OrionAPI;
        var request = {
            method: 'PUT',
            url: orion + "/v2/entities/" + entity.id + "/attrs/"+attr,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(value),
            json: true
        };
        try {
            var response = await sendRequest(request, 204);
            return true;
        } catch (error) {
            console.log(JSON.stringify(request, null, 4));
            return Promise.reject("Can't add attribute: " + error)
        }
    }
}

function createUpdateAttribute(entity, attr, version) {
    var value=null;
    if (entity.hasOwnProperty(attr)) {
        value=entity[attr];
        if (!value.hasOwnProperty("metadata")) {
            value.metadata={};
        }
        value.metadata.version={
            value: version
        }
    }
    return value;
}