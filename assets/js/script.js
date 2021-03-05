const citySearch = document.querySelector("#citySearch");
const searchBtn = document.querySelector("#buttonSearch");
const searchSidebar = document.querySelector("#searchSidebar");
const citiesUl = document.querySelector("#cities");

const selectedCityName = document.querySelector("#selectedCityName");
const selectedCityTemp = document.querySelector("#selectedCityTemp");
const selectedCityHumid = document.querySelector("#selectedCityHumid");
const selectedCityWind = document.querySelector("#selectedCityWind");
const selectedCityUv = document.querySelector("#selectedCityUv");

const cityWeatherApi = function(){
    //need to replace '_' spaces with +
    const cityBasicWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch.value +"&appid=508f9f1ec1873e44a9f17ab4f5c43087";
    
    fetch(cityBasicWeatherUrl)
        .then(function(response){
            if(response.status===404){
                return
            } 
            return response.json();
        })
        .then(function(data){
            if(data===undefined){
                citySearch.value = "";
                return
            }
            console.log(data)
            const newLi = document.createElement("li");
            newLi.setAttribute("class", "cityLi");
            newLi.textContent = data.name;
            citiesUl.appendChild(newLi);

            const kToF = function(k){
                return Math.round((k-273.15) * 9/5 +32);
            }

            const msToMph = function(w){
                return Math.round(w * 2.23694);
            }

            selectedCityName.textContent = data.name;
            selectedCityTemp.textContent = "Temperature: " + kToF(data.main.temp) + "° Farenheit";
            selectedCityHumid.textContent = "Humidity: " + data.main.humidity + "% Humidity";
            selectedCityWind.textContent = "Wind Speed: " + msToMph(data.wind.speed) + " mph" ;

            const cityUvUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" + data.coord.lat + "&lon=" + data.coord.lon+ "&appid=508f9f1ec1873e44a9f17ab4f5c43087"

            fetch(cityUvUrl)
                .then(function(response){
                    return response.json()
                })
                .then(function(data){
                    const cityUv = data.value;
                    console.log(data);
                    console.log(cityUv);
                    selectedCityUv.textContent = "UV Index: " + cityUv;

                    if(cityUv<2){
                        selectedCityUv.setAttribute("style", "background: lightgreen")
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
    
}


searchSidebar.addEventListener("click", function(event){
    event.preventDefault();
    if(event.target.matches("#buttonSearch")){
        if(citySearch.value===""){
            return
        }
        cityWeatherApi();

    } else if (event.target.matches(".cityLi")) {
        console.log("city")
    }
});


/* TODO
-five day weather
    --append
    --style
    --data
    
-deal with spaces in search input

-localeStorage

-use the names on the aside li to call the populate function

-conditionals for weather emogis
*/