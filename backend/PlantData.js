// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const PlantSchema = new Schema(
  {
    time: Date,
    id: String,
    humidity: String,
    temp: Number
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("PlantData", PlantSchema);