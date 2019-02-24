import React from 'react';
import './footer.css';
export class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            testKey: 'value'
        }
    }

    render() {
        return (
            <div className='footer'>
                <p>copyright MaTo</p>
            </div>
        );
    }
};

