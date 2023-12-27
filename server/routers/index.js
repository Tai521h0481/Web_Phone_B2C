const express = require("express");
const path = require("path");
const router = express.Router();

const userRouter = require("./user.router");
const productRouter = require("./product.router");

router.use("/users", userRouter);
router.use("/products", productRouter);

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/pages/index.html"));
});

router.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/pages/dashboard.html"));
});

router.get("/tables", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/pages/tables.html"));
});

router.get("/billing", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/pages/billing.html"));
});

router.get("/products", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/pages/products.html"));
});

router.get("/profile", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/pages/profile.html"));
});

router.get("/virtual-reality", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/pages/virtual-reality.html"));
});

module.exports = router;