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

let city5DayDiv;
let city5DayPDate;
let city5DayPSun;
let city5DayPTemp;
let city5DayPHumid;

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
    const cityBasicWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityTrigger +"&units=imperial&appid=508f9f1ec1873e44a9f17ab4f5c43087";
    
    fetch(cityBasicWeatherUrl)
        .then(function(response){
            if(response.status===404){
                alert("not a valid city");
            } 
            return response.json();
        })
        .then(function(data){

            if(storageArray.indexOf(data.name)===-1){
                storageGet(data.name);
            }

            storageArrayFn(data);

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
                sunSpot.textContent = String.fromCodePoint(0x2601)
            } else {
                sunSpot.textContent =  String.fromCodePoint(0x1F937)
            }
            
            selectedCityTemp.innerHTML = "Temperature: " + data.main.temp + "° Farenheit";
            selectedCityHumid.textContent = "Humidity: " + data.main.humidity + "% Humidity";
            selectedCityWind.textContent = "Wind Speed: " + data.wind.speed + " mph";

            // -------------------UV functionality-----------------------`
            const cityUvUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + data.coord.lat + "&lon=" + data.coord.lon+ "&appid=508f9f1ec1873e44a9f17ab4f5c43087"

            fetch(cityUvUrl)
                .then(function(response){
                    return response.json();
                })
                .then(function(data){
                    const cityUv = data.value;
                    selectedCityUv.textContent = "UV Index: " + cityUv;

                    if(cityUv<3){
                        selectedCityUv.setAttribute("style", "background: green")
                    } else if (cityUv < 5 && cityUv >= 3){
                        selectedCityUv.setAttribute("style", "background: yellow");
                    } else if (cityUv < 11 && cityUv >= 5) {
                        selectedCityUv.setAttribute("style", "background: red")
                    } else if (cityUv >= 11){
                        selectedCityUv.setAttribute("style", "background: black; color: white");
                        selectedCityUv.textContent = "UV Index: " + cityUv + " holy crap! go inside!"
                    }  
                })

        });
    
        //------------------5 day forcast-------------------------- 
    const city5DayCall = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityTrigger + "&units=imperial&appid=508f9f1ec1873e44a9f17ab4f5c43087"
    fetch(city5DayCall)
        .then(function(responce){
            return responce.json();
        })
        .then(function(data){
            const city5Day = data.list;

            const city5DayPDateClass = document.querySelectorAll(".fiveDayDate")
            const city5DayPSunClass = document.querySelectorAll(".fiveDaySun")
            const city5DayPTempClass = document.querySelectorAll(".fiveDayTemp")
            const city5DayPHumidClass = document.querySelectorAll(".fiveDayHumid")

            let city5DayIndex = 0;

            for (let i = 0; i < city5Day.length ; i++) {
                cityDays = city5Day[i];
                
                if(moment.unix(cityDays.dt).format("HH")==="13"|| moment.unix(cityDays.dt).format("HH")==="14"){

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
                        city5DayPSunClass[city5DayIndex].textContent = String.fromCodePoint(0x2601)
                    } else {
                        city5DayPSunClass[city5DayIndex].textContent = String.fromCodePoint(0x1F937)
                    }
                    
                    city5DayPDateClass[city5DayIndex].textContent = moment.unix(cityDays.dt).format("MM/DD/YYYY");
                    city5DayPTempClass[city5DayIndex].textContent = "Temp: " + cityDays.main.temp;
                    city5DayPHumidClass[city5DayIndex].textContent = "Humidity: " + cityDays.main.humidity;

                    city5DayIndex++;
                }
            }   
        })

}

//-----------getting&setting local storage----------------
let storageArray = JSON.parse(localStorage.getItem("storageArray"))||[];

let storageGet = function(name){
    const button = document.createElement("li");
    button.textContent = name.replaceAll("+", " ");
    button.setAttribute("class", "cityLi");
    citiesUl.appendChild(button);
}

const storageArrayFn = function(data){
    if(storageArray.indexOf(data.name) !== -1){
        return;
    }
    if(data.cod===200){
        storageArray.push(data.name);
        localStorage.setItem("storageArray", JSON.stringify(storageArray));
    }
}

let appendCount = 0;
//-------------------search button--------------------
searchSidebar.addEventListener("click", function(event){
    event.preventDefault();
    const citySearchClean = citySearch.value.trim("").replaceAll(" ", "+").toLowerCase();
    if(event.target.matches("#buttonSearch")){
        if(citySearchClean===""){
            return
        };
        if(appendCount===0){
            render5Day()
        };
        cityWeatherApi(citySearchClean);
        citySearch.value = "";
        
        appendCount = 1;

//-----------------saved city li buttons-------------
    } else if (event.target.matches(".cityLi")) {
        cityWeatherApi(event.target.textContent);

        if(appendCount===0){
            render5Day()
        };

        appendCount = 1;
    }
});

for (let i = 0; i < storageArray.length; i++) {
    storageGet(storageArray[i]);  
}
