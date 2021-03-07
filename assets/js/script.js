const citySearch = document.querySelector("#citySearch");

const searchBtn = document.querySelector("#buttonSearch");
const searchSidebar = document.querySelector("#searchSidebar");
const citiesUl = document.querySelector("#cities");

const selectedCityName = document.querySelector("#selectedCityName");
const selectedCityTemp = document.querySelector("#selectedCityTemp");

const selectedCityHumid = document.querySelector("#selectedCityHumid");
const selectedCityWind = document.querySelector("#selectedCityWind");
const selectedCityUv = document.querySelector("#selectedCityUv");

const fiveDayWrap = document.querySelector("#fiveDayWrap");

let cityLi;

let appendCount = 0;

let city5DayDiv;
let city5DayPDate;
let city5DayPSun;
let city5DayPTemp;
let city5DayPHumid;

const testString = "this is a  sentance"
console.log(testString.replace(" ", "+"));

const kToF = function(k){
    return Math.round((k-273.15) * 9/5 +32);
};

const render5Day = function(){
for (let i = 0; i < 5; i++) {
        city5DayDiv = document.createElement("div");
        city5DayPDate = document.createElement("p");
        city5DayPSun = document.createElement("p");
        city5DayPTemp = document.createElement("p");
        city5DayPHumid = document.createElement("p");

        city5DayDiv.setAttribute("class", "fiveDayCard");
        city5DayPDate.setAttribute("class", "fiveDayDate");
        city5DayPSun.setAttribute("class", "fiveDaySun");
        city5DayPTemp.setAttribute("class", "fiveDayTemp");
        city5DayPHumid.setAttribute("class", "fiveDayHumid");

        fiveDayWrap.appendChild(city5DayDiv);
        city5DayDiv.appendChild(city5DayPDate);
        city5DayDiv.appendChild(city5DayPSun);
        city5DayDiv.appendChild(city5DayPTemp);
        city5DayDiv.appendChild(city5DayPHumid);
    }
                    
}

const cityWeatherApi = function(cityTrigger){
    //need to replace '_' spaces with +
    const cityBasicWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityTrigger +"&appid=508f9f1ec1873e44a9f17ab4f5c43087";
    
    fetch(cityBasicWeatherUrl)
        .then(function(response){
            if(response.status===404){
                return
            } 
            return response.json();
        })
        //bad search------------
        .then(function(data){
            if(data===undefined){
                citySearch.value = "";
                return
            }
            //----------TODO localStorage---------------
            citySearch.value = "";
            // console.log(data)
            const newLi = document.createElement("li");
            newLi.setAttribute("class", "cityLi");
            cityLi = document.querySelector(".cityLi");
            newLi.textContent = data.name;
            citiesUl.appendChild(newLi);

            const msToMph = function(w){
                return Math.round(w * 2.23694);
            }

            selectedCityName.innerHTML = data.name + " " + moment.unix(data.dt).format("MM/DD/YYYY") + " <span id='sunSpot'> </span>";
            
            const sunSpot = document.querySelector("#sunSpot");
            
            if (data.weather[0].main==="Clear"){
                sunSpot.textContent =  String.fromCodePoint(0x1F31E)
            } else if(data.weather[0].main==="Thunderstorm"){
                sunSpot.textContent =  String.fromCodePoint(0x1F329)
            } else if (data.weather[0].main==="Drizzle"){
                sunSpot.textContent =  String.fromCodePoint(0x1F328)
            } else if (data.weather[0].main==="Rain"){
                sunSpot.textContent =  String.fromCodePoint(0x1F327)
            } else if (data.weather[0].main==="Snow"){
                sunSpot.textContent = String.fromCodePoint(0x1F325)
            } else if (data.weather[0].main==="Clouds"){
                sunSpot.textContent = String.fromCodePoint(0x1F325)
            } else {
                sunSpot.textContent =  String.fromCodePoint(0x1F937)
            }
            
            
            selectedCityTemp.innerHTML = "Temperature: " + kToF(data.main.temp) + "° Farenheit";
            selectedCityHumid.textContent = "Humidity: " + data.main.humidity + "% Humidity";
            selectedCityWind.textContent = "Wind Speed: " + msToMph(data.wind.speed) + " mph";

            const cityUvUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + data.coord.lat + "&lon=" + data.coord.lon+ "&appid=508f9f1ec1873e44a9f17ab4f5c43087"

            fetch(cityUvUrl)
                .then(function(response){
                    return response.json()
                })
                .then(function(data){
                    const cityUv = data.value;
                    // console.log(data);
                    // console.log(cityUv);
                    selectedCityUv.textContent = "UV Index: " + cityUv;


                    //this is not working correctly
                    //green is not rendering a
                    //once it does render a color it stays that color even if value changes toa lower value
                    if(cityUv<2){
                        selectedCityUv.setAttribute("style", "background: green")
                    } else if (cityUv >= 3 && cityUv < 5){
                        selectedCityUv.setAttribute("style", "background: yellow");
                    } else if (cityUv >= 5 && cityUv < 11) {
                        selectedCityUv.setAttribute("style", "background: red")
                    } else if (cityUv >= 11){
                        selectedCityUv.setAttribute("style", "background: black; color: white");
                        selectedCityUv.textContent = "UV Index: " + cityUv + " holy crap! go inside!"
                    }  
                })

        });
    
        //------------------5 day forcast--------------------------
        //specify query toooooo much data
    const city5Day = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityTrigger + "&appid=508f9f1ec1873e44a9f17ab4f5c43087"
    fetch(city5Day)
        .then(function(responce){
            return responce.json();
        })
        .then(function(data){
            // console.log(data)
            const city5Day = data.list;

            const city5DayPDateClass = document.querySelectorAll(".fiveDayDate")
            const city5DayPSunClass = document.querySelectorAll(".fiveDaySun")
            const city5DayPTempClass = document.querySelectorAll(".fiveDayTemp")
            const city5DayPHumidClass = document.querySelectorAll(".fiveDayHumid")

            let city5DayIndex = 0;

            console.log(city5Day.length)
            for (let i = 0; i < city5Day.length ; i++) {
                cityDays = city5Day[i];

                if(moment.unix(cityDays.dt).format("HH")==="13"){
                    console.log(moment.unix(cityDays.dt));
                    console.log(cityDays.main.temp);
                    console.log(city5DayIndex);
                    
                    //because city5Day is a list of 40 things 
              
                    // need to prevent the new elements being created
                    // appendCount makes the line below "rain" become undefined
                    console.log(cityDays.weather[0].main);
                    // could cheat it and make elements HTML and just change values
                    if (cityDays.weather[0].main==="Clear"){
                        city5DayPSunClass[city5DayIndex].textContent = String.fromCodePoint(0x1F31E)
                    } else if(cityDays.weather[0].main==="Thunderstorm"){
                        city5DayPSunClass[city5DayIndex].textContent = String.fromCodePoint(0x1F329)
                    } else if (cityDays.weather[0].main==="Drizzle"){
                        city5DayPSunClass[city5DayIndex].textContent = String.fromCodePoint(0x1F328)
                    } else if (cityDays.weather[0].main==="Rain"){
                        city5DayPSunClass[city5DayIndex].textContent = String.fromCodePoint(0x1F327)
                    } else if (cityDays.weather[0].main==="Snow"){
                        city5DayPSunClass[city5DayIndex].textContent = String.fromCodePoint(0x2747)
                    } else if (cityDays.weather[0].main==="Clouds"){
                        city5DayPSunClass[city5DayIndex].textContent = String.fromCodePoint(0x1F325)
                    } else {
                        city5DayPSunClass[city5DayIndex].textContent = String.fromCodePoint(0x1F937)
                    }
                    
                    city5DayPDateClass[city5DayIndex].textContent = moment.unix(cityDays.dt).format("MM/DD/YYYY");
                    city5DayPTempClass[city5DayIndex].textContent = "Temp: " + kToF(cityDays.main.temp);
                    city5DayPHumidClass[city5DayIndex].textContent = "Humidity: " + cityDays.main.humidity;
                    
                    city5DayIndex++;
                }
            }   
        })

}


searchSidebar.addEventListener("click", function(event){
    event.preventDefault();
    if(event.target.matches("#buttonSearch")){
        if(citySearch.value===""){
            return
        }
        if(appendCount===0){
            render5Day()
        }
        cityWeatherApi(citySearch.value);
        appendCount = 1;

    } else if (event.target.matches(".cityLi")) {
        cityWeatherApi(event.target.textContent);
        // appendCount++;
    }
});


/* TODO

-deal with spaces in search input

-localeStorage

-stop multiple 5 days

-stop repeat citys under search

*/