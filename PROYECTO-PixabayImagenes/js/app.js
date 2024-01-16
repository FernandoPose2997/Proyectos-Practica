
const resutlado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");
const paginacionDiv = document.querySelector("#paginacion");

const registroPorPaginas = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () =>{
    formulario.addEventListener("submit" ,validarFormulario);
}

function validarFormulario(e){
    e.preventDefault();
    
    const terminoBusqueda = document.querySelector("#termino").value;
    
    if(terminoBusqueda === ""){
        mostrarAlerta("agrega un termino de busqueda");
        return;
    }

    buscarImagenes();
}

function mostrarAlerta(mensaje){
    const existeAlerta = document.querySelector(".bg-red-100");

    if(!existeAlerta){
        const alerta = document.createElement("p");
        alerta.classList.add("bg-red-100", "border-red-400", "text-red-700", "px-4", "py-3", "rounded", "mx-auto", "mt-6", "text-center");
        alerta.innerHTML = `
        <strong class"font-bold">Error!</strong>
        <span class="block sm:inline">${mensaje}</span>
        `;
    
        formulario.appendChild(alerta);
    
        setTimeout(()=>{
            alerta.remove();
        }, 3000);
    }
}

function buscarImagenes(){

    const termino = document.querySelector('#termino').value;
    
    const key = "39568597-ae212300a47d46a166d8ab53a";
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registroPorPaginas}&page=${paginaActual}`;
    
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            totalPaginas = calcularPaginas(resultado.totalHits);
            mostrarImagenes(resultado.hits)
        })
}

//Generador que va a registrar la cantidad de elementos de acuerdo a las paginas
function *crearPaginador(total){
    for(let i = 1; i <= total; i++){
        yield i;
    }
}

function calcularPaginas(total){
    return parseInt(Math.ceil(total / registroPorPaginas));
}

function mostrarImagenes(imagenes){
    console.log(imagenes);

    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }

     imagenes.forEach( imagen => {

        const { likes, views, previewURL, largeImageURL } = imagen;
        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 mb-4 p-3">
                <div class="bg-white ">
                    <img class="w-full" src=${previewURL} alt={tags} />
                    <div class="p-4">
                        <p class="card-text">${likes} Me Gusta</p>
                        <p class="card-text">${views} Vistas </p>
        
                        <a href=${largeImageURL} 
                        rel="noopener noreferrer" 
                        target="_blank" class="bg-blue-800 w-full p-1 block mt-5 rounded text-center font-bold uppercase hover:bg-blue-500 text-white">Ver Imagen</a>
                    </div>
                </div>
            </div>
         `;
    });
    
    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }

    imprimirPaginador();
}    

function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas);
    
    while( true ) {
        const {value, done } = iterador.next();

        if(done) return;

        // Crear botón de sig
        const boton = document.createElement('a');
        boton.href = "#";
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'mx-auto', 'mb-5', 'font-bold', 'rounded');

        boton.onclick = () => {
            paginaActual = value;
            buscarImagenes();
        }
        paginacionDiv.appendChild(boton);
    }
}