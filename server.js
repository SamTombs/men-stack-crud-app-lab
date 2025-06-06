const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Cars = require("./models/cars.js");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.get("/cars", async (req, res) => {
  const allCars = await Cars.find();
  console.log(allCars);
  res.render("cars/index.ejs", { cars: allCars});
});

app.get("/cars/new", (req, res) => {
  res.render("cars/new.ejs");
});

app.get("/cars/:carId", async (req, res) => {
    const foundCar = await Cars.findById(req.params.carId);
  res.render("cars/show.ejs", {car: foundCar})
});

app.post("/cars", async (req, res) => {
  await Cars.create(req.body);
  res.redirect("/cars/new");
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

