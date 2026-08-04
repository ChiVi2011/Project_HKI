const express = require("express");
const app = express();
const path = require("path");
// const userRoute = require("./routes/userRoute");
// Middleware
app.use(express.json());

//Router
// app.use("/users", userRoute);

module.exports = app;
