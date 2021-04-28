import React from "react";
import { withGoogleMap, withScriptjs, GoogleMap, Marker, Polyline } from "react-google-maps";

class Map extends React.Component {

    state = {
        progress: [],
    };



    path = [
        { lat: 48.750488, lng: 30.219790 },
        { lat: 48.751138, lng: 30.219584 },
        { lat: 48.751601, lng: 30.219331 },
        { lat: 48.752506, lng: 30.218902 },
        { lat: 48.753824, lng: 30.218315 },
    ];

    velocity = 5;
    initialDate = new Date();

    getDistance = () => {
        const differentInTime = (new Date() - this.initialDate) / 1000;
        return differentInTime * this.velocity
    };

    componentDidMount = () => {
        this.interval = window.setInterval(this.moveObject, 1000)
    };

    componentWillUnmount = () => {
        window.clearInterval(this.interval)
    };

    moveObject = () => {
        const distance = this.getDistance()
        if (! distance) {
            return
        }

        let progress = this.path.filter(coordinates => coordinates.distance < distance)

        const nextLine = this.path.find(coordinates => coordinates.distance > distance)
        if (! nextLine) {
            this.setState({ progress })
            return // it's the end!
        }
        const lastLine = progress[progress.length - 1]

        const lastLineLatLng = new window.google.maps.LatLng(
            lastLine.lat,
            lastLine.lng
        )

        const nextLineLatLng = new window.google.maps.LatLng(
            nextLine.lat,
            nextLine.lng
        )

        // distance of this line
        const totalDistance = nextLine.distance - lastLine.distance
        const percentage = (distance - lastLine.distance) / totalDistance

        const position = window.google.maps.geometry.spherical.interpolate(
            lastLineLatLng,
            nextLineLatLng,
            percentage
        )

        progress = progress.concat(position)
        this.setState({ progress })
    }

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
            )

            return { ...coordinates, distance }
        })

        console.log(this.path)
    }

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