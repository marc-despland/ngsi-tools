const assert = require('assert');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const expect = chai.expect;

const Updater = require("../updater.js");
var Config = require('../config');

var entity = {
    "id": "FR_BAS:9534066:20209659",
    "type": "VesselCall",
    "IMO": {
        "type": "Integer",
        "value": 9534066,
        "metadata": {}
    },
    "dataProvider": {
        "type": "Text",
        "value": "http://frbod/vcall",
        "metadata": {}
    },
    "journeyid": {
        "type": "Integer",
        "value": 20209659,
        "metadata": {}
    },
    "location": {
        "type": "geo:json",
        "value": {
            "type": "Point",
            "coordinates": [
                -0.5472,
                44.863
            ]
        },
        "metadata": {}
    },
    "name": {
        "type": "STRING_URL_ENCODED",
        "value": "ORALORA",
        "metadata": {}
    },
    "operation": {
        "type": "Text",
        "value": "unloading",
        "metadata": {}
    },
    "scheduled_arrival_dock": {
        "type": "DateTime",
        "value": "2020-10-25T07:00:00.00Z",
        "metadata": {}
    },
    "scheduled_leave_dock": {
        "type": "DateTime",
        "value": "2020-10-25T07:00:00.00Z",
        "metadata": {}
    },
    "source": {
        "type": "Text",
        "value": "urn:pixel:DataSource:frbod:VesselCall",
        "metadata": {}
    },
    "unloading_agent": {
        "type": "STRING_URL_ENCODED",
        "value": "SEAINVEST",
        "metadata": {}
    },
    "unloading_berth": {
        "type": "Integer",
        "value": 436,
        "metadata": {}
    },
    "loading_berth": {
        "type": "Integer",
        "value": 436,
        "metadata": {}
    },
    "unloading_cargo_fiscal_type": {
        "type": "Text",
        "value": "",
        "metadata": {}
    },
    "unloading_cargo_type": {
        "type": "STRING_URL_ENCODED",
        "value": "I.HUILE%20COLZA",
        "metadata": {}
    },
    "unloading_dangerous": {
        "type": "Boolean",
        "value": false,
        "metadata": {}
    },
    "unloading_tonnage": {
        "type": "Integer",
        "value": 3000,
        "metadata": {}
    }
};

Config.OrionAPI="http://orion:1026"

describe('UpdateVesselCall', () => {
    beforeEach(async () => {
        await expect(Updater.createEntity(entity)).to.be.fulfilled;
    })
    afterEach(async () => {
        await expect(Updater.deleteEntity(entity)).to.be.fulfilled;
    });
    it('checkIMO bad', async () => {
        var result = Updater.checkIMO(entity);
        expect(result).to.be.eql({
            "type": "Text",
            "value": "9534066"
        })
    });
    it('checkIMO good', async () => {
        entity.IMO = {
            type: "Text",
            value: "9534066"
        }
        var result = Updater.checkIMO(entity);
        expect(result).to.be.eql("")
    });
    it('checkIMO bad but string', async () => {
        entity.IMO = {
            type: "Integer",
            value: "9534066"
        }
        var result = Updater.checkIMO(entity);
        expect(result).to.be.eql({
            "type": "Text",
            "value": "9534066"
        })
    });
    it('patchIMO', async () => {
        var updated=await expect(Updater.patchIMO(entity)).to.be.fulfilled;
        expect(updated).to.be.eql(true)
        var checked=await expect(Updater.getEntity(entity)).to.be.fulfilled;
        var result = Updater.checkIMO(checked);
        expect(result).to.be.eql("")
    });
    it('checkOperation', async () => {
        var result = Updater.checkOperation(entity);
        expect(result).to.be.eql(true)
    });
    it('patchOperation', async () => {
        var result = Updater.checkOperation(entity);
        expect(result).to.be.eql(true)
        var updated=await expect(Updater.patchOperation(entity)).to.be.fulfilled;
        expect(updated).to.be.eql(true)
        var checked=await expect(Updater.getEntity(entity)).to.be.fulfilled;
        var result = Updater.checkOperation(checked);
        expect(result).to.be.eql(false);
    });
    it('patchUnloadingBerth', async () => {
        var result = Updater.checkUnloadingBerth(entity);
        expect(result).not.to.be.eql("")
        var updated=await expect(Updater.patchUnloadingBerth(entity)).to.be.fulfilled;
        expect(updated).to.be.eql(true)
        var checked=await expect(Updater.getEntity(entity)).to.be.fulfilled;
        var result = Updater.checkUnloadingBerth(checked);
        expect(result).to.be.eql("");
    });
    it('patchLoadingBerth', async () => {
        var result = Updater.checkLoadingBerth(entity);
        expect(result).not.to.be.eql("")
        var updated=await expect(Updater.patchLoadingBerth(entity)).to.be.fulfilled;
        expect(updated).to.be.eql(true)
        var checked=await expect(Updater.getEntity(entity)).to.be.fulfilled;
        var result = Updater.checkLoadingBerth(checked);
        expect(result).to.be.eql("");
        updated=await expect(Updater.patchLoadingBerth(checked)).to.be.fulfilled;
        expect(updated).to.be.eql(false)
    });

    it('patchScheduledLeaveDock', async () => {
        var result = Updater.checkScheduledLeaveDock(entity);
        var leave=entity.scheduled_leave_dock;
        expect(result).to.be.eql(true)
        var updated=await expect(Updater.patchScheduledLeaveDock(entity)).to.be.fulfilled;
        expect(updated).to.be.eql(true)
        var checked=await expect(Updater.getEntity(entity)).to.be.fulfilled;
        var result = Updater.checkScheduledLeaveDock(checked);
        expect(result).to.be.eql(false)
        expect(checked.hasOwnProperty("scheduled_departure_dock")).to.be.eql(true)
        expect(checked.scheduled_departure_dock).to.be.eql(leave);
        updated=await expect(Updater.patchScheduledLeaveDock(checked)).to.be.fulfilled;
        expect(updated).to.be.eql(false)
    });

    it('patchEntity', async () => {
        var updated=await expect(Updater.patchEntity(entity)).to.be.fulfilled;
        expect(updated).to.be.eql(true)
        var checked=await expect(Updater.getEntity(entity)).to.be.fulfilled;
        updated=await expect(Updater.patchEntity(checked)).to.be.fulfilled;
        expect(updated).to.be.eql(false)
    });
});