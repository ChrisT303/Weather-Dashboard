let queryURL = "https://api.openweathermap.org/data/2.5/onecall?";
let lat = "lat=39.742043&";
let lon = "lon=-104.991531&";
let apiOptions = "units=imperial&exclude=minutely,alerts&";
let apiKey = "appid=9821af4b5fd3bcd16add54c3c57c7e82";
let file = queryURL + lat + lon + apiOptions + apiKey;

// fetch weather API
fetch(file)
.then((response) => response.json())
.then((data) => {

    // main weather data 
   let main = data.current.weather[0].main;
   let description = data.current.weather[0].description;
   let temp = Math.round(data.current.temp);
   let humidity = data.current.humidity;
   let windSpeed = data.current.wind_speed;
   let uvi = data.current.uvi;

        // Daily weather data
  let day1Temp = Math.round(data.daily[0].temp.day);
  let day2Temp = Math.round(data.daily[1].temp.day);
  let day3Temp = Math.round(data.daily[2].temp.day);
  let day4Temp = Math.round(data.daily[3].temp.day);
  let day5Temp = Math.round(data.daily[4].temp.day);
  let day1Main = data.daily[0].weather[0].main;
  let day2Main = data.daily[1].weather[0].main;
  let day3Main = data.daily[2].weather[0].main;
  let day4Main = data.daily[3].weather[0].main;
  let day5Main = data.daily[4].weather[0].main;

 

   
})