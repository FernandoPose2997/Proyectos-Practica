
//constructores
function Seguro(marca, year, tipo){
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}
//Realiza la cotizacion con los datos
Seguro.prototype.cotizarSeguro = function () {
    /*   1= americano 1.15 
         2= asiatico 1.05
         3 = europeo 1.35 */

    let cantidad;
    const base = 2000;

    switch(this.marca) {
        case "1":
            cantidad = base * 1.15;
            break;
        case "2":
            cantidad = base * 1.05;
            break;
        case "3":
            cantidad = base * 1.35;
            break;
        default:
            break;
    }

    //Leer el año(cada año de antiguedad el costo se reduce un 3%)
    const diferencia = new Date().getFullYear() - this.year;
    cantidad -= ((diferencia * 3) * cantidad) / 100;

    /*Si el seguro es basico se multiplica por un 30%+
    Si el seguro es completo se multiplica por un 50%+ */
    if(this.tipo ==="basico"){
        cantidad *= 1.30;
    } else {
        cantidad *= 1.50;
    }return cantidad;
}


function UI(){}

//Llena las opciones de los años
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear(),
        min = max - 20;    
    
    const selectYear = document.querySelector("#year");
    
    for(let i = max; i > min; i--){
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

//muestra alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) =>{
    const div = document.createElement("div");

    if(tipo === "error"){
        div.classList.add("error");
    } else {
        div.classList.add("correcto");
    }
    div.classList.add("mensaje", "mt-10");
    div.textContent = mensaje;

    //Insertar en el HTML
    const formulario = document.querySelector("#cotizar-seguro");
    formulario.insertBefore(div, document.querySelector("#resultado"));

    setTimeout (() => {
        div.remove();
    }, 2000);
}

UI.prototype.mostrarResultado = (total, seguro) =>{

    const {marca, year, tipo} = seguro;
    let textoMarca ;
    
    switch(marca){
        case "1":
            textoMarca = "Americano";
            break;
        case "2":
            textoMarca = "Asiatico";
            break;
        case "3":
            textoMarca = "Europeo";
            break;
            default:
                break;
    }

    //Crear el resultado
    const div = document.createElement("div");
    div.classList.add("mt-10");
    div.innerHTML = `
        <p class="header"> Tu resumen </p>
        <p class="font-blod"> Marca: <span class="font-normal"> ${textoMarca}</p>
        <p class="font-blod"> Año: <span class="font-normal"> ${year}</p>
        <p class="font-blod"> Tipo de Seguro: <span class="font-normal"> ${tipo}</p>
        <p class="font-blod"> Total: <span class="font-normal"> $${total}</p>
    `;
    const resultadoDiv = document.querySelector("#resultado");

    //Mostrar el spinner
    const spinner = document.querySelector("#cargando");
    spinner.style.display = "block";

    setTimeout(() => {
        spinner.style.display = "none"; //Se borra el spinneer
        resultadoDiv.appendChild(div); // Se muestra el resultado
    }, 2000);
}

//instanciar UI
const ui = new UI();


document.addEventListener("DOMContentLoaded",() => {
    ui.llenarOpciones(); //Llena el select con los años
})

eventListeners();
function eventListeners() {
    const formulario = document.querySelector("#cotizar-seguro");
    formulario.addEventListener("submit", cotizarSeguro);
}

function cotizarSeguro(e){
    e.preventDefault();

    //Leer la marca seleccionada
    const marca = document.querySelector("#marca").value;

    //Leer el año seleccionado
    const year = document.querySelector("#year").value;
    //Leer el tipo de cobertura
    const tipo = document.querySelector("input[name='tipo']:checked").value;
   if(marca === ""||year === "" || tipo === "") {
        ui.mostrarMensaje("Todos los campos son obligatorios", "error");
   } else {
        ui.mostrarMensaje("Cotizando", "correcto");
   }

   //Ocultar las cotizaciones previas
   const resultados = document.querySelector("#resultado div");
   if (resultados != null){
    resultados.remove();
   }

   //instanciar el seguro
   const seguro = new Seguro(marca, year, tipo);
   const total = seguro.cotizarSeguro();
   
   

   //Utilizar el prototype que va a cotizar
   ui.mostrarResultado(total, seguro);
}