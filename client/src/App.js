import React, { Component } from 'react';
import './Reset.css'
import './App.css';
import { dummyResponse } from './helpers/helpers';
import { Nav } from './Components/Nav/nav';
import { Footer } from './Components/Footer/footer';
import { InfoContainer } from './Components/Info-container/InfoContainer'
import axios from 'axios';

// App component

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: {},
      networkError: {
        message: "",
        display: 'none'
      },
      sensor_history: [],
      radio_sensors: [],
      plant_sensors: []
    }
    this.fetchRoom = this.fetchRoom.bind(this);
    this.fetchPlant = this.fetchPlant.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.putDatatoDb = this.putDatatoDb.bind(this);
  }

  // Executes API calls for rooms and plants
  fetchData() {
    this.fetchRoom();
    this.fetchPlant();
  }

  /// DB calls ///

  // Stores values to DB
  putDatatoDb() {
    axios.post("/api/putData", {
      data: this.state.radio_sensors
    });
  }

/// API calls ///

// Calls roomsensors and sets value to state

  async fetchRoom() {
    await axios.get('https://cors-anywhere.herokuapp.com/http://84.248.74.145:8001/ws/radio')
      .then(response => {
        if (response) {
          this.setState({
            networkError: {
              message: '',
              display: 'none'
            },
            radio_sensors: response.data.radio_sensors.map(sensor => {
              return {
                time: sensor.time,
                location: sensor.location,
                id: sensor.id,
                humidity: sensor.humidity,
                model: sensor.model,
                channel: sensor.channel,
                battery_low: sensor.battery_low,
                temperature_C: sensor.temperature_C
              }
            })
          })
        }
       else throw new Error('Network response was not ok. :( Displaying dummy sensors instead.');
      })
      .catch(err => {

        // Display dummysensors on error
        console.log(err.message)
        this.setState({
          networkError: {
            message: err.message,
            display: 'inline'
          },
          radio_sensors: dummyResponse
        });
      })
  };

// Call for plantsensors and sets value to state

async fetchPlant() {
    await axios.get('https://cors-anywhere.herokuapp.com/http://84.248.74.145:8001/ws/i2c')
      .then(response => {
        if (response) {
          this.setState({
            plant_sensors: [{
              time: response.data.I2C_soil_moisture.time,
              temp: response.data.I2C_soil_moisture.temp,
              humidity: response.data.I2C_soil_moisture.humidity,
              id:'666'
            }]
          }) 
        }
        else throw new Error('Network response was not ok for plant.');
      })
      .catch(err => {
        console.log(err.message)
        this.setState({
          networkError: {
            message: err.message,
            display: 'inline'
          }
        });
      })

  }

/// Lifecycle methods

componentWillMount() {

  // Gets sensor data from thirdparty API when user visits client
  this.fetchData();
}

componentDidMount() {

  // Stores current sensor values to DB when user visits client
  // setTimeout(() => {
  //   this.putDatatoDb();
  // }, 2000);

  // Sets interval for getting values
  setInterval(this.fetchData, 30000);

  // Sets interval for storing values
 // setInterval(this.putDatatoDb, 60 * 60000);
}


/// Renders component

  render() {

    return (
      <div className="App">
        <div>
          <Nav />
          <InfoContainer
            networkError={this.state.networkError}
            plantSensorInfo={this.state.plant_sensors}
            roomSensorInfo={this.state.radio_sensors}/>
          <Footer />
        </div>
      </div>
    );
  }
}

// Exports App
export default App;