//VARIABLES
const formulario = document.querySelector("#formulario");
const listaTweets = document.querySelector("#lista-tweets");
let tweets = []; //arreglo donde almacenar los tweets

//EVENT LISTENERS
EventListener ();

function EventListener () {
    formulario.addEventListener("submit", agregarTweet); //Cuando el usuario agrega un tweet

    //Cuando el documento esta listo
    document.addEventListener("DOMContentLoaded", ()=> {
        tweets = JSON.parse(localStorage.getItem("tweets")) || [];
        crearHTML();
    }); 
}

//FUNCIONES
function agregarTweet(e) {
    e.preventDefault();

    //textaera donde el usuario escribe
    const tweet = document.querySelector('#tweet').value;
    const tweetObj = {
        id: Date.now(),
        tweet: tweet,

    }
    //validar
    if(tweet === '') {
        mostrarError("El mensaje no puede estar vacio");
    } 
    else {
        tweets = [...tweets, tweetObj];
    }
    crearHTML ();

    //reomocar el formulario
    formulario.reset();
}

function mostrarError (error) {
    const mensajeError = document.createElement("p");
    mensajeError.textContent = error;
    mensajeError.classList.add("error");

    //Insertar en el contenido
    const contenido = document.querySelector("#contenido");
    contenido.appendChild(mensajeError);

    //elimina la alerta despues de 3 segundos
    setTimeout(() => {
        mensajeError.remove();
    }, 3000);
}

//muestra un listado de los Tweets
function crearHTML() {
    limpiarHTML();

    if (tweets.length > 0){
        tweets.forEach(tweet =>{

            const btnEliminar = document.createElement("a");//Agregar un boton de eliminar
            btnEliminar.classList.add("borrar-tweet");
            btnEliminar.innerText = "X";

            //Añadir funcion de eliminar al boton
            btnEliminar.onclick = () =>{
                borrarTweet(tweet.id);
            }

             const li = document.createElement("li"); //crear el HTML

            li.innerText = tweet.tweet; //añadir el texto

            li.appendChild(btnEliminar);//Asignar el boton

            listaTweets.appendChild(li); //insertarlo en el HTML
        })
    }
    sincronizarStorage();
}

 //Agrega los Tweets actuales al LocalStorage
 function sincronizarStorage() {
    localStorage.setItem("tweets", JSON.stringify(tweets));
}

//Elimina un tweet
function borrarTweet(id){
    tweets = tweets.filter( tweet => tweet.id !== id);
    crearHTML();
}

//Limpiar el HTML
function limpiarHTML () {
    while( listaTweets.firstChild) {
        listaTweets.removeChild(listaTweets.firstChild);
    }
}