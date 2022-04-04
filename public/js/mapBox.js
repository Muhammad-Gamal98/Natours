/*eslint-disable*/
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoibXVnYTk4IiwiYSI6ImNsMWp3Nzl1azFzeXUzbHJ0dGxycWdiNXEifQ.o5WudgxsQNEWWPNYtcuspQ';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11'
});
