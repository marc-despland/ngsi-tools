const assert = require('assert');
//const expect = require('chai').expect;
var Orion = require('../lib/orion.js')
var Tools = require('../lib/tools.js')
var Config = require('../config.js')
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

var entityid=Tools.makeid(12);
var subscriptionid="";

describe('Orion', () => {
    after(async () => {
        await expect(Orion.deleteEntity(entityid)).to.eventually.fulfilled;
        await expect(Orion.deleteSubscription(subscriptionid)).to.eventually.fulfilled;
    })
    it('Create Entity', async () => {
        var entity={
            "id": entityid,
            "type": "Room",
            "temperature": {
              "value": 23,
              "type": "Float"
            },
            "pressure": {
              "value": 720,
              "type": "Integer"
            }
          }
        await expect(Orion.createEntity(entity)).to.be.fulfilled;
    });
    it('get Entity', async () => {
        var result = await expect(Orion.getEntity(entityid)).to.be.fulfilled;
        expect(result.hasOwnProperty("id")).to.be.true
    });
    it('get Entities Of Type', async () => {
        var result = await expect(Orion.getEntitiesOfType("Room", 20)).to.be.fulfilled;
        expect(result.length).to.be.greaterThan(0);
    });
    it('delete Entity', async () => {
        await expect(Orion.deleteEntity(entityid)).to.be.fulfilled;
    });
    it('Create Subscription', async () => {
        var subscription={
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
                "url": Config.DALInquisitorAPI+"/sources"
              },
              "attrs": ["source"]
            },
            "expires": "2040-01-01T14:00:00.00Z"
          }
        subscriptionid=await expect(Orion.createSubscription(subscription)).to.be.fulfilled;
    });
    it('get Subscription', async () => {
        var result = await expect(Orion.getSubscription(subscriptionid)).to.be.fulfilled;
        expect(result.hasOwnProperty("id")).to.be.true
    });
    it('get Subscriptions List', async () => {
        var result = await expect(Orion.listSubscription()).to.be.fulfilled;
        expect(result.length).to.be.greaterThan(0);
    });
    it('search Subscription', async () => {
        var subscription={
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
                "url": Config.DALInquisitorAPI+"/sources"
              },
              "attrs": ["source"]
            },
            "expires": "2040-01-01T14:00:00.00Z"
          }
        var result = await expect(Orion.searchSubscription(subscription)).to.be.fulfilled;
        expect(result).to.be.equals(subscriptionid)
    });
    it('delete Subscriptions', async () => {
        await expect(Orion.deleteSubscription(subscriptionid)).to.be.fulfilled;
    });
    it('get Subscription', async () => {
        var result = await expect(Orion.getSubscription(subscriptionid)).to.be.rejected;
    });
})