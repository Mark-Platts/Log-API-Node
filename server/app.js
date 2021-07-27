const express = require("express");
const app = express();
const mongoose = require("mongoose");

//connect to local mongo db
mongoose.connect('mongodb://localhost:27017/Log-API-node-db', {useNewUrlParser: true, useUnifiedTopology: true});

const logRoutes = require("./api/routes/logs");

app.use(express.urlencoded({ extended: false })); //Tells app how to parse req.body
app.use(express.json());

//Used in development to prevent cors issues, come back and clean this up when deploying
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.use("/logs", logRoutes);

//The next two parts run iff the endpoint doesn't match to any route, the first creates an error object and the second sends it
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;