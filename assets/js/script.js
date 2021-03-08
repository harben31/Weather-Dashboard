//kinda BONUS
//prevent printin of bad searches

//BONUS
//make a cloudy and partially cloudy destinction
//limit how many tags are allowed under the search
//

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

const renderStorage = function(){
    if (localStorage.length !== 0){
        for (let i = 0; i < localStorage.length; i++) {
            const newLi = document.createElement("li");
            newLi.setAttribute("class", "cityLi");
            cityLi = document.querySelector(".cityLi");
            newLi.textContent = localStorage.getItem("city" + i);
            citiesUl.appendChild(newLi);
        }
    }
}
renderStorage();

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
                console.log("returned");
                return
            } else {
                
            }
            return response.json();
        })
        //bad search------------
        .then(function(data){
            if(data===undefined){
                return
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
                sunSpot.textContent = String.fromCodePoint(0x2601)
            } else {
                sunSpot.textContent =  String.fromCodePoint(0x1F937)
            }
            
            
            selectedCityTemp.innerHTML = "Temperature: " + data.main.temp + "° Farenheit";
            selectedCityHumid.textContent = "Humidity: " + data.main.humidity + "% Humidity";
            selectedCityWind.textContent = "Wind Speed: " + data.wind.speed + " mph";


            // -------------------UV functionality-----------------------
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
        //specify query toooooo much data
    const city5Day = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityTrigger + "&units=imperial&appid=508f9f1ec1873e44a9f17ab4f5c43087"
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
                    // console.log(moment.unix(cityDays.dt));
                    // console.log(cityDays.main.temp);
                    // console.log(city5DayIndex);
                    // console.log(cityDays.weather[0].main);

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

//-------------saving to localstorage---------
//good place for this function?
let cityStorageIndex = 0;
let saveSwitch = 0;

console.log(localStorage.key(0))
const save2Storage = function(){
    if(localStorage.length===0){
        console.log("storage empty")
        localStorage.setItem("city" + cityStorageIndex, citySearch.value.trim("").replaceAll(" ", "+").toLowerCase());
        let newLi = document.createElement("li");
        newLi.setAttribute("class", "cityLi");
        cityLi = document.querySelector(".cityLi");
        newLi.textContent = citySearch.value.trim("").toLowerCase();
        citiesUl.appendChild(newLi);
        cityStorageIndex++;
        return;
    };
    
    if (localStorage.length !== 0){
        //----------prevents duplicate city tags from printing-------
        cityStorageIndex = localStorage.length;
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            // console.log(key);
            let value = localStorage.getItem(key);
            // console.log(value)
            if(value===citySearch.value.trim("").replaceAll(" ", "+").toLowerCase()){
                // console.log("match" + value);
                saveSwitch = 1;
            } 
        }
        if (saveSwitch===1){
            console.log("switch " +  saveSwitch);
            saveSwitch = 0;
            return
        } else {
            console.log("switch else")
            localStorage.setItem("city" + cityStorageIndex, citySearch.value.trim("").replaceAll(" ", "+").toLowerCase())
            const newLi = document.createElement("li");
            newLi.setAttribute("class", "cityLi");
            cityLi = document.querySelector(".cityLi");
            newLi.textContent = citySearch.value.trim("").toLowerCase();
            citiesUl.appendChild(newLi);
            saveSwitch = 0;
        }
    }
}

let appendCount = 0;
//-------------------search button--------------------
searchSidebar.addEventListener("click", function(event){
    event.preventDefault();
    const citySearchClean = citySearch.value.trim("").replaceAll(" ", "+").toLowerCase();
    if(event.target.matches("#buttonSearch")){
        // console.log(citySearchClean);
        if(citySearchClean===""){
            return
        };
        if(appendCount===0){
            render5Day()
        };
        cityWeatherApi(citySearchClean);
        save2Storage();
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
