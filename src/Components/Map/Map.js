import React from 'react';
import { withGoogleMap, withScriptjs, GoogleMap, Marker, Polyline } from 'react-google-maps';
import { getRequest } from '../Request';

const Map = () => {

    const [ path, setPath ] = React.useState([]);
    const [ progress, setProgress ] = React.useState([]);
    const [ velocity, setVelocity ] = React.useState(15);
    const [ initialDate, setInitialDate ] = React.useState(new Date());

    React.useEffect(() => {

        const getCoordinatesWithDistance = (coordinates, i, array) => {
            if (i === 0) {
                return { ...coordinates, distance: 0 };
            }
            const { lat: lat1, lng: lng1 } = coordinates;
            const latLong1 = new window.google.maps.LatLng(lat1, lng1);

            const { lat: lat2, lng: lng2 } = array[0];
            const latLong2 = new window.google.maps.LatLng(lat2, lng2);

            const distance = window.google.maps.geometry.spherical.computeDistanceBetween(latLong1, latLong2);

            return { ...coordinates, distance };
        };

        const moveObject = () => {

            const getDistance = () => {
                const differentInTime = (new Date() -initialDate) / 1000;
                return differentInTime * velocity;
            };

            const distance = getDistance();
            if (!distance) {
                return;
            }

            let curProgress = path.filter((coordinates) => coordinates.distance < distance);
            const nextLine = path.find((coordinates) => coordinates.distance > distance);

            if (!nextLine) {
                setProgress(curProgress);
                return;
            }
            const lastLine = curProgress[curProgress.length - 1];

            const lastLineLatLng = new window.google.maps.LatLng(lastLine.lat, lastLine.lng);

            const nextLineLatLng = new window.google.maps.LatLng(nextLine.lat, nextLine.lng);

            const totalDistance = nextLine.distance - lastLine.distance;
            const percentage = (distance - lastLine.distance) / totalDistance;

            const position = window.google.maps.geometry.spherical.interpolate(lastLineLatLng, nextLineLatLng, percentage);

            curProgress = curProgress.concat(position);
            setProgress(curProgress);
        };

        async function fetchData() {
            const data = await getRequest();
            const modPath = data.map(getCoordinatesWithDistance);
            setPath(modPath);
        }

        const interval = window.setInterval(moveObject, 1000);

        if (path.length === 0) {
            fetchData();
        }

        return () => {
            window.clearInterval(interval);
        }
    },[initialDate, velocity, path]);

    return  <GoogleMap defaultZoom={16} defaultCenter={{ lat: 48.750488, lng: 30.21979 }}>
        <Polyline path={progress} options={{ strokeColor: '#FF0000 ' }} />
        <Marker position={progress[progress.length - 1]} />
    </GoogleMap>;
}

const MapComponent = withScriptjs(withGoogleMap(Map));

const GMC = () => (
    <MapComponent
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `500px`, width: '100%' }} />}
        mapElement={<div style={{ height: `100%` }} />}
    />
)
export default GMC;