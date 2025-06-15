const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");
const app = express();
//Holds all auth endpoints
const authController = require("./controllers/auth.js");
const session = require('express-session');


mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const port = process.env.PORT ? process.env.PORT : "3000";


const Cars = require("./models/cars.js");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use("/auth", authController);

app.get("/", (req, res) => {
  res.render("index.ejs", {
    user: req.session.user,
  });
});

app.get("/vip-lounge", (req, res) => {
  if (req.session.user) {
    res.redirect("/cars/show");
  } else {
    res.send("Sorry, no guests allowed.");
  }
});


//List on the index page
app.get("/cars", async (req, res) => {
  const allCars = await Cars.find();
  console.log(allCars);
  res.render("cars/index.ejs", { cars: allCars});
});

app.get("/cars/new", (req, res) => {
  res.render("cars/new.ejs");
});

//View a list
app.get("/cars/:carId", async (req, res) => {
    const foundCar = await Cars.findById(req.params.carId);
  res.render("cars/show.ejs", {car: foundCar})
});

//Create
app.post("/cars", async (req, res) => {
  await Cars.create(req.body);
  res.redirect("/cars/new");
});

//Delete
app.delete("/cars/:carId", async (req, res) => {
   await Cars.findByIdAndDelete(req.params.carId);
  res.redirect("/cars");
});


app.get("/cars/:carId/edit", async (req, res) => {
  const foundCar = await Cars.findById(req.params.carId);
  res.render("cars/edit.ejs", {
    car: foundCar,
  });
});

//Edit || Update
app.put("/cars/:carId", async (req, res) => {
  await Cars.findByIdAndUpdate(req.params.carId, req.body);
  res.redirect(`/cars/${req.params.carId}`);
});

app.listen(port, () => {
  console.log('Listening on port 3000');
});

