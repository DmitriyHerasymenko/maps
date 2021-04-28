import React from "react";
import { withGoogleMap, withScriptjs, GoogleMap, Marker, Polyline } from "react-google-maps";
import {getRequest} from "../Request";

class Map extends  React.Component {

    state = {
        path: [],
        progress: [],
    };


    path = [
        { lat: 48.750488, lng: 30.219790 },
        { lat: 48.750715, lng: 30.219781 },
        { lat: 48.750986, lng: 30.219579 },
        { lat: 48.751340, lng: 30.219479 },

    ];

    velocity = 5;
    initialDate = new Date();

    getDistance = () => {
        const differentInTime = (new Date() - this.initialDate) / 1000;
        return differentInTime * this.velocity
    };

    componentDidMount = async () => {
        this.interval = window.setInterval(this.moveObject, 1000);
        const data = await getRequest();
        this.setState({path: data});
        console.log("state", this.state)
    };

    componentWillUnmount = () => {
        window.clearInterval(this.interval)
    };

    moveObject = () => {
        const distance = this.getDistance();
        if (! distance) {
            return
        }

        let progress = this.path.filter(coordinates => coordinates.distance < distance);

        const nextLine = this.path.find(coordinates => coordinates.distance > distance);
        if (! nextLine) {
            this.setState({ progress });
            return
        }
        const lastLine = progress[progress.length - 1];

        const lastLineLatLng = new window.google.maps.LatLng(
            lastLine.lat,
            lastLine.lng
        );

        const nextLineLatLng = new window.google.maps.LatLng(
            nextLine.lat,
            nextLine.lng
        );


        const totalDistance = nextLine.distance - lastLine.distance
        const percentage = (distance - lastLine.distance) / totalDistance

        const position = window.google.maps.geometry.spherical.interpolate(
            lastLineLatLng,
            nextLineLatLng,
            percentage
        );

        progress = progress.concat(position)
        this.setState({ progress })
    };

    componentWillMount = () => {
        this.path = this.path.map((coordinates, i, array) => {
            if (i === 0) {
                return { ...coordinates, distance: 0 }
            }
            const { lat: lat1, lng: lng1 } = coordinates
            const latLong1 = new window.google.maps.LatLng(lat1, lng1)

            const { lat: lat2, lng: lng2 } = array[0]
            const latLong2 = new window.google.maps.LatLng(lat2, lng2)


            const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
                latLong1,
                latLong2
            );

            return { ...coordinates, distance }
        });

        console.log(this.path)
    };

    render = () => {
        return (
            <GoogleMap
                defaultZoom={16}
                defaultCenter={{ lat: 48.750488, lng: 30.219790 }}
            >
                <Polyline path={this.state.progress} options={{ strokeColor: "#FF0000 " }} />
                <Marker position={this.state.progress[this.state.progress.length - 1]} />

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