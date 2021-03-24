const assert = require('assert');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const expect = chai.expect;
//const axios = require('axios');

const keyrock = require("../lib/keyrock.js");
var token="";
var pixel="";
var proxy="";
var wilma="";

describe('Keyrock', () => {
    after(async () => {
        await expect(keyrock.deleteOrganization(token, pixel)).to.eventually.fulfilled;
        await expect(keyrock.deletePEPProxy(token, proxy)).to.eventually.fulfilled;
        await expect(keyrock.deleteApplication(token, proxy)).to.eventually.fulfilled;
    })
    it('Authenticate', async () => {
        token = await expect(keyrock.authenticate()).to.be.fulfilled;
        expect(token).to.not.be.equal("")
    });
    it('GetTokenInfo', async () => {
        var info = await expect(keyrock.getTokenInfo(token)).to.be.fulfilled;
        expect(info.hasOwnProperty("access_token")).to.be.true
    });
 /*   it('GetOrganizationsList', async () => {
        var info = await expect(keyrock.getOrganizationsList(token)).to.be.rejected;
    });*/
   it('CreateOrganization', async () => {
        var orga= {
            "organization": {
              "name": "PIXEL",
              "description": "The main PIXEL Organization"
            }
          }
        var neworga = await expect(keyrock.createOrganization(token,orga)).to.be.fulfilled;
        expect(neworga.hasOwnProperty("organization")).to.be.true
        expect(neworga.organization.hasOwnProperty("id")).to.be.true
        pixel=neworga.organization.id;
    });
    it('GetOrganization', async () => {
        var info = await expect(keyrock.getOrganization(token, pixel)).to.be.fulfilled;
        expect(info.hasOwnProperty("organization")).to.be.true
    });
    it('GetOrganizationsList', async () => {
        var info = await expect(keyrock.getOrganizationsList(token)).to.be.fulfilled;
    });
    it('GetApplicationsList', async () => {
        var info = await expect(keyrock.getApplicationsList(token)).to.be.fulfilled;
    });
    it('CreateApplication', async () => {
        var source= {
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
        var result = await expect(keyrock.createApplication(token,source)).to.be.fulfilled;
        expect(result.hasOwnProperty("application")).to.be.true
        expect(result.application.hasOwnProperty("id")).to.be.true
        proxy=result.application.id;
    });
    it('GetApplication', async () => {
        var info = await expect(keyrock.getApplication(token, proxy)).to.be.fulfilled;
        expect(info.hasOwnProperty("application")).to.be.true
    });
    it('GetApplicationsList', async () => {
        var info = await expect(keyrock.getApplicationsList(token,)).to.be.fulfilled;
    });
    it('GetPEPProxy before created it', async () => {
        var info = await expect(keyrock.getPEPProxy(token, proxy)).to.be.rejected;
    });
    it('CreatePEPProxy', async () => {
        var result = await expect(keyrock.createPEPProxy(token,proxy)).to.be.fulfilled;
        expect(result.hasOwnProperty("pep_proxy")).to.be.true
        expect(result.pep_proxy.hasOwnProperty("id")).to.be.true
        expect(result.pep_proxy.hasOwnProperty("password")).to.be.true
        wilma=result.pep_proxy.id;
    });
    it('GetPEPProxy', async () => {
        var info = await expect(keyrock.getPEPProxy(token, proxy)).to.be.fulfilled;
        expect(info.hasOwnProperty("pep_proxy")).to.be.true
        expect(info.pep_proxy.hasOwnProperty("oauth_client_id")).to.be.true
    });
    it('Renew Password for PEPProxy', async () => {
        var info = await expect(keyrock.renewPasswordPEPProxy(token, proxy)).to.be.fulfilled;
        expect(info.hasOwnProperty("new_password")).to.be.true
    });
});

