import React from "react";
import { withGoogleMap, withScriptjs, GoogleMap } from "react-google-maps";

class Map extends React.Component {
    render = () => {
        return (
            <GoogleMap
                defaultZoom={16}
                defaultCenter={{ lat: 48.750488, lng: 30.219790 }}
            >
            </GoogleMap>
        )
    }
}

const MapComponent = withScriptjs(withGoogleMap(Map));

export default () => (
    <MapComponent
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px`, width: '500px' }} />}
        mapElement={<div style={{ height: `100%` }} />}
    />
)