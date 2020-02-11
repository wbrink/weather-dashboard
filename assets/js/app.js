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

var cities = JSON.parse(localStorage.getItem("searchedCities"));

if (!cities) {
  cities = [];
} else {
  loadCities();
}



function loadCities() {
  for (var i = 0; i<cities.length; i++) {
    var x = $("<div>").text(cities[i]).addClass("searched-cities");
    $(".search").append(x);
  }
}

// fills in the next 5 days
setDate();

// when form is submitted
form.on("submit", search);

function search(e) {
  e.preventDefault();

  // if city is in there
  if (city.val()) {
    searchLocation = city.val();
    if (searchLocation.indexOf(",") == -1) {
      var curWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchLocation + "&units=imperial&appid=ea61de219a59abe630bd0cdab605c61a";
      var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchLocation + "&appid=ea61de219a59abe630bd0cdab605c61a&units=imperial";
    } else {
      searchLocation = city.val().split(",");
      for (var i = 0; i<searchLocation.length; i++) {
        searchLocation[i] = searchLocation[i].trim();
      }
      searchLocation = searchLocation.join(",");
      var curWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchLocation + "&units=imperial&appid=ea61de219a59abe630bd0cdab605c61a";
      var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchLocation + "&appid=ea61de219a59abe630bd0cdab605c61a&units=imperial";
    }
    

    // use regex to determine zip code or city,state,country  
    if (searchLocation.match(zipRegex)) {
      searchLocation = city.val();
      curWeatherURL = "https://api.openweathermap.org/data/2.5/weather?zip=" + searchLocation + "&appid=ea61de219a59abe630bd0cdab605c61a&units=imperial";
      var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?zip=" + searchLocation + "&appid=ea61de219a59abe630bd0cdab605c61a&units=imperial"
    } 

    var searchedCity = $("<div>").text(searchLocation).addClass("searched-cities");
    $(".search").append(searchedCity);
    
    // append to local storage
    cities.push(searchLocation);
    localStorage.setItem("searchedCities", JSON.stringify(cities));

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
    url = "http://openweathermap.org/img/wn/" + res.weather[0].icon + "@2x.png";
    $("#currentIcon").attr("src", url);
    
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

    // variables for each forecast day    
    var clear1 = 0; // # of clear descriptions on first day etc.
    var clouds1 = 0;
    var rain1 = 0;
    var snow1 = 0;
    var thunderstorm1 = 0;
    var temps1 = []; // all the temps for given day
    var humidities1 = []; // all the humidities for the given day

    var clear2 = 0;
    var clouds2 = 0;
    var rain2 = 0;
    var thunderstorm2 = 0;
    var snow2 = 0;
    var temps2 = [];
    var humidities2 = [];

    var clear3 = 0;
    var clouds3 = 0;
    var rain3 = 0;
    var thunderstorm3 = 0;
    var snow3 = 0;
    var temps3 = [];
    var humidities3 = [];

    var clear4 = 0;
    var clouds4 = 0;
    var rain4 = 0;
    var thunderstorm4 = 0;
    var snow4 = 0;
    var temps4 = [];
    var humidities4 = [];

    var clear5 = 0;
    var clouds5 = 0;
    var rain5 = 0;
    var thunderstorm5 = 0;
    var snow5 = 0;
    var temps5 = [];
    var humidities5 = [];


    for (var i = 0; i < res.list.length; i++) {
      localTime = res.list[i].dt; 
      localTime = new Date(localTime * 1000); // converts to local time
      
      // tomorrow
      if (localTime >= tomorrow  && localTime < secondDay ) {
        if (res.list[i].weather[0].main === "Clear") {
          clear1++;
        } else if (res.list[i].weather[0].main === "Clouds") {
          clouds1++;
        } else if (res.list[i].weather[0].main === "Rain") {
          rain1++; 
        } else if (res.list[i].weather[0].main === "Thunderstorm") {
          thunderstorm1++; 
        }
        else if (res.list[i].weather[0].main === "Snow") {
          snow1++; 
        }
        temps1.push(res.list[i].main.temp)
        humidities1.push(res.list[i].main.humidity);

      }
      // secondDay
      else if (localTime >= secondDay  && localTime < thirdDay) {
        if (res.list[i].weather[0].main === "Clear") {
          clear2++;
        } else if (res.list[i].weather[0].main === "Clouds") {
          clouds2++;
        } else if (res.list[i].weather[0].main === "Rain") {
          rain2++; 
        } else if (res.list[i].weather[0].main === "Thunderstorm") {
          thunderstorm2++; 
        }
        else if (res.list[i].weather[0].main === "Snow") {
          snow2++; 
        }

        temps2.push(res.list[i].main.temp)
        humidities2.push(res.list[i].main.humidity);
      }
      // third
      else if (localTime >= thirdDay  && localTime < fourthDay) {
        if (res.list[i].weather[0].main === "Clear") {
          clear3++;
        } else if (res.list[i].weather[0].main === "Clouds") {
          clouds3++;
        } else if (res.list[i].weather[0].main === "Rain") {
          rain3++; 
        } else if (res.list[i].weather[0].main === "Thunderstorm") {
          thunderstorm3++; 
        }
        else if (res.list[i].weather[0].main === "Snow") {
          snow3++; 
        }

        temps3.push(res.list[i].main.temp)
        humidities3.push(res.list[i].main.humidity);
      }
      // fourth
      else if (localTime >= fourthDay  && localTime < fifthDay) {
        if (res.list[i].weather[0].main === "Clear") {
          clear4++;
        } else if (res.list[i].weather[0].main === "Clouds") {
          clouds4++;
        } else if (res.list[i].weather[0].main === "Rain") {
          rain4++; 
        } else if (res.list[i].weather[0].main === "Thunderstorm") {
          thunderstorm4++; 
        }
        else if (res.list[i].weather[0].main === "Snow") {
          snow4++; 
        }

        temps4.push(res.list[i].main.temp)
        humidities4.push(res.list[i].main.humidity);
      }
      // fifth
      else if (localTime >= fifthDay) {
        if (res.list[i].weather[0].main === "Clear") {
          clear5++;
        } else if (res.list[i].weather[0].main === "Clouds") {
          clouds5++;
        } else if (res.list[i].weather[0].main === "Rain") {
          rain5++; 
        } else if (res.list[i].weather[0].main === "Thunderstorm") {
          thunderstorm5++; 
        }
        else if (res.list[i].weather[0].main === "Snow") {
          snow5++; 
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

    
    weatherIcon(clear1, clouds1, rain1, snow1, thunderstorm1, $(".icon1"));
    weatherIcon(clear2, clouds2, rain2, snow2, thunderstorm2, $(".icon2"));
    weatherIcon(clear3, clouds3, rain3, snow3, thunderstorm3, $(".icon3"));
    weatherIcon(clear4, clouds4, rain4, snow4, thunderstorm4, $(".icon4"));
    weatherIcon(clear5, clouds5, rain5, snow5, thunderstorm5, $(".icon5"));
    

    
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
function weatherIcon(clear, cloudy, rain, snow, thunderstorm, element) {
  element.empty();
  var ext = "";
  if (snow) {
    ext = "13d@2x.png";
  } else if (thunderstorm) {
    ext = "11d@2x.png";
  } else if(rain) {
    ext = "09d@2x.png";
  } else if (cloudy > clear) {
    ext = "03d@2x.png"; 
  } else if(clear > 2 && cloudy > 2) {
    ext = "02d@2x.png";
  } else {
    ext = "01d@2x.png";
  }

  element.append(
    $("<img>").attr({src: `http://openweathermap.org/img/wn/${ext}`, width: "50px"})
  );  

}


$(document).on("click", ".searched-cities", searchPastChoice);

function searchPastChoice(e) {
  
  var searchLocation = $(this).text();
  
  var curWeatherURL;
  var forecastURL;

  if (!searchLocation.match(zipRegex)) {
    curWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchLocation + "&units=imperial&appid=ea61de219a59abe630bd0cdab605c61a";
    forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchLocation + "&appid=ea61de219a59abe630bd0cdab605c61a&units=imperial";
  } else if (searchLocation.match(zipRegex)) {
    curWeatherURL = "https://api.openweathermap.org/data/2.5/weather?zip=" + searchLocation + "&appid=ea61de219a59abe630bd0cdab605c61a&units=imperial";
    forecastURL = "https://api.openweathermap.org/data/2.5/forecast?zip=" + searchLocation + "&appid=ea61de219a59abe630bd0cdab605c61a&units=imperial"
  }
  
  getCurrentWeather(curWeatherURL);
  getForecast(forecastURL);
}