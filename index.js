const express = require('express')
const Datastore = require('@seald-io/nedb')
const app = express()
require('dotenv').config()

const port = process.env.PORT || 3500
app.listen(port, () => console.log(`Listening to port at ${port}`))
app.use(express.static('public'))
app.use(express.json())

let database = new Datastore({filename:'weatherdata.db'})
database.loadDatabase()

app.post('/api',(request,response) =>{
    const data = request.body
    console.log(data)
    response.json(data)
    database.insert(data)
})
app.get('/api',(request,response) =>{
    database.find({},(err,data) =>{
        if(err){
            response.end()
            return
        }
        response.json(data)
    })
})

app.get('/weather/:latlon',async (request,response) =>{
    const latlon = request.params.latlon.split(',')
    lat = latlon[0]
    lon = latlon[1]
    console.log(lat)
    let weatherKEY = process.env.WEATHER_KEY
    weather_URL = `http://api.weatherapi.com/v1/current.json?key=${weatherKEY}&q=${lat},${lon}`
    const weather_response = await fetch(weather_URL)
    const weather_data = await weather_response.json()

    let airKEY = process.env.AIRQKEY
    airQ_URL = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${airKEY}`
    const airQ_response = await fetch(airQ_URL)
    const airQ_data = await airQ_response.json()
    
    const data = {
        weather:weather_data,
        air_quality: airQ_data
    }
    response.json(data)
})