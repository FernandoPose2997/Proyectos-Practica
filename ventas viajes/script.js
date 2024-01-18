import { barcelona, roma, paris, londres} from "./ciudades.js"

//obtener elementos del DOM
let enlaces = document.querySelectorAll("a");
let tituloElemento = document.getElementById("titulo");
let subtituloElemento = document.getElementById("subtitulo");
let parrafoElemento = document.getElementById("parrafo");

//Agregar evento a cada enlace
enlaces.forEach(function (enlace){
    enlace.addEventListener("click", function(){      
        enlaces.forEach(function (enlace){             //Remover la clase active de los enlaces
            enlace.classList.remove("active");
        });
    
    this.classList.add("active"); //Agregar la clase active al enlace actual

    //Obtener el contenido correspondiente segun el enlace
    let contenido = obtenerContenido(this.textContent)

    //Mostrar el contenido del enlace en el DOM
    tituloElemento.innerHTML = contenido.titulo
    subtituloElemento.innerHTML = contenido.subtitulo
    parrafoElemento.innerHTML = contenido.parrafo
    });
});

//Funcion para informacion correcta

function obtenerContenido(enlace){
    let contenido ={
        "Barcelona": barcelona,
        "Roma": roma,
        "París": paris,
        "Londres": londres,
    }; return contenido [enlace];
}