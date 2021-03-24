'use strict'

const tools = require('./lib/tools');

module.exports = {
    KeyrockAdminPassword: tools.readSecret("KEYROCK_ADMIN_PASSWORD", "default"),
    KeyrockAdminLogin: process.env.KEYROCK_ADMIN_LOGIN || "admin",
    KeyrockAPI: process.env.KEYROCK_API || "http://172.17.0.1:3000",
    KeyrockRegenratePEPProxy: tools.readBoolean("KEYROCK_REGENERATE_PEP_PROXY", false),
    OrionAPI: process.env.ORION_API || "http://172.17.0.1:1026",
    OrionService: process.env.ORION_SERVICE || "",
    OrionServicePath: process.env.ORION_SERVICE_PATH || "",
    DALInquisitorAPI: process.env.DAL_INQUISITOR_API || "http://172.17.0.1:8080",
}