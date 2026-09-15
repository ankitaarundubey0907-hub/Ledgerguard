const request = require("supertest");
const express = require("express");

const app = express();

app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "LedgerGuard backend is running"
    });
});

describe("Health API", () => {

    test("GET /health should return 200", async() => {

        const response = await request(app)
            .get("/health");

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.message)
            .toBe("LedgerGuard backend is running");
    });

});