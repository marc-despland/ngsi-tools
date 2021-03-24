const assert = require('assert');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const expect = chai.expect;

const Updater = require("../updater.js");
var Config = require('../config');
var Data = require('./data');

Config.OrionAPI="http://orion:1026"

describe('UpdateVesselCall', () => {
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
    it('Data count', async () => {
        var count= await expect(Updater.countVesselCall()).to.be.fulfilled;
        expect(count).to.be.eql(Data.data.length)
    });

    it('Update page 0', async () => {
        var updated= await expect(Updater.updateVesselCallPage(0, 10)).to.be.fulfilled;
        expect(updated).to.be.eql(true)
        updated= await expect(Updater.updateVesselCallPage(0, 10)).to.be.fulfilled;
        expect(updated).to.be.eql(false)
    });
    it('Update VesselCAll', async () => {
        var updated= await expect(Updater.updateVesselCall()).to.be.fulfilled;
        expect(updated).to.be.eql(true)
        updated= await expect(Updater.updateVesselCall()).to.be.fulfilled;
        expect(updated).to.be.eql(false)
    });
    
})