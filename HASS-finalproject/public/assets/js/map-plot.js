// Initialize the map
// [0, 0] are the latitude and longitude
// 2 is the zoom
// map_plot is the id of the div where the map will appear
let mymap = L.map("map_plot").setView([50, 100], 2);

// Add a tile to the map = a background. Comes from OpenStreetmap
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 10,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(mymap);

map_plot_update();

function map_plot_update() {
  fetchJsonFromFile("data/liked_users_latlon.json")
    .then((jsonData) => {
      // console.log('Data from JSON file:', jsonData);
      jsonData.forEach(function (arr) {
        L.marker([arr.lat, arr.lon]).addTo(mymap);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
