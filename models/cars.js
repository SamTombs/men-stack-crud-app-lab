const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  make: String,
  model:String,
  color: String,
  horsepower: Number,
});

const Cars = mongoose.model("Cars", carSchema);

module.exports = Cars;