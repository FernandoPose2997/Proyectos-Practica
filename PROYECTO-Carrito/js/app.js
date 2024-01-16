//variables
const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const listaCursos = document.querySelector("#lista-cursos");
let articulosCarrito = [];

cargarEventListeners();
function cargarEventListeners() {
    //agregar un curso presionando "agregar al carrito"
    listaCursos.addEventListener("click", agregarCurso);

    //eliminar un curso del carrito
    carrito.addEventListener("click", eliminarCurso);

    //Muestra los cursos del LocalStorage
    document.addEventListener("DOMContentLoaded", () =>{
        articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carritoHTML();
    })

    //vaciar el carrito
    vaciarCarritoBtn.addEventListener("click",()=>{
       articulosCarrito = []; //reseteamos el arreglo
       limpiarHTML(); //eliminamos todo el HTML
    } )
}


//Funciones 
function agregarCurso(e) {
    e.preventDefault();

    if (e.target.classList.contains("agregar-carrito")){
        const cursoSeleccionado = e.target.parentElement.parentElement;
       leerDatosCurso(cursoSeleccionado);
    }
}

//elimina un curso del carrito
function eliminarCurso(e) {
    if(e.target.classList.contains("borrar-curso")){
        const cursoId = e.target.getAttribute("data-id");
        //elimina del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId);
        
        carritoHTML(); //iterar sobre el carrito y mostrar HTML actualizado
    }
}

//Lee el contenido del HTML al que le dimos click
function leerDatosCurso(curso){
    // console.log(curso);


//Crear un objeto con el contenido del curso
    const infoCurso = {
        imagen: curso.querySelector("img").src,
        titulo: curso.querySelector("h4").textContent,
        precio: curso.querySelector(".precio span").textContent,
        id: curso.querySelector("a").getAttribute("data-id"),
        cantidad: 1,
    }

    //revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some( curso => curso.id=== infoCurso.id);
    if(existe) {
        //actualizamos la cantidad
        const cursos = articulosCarrito.map(curso => {
            if(curso.id=== infoCurso.id){
                curso.cantidad++;
                return curso; //retorna el objeto duplicado
            } else {
                return curso; //retrona los obj no duplicados
            }
        });
        articulosCarrito = [...cursos];
    } else {
        //agregamos el curso al carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    //agrega elementos al carrito
   
    console.log(articulosCarrito);

    carritoHTML();
}

//Muestra el carrito de compas en el HTML
function carritoHTML () {

    //Limpiar el carrito
    limpiarHTML();

    //Recorre el carrito y genera el HTML
    articulosCarrito.forEach ( curso =>{
        const row = document.createElement("tr");
        row.innerHTML = `
            <td> <img src="${curso.imagen}" width="100"> </td>
            <td>${curso.titulo} </td>
            <td> ${curso.precio} </td>
            <td>${curso.cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${curso.id}"> x </a>
            </td>
        `;
        //Agrega el HTML del carrito en el tboody
        contenedorCarrito.appendChild(row);
    });

    //Agregar el carrito de compras al LocalStorage
    sincronizarStorage();
}

function sincronizarStorage() {
    localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}

//Elimina los cursos del HTML
function limpiarHTML(){
    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}