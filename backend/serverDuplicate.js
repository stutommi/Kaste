const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./RoomData");
const PlantData = require("./PlantData");
const axios = require("axios")

const API_PORT = 3001;
const app = express();
const router = express.Router();
const cors = require('cors')


const corsOptions = {
  origin: ['http://localhost:3000', 'http://88.113.135.116:3000']
}

app.options('*', cors())

// this is our MongoDB database
const dbRoute = "mongodb://XXXXXXXXXX:XXXXXX@dXXXXXXX.mlab.com:XXXXXX/XXXXXXX";
// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// Get room rensors
async function fetchRoom() {
  await axios.get('http://84.248.74.145:8001/ws/radio')
    .then(response => {
      if (response) {

        response.data.radio_sensors.forEach(index => {

          let data = new Data();
          const { time, location, id, humidity, model, channel, battery_low, temperature_C } = index;


          data.time = new Date(time);
          data.location = location;
          data.id = id;
          data.humidity = humidity;
          // data.model = model;
          // data.channel = channel;
          data.battery_low = battery_low;
          data.temperature_C = temperature_C;
          data.save(function (err) {
            if (err) return res.json({ success: false, error: err });
            console.log('SAVED RoomsData for ' + data.location) // saved!
          });
        });

      }
      else throw new Error('Network response was not ok. :(');
    })
    .catch(err => {
      console.log(err.message)

    })
};

async function fetchPlant() {
  await axios.get('http://84.248.74.145:8001/ws/i2c')
    .then(response => {
      if (response) {

        let plantArray = [response.data.I2C_soil_moisture]
        plantArray.forEach(sensor => {

          let data = new PlantData();
          const { time, humidity, temp } = sensor;


          data.time = new Date(time);
          data.id = '666';
          data.humidity = humidity;
          data.temp = temp;
          console.log(data);
          data.save(function (err) {
            if (err) return res.json({ success: false, error: err });
            console.log('SAVED PlantData') // saved!
          });
        });

      }
      else throw new Error('Network response was not ok. :(');
    })
    .catch(err => {
      console.log(err.message)

    })
};

// Execute Get request for sensors
fetchRoom();
fetchPlant();
// Sets interval for storing values
setInterval(fetchRoom, 60000);
setInterval(fetchPlant, 60000);

//////////////////////////////////// ^^^^^^^

// Handle Room GET requests
router.get("/getRoomData/:id/:limit", cors(corsOptions), (req, res) => {
  console.log(req.params.limit+ 'getRoomdata param limit')
  Data.
    find({ id: req.params.id }).
    limit(parseInt(req.params.limit)).
    sort('-time').
    select('id humidity time temperature_C').
    exec((err, data) => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true, data: data });
    });
});

// Handle Plant GET requests
router.get("/getPlantData/:id/:limit", cors(corsOptions), (req, res) => {
  PlantData.
    find({ id: req.params.id }).
    limit(parseInt(req.params.limit)).
    sort('-time').
    select('id humidity time temp').
    exec((err, data) => {
      if (err) return res.json({ success: false, error: err });

      return res.json({ success: true, data: data });
    });
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));