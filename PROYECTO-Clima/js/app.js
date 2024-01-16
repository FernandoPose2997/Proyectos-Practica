//Selectores
const container = document.querySelector(".container");
const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");

window.addEventListener("load", () => {
    formulario.addEventListener("submit", buscarClima);
}) 


function buscarClima(e){
    e.preventDefault();

    //Validar toda la informacion
    const ciudad = document.querySelector("#ciudad").value;
    const pais = document.querySelector("#pais").value;

    if(ciudad === "" || pais ===""){
        mostrarError("Ambos campos son obligatorios");
        
        return;
    }
    //Consultar la API
    consultarAPI(ciudad, pais);
}

function mostrarError(mensaje){
   
    const alerta = document.querySelector(".bg-red-100");

    //Crear alerta
    if(!alerta){
        const alerta = document.createElement('div');

        alerta.classList.add('bg-red-100', "border-red-400", "text-red-700", "px-4", "py-3", "rounded", "relative", "max-w-md", "mx-auto", "mt-6", "text-center" );

        alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">${mensaje}</span>
        `;

        container.appendChild(alerta);

        setTimeout(() =>{
            alerta.remove();
        }, 3000);
    }

}

function consultarAPI(ciudad, pais ) {


    const appId = '21be3df355ea83f6395361b36c968cd3';
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;
    
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {

            limpiarHtml();

            if(datos.cod === "404"){
                mostrarError("Ciudad no encontrada")
                return;
            }
            //Imprime la respeusta en el HTML
            mostrarClima(datos);
        })
}

function mostrarClima(datos){
    const {name, main: {temp, temp_max, temp_min}} = datos;

    const centigrados = kelvinCentigrados(temp);
    const max= kelvinCentigrados(temp_max);
    const min = kelvinCentigrados(temp_min);

    const nombreCiudad = document.createElement("p");
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add("font-bold", "text-2zl");

    const actual = document.createElement("p");
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add("font-bold", "text-6xl");

    const tempMaxima = document.createElement("p");
    tempMaxima.innerHTML = ` Maxima: ${max} &#8451;`;
    tempMaxima.classList.add("text-xl");

    const tempMinima = document.createElement("p");
    tempMinima.innerHTML = `Minima: ${min} &#8451;`;
    tempMinima.classList.add("text-xl");

    const resultadoDiv = document.createElement("div");
    resultadoDiv.classList.add("text-center", "text-white");
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);

    resultado.appendChild(resultadoDiv);
    
}

function kelvinCentigrados(grados){
    return Math.round(grados - 273.15);
}

function limpiarHtml(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}
