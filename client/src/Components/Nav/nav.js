import React from 'react';
import NavLogo from '../../images/leaf-logo.png';
import './nav.css';

export class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: ''
        }
        this.checkTime = this.checkTime.bind(this);
    }

    componentDidMount() {
        this.checkTime()
        setInterval(this.checkTime, 1000);
    }

    checkTime() {

        let timeNow = Date()
        let day = timeNow.slice(0,3);
        let time = timeNow.slice(16, 25);
        this.setState({
            time: `${day} ${time}`
        })
    }
    
    render() {
        return (
            <div className='nav'>
                <div className='nav-logo'>
                    <img src={NavLogo} alt='logo' />
                    <h1>Kaste</h1>
                </div>
                <div className='time'>
                    <p>{this.state.time}</p>
                </div>
            </div>
        )
    }
}

