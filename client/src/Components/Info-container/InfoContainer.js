import React from 'react';
import './InfoContainer.css';
import { RoomInfo } from '../Room-info/RoomInfo';
import { PlantInfo } from '../Plant-info/PlantInfo';

export const InfoContainer = props => {
    return (


        <div className='plant-container' >

            <p className='error-message' style={{ display: props.networkError.display }}>{props.networkError.message}</p>
            {
                props.roomSensorInfo.map(sensor => {

                    return <RoomInfo location={sensor.location} key={sensor.id} sensor={sensor} />
                })
            }

            {
                props.plantSensorInfo.map(sensor => {

                    return <PlantInfo key={666} plantInfo={sensor}/>
                })
            }
        </div>
    )
};
