const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRouter = require("./routes/posts");
const authRouter = require("./routes/auth");

const mongoConf = process.env.MONGO_CONFIG_URL;

const app = express();

mongoose
  .connect(mongoConf, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch(() => {
    console.log(" Unable to connect to DB...");
  });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* MANUAL CORS */
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
//   next();
// });

app.use("/api/posts", postsRouter);
app.use("/api/auth", authRouter);

module.exports = app;
