const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors());

app.get('/path', (req, res) => {
    res.send([
        { lat: 48.752236, lng: 30.219027 },
        { lat: 48.755349, lng: 30.217481 },
        { lat: 48.757686, lng: 30.216222 },
        { lat: 48.759132, lng: 30.215538 },
        { lat: 48.759046, lng: 30.214366 },
        { lat: 48.758804, lng: 30.213437 },
        { lat: 48.758685, lng: 30.212689 },
        { lat: 48.759273, lng: 30.212396 },

    ])
})

app.listen(8080, () => console.log('Server ready'));