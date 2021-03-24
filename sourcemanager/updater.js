'use strict';

var Config = require('./config');
const axios = require('axios');


module.exports = {
    createEntity,
    deleteEntity,
    getEntity,
    deleteAttribute,
    addAttribute,
    patchEntity,
    checkIMO,
    patchIMO,
    checkOperation,
    patchOperation,
    patchUnloadingBerth,
    patchLoadingBerth,
    checkUnloadingBerth,
    checkLoadingBerth,
    checkScheduledLeaveDock,
    patchScheduledLeaveDock,
    patchEntity,
    countVesselCall,
    updateVesselCallPage,
    updateVesselCall
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
async function addAttribute(entity, attr, value) {
    var orion = Config.OrionAPI;
    var body = {};
    body[attr] = value;
    var request = {
        method: 'POST',
        url: orion + "/v2/entities/" + entity.id + "/attrs",
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify(body),
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


function intToText(value) {
    return value.toString();
}

function checkIMO(entity) {
    var response = "";
    if (entity.hasOwnProperty("IMO") && entity.IMO.hasOwnProperty("type") && (entity.IMO.type != "Text")) {
        response = {
            type: "Text",
            value: intToText(entity.IMO.value)
        }
    }
    return response;
}



async function patchIMO(entity) {
    var attrs = checkIMO(entity);
    if (attrs !== "") {
        var orion = Config.OrionAPI;
        var request = {
            method: 'PUT',
            url: orion + "/v2/entities/" + entity.id + "/attrs/IMO",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(attrs),
            json: true
        };
        try {
            var response = await sendRequest(request, 204);
            return true;
        } catch (error) {
            return Promise.reject("Can't update entity: " + error)
        }
    } else {
        return false;
    }
}


function checkOperation(entity) {
    return entity.hasOwnProperty("operation");
}

async function patchOperation(entity) {
    if (checkOperation(entity)) {
        try {
            await deleteAttribute(entity, "operation");
            return true;
        } catch (error) {
            return Promise.reject("Can't delete attribute: " + error)
        }
    } else {
        return false;
    }
}



function checkUnloadingBerth(entity) {
    var response = "";
    if (entity.hasOwnProperty("unloading_berth") && entity.unloading_berth.hasOwnProperty("type") && (entity.unloading_berth.type != "Text")) {
        response = {
            type: "Text",
            value: intToText(entity.unloading_berth.value)
        }
    }
    return response;
}



async function patchUnloadingBerth(entity) {
    var attrs = checkUnloadingBerth(entity);
    if (attrs !== "") {
        var orion = Config.OrionAPI;
        var request = {
            method: 'PUT',
            url: orion + "/v2/entities/" + entity.id + "/attrs/unloading_berth",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(attrs),
            json: true
        };
        try {
            var response = await sendRequest(request, 204);
            return true;
        } catch (error) {
            return Promise.reject("Can't update entity: " + error)
        }
    } else {
        return false;
    }
}

function checkLoadingBerth(entity) {
    var response = "";
    if (entity.hasOwnProperty("loading_berth") && entity.loading_berth.hasOwnProperty("type") && (entity.loading_berth.type != "Text")) {
        response = {
            type: "Text",
            value: intToText(entity.loading_berth.value)
        }
    }
    return response;
}



async function patchLoadingBerth(entity) {
    var attrs = checkLoadingBerth(entity);
    if (attrs !== "") {
        var orion = Config.OrionAPI;
        var request = {
            method: 'PUT',
            url: orion + "/v2/entities/" + entity.id + "/attrs/loading_berth",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(attrs),
            json: true
        };
        try {
            var response = await sendRequest(request, 204);
            return true;
        } catch (error) {
            return Promise.reject("Can't update entity: " + error)
        }
    } else {
        return false;
    }
}

function checkScheduledLeaveDock(entity) {
    return entity.hasOwnProperty("scheduled_leave_dock");
}
async function patchScheduledLeaveDock(entity) {
    if (checkScheduledLeaveDock(entity)) {
        var departure = entity.scheduled_leave_dock;
        try {
            await deleteAttribute(entity, "scheduled_leave_dock");
            await addAttribute(entity, "scheduled_departure_dock", departure);
            return true;
        } catch (error) {
            return Promise.reject("Can't delete or add attribute: " + error)
        }
    } else {
        return false;
    }
}

async function patchEntity(entity) {
    var updated = false;
    try {
        updated = await patchIMO(entity) || updated
        updated = await patchOperation(entity) || updated
        updated = await patchUnloadingBerth(entity) || updated
        updated = await patchLoadingBerth(entity) || updated
        updated = await patchScheduledLeaveDock(entity) || updated
        return updated;
    } catch (error) {
        return Promise.reject("Fail to patch entity: " + error)
    }
}

async function countVesselCall() {
    var orion = Config.OrionAPI;
    var request = {
        method: 'GET',
        url: orion + "/v2/entities?type=VesselCall&options=count",
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

async function updateVesselCallPage(page, items) {
    var orion = Config.OrionAPI;
    var request = {
        method: 'GET',
        url: orion + "/v2/entities?type=VesselCall&options=count&limit=" + items + "&offset=" + (items * page),
        headers: {},
        json: true
    };
    try {
        var response = await sendRequest(request, 200);
        var updated = false;
        for (var i = 0; i < response.data.length; i++) {
            updated = await patchEntity(response.data[i]) || updated;
        }
        return (updated);
    } catch (error) {
        return Promise.reject("Can't update entity: " + error)
    }
}


async function updateVesselCall() {
    var updated = false;
    var items = 20;
    try {
        var count=await countVesselCall();
        for (var i = 0; i < count; i = i + items) {
            var page = Math.floor(i / items);
            updated = await updateVesselCallPage(page, items) || updated;
            console.log("Page "+page+ " updated :" +updated)
        }
        return (updated);
    } catch (error) {
        return Promise.reject("Can't update entity: " + error)
    }
}