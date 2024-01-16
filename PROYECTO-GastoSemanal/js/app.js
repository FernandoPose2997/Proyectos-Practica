//Variables y selectores
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");


//Eventos de
eventListener();
function eventListener() {
    document.addEventListener("DOMContentLoaded", preguntarPresupuesto);

    formulario.addEventListener("submit", agregarGasto);
}
    


//Classes
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto]; 
        this.calcularRestante();
    }
    calcularRestante() {
        const gastado = this.gastos.reduce((total,gasto )=> total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }
    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto(cantidad){
        //extraer valor
        const  {presupuesto, restante} = cantidad;
        //agregar al HTML
        document.querySelector("#total").textContent = presupuesto;
        document.querySelector("#restante").textContent = restante;
    }
    imprimirAlerta(mensaje, tipo){
        //Crear el div
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("text-center", "alert");

        if(tipo === "error"){
            divMensaje.classList.add("alert-danger");
        } else {
            divMensaje.classList.add("alert-success");
        }
        //Mensaje de error
        divMensaje.textContent = mensaje;
        document.querySelector(".primario").insertBefore(divMensaje, formulario);
        setTimeout(() => {
            divMensaje.remove();
        }, 2500);
    }
    mostrarGastos(gastos){

        this.LimpiarHTML();//Elimina el HTML previo

        //Iterar sobre los gastos
        gastos.forEach(gasto => {
            const {nombre, cantidad, id} = gasto;
            //Crear un LI
            const nuevoGasto = document.createElement("li");
            nuevoGasto.className = "list-group-item d-flex justify-content-between align-items-center";
            nuevoGasto.dataset.id = id;
            //Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $${cantidad}</span> `;
            
            //boton de borrar el gasto
            const btnBorrar = document.createElement("button");
            btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
            btnBorrar.innerHTML = "Borrar &times";
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);
            


            //agregar al HTML
            gastoListado.appendChild(nuevoGasto);
        })
    }
    LimpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }
    actualizarRestante(restante){
        document.querySelector("#restante").textContent = restante;
    }
    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector(".restante");
        if((presupuesto /4)> restante){
            restanteDiv.classList.remove("alert-success", "alert-warning");
            restanteDiv.classList.add("alert-danger");
        }else if((presupuesto /2)> restante){
            restanteDiv.classList.remove("alert-success");
            restanteDiv.classList.add("alert-warning");
        }else {
            restanteDiv.classList.remove("alert-danger", "alert-warning");
            restanteDiv.classList.add("alert-success");
        }
        if(restante <= 0){
            ui.imprimirAlerta("El presupuesto se termino", "error");
            formulario.querySelector("button[type='submit']").disabled = true;
        }
    }
   
}


//Instanciar
const ui = new UI();
let presupuesto;

//Funciones

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt("Cual es tu presupuesto?");
    
    if (presupuestoUsuario === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();
    }
    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);
}


//Añade gastos
function agregarGasto(e){
    e.preventDefault();
    //Leer datos del formulario
    const nombre = document.querySelector("#gasto").value;
    const cantidad = Number(document.querySelector("#cantidad").value);

    //validar
    if(nombre === "" || cantidad === ""){
      ui.imprimirAlerta("ambos campos son obligatorios", "error");
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta("Cantidad no valida", "error");
    }

    //generar un objeto con el gasto
    const gasto = {nombre, cantidad, id: Date.now()}

    //añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);
    //mensaje de gasto agregado
    ui.imprimirAlerta("Gasto agregado correctamente");

    //Imprimir los gastos
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

    //Reinica el fomrulario
    formulario.reset();
    
}

function eliminarGasto(id){
    //Los los gastos elimina del objeto
    presupuesto.eliminarGasto(id);
    //Elimina los gastos del HTML
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}