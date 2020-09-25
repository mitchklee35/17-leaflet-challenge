function createMap() {


const myMap = L.map("map", {
    center: [38.87, -99.32],
    zoom: 5
});

const streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    // tileSize: 512,
    // zoomOffset: -1,
    accessToken: API_KEY
}).addTo(myMap);

var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(URL, function (data) {
    console.log(data)
    let earthquakes = data.features;
    console.log(earthquakes);
    let color = {
        level1: "#bfff00",
        level2: "#ffff00",
        level3: "#ffbf00",
        level4: "#ff8000",
        level5: "#ff4000",
        level6: "#ff0000"
    }

    for (var i = 0; i < earthquakes.length; i++) {
        let latitude = earthquakes[i].geometry.coordinates[1];
        let longitude = earthquakes[i].geometry.coordinates[0];
        let magnitude = earthquakes[i].properties.mag;
        var fillColor;
        if (magnitude > 5) {
            fillColor = color.level6
        } else if (magnitude > 4) {
            fillColor = color.level5
        } else if (magnitude > 3) {
            fillColor = color.level4
        } else if (magnitude > 2) {
            fillColor = color.level3
        } else if (magnitude > 1) {
            fillColor = color.level2
        } else {
            fillColor = color.level1
        }
        var epicenter = L.circleMarker([latitude, longitude], {
            radius: magnitude ** 2,
            color: "black",
            fillColor: fillColor,
            fillOpacity: 1,
            weight: 1
        });
        epicenter.addTo(myMap);

        epicenter.bindPopup("<h3> " + new Date(earthquakes[i].properties.time) + "</h3><h4>Magnitude: " + magnitude +
            "<br>Location: " + earthquakes[i].properties.place + "</h4><br>");
    }
    var legend = L.control({
        position: 'bottomright'
    });

    legend.onAdd = function (color) {
        var div = L.DomUtil.create('div', 'info legend');
        var levels = ['>1', '1-2', '2-3', '3-4', '4-5', '5+'];
        var colors = ['#bfff00', '#ffff00', '#ffbf00', '#ff8000', '#ff4000', '#ff0000']

        for (var i = 0; i < levels.length; i++) {
            div.innerHTML += '<i style="background:' + colors[i] + '"></i>' + levels[i] + '<br>';
        }
        return div;
    }
    legend.addTo(myMap);
})

}

createMap()