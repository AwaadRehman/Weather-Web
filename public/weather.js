let latitude = document.getElementById('lat')
let longitude = document.getElementById('lon')
let btn = document.getElementById("btn")
let details = document.getElementById('details')

let lat,lon
if(navigator.geolocation){
    console.log('geolocation available')
    
    navigator.geolocation.getCurrentPosition(async position =>{
        lat = position.coords.latitude
        lon = position.coords.longitude
        latitude.textContent = lat.toFixed(2)
        longitude.textContent = lon.toFixed(2)
    })
}
else{
    console.log('geolocation not available')
}

btn.addEventListener('click',async ()=>{
    try{   
        APIURL = `weather/${lat},${lon}`
        const response = await fetch(APIURL)
        const json = await response.json()
        
        let weather = json.weather
        let location = weather.location
        let current = weather.current
        console.log(json)
        let aq = json.air_quality.data
        let forfetchaq = aq.dominentpol
        let aqi = aq.iaqi.pm25
        implement(location,current,forfetchaq,aqi)

        const data = {lat,lon,current,aq,aqi}
        const options = {
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(data)
        }
        let Checkresponse =await fetch('/api',options)
        let raw = await Checkresponse.json()
    }
    catch(error){
        details.textContent = 'Something Went Wrong.'
    }
})

function implement(dataL,dataC,dom,aqi){
    const {name,country} = dataL
    const {is_day,temp_c,humidity,wind_mph,condition} = dataC
    const {dominentpol} = dom
    const {v} = aqi

    details.innerHTML = `
    <p>location: <span>${name},${country}</span></p>
    <p>Temperature: <span>${temp_c}C</span></p>
    <p>Humidity:<span>${humidity}</span></p>
    <p>Wind MPH:<span>${wind_mph}</span></p>
    <p>Condition:<span>${condition.text}</span></p>
    <p>Dominentpol:<span>${dom}</span></p>
    <p>Value of pm25: <span>${v}ugm/³</span></p>
    <p>is Day:<span>${is_day == 0 ? 'No' : 'Yes'}</span></p>`
}