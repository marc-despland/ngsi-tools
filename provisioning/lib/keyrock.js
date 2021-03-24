'use strict';

const Config = require('../config');
const axios = require('axios');


module.exports = {
    async sendRequest(request,expected) {
        var response;
        try {
            response = await axios.request(request);
        } catch (error) {
            return Promise.reject(error)
        }
        if (response.status === expected) {
            return response;
        } else {
            return Promise.reject(response.status + " "+ response.statusText)
        }
    },
    async authenticate() {
        var credentials={
            "name": Config.KeyrockAdminLogin,
            "password": Config.KeyrockAdminPassword
          }
        var request = {
            method: 'POST',
            url: Config.KeyrockAPI + "/v1/auth/tokens",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(credentials),
            json: true
        };
        var response=await this.sendRequest(request, 201);
        if (response.headers.hasOwnProperty("x-subject-token")) {
            return response.headers["x-subject-token"];
        } else {
            return Promise.reject("No header in response")
        }
    },
    async getTokenInfo(token) {
        var request = {
            method: 'GET',
            url: Config.KeyrockAPI + "/v1/auth/tokens",
            headers: {
                "X-Auth-Token": token,
                "X-Subject-token": token,
                "Content-Type": "application/json"
            },
            json: true
        };
        var response=await this.sendRequest(request, 200);
        return response.data;
    },
    async createOrganization(token, organization) {
        var request = {
            method: 'POST',
            url: Config.KeyrockAPI + "/v1/organizations",
            headers: {
                "X-Auth-Token": token,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(organization),
            json: true
        };
        var response=await this.sendRequest(request, 201);
        return response.data;
    },
    async getOrganization(token,id) {
        var request = {
            method: 'GET',
            url: Config.KeyrockAPI + "/v1/organizations/"+id,
            headers: {
                "X-Auth-Token": token,
                "Content-Type": "application/json"
            },
            json: true
        };
        var response=await this.sendRequest(request, 200);
        return response.data;
    },
    async getOrganizationsList(token) {
        var request = {
            method: 'GET',
            url: Config.KeyrockAPI + "/v1/organizations",
            headers: {
                "X-Auth-Token": token,
                "Content-Type": "application/json"
            },
            json: true
        };
        var response=await this.sendRequest(request, 200);
        return response.data;
    },
    async deleteOrganization(token,id) {
        var request = {
            method: 'DELETE',
            url: Config.KeyrockAPI + "/v1/organizations/"+id,
            headers: {
                "X-Auth-Token": token,
                "Content-Type": "application/json"
            },
            json: true
        };
        var response=await this.sendRequest(request, 204);
        return true;
    },
    async createApplication(token,application) {
        var request = {
            method: 'POST',
            url: Config.KeyrockAPI + "/v1/applications",
            headers: {
                "X-Auth-Token": token,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(application),
            json: true
        };
        var response=await this.sendRequest(request, 201);
        return response.data;
    },
    async getApplication(token,id) {
        var request = {
            method: 'GET',
            url: Config.KeyrockAPI + "/v1/applications/"+id,
            headers: {
                "X-Auth-Token": token,
                "Content-Type": "application/json"
            },
            json: true
        };
        var response=await this.sendRequest(request, 200);
        return response.data;
    },
    async getApplicationsList(token) {
        var request = {
            method: 'GET',
            url: Config.KeyrockAPI + "/v1/applications",
            headers: {
                "X-Auth-Token": token,
                "Content-Type": "application/json"
            },
            json: true
        };
        var response=await this.sendRequest(request, 200);
        return response.data;
    },
   async deleteApplication(token,id) {
        var request = {
            method: 'DELETE',
            url: Config.KeyrockAPI + "/v1/applications/"+id,
            headers: {
                "X-Auth-Token": token,
                "Content-Type": "application/json"
            },
            json: true
        };
        var response=await this.sendRequest(request, 204);
        return true;
    },
    async createPEPProxy(token,id) {
        var request = {
            method: 'POST',
            url: Config.KeyrockAPI + "/v1/applications/"+id+"/pep_proxies",
            headers: {
                "X-Auth-Token": token,
                "Content-Type": "application/json"
            },
            json: true
        };
        var response=await this.sendRequest(request, 201);
        return response.data;
    },
    async getPEPProxy(token,id) {
        var request = {
            method: 'GET',
            url: Config.KeyrockAPI + "/v1/applications/"+id+"/pep_proxies",
            headers: {
                "X-Auth-Token": token,
                "Content-Type": "application/json"
            },
            json: true
        };
        var response=await this.sendRequest(request, 200);
        return response.data;
    },
    async renewPasswordPEPProxy(token,id) {
        var request = {
            method: 'PATCH',
            url: Config.KeyrockAPI + "/v1/applications/"+id+"/pep_proxies",
            headers: {
                "X-Auth-Token": token,
                "Content-Type": "application/json"
            },
            json: true
        };
        var response=await this.sendRequest(request, 200);
        return response.data;
    },
    async deletePEPProxy(token,id) {
        var request = {
            method: 'DELETE',
            url: Config.KeyrockAPI + "/v1/applications/"+id+"/pep_proxies",
            headers: {
                "X-Auth-Token": token,
                "Content-Type": "application/json"
            },
            json: true
        };
        var response=await this.sendRequest(request, 204);
        return true;
    }



}