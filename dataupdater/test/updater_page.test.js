const assert = require('assert');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const expect = chai.expect;

const Updater = require("../updater.js");
var Config = require('../config');
var Data = require('./data');

Config.OrionAPI="http://orion:1026"

describe('Update List Of Object', () => {
    before(async () => {
        for( var i=0; i<Data.data.length; i++) {
            await expect(Updater.createEntity(Data.data[i])).to.be.fulfilled;
        }
        
    })
    after(async () => {
        for( var i=0; i<Data.data.length; i++) {
            await expect(Updater.deleteEntity(Data.data[i])).to.be.fulfilled;
        }
    });
    it('countObject', async () => {
        var count= await expect(Updater.countObject("VesselCall")).to.be.fulfilled;
        expect(count).to.be.eql(Data.data.length)
    });
    it('countSearchNoVersion', async () => {
        var count= await expect(Updater.countSearchNoVersion("VesselCall", "IMO")).to.be.fulfilled;
        expect(count).to.be.eql(Data.data.length)
    });
    it('searchObject', async () => {
        var list= await expect(Updater.searchObject("VesselCall", "IMO", "001")).to.be.fulfilled;
        expect(list.length).to.be.gt(0)
    });
    it('update', async () => {
        var total= await expect(Updater.countObject("VesselCall")).to.be.fulfilled;
        expect(total).to.be.eql(Data.data.length)
        var updated= await expect(Updater.update("VesselCall", "IMO", "001")).to.be.fulfilled;
        expect(updated).to.be.eql(total)
        var count= await expect(Updater.countSearchNoVersion("VesselCall", "IMO")).to.be.fulfilled;
        expect(count).to.be.eql(0)
        updated= await expect(Updater.update("VesselCall", "IMO", "001")).to.be.fulfilled;
        expect(updated).to.be.eql(0)
        updated= await expect(Updater.update("VesselCall", "IMO", "002")).to.be.fulfilled;
        expect(updated).to.be.eql(total)
    });
})