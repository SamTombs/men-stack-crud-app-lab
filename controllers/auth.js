const User = require("../models/user.js");
const bcrypt = require("bcrypt");

const express = require("express");

const router = express.Router();

router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
})



router.post("/sign-up", async (req, res) => {
    
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
    return res.send("Username already taken.");
    }

    if(req.body.password !== req.body.confirmPassword) {
    res.send("Passwords do not match");
     }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

    const user = await User.create(req.body);
    res.send(`Thanks for signing up ${user.username}`);
});

router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});

router.post("/sign-in", async (req, res) => {
    
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
    return res.send("Login failed. Please try again.");
    }
    
    const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password
    );
    
    if (!validPassword) {
    return res.send("Login failed. Please try again.");
    }
//Package makes this into a cookie
    req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id
    };

    res.redirect("/");

});

router.get("/sign-out", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
