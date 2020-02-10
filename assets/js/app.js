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

// variables for forecast
var tomorrow;
var secondDay;
var thirdDay;
var fourthDay;
var fifthDay;

// fills in the next 5 days
setDate();

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

// makes sure it local time 
// order of importance snow, rain,clouds, clear
// sort temps for each day
function getForecast(url) {
  $.ajax({
    url: url,
    method: "GET"
  })
  .fail(function(res) {
    console.log("error");
  })
  .then(function(res) {

    // need to account for UTC Time
    //var shiftSeconds = res.city.timezone;
    
    var clear1 = 0;
    var clouds1 = 0;
    var rain1 = 0;
    var snow1 = 0
    var temps1 = [];
    var humidities1 = [];

    var clear2 = 0;
    var clouds2 = 0;
    var rain2 = 0;
    var snow2 = 0;
    var temps2 = [];
    var humidities2 = [];

    var clear3 = 0;
    var clouds3 = 0;
    var rain3 = 0;
    var snow3 = 0;
    var temps3 = [];
    var humidities3 = [];

    var clear4 = 0;
    var clouds4 = 0;
    var rain4 = 0;
    var snow4 = 0;
    var tempHigh5 = 0;
    var temps4 = [];
    var humidities4 = [];

    var clear5 = 0;
    var clouds5 = 0;
    var rain5 = 0;
    var snow5 = 0;
    var temps5 = [];
    var humidities5 = [];


    for (var i = 0; i < res.list.length; i++) {
      localTime = res.list[i].dt;
      localTime = new Date(localTime * 1000); // converts to local time
      
      // tomorrow
      if (localTime >= tomorrow  && localTime < secondDay ) {
        if (res.list[i].weather.main === "Clear") {
          clear1++;
        } else if (res.list[i].weather.main === "Clouds") {
          clouds1++;
        } else if (res.list[i].weather.main === "Rain") {
          rain1++; 
        }
        else if (res.list[i].weather.main === "Snow") {
          snow1++; 
        }
        temps1.push(res.list[i].main.temp)
        humidities1.push(res.list[i].main.humidity);

      }
      // secondDay
      else if (localTime >= secondDay  && localTime < thirdDay) {
        if (res.list[i].weather.main === "Clear") {
          clear1++;
        } else if (res.list[i].weather.main === "Clouds") {
          clouds1++;
        } else if (res.list[i].weather.main === "Rain") {
          rain1++; 
        }
        else if (res.list[i].weather.main === "Snow") {
          snow1++; 
        }

        temps2.push(res.list[i].main.temp)
        humidities2.push(res.list[i].main.humidity);
      }
      // third
      else if (localTime >= thirdDay  && localTime < fourthDay) {
        if (res.list[i].weather.main === "Clear") {
          clear1++;
        } else if (res.list[i].weather.main === "Clouds") {
          clouds1++;
        } else if (res.list[i].weather.main === "Rain") {
          rain1++; 
        }
        else if (res.list[i].weather.main === "Snow") {
          snow1++; 
        }

        temps3.push(res.list[i].main.temp)
        humidities3.push(res.list[i].main.humidity);
      }
      // fourth
      else if (localTime >= fourthDay  && localTime < fifthDay) {
        if (res.list[i].weather.main === "Clear") {
          clear1++;
        } else if (res.list[i].weather.main === "Clouds") {
          clouds1++;
        } else if (res.list[i].weather.main === "Rain") {
          rain1++; 
        }
        else if (res.list[i].weather.main === "Snow") {
          snow1++; 
        }

        temps4.push(res.list[i].main.temp)
        humidities4.push(res.list[i].main.humidity);
      }
      // fifth
      else if (localTime >= fifthDay) {
        if (res.list[i].weather.main === "Clear") {
          clear1++;
        } else if (res.list[i].weather.main === "Clouds") {
          clouds1++;
        } else if (res.list[i].weather.main === "Rain") {
          rain1++; 
        }
        else if (res.list[i].weather.main === "Snow") {
          snow1++; 
        }

        temps5.push(res.list[i].main.temp)
        humidities5.push(res.list[i].main.humidity);

      }
    } // end for
  
    // sort arrays
    $(".highTemp1").text(`${temps1.sort(function(a,b) {return b-a})[0]} F`);
    $(".lowTemp1").text(`${temps1.sort()[0]} F`);
    $(".humidity1").text(`${humidities1.sort()[humidities1.length-1]}`);

    $(".highTemp2").text(`${temps2.sort(function(a,b) {return b-a})[0]} F`);
    $(".lowTemp2").text(`${temps2.sort()[0]} F`);
    $(".humidity2").text(`${humidities2.sort()[humidities2.length-1]}`);

    $(".highTemp3").text(`${temps3.sort(function(a,b) {return b-a})[0]} F`);
    $(".lowTemp3").text(`${temps3.sort()[0]} F`);
    $(".humidity3").text(`${humidities3.sort()[humidities3.length-1]}`);

    $(".highTemp4").text(`${temps4.sort(function(a,b) {return b-a})[0]} F`);
    $(".lowTemp4").text(`${temps4.sort()[0]} F`);
    $(".humidity4").text(`${humidities4.sort()[humidities4.length-1]}`);


    $(".highTemp5").text(`${temps5.sort(function(a,b) {return b-a})[0]} F`);
    $(".lowTemp5").text(`${temps5.sort()[0]} F`);
    $(".humidity5").text(`${humidities5.sort()[humidities5.length-1]}`);

    // function for figuring out which icon will be present

    
  });
}

// sets the forecast dates when the page loads
function setDate() {
    tomorrow = new Date(); //gives local time
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0,0,0,0); // sets date to tomorrow 12AM add offset
    $(".date1").text(`${tomorrow.getMonth()+1}/${tomorrow.getDate()}/${tomorrow.getFullYear()}`);
    
    secondDay = new Date(); //gives local time
    secondDay.setDate(secondDay.getDate() + 2)
    secondDay.setHours(0,0,0,0); // sets date to tomorrow 12AM add offset
    $(".date2").text(`${secondDay.getMonth()+1}/${secondDay.getDate()}/${secondDay.getFullYear()}`);

    thirdDay = new Date(); //gives local time
    thirdDay.setDate(thirdDay.getDate() + 3)
    thirdDay.setHours(0,0,0,0); // sets date to tomorrow 12AM add offset
    $(".date3").text(`${thirdDay.getMonth()+1}/${thirdDay.getDate()}/${thirdDay.getFullYear()}`);

    fourthDay = new Date(); //gives local time
    fourthDay.setDate(fourthDay.getDate() + 4)
    fourthDay.setHours(0,0,0,0); // sets date to tomorrow 12AM add offset
    $(".date4").text(`${fourthDay.getMonth()+1}/${fourthDay.getDate()}/${fourthDay.getFullYear()}`);

    fifthDay = new Date(); //gives local time
    fifthDay.setDate(fifthDay.getDate() + 5)
    fifthDay.setHours(0,0,0,0); // sets date to tomorrow 12AM add offset
    $(".date5").text(`${fifthDay.getMonth()+1}/${fifthDay.getDate()}/${fifthDay.getFullYear()}`);
}

// function used to figure out which icon will be used for the forecast days
function weatherIcon() {
  

}