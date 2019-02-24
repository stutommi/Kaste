import React, { Component } from 'react';
import plant from '../../images/plant.jpeg';
import options from '../Room-info/ChartOptions';
import { Spring } from 'react-spring';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import moment from 'moment';
import "./PlantInfo.css";


export class PlantInfo extends Component {
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
                    pointBackgroundColor: 'rgba(00, 0, 0, 0.6)',
                    pointHoverBackgroundColor: 'rgba(0, 0, 0, 0.6)',
                    pointHoverBorderColor: 'rgba(0, 0, 0, 0.6)',
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
        console.log(this.props.sensor)
        let timeHistoryArray = [];
        let tempHistoryArray = [];
        let humidityHistoryArray = [];
        await axios.get(`/api/getPlantData/${this.props.plantInfo.id}/${this.state.chartRange}`)
            .then((history) => {
                // Success
                 console.log(history.data.data)
                history.data.data.forEach(doc => {
                    let tempDate = moment(doc.time).format('ddd kk:mm');
                    humidityHistoryArray.push(doc.humidity)
                    timeHistoryArray.push(tempDate);
                    tempHistoryArray.push(doc.temp);
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

        const { time, humidity,
            temp } = this.props.plantInfo;

        let infoContainer = this.state.isToggleOn ? "info-container-big" : "info-container-small";


        return (

            <Spring
                from={{ opacity: 0, marginTop: -500 }}
                to={{ opacity: 1, marginTop: 0 }}
                config={{ delay: 1000, duration: 600 }}
            >

                {props =>
                    <div style={props}>

                        <div className={infoContainer}>
                            <div className='name-container-plant'>
                                <h1>Wisteria sinensis</h1>
                            </div>

                            <div className='content-plant'>
                                <div className='livepic-container-plant' style={{ backgroundImage: `url(${plant})` }}>
                                </div>
                                <div className='info-plant'>
                                    <div className='air_temp-plant'>
                                        <p>Temperature</p>
                                        <span>{Math.round(temp * 100) / 100}°C</span>
                                    </div>
                                    <div className='sensor-time-plant'>
                                        <p>Last Updated</p>
                                        <span>{time.slice(11,19)}</span>
                                    </div>
                                    <div className='air-moist-plant'>
                                        <p>Soil Moisture</p>
                                        <span>{Math.round(humidity)}%</span>
                                    </div>
                                </div>
                                <div className="button-container">
                                    <button value="60" className="ui-button-plant" onClick={this.handleChartRangeChange}>1 h</button>
                                    <button value="1440" className="ui-button-plant" onClick={this.handleChartRangeChange}>1 d</button>
                                    <button value="10080" className="ui-button-plant" onClick={this.handleChartRangeChange}>1 w</button>
                                    <button value="40320" className="ui-button-plant" onClick={this.handleChartRangeChange}>1 m</button>
                                    <button value="483840" className="ui-button-plant" onClick={this.handleChartRangeChange}>1 y</button>
                                </div>
                                <div className='chart-1-plant' onClick={this.resizeChart}>
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

 // export const PlantInfo = props => {

//     console.log(props);
//     const { time, humidity,
//         temp } = props.plantInfo;

//     return (

//         <Spring
//             from={{ opacity: 0, marginTop: -500 }}
//             to={{ opacity: 1, marginTop: 0 }}
//             config={{ delay: 1000, duration: 600 }}
//         >

//             {props =>
//                 <div style={props}>

//                     <div className={infoContainer}>
//                         <div className='name-container-plant'>
//                             <h1>Wisteria sinensis</h1>
//                         </div>

//                         <div className='content'>
//                             <div className='livepic-container-plant' style={{ backgroundImage: `url(${plant})` }}>
//                             </div>
//                             <div className='info'>
//                                 <div className='air_temp-plant'>
//                                     <p>Temperature</p>
//                                     <span>{Math.round(temp * 100) / 100}°C</span>
//                                 </div>
//                                 <div className='sensor-time-plant'>
//                                     <p>Last Updated</p>
//                                     <span>{time.slice(11, 19)}</span>
//                                 </div>
//                                 <div className='air-moist-plant'>
//                                     <p>Soil Moisture</p>
//                                     <span>{Math.round(humidity)}%</span>
//                                 </div>
//                             </div>
//                             <div className="button-container">
//                                 <button value="60" className="ui-button" onClick={this.handleChartRangeChange}>1 h</button>
//                                 <button value="1440" className="ui-button" onClick={this.handleChartRangeChange}>1 d</button>
//                                 <button value="10080" className="ui-button" onClick={this.handleChartRangeChange}>1 w</button>
//                                 <button value="40320" className="ui-button" onClick={this.handleChartRangeChange}>1 m</button>
//                                 <button value="483840" className="ui-button" onClick={this.handleChartRangeChange}>1 y</button>
//                             </div>

//                             <div className='icon-container-plant'>
//                                 <div className='icon-list'>
//                                     <div className='icon-containers-plant'>
//                                         <img id='watering-can' src={WateringCanIcon} alt='plant' />
//                                     </div>
//                                     <div className='icon-containers-plant'>
//                                         <img id='zoom' src={ZoomIcon} alt='plant' />
//                                     </div>
//                                     <div className='icon-containers-plant'>
//                                         <img id='settings' src={SettingsIcon} alt='plant' />
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className='chart-1' onClick={this.resizeChart}>
//                                 <Line
//                                     data={this.state.chartData1}
//                                     // redraw
//                                     options={options}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             }
//         </Spring>
//     )
// }