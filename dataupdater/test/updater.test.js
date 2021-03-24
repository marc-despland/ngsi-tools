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
        "type": "Text",
        "value": "9534066",
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

describe('Data Updater', () => {
    beforeEach(async () => {
        await expect(Updater.createEntity(entity)).to.be.fulfilled;
    })
    afterEach(async () => {
        await expect(Updater.deleteEntity(entity)).to.be.fulfilled;
    });
    it('createUpdateAttribute', async () => {
        var result = Updater.createUpdateAttribute(entity, "IMO", "001");
        expect(result).to.be.eql({
            "type": "Text",
            "value": "9534066",
            "metadata": {
                "version" : {
                    "value": "001"
                }
            }
        })
    });
    
    it('createUpdateAttribute not existing attribute', async () => {
        var result = Updater.createUpdateAttribute(entity, "EMPIRESTRIKEBACK", "001");
        expect(result).to.be.eql(null)
    });

    it('updateAttribute', async () => {
        await expect(Updater.updateAttribute(entity, "IMO", "001")).to.be.fulfilled;
        var checked=await expect(Updater.getEntity(entity)).to.be.fulfilled;
        expect(checked).to.be.eql({
            "id": "FR_BAS:9534066:20209659",
            "type": "VesselCall",
            "IMO": {
                "type": "Text",
                "value": "9534066",
                "metadata": {
                    "version": {
                        "value": "001",
                        "type": "Text"
                    }
                }
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
        })
        
    });
});