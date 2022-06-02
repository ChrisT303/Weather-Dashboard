let citiesArr = eval(localStorage.cities) || [];
saveStorage();

$('#search-button').on('click', handleWeather);

$("#city-input").keypress(function (event) {
  if (event.key === "Enter") {
    handleWeather();
  }
});

function saveStorage(city) {
  if (city){
    if (!citiesArr.includes(city)) citiesArr.push(city[0].toUpperCase()+city.substr(1));
  }
  $('#searchHistory').html('');
  citiesArr.forEach(city => {
    $('#searchHistory').append(`<button class="btn-primary" onclick="handleHistory('${city}')">${city}</button>`)
  });
  localStorage.cities = JSON.stringify(citiesArr);
};

function handleHistory(city) {
  $('input').val(city);
  handleWeather();
}

function handleWeather() {
  let city = document.querySelector('input').value;
  if (!city) return;
  let url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  fetch(url).then(data => data.json()).then(data => {
    let { lat, lon } = data[0];

    let url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;


    fetch(url2).then(data => data.json()).then(data => {
      saveStorage(city);
      console.log(data);
      let icon = `http://openweathermap.org/img/w/${data.current.weather[0].icon}.png`
      

      let description = data.current.weather[0].description;
      let temp = Math.round(data.current.temp);
      let humidity = data.current.humidity;
      let windSpeed = Math.round(data.current.wind_speed);
      let uvi = data.current.uvi;
      let name = city;
 

      document.getElementById('icon').setAttribute('src', icon);
      document.getElementById("cityDescription").innerHTML = description;
      document.getElementById("cityTemp").innerHTML = temp + "°";
      document.getElementById("cityHumididty").innerHTML = humidity + "%";
      document.getElementById("cityWindSpeed").innerHTML = windSpeed + " mph";
      document.getElementById("cityUVI").innerHTML = uvi;
      document.getElementById("cityName").innerHTML = name;
      document.getElementById("currentDate").innerHTML = moment().format("MMM Do YYYY");

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
    

      document.getElementById('forecast').innerHTML = '';

      for (let i = 0; i < 5; i++) {
        let date = moment().add(i + 1, "days").format("MM/DD/YYYY");
        let icon2 = data.daily[i].weather[0].icon;
        let temp = data.daily[i].temp.day;
        let wind = data.daily[i].wind_speed;
        let humidity = data.daily[i].humidity;

        document.getElementById('forecast').innerHTML +=
          `<div class="forecastCard">
              <h5>${date}</h5>
              <img src="http://openweathermap.org/img/w/${icon2}.png">
              <h6>Temp: ${Math.round(temp) + "°"}</h6>
              <h6>Wind: ${Math.round(wind) + " mph"}</h6>
             <h6>Humidity: ${humidity + "%"}</h6>
              </div>`

      }

      document.querySelector(".hide").style.display = "block";
    });
  });
};


$(window).on("load", function () {
  $("#city-input").prop("value", citiesArr[0]);
  handleWeather();
})


// localtstorage.clear