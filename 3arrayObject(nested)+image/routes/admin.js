const express = require('express')
const bodyParser = require("body-parser");
const router = new express.Router();
const Admin = require('../models/admin');
// const cookieParser = require("cookie-parser")
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs")
var urlencodedParser = bodyParser.urlencoded({ extended: false });
//dashboard
router.get("/", (req, res) => {
    res.render("dashboard", { title: "Dashboard", page_name: "dashboard" });
  });

  router.get("/signup", (req, res) => {
    res.render("signup", { title: "Signup", page_name: "signup" });
  });
  
  router.get("/signin", (req, res) => {
    res.render("signin", { title: "Signin", page_name: "signin" });
  });
  router.get("/forgot-password", (req, res) => {
    res.render("forgot-password", { title: "forgot-password", page_name: "forgot-password" });
  });

  
//create a new users 
router.post("/addadmin",urlencodedParser, async (req, res) => {
    try {
        const users = new Admin(req.body)
        console.log(req.body.name);
        // const token = await users.generateAuthToken()
        // // set cookie
        // res.cookie("jwt", token, {
        //     expires: new Date(Date.now() + 90000), //set cookie for 9 min
        //     httpOnly: true
        // })

        const createUser = await users.save();
        res.status(201).send(createUser);
    } catch (e) {
        res.status(401).send(e);
    }
})

module.exports = router;