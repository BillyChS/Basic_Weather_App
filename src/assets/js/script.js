
let API_Key = '9493c295f193a7284bd484aee2d0c7ed'

let timeZone = ''
let region = document.querySelector("#regions").value
let countryCode = document.querySelector("#countries").value


document.querySelector("#regions").addEventListener('change',function() { 
    region = document.querySelector("#regions").value
    getCountries(region)
 })
 function getCountries(region){

    let contriesSelect = document.querySelector("#countries")
    let url = `https://restcountries.com/v3.1/region/${region}`

    const xhr = new XMLHttpRequest();
    xhr.open('GET',url,true)
    let data = null
    xhr.onload = function() { 
        if(xhr.status == 200){
            data = JSON.parse(xhr.response)
            contriesSelect.innerHTML = ''
            data.forEach(element => {
                contriesSelect.innerHTML += `<option value="${element.cca2}">${element.name.common}</option>`
                console.log(element.cca2)
            });
        }
     }
     xhr.send()
}

 document.querySelector('#countries').addEventListener('change',function(){
    countryCode = document.querySelector("#countries").value
 })



function getCitiesByCountry(countryCode){

    let url = 'https://countriesnow.space/api/v0.1/countries/cities'
    let xhr = new XMLHttpRequest();
    let data = {'country':countryCode};

    let cities = null

    xhr.open('POST',url,true)
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload= function(){
        if(xhr.status == 200){
            cities = JSON.parse(xhr.response)
            console.log(cities)
        }
    }

    xhr.send(JSON.stringify( data ));

}

document.querySelector("#showData").addEventListener('click',function(){
        //Setting the hour
        setInterval(()=> {

        },20000)

    let city = document.getElementById("data").value;
    let cityInformation = getCityInformation(countryCode,city);
    //let timezone = getTimezone() 
    //loadAreas()
});


//This functions works to get the latitude and longitu of the city, after that we use those dates to
//get the information of the climate and the timzezone

function getCityInformation(countryCode,city){

    const timezone = document.querySelector("#time-zone")
    const countryE = document.querySelector("#country")
    let units = document.querySelector("#units").value;

    let access_key = '4815e45e63ff7432b2a1dac98db7b2e4'
    let geyLat_and_log = `http://api.positionstack.com/v1/forward?
    access_key=${access_key}&query=1600%20Pennsylvania%20Ave%20NW,%20Washington%20DC`

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${API_Key}`

    //let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_Key}`
    //Create XHR(XMLHttpRequest) Object
    const xhr = new XMLHttpRequest();

    let data = null
    xhr.open('GET',url,true);
    //Getting the latitude and longitude of the city
    xhr.onload = function(){
        if(xhr.status == 200 ){
            data = JSON.parse(xhr.response)
            getData(data.coord.lat,data.coord.lon,units)
            timezone.innerHTML = `${data.sys.country}/${data.name}`
            countryE.innerHTML = `${data.sys.country}`
        }else{
            alert("No se encontro la ciudad ")
        }
    }
    xhr.send()
}


function getTimezone(timezone){

    const timeE = document.querySelector("#time")
    const dateE = document.querySelector("#date")

    let timeZonesUrl = `https://worldtimeapi.org/api/timezone/${timezone}`


    const xhr = new XMLHttpRequest();

    xhr.open('GET',timeZonesUrl,true)

    xhr.onload = function(){
        if(xhr.status == 200 ){

            let data = JSON.parse(xhr.response)
            
            let weekDays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
            let yearMoths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dec']


            let timeF = data.datetime

            timeF = timeF.split('T')

            //getting the date
            let dateNormalFormat = timeF[0].split('-')

            let month = dateNormalFormat[1]
            month = yearMoths[parseInt(month)-1]

            const day = dateNormalFormat[2]
            //IF IS MONDAY,TUESDAY,WEDNESDAY...
            let day_of_week = weekDays[data.day_of_week-1]

            
            //split the date for YYYY-MM-DD
            let timeNormalFormat = timeF[1].split('.')[0].split(':')

            
            const hour = timeNormalFormat[0]
            const minutes = timeNormalFormat[1]


            let hoursIn12HrFormat
            if(hour>=12){
                hoursIn12HrFormat = hour%12
            }else{
                hoursIn12HrFormat = hour
            }
            let ampm
            if(hour>=12){
                ampm='PM'
            }else{
                ampm='AM'
            }
            timeE.innerHTML = `${hoursIn12HrFormat}:${minutes} <span class="fs-1  am-pm">${ampm}</span>`
            dateE.innerHTML = `${day_of_week}, ${day} ${month}`

        }
    }
    xhr.send()

}


function getData(lat,lon,units){
    

    const currentWeatherItemE = document.querySelector("#current-weather-items")
    const currentTempEl = document.querySelector("#current-temp")
    const weatherForecast = document.querySelector("#weather-forecast")

      getWeatherData()
      function getWeatherData(){

        const xhr = new XMLHttpRequest();
        //URL
        let data = null

        let urlTimezoneApp = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&exclude=hourly,minutely&appid=${API_Key}`
        xhr.open('GET',urlTimezoneApp,true)
        xhr.onload = function(){
            if(xhr.status == 200){
                data = JSON.parse(xhr.response)
                console.log(data)
                getTimezone(data.timezone)
                currentWeatherItemE.innerHTML = `
                <div class="d-flex justify-content-between weather-item">
                    <div>Humity</div>
                    <div>${data.current.humidity} %</div>
                </div>
                <div class="d-flex justify-content-between weather-item">
                    <div>Pressure</div>
                    <div>${data.current.pressure}</div>
                </div>
                <div class="d-flex justify-content-between weather-item">
                    <div>Wind Speed</div>
                    <div>${data.current.wind_speed}</div>
                </div>
                <div class="d-flex justify-content-between weather-item">
                    <div>Sunrise</div>
                    <div>${window.moment(data.current.sunrise * 1000).format('HH:mm a') }</div>
                </div>
                <div class="d-flex justify-content-between weather-item">
                    <div>Sunset</div>
                    <div>${window.moment(data.current.sunset * 1000).format('HH:mm a') }</div>
                </div>`

                let unitsEl = ''
                if(units == 'metric'){
                    unitsEl = 'C'
                }else{
                    unitsEl = 'F'
                }

                currentTempEl.innerHTML= `
                    <img src="http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png" alt="icon">
                    <div class="other mx-3">
                        <div class="day p-2 rounded p-2 text-center">${window.moment(data.daily[0].dt * 1000).format('ddd')}</div>
                        <div class="temp pt-3 ">Night  ${data.daily[0].temp.night}&#176;${unitsEl}</div>
                        <div class="temp pt-3 ">Day  ${data.daily[0].temp.day}&#176;${unitsEl}</div>
                    </div>`

                let futureDays = ''
                data.daily.forEach((day,i) => {
                    if(i ==0 ){

                    }else{
                        futureDays +=`                   
                        <div class="mx-3 rounded-4  border border-white border-1 weather-forecast-item d-flex align-items-center justify-content-center">
                            <div class="day rounded p-2 mt-2 text-center">${window.moment(day.dt * 1000).format('ddd')}</div>
                                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="icon">
                                <div class="temp fw-light pt-3 ">Night  ${day.temp.night}&#176;${unitsEl}</div>
                            <div class="temp fw-light pt-3 ">Day  ${day.temp.day}&#176;${unitsEl}</div>
                        </div>`
                    }
                    
                });
                weatherForecast.innerHTML = futureDays
            }
        }
        xhr.send()

        }
}
    
