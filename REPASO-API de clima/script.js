
let url = "https://api.openweathermap.org/data/2.5/weather";
let apiKey = "21be3df355ea83f6395361b36c968cd3";
let diferenciaGrados = 273.15;






document.getElementById("botonBusqueda").addEventListener("click", ()=>{
    const ciudad = document.getElementById("ciudadEntrada").value
    if(ciudad){
        fetchDatosClima(ciudad)
    }
})    

function fetchDatosClima(ciudad){
    fetch(`${url}?q=${ciudad}&appid=${apiKey}`)
    .then(response => response.json())
    .then(response => mostrarDatos(response))
}

function mostrarDatos(response){
    const datosClima = document.getElementById("datosClima")
    datosClima.innerHTML = ""

    const ciudadNombre = response.name
    const paisNombre = response.sys.country
    const humedad = response.main.humidity
    const temperatura = response.main.temp
    const descripcion = response.weather[0].description
    const icono = response.weather[0].icon

    const ciudadTitulo = document.createElement("h2")
    ciudadTitulo.textContent = `${ciudadNombre}, ${paisNombre}`

    const humedadInfo = document.createElement("p")
    humedadInfo.textContent = `La humedad es de ${humedad}%`

    const temperaturaInfo = document.createElement("p")
    temperaturaInfo.textContent = `La temperatura es de ${Math.floor(temperatura - diferenciaGrados)}°C`

    const iconoInfo = document.createElement("img")
    iconoInfo.src = `https://openweathermap.org/img/wn/${icono}@2x.png`

    const descripcionInfo = document.createElement("p")
    descripcionInfo.textContent = `La descripción meteorólogica es: ${descripcion}`

    datosClima.appendChild(ciudadTitulo);
    datosClima.appendChild(temperaturaInfo);
    datosClima.appendChild(humedadInfo);
    datosClima.appendChild(iconoInfo);
    datosClima.appendChild(descripcionInfo);
}
