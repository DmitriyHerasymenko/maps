const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors());

app.get('/path', (req, res) => {
    res.send([
        { lat: 48.750488, lng: 30.219790 },
        { lat: 48.750715, lng: 30.219781 },
        { lat: 48.750986, lng: 30.219579 },
        { lat: 48.751340, lng: 30.219479 },

    ])
})

app.listen(8080, () => console.log('Server ready'));