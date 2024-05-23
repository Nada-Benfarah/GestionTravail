const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const app = express();

require("dotenv").config();

const {
  verifyAdminToken,
  verifyUserToken,
  verifyResponsableToken,
} = require("./middlewares");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

//routes

const auth = require("./routes/auth");
const current = require("./routes/current");
const user = require("./routes/user");
const demande = require("./routes/demande");
const reponse = require("./routes/reponse");
const workflow = require("./routes/workflow");
const settings = require("./routes/settings");
const download = require("./routes/download");

//authontication (login)
app.use("/api/auth", auth);

//user section
app.use(verifyUserToken);
app.use("/api/current", current);
app.use("/api/demande", demande);
app.use("/api/settings", settings);
app.use("/api/download", download);

//responsable section
app.use(verifyResponsableToken);
app.use("/api/reponse", reponse);

//admin section
app.use(verifyAdminToken);
app.use("/api/user", user);
app.use("/api/workflow", workflow);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.json(err);
  console.log(err);
});

module.exports = app;
