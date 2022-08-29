//imports
require("dotenv").config();
//database connection
require("./db/conn");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const session = require('express-session')
const Router = require("./routes/router");
const PORT = process.env.PORT || 4000;


//set template engine
app.set("view engine", "ejs");
app.use(express.static("uploads"));
app.use(express.static(__dirname + "/public"));
// Use the session middleware
app.use(session({ secret: "my key", saveUninitialized: true, resave: false }));
app.use((req, res, next) => {
  (res.locals.message = req.session.message), delete req.session.message;
  next();
});
app.use(Router);
app.listen(PORT, () => {
  console.log(`Server Started at http://localhost:${PORT}`);
});
