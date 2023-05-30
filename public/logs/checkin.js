let map = L.map('map').setView([0,0], 1);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

getData()
async function getData() {
    const response = await fetch('/api');
    const data = await response.json();
    console.log(data)
    
    for(item of data){
        const marker = L.marker([item.lat,item.lon]).addTo(map)
        
        let weather = item.current
        const txt = `the weather of ${item.lat.toFixed(2)} ,${item.lon.toFixed(2) } is ${weather.temp_c}C the value of dominionpol pm25 is ${item.aq.aqi}ugm/³`
        marker.bindPopup(txt)
    }
}