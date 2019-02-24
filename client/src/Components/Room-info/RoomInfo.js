import React, { Component } from 'react';
import './RoomInfo.css';
import fridge from '../../images/fridge.jpeg';
import living_room from '../../images/living_room.jpeg';
import balcony from '../../images/balcony.jpeg';
import options from './ChartOptions';
import { Spring } from 'react-spring';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import moment from 'moment';

const imageObj = {
    fridge: fridge,
    living_room: living_room,
    balcony: balcony,
}

export class RoomInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstData: true,
            isToggleOn: false,
            chartData1: {},
            chartRange: 10080
        }
        this.getHistory = this.getHistory.bind(this);
        this.resizeChart = this.resizeChart.bind(this);
        this.handleChartRangeChange = this.handleChartRangeChange.bind(this);

    }

    handleChartRangeChange(event) {
        let limit = event.target.value;
        this.setState({ chartRange: limit }, () => { this.getHistory() });
    }

    componentDidMount() {
        this.getHistory();
        setInterval(this.getHistory, 5 * 60000);
    }

    getChartData(tempHistoryArray, timeHistoryArray, humidityHistoryArray) {

        this.setState({
            chartData1: {
                labels: timeHistoryArray.reverse(),
                datasets: [{
                    label: 'Temp (C°)',
                    type: 'line',
                    data: tempHistoryArray.reverse(),
                    fill: false,
                    pointRadius: 0,
                    borderColor: 'rgba(0, 0, 0, 0.6)',
                    borderWidth: 1,
                    pointBorderColor: 'rgba(0, 0, 0, 0.6)',
                    pointBackgroundColor: 'rgba(50, 200, 50, 0.6)',
                    pointHoverBackgroundColor: 'rgba(50, 200, 50, 0.6)',
                    pointHoverBorderColor: 'rgba(50, 200, 50, 0.6)',
                    yAxisID: 'y-axis-2'
                }, {
                    type: 'line',
                    label: 'Humidity (%)',
                    data: humidityHistoryArray.reverse(),
                    fill: true,
                    pointRadius: 0,
                    backgroundColor: 'rgba(0, 100, 250, 0.3)',
                    borderColor: 'rgba(0, 100, 250, 0.6)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(0, 100, 250, 0.6)',
                    hoverBorderColor: 'rgba(0, 100, 250, 0.6)',
                    yAxisID: 'y-axis-1'
                }]
            }
        });
    }

    async getHistory() {

        let timeHistoryArray = [];
        let tempHistoryArray = [];
        let humidityHistoryArray = [];
        await axios.get(`/api/getRoomData/${this.props.sensor.id}/${this.state.chartRange}`)
            .then((history) => {

                console.log(history.data.data.length);

                // Success
                // console.log(history.data.data)
                history.data.data.forEach(doc => {
                    let tempDate = moment(doc.time).format('ddd kk:mm');
                    humidityHistoryArray.push(doc.humidity)
                    timeHistoryArray.push(tempDate);
                    tempHistoryArray.push(doc.temperature_C);
                    //  return console.log('updated roominfo arrays!')
                })

                this.getChartData(tempHistoryArray, timeHistoryArray, humidityHistoryArray);
                // if (this.state.firstData) {
                //     this.setState({firstData: false});
                //     this.getChartData(tempHistoryArray, timeHistoryArray, humidityHistoryArray);}

                //  else if (this.state.firstData === false && timeHistoryArray === this.state.chartData1.labels.reverse()) {
                //      console.log('haloo');           
                //      this.getChartData(tempHistoryArray, timeHistoryArray, humidityHistoryArray);
                //  }
            })
            .catch((error) => {
                // Error
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    // console.log(error.response.data);
                    // console.log(error.response.status);
                    // console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                console.log(error.config);

            })
    }

    resizeChart() {
        this.setState({
            isToggleOn: !this.state.isToggleOn
        });
    }

    setGender(event) {
        console.log(event.target.value);
    }

    render() {

        const { time,
            humidity,
            temperature_C,
            location } = this.props.sensor

        let infoContainer = this.state.isToggleOn ? "info-container-big" : "info-container-small";


        return (
            <Spring
                from={{ opacity: 0, marginTop: -500 }}
                to={{ opacity: 1, marginTop: 0 }}
                config={{ delay: 500, duration: 600 }}
            >

                {props =>
                    <div style={props}>

                        <div className={infoContainer}>
                            <div className='name-container'>
                                <h1>{location}</h1>
                            </div>

                            <div className='content'>
                                <div className='livepic-container' style={{ backgroundImage: `url(${imageObj[location]})` }}>
                                </div>
                                <div className='info'>
                                    <div className='air_temp'>
                                        <p>Air Temp</p>
                                        <span>{Math.round(temperature_C * 100) / 100}°C</span>
                                    </div>
                                    <div className='sensor-time'>
                                        <p>Last Updated</p>
                                        <span>{time.slice(11, 19)}</span>
                                    </div>
                                    <div className='air-moist'>
                                        <p>Humidity</p>
                                        <span>{humidity}%</span>
                                    </div>
                                </div>
                                <div className="button-container">
                                    <button value="60" className="ui-button" onClick={this.handleChartRangeChange}>1 h</button>
                                    <button value="1440" className="ui-button" onClick={this.handleChartRangeChange}>1 d</button>
                                    <button value="10080" className="ui-button" onClick={this.handleChartRangeChange}>1 w</button>
                                    <button value="40320" className="ui-button" onClick={this.handleChartRangeChange}>1 m</button>
                                    <button value="483840" className="ui-button" onClick={this.handleChartRangeChange}>1 y</button>
                                </div>


                                <div className='chart-1' onClick={this.resizeChart}>
                                    <Line
                                        data={this.state.chartData1}
                                        // redraw
                                        options={options}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </Spring>
        )
    }
}

/*


<div className='chart-2' onClick={this.resizeChart}>
                                <Line
                                    data={this.state.chartData2}
                                    options={{
                                        title: {
                                            display: this.props.displayTitle,
                                            text: 'Temperature changes ' + this.props.location,
                                            fontSize: 25,
                                        },
                                        legend: {
                                            display: this.props.displayLegend,
                                            position: this.props.legendPosition
                                        },
                                        scales: {
                                            yAxes: [{
                                                ticks: {
                                                    beginAtZero: true,
                                                    suggestedMin: 0,
                                                    suggestedMax: 100
                                                }
                                            }]
                                        }
                                    }}
                                />
                            </div>
                            
                <label class="container">One
  <input type="radio" checked="checked" name="radio">
                        <span class="checkmark"></span>
</label>
                    <label class="container">Two
  <input type="radio" name="radio">
                            <span class="checkmark"></span>
</label>
                        <label class="container">Three
  <input type="radio" name="radio">
                                <span class="checkmark"></span>
</label>
                            <label class="container">Four
  <input type="radio" name="radio">
                                    <span class="checkmark"></span>
</label>

                            */