'use strict';

var keyrock = require("./lib/keyrock");
var Orion = require("./lib/orion");
var Config = require('./config.js')

async function provisioning_keyrock() {
    var token = "";
    var pixel = "";
    var appli = "";
    try {
        token = await keyrock.authenticate();
    } catch (error) {
        return Promise.reject("Authenticate failed : " + error);
    }
    console.log("Token \t\t\t\t: " + token);
    var orga = {
        "organization": {
            "name": "PIXEL",
            "description": "The main PIXEL Organization"
        }
    }
    try {
        var list = await keyrock.getOrganizationsList(token);
        var found = false;
        for (var organization of list.organizations) {
            if (organization.Organization.name === orga.organization.name) {
                found = true;
                pixel = organization.Organization.id;
            }
        }
        if (!found) {
            try {
                var result = await keyrock.createOrganization(token, orga);
                pixel = result.organization.id;
            } catch (error) {
                return Promise.reject("Can't create organization PIXEL : " + error);
            }
        }
    } catch (error) {
        try {
            var result = await keyrock.createOrganization(token, orga);
            pixel = result.organization.id;
        } catch (error) {
            return Promise.reject("Can't create organization PIXEL : " + error);
        }
    }
    console.log("Organization PIXEL \t\t: " + pixel)

    var source = {
        "application": {
            "name": "DAL NGSIAGENTS PROXY",
            "description": "Access point for the NGSIAgents (daemon)",
            "redirect_uri": "http://localhost/login",
            "url": "http://localhost",
            "grant_type": [
                "authorization_code",
                "implicit",
                "password"
            ],
            "token_types": [
                "permanent"
            ]
        }
    }
    try {
        var list = await keyrock.getApplicationsList(token);
        var found = false;
        for (var application of list.applications) {
            if (application.name === source.application.name) {
                found = true;
                appli = application.id;
            }
        }
        if (!found) {
            var result = await keyrock.createApplication(token, source);
            appli = result.application.id;
        }
    } catch (error) {
        return Promise.reject("Can't create application DAL NGSIAGENTS PROXY : " + error);
    }
    console.log("Appli DAL NGSIAGENTS PROXY \t: " + appli)
    try {
        var result = await keyrock.getPEPProxy(token, appli);
        console.log("PEP Proxy already exists !");
        console.log("PEP Proxy oauth_client_id  \t: " + result.pep_proxy.id)
        if (Config.KeyrockRegenratePEPProxy) {
            try {
                var renew_password = await keyrock.renewPasswordPEPProxy(token, appli);
                console.log("PEP Proxy password \t\t: " + renew_password.new_password)
            } catch (error) {
                return Promise.reject("Can't renew paasword PEP Proxy for DAL NGSIAGENTS PROXY : " + error);
            }
        }
    } catch (error) {
        try {
            var result = await keyrock.createPEPProxy(token, appli);
            console.log("PEP Proxy password \t\t: " + result.pep_proxy.password)
        } catch (error) {
            return Promise.reject("Can't create PEP Proxy for DAL NGSIAGENTS PROXY : " + error);
        }
        try {
            var result = await keyrock.getPEPProxy(token, appli);
            console.log("PEP Proxy oauth_client_id \t: " + result.pep_proxy.id)
        } catch (error) {
            return Promise.reject("Can't retrieve PEP Proxy for DAL NGSIAGENTS PROXY : " + error);
        }
    }
}

async function provisioning_inquisitor() {
    var id = "";
    var subscription = {
        "description": "DAL Inquisitor subscription to detect new sources",
        "subject": {
            "entities": [
                {
                    "idPattern": ".*",
                    "typePattern": ".*"
                }
            ],
            "condition": {
                "attrs": [
                    "source"
                ]
            }
        },
        "notification": {
            "http": {
                "url": Config.DALInquisitorAPI + "/sources"
            },
            "attrs": ["source"]
        },
        "expires": "2040-01-01T14:00:00.00Z"
    }
    try {
        id = await Orion.searchSubscription(subscription)
        console.log("Subscription already exists\t: "+id);
        return true;
    } catch(error) {
        try {
            id=await Orion.createSubscription(subscription);
            console.log("Subscription created\t\t: "+id);
        }catch(error) {
            return Promise.reject("Can't create subscription");
        }
    }

}

/*provisioning_keyrock().then(() => {
    console.log("Done")
}).catch ((error) =>{
    console.log("Provisioning failed : " + error)
});*/

(async () => {
    await provisioning_keyrock();
    console.log("Keyrock \t............. \tDone\r")
    await provisioning_inquisitor();
    console.log("Inquisitor \t............. \tDone\r")

})().catch(error => {
    console.log("Provisioning failed : " + error)
});