var searchLocation;
var form = $("#search-form");
var city = $("#city-input");
var zipRegex = /[0-9-]{5,15}.*/; // 5to 15 numbers ranging from 5 to 15 with dashs included anywhere

var curLocation = $("#current-place");
var curTemp = $("#temp");
var curHumidity = $("#humidity");
var curWind = $("#wind");
var curUV = $("#uv");
var curUVRange = $("#uv-range");

// when form is submitted
form.on("submit", search);

function search(e) {
  e.preventDefault();

  // if city is in there
  if (city.val()) {
    searchLocation = city.val();
    var curWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchLocation + "&units=imperial&appid=ea61de219a59abe630bd0cdab605c61a";
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchLocation + "&appid=ea61de219a59abe630bd0cdab605c61a&units=imperial"

    // use regex to determine zip code or city,state,country  
    if (searchLocation.match(zipRegex)) {
      searchLocation = city.val();
      curWeatherURL = "https://api.openweathermap.org/data/2.5/weather?zip=" + searchLocation + "&appid=ea61de219a59abe630bd0cdab605c61a&units=imperial";
      var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?zip=" + searchLocation + "&appid=ea61de219a59abe630bd0cdab605c61a&units=imperial"
    } 
    
  getCurrentWeather(curWeatherURL);
  getForecast(forecastURL);
  


  }
  else {
    alert("Please Input Proper Location");
  }
  
}


function getCurrentWeather(url) {
  // get current weather
  $.ajax({
    url: url,
    method: "GET"
  })
  .fail(function(res) {
    console.log("error");
  })
  .then(function(res) {
    curLocation.text(res.name + ", " + res.sys.country);
    curTemp.text(`${res.main.temp} F`);
    curHumidity.text(`${res.main.humidity}%`);
    curWind.text(`${res.wind.speed} MPH`)
    
    
    // get uv index
    $.ajax({
      url: "http://api.openweathermap.org/data/2.5/uvi?appid=ea61de219a59abe630bd0cdab605c61a&lat=" + res.coord.lat +  "&lon=" + res.coord.lon,
      method: "GET"
    }).then(function(res) {
      var uv = res.value;
      if (uv < 3) {
        curUVRange.css("background-color", "green");
      } else if (uv >=3 && uv < 6) {
        curUVRange.css("background-color", "yellow")
      } else if (uv >= 6 && uv < 8) {
        curUVRange.css("background-color", "orange")
      } else if (uv >= 8 && uv < 11) {
        curUVRange.css("background-color", "red")
      } else if (uv >= 11) {
        curUVRange.css("background-color", "purple")
      }
      curUVRange.text(uv);
    });
  });
}

function getForecast(url) {
  $.ajax({
    url: url,
    method: "GET"
  })
  .fail(function(res) {
    console.log("error");
  })
  .then(function(res) {
    var shiftSeconds = res.city.timezone;
    tomorrow = new Date(); //gives local time
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0,0,0,0); // sets date to tomorrow 12AM add offset
    
    secondDay = new Date(); //gives local time
    secondDay.setDate(secondDay.getDate() + 2)
    secondDay.setHours(0,0,0,0); // sets date to tomorrow 12AM add offset

    thirdDay = new Date(); //gives local time
    thirdDay.setDate(thirdDay.getDate() + 3)
    thirdDay.setHours(0,0,0,0); // sets date to tomorrow 12AM add offset

    fourthDay = new Date(); //gives local time
    fourthDay.setDate(fourthDay.getDate() + 3)
    fourthDay.setHours(0,0,0,0); // sets date to tomorrow 12AM add offset

    fifthDay = new Date(); //gives local time
    fifthDay.setDate(fifthDay.getDate() + 3)
    fifthDay.setHours(0,0,0,0); // sets date to tomorrow 12AM add offset

    var count = 0;
    var clear = 0;
    var clouds = 0;
    var rain = 0;
    for (var i = 0; i < res.list.length; i++) {
      localTime = res.list[i].dt - shiftSeconds;
      localTime = localTime * 1000;
      
      // tomorrow
      if (localTime >= tomorrow  && localTime < secondDay ) {
        console.log("before tomorrow")
      }
      // secondDay
      else if (localTime >= secondDay  && localTime < thirdDay) {
        counter = 1;
      }
    }
    
  });
}
