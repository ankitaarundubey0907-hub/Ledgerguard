const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "LedgerGuard API",
            version: "1.0.0",
            description: "API documentation for the LedgerGuard multi-tenant billing and employee management system"
        },
        servers: [{
            url: "http://localhost:5000"
        }]
    },
    apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;