const apiKey = "9821af4b5fd3bcd16add54c3c57c7e82";
// evalutates local storage or empty array
let citiesArr = eval(localStorage.cities) || [];
// calls save storage function
saveStorage();

// click lisener for searhbutton then runs weather function
$('#search-button').on('click', handleWeather);
// passes in city searched and enables the user to press enter to search 
$("#city-input").keypress(function (event) {
  if (event.key === "Enter") {
    handleWeather();
  }
});
// Save to local storage function 
function saveStorage(city) {
  // pushes city to button if saved in local storage and captalizes first letter
  if (city){
    if (!citiesArr.includes(city))citiesArr.push(city[0].toUpperCase()+city.substr(1));
  } 
  // creates each button in html
  $('#searchHistory').html('');
  citiesArr.forEach(city => {
    $('#searchHistory').append(`<button class="btn-primary" onclick="handleHistory('${city}')">${city}</button>`)
  });
  localStorage.cities = JSON.stringify(citiesArr);
};
// handles search hisotry input
function handleHistory(city) {
  $('input').val(city);
  handleWeather();
}
// main function to pull API
function handleWeather() {
  let city = document.querySelector('input').value;
  // if no city entered nothing happens 
  if (!city) return;
  let url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  // API fetch
  fetch(url).then(data => data.json()).then(data => {
    let { lat, lon } = data[0];

    let url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;


    fetch(url2).then(data => data.json()).then(data => {
      saveStorage(city);
      console.log(data);
      let icon = `http://openweathermap.org/img/w/${data.current.weather[0].icon}.png`
      
      // varibales for each weather retlated attribute 
      let description = data.current.weather[0].description;
      let temp = Math.round(data.current.temp);
      let humidity = data.current.humidity;
      let windSpeed = Math.round(data.current.wind_speed);
      let uvi = data.current.uvi;
      let name = city;
 
      // adds to HTML with proper symbols and lettering 
      document.getElementById('icon').setAttribute('src', icon);
      document.getElementById("cityDescription").innerHTML = description;
      document.getElementById("cityTemp").innerHTML = temp + "°";
      document.getElementById("cityHumididty").innerHTML = humidity + "%";
      document.getElementById("cityWindSpeed").innerHTML = windSpeed + " mph";
      document.getElementById("cityUVI").innerHTML = uvi;
      document.getElementById("cityName").innerHTML = name;
      document.getElementById("currentDate").innerHTML = moment().format("MMM Do YYYY");
      // color change statment for uvi color change
        $("#cityUVI").each(function () {
         if (uvi < 3) {
          $(this).addClass("favorable");
          $(this).removeClass("moderate");
          $(this).removeClass("severe");
         }
         else if (uvi >= 3 && uvi <= 8) {
          $(this).addClass("moderate");
          $(this).removeClass("favorable");
          $(this).removeClass("severe");
       }
        else {
         $(this).addClass("severe");
         $(this).removeClass("favorable");
         $(this).removeClass("moderate");
      }
         });
    
      // clears 5 day forecast so it does not repeat the previous cities 5 day forcast searched 
      document.getElementById('forecast').innerHTML = '';
      // loops weather info over 5 day forecast 
      for (let i = 0; i < 5; i++) {
        let date = moment().add(i + 1, "days").format("MM/DD/YYYY");
        let icon2 = data.daily[i].weather[0].icon;
        let temp = data.daily[i].temp.day;
        let wind = data.daily[i].wind_speed;
        let humidity = data.daily[i].humidity;
      // dynamically adds 5 day info to html 
        document.getElementById('forecast').innerHTML +=
          `<div class="forecastCard">
              <h5>${date}</h5>
              <img src="http://openweathermap.org/img/w/${icon2}.png">
              <h6>Temp: ${Math.round(temp) + "°"}</h6>
              <h6>Wind: ${Math.round(wind) + " mph"}</h6>
             <h6>Humidity: ${humidity + "%"}</h6>
              </div>`

      }
          
    });
    // hides info on main screen and displays upon search 
    document.querySelector(".hide").style.display = "block";
  });
};

// clears local storage, innerHtml, and reloads on click 
function handleClear(){
  localStorage.clear();
  document.getElementById('searchHistory').innerHTML = '';
  window.location.reload();
  
}

