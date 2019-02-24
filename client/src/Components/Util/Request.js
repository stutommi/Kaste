require('es6-promise').polyfill();
require('isomorphic-fetch');
/*
{
	"radio_sensors": [{
		"time": "2019-01-13 18:16:15",
		"location": "fridge",
		"id": 1447,
		"temperature_C": 8.699999999999999,
		"humidity": 51,
		"model": "Acurite tower sensor",
		"channel": "A",
		"battery_low": 0
	}, {
		"time": "2019-01-13 18:16:17",
		"location": "living_room",
		"id": 4489,
		"temperature_C": 21.1,
		"humidity": 43,
		"model": "Acurite tower sensor",
		"channel": "A",
		"battery_low": 0
	}, {
		"time": "2019-01-13 18:16:13",
		"location": "balcony",
		"id": 725,
		"temperature_C": 0,
		"humidity": 74,
		"model": "Acurite tower sensor",
		"channel": "A",
		"battery_low": 0
	}]
}

*/

const sensorData = [];

const Request = {

    search() {
        return fetch('http://84.248.74.145:8001/ws/radio').
            then(response => {
                return response.json()
            }).then(jsonResponse => {
                console.log(jsonResponse.radio_sensors);
                sensorData.splice(0, sensorData.length)
                sensorData.push(jsonResponse.radio_sensors.map(sensor => {
                    return {
                        time: sensor.time,
                        location: sensor.location,
                        id: sensor.id,
                        humidity: sensor.humidity,
                        model: sensor.model,
                        channel: sensor.channel,
                        battery_low: sensor.battery_low
                    }
                }))
            }
            )
    }
}

Request.search();

// setInterval(async function() {
//     console.log(sensorData);
//     Request.search()
// }, 3000);

