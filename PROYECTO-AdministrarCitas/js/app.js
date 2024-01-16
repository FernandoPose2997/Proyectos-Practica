//Campos del formulario
const mascotaInput = document.querySelector("#mascota");
const propietarioInput = document.querySelector("#propietario");
const telefonoInput = document.querySelector("#telefono");
const fechaInput = document.querySelector("#fecha");
const horaInput = document.querySelector("#hora");
const sintomasInput = document.querySelector("#sintomas");
//UI
const formulario = document.querySelector("#nueva-cita");
const contenedorCitas = document.querySelector("#citas");
let editando;
//Registrar clases
class Citas {
    constructor(){
        this.citas = [];
    }
    agregarCita(cita){
        this.citas = [...this.citas, cita];
    }
    eliminarCita(id){
        this.citas = this.citas.filter( cita  => cita.id !== id);
    }
    editarCita(citaActualizada){
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita); 
    }
}

class UI {
    
    ImprimirAlerta(mensaje, tipo){
        //Crear el div
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("text-center", "alert", "d-block", "col-12");
        //Agregar clase segun el error
        if(tipo === "error"){
            divMensaje.classList.add("alert-danger");
        }else {
            divMensaje.classList.add("alert-success");
        }
        //Mensaje de error
        divMensaje.textContent = mensaje;
        //Agregar al DOM
        document.querySelector("#contenido").insertBefore(divMensaje, document.querySelector(".agregar-cita"));
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
    imprimirCitas({citas}){

        this.limpiarHTML();

        citas.forEach(cita =>{
            const { mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

            const divCita = document.createElement("div");
            divCita.classList.add("cita", "p-3");
            divCita.dataset.id = id;

            //Scripting de los elemntos de la cita
            const mascotaParrafo = document.createElement("h2");
            mascotaParrafo.classList.add("card-title", "font-weight-bolder");
            mascotaParrafo.textContent = mascota;

            const  propietarioParrafo = document.createElement("p");
            propietarioParrafo.innerHTML = `<span class="font-weight-bolder">Propietario:</span>${propietario}`;

            const  telefonoParrafo = document.createElement("p");
            telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Contacto:</span>${telefono}`;

            const  fechaParrafo = document.createElement("p");
            fechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha:</span>${fecha}`;

            const  horaParrafo = document.createElement("p");
            horaParrafo.innerHTML = `<span class="font-weight-bolder">Hora:</span>${hora}`;

            const  sintomasParrafo = document.createElement("p");
            sintomasParrafo.innerHTML = `<span class="font-weight-bolder">Sintomas:</span>${sintomas}`;

            //Boton para eliminar esta cita
            const btnEliminar = document.createElement("button");
            btnEliminar.classList.add("btn","btn-danger", "mr-2");
            btnEliminar.innerHTML = "Eliminar ";
            btnEliminar.onclick = () => eliminarCita(id);
            //Boton para editar cita
            const btnEditar = document.createElement("button");
            btnEditar.classList.add("btn", "btn-info");
            btnEditar.innerHTML = "Editar";
            btnEditar.onclick =()=> cargarEdicion(cita);

            //Agregar los parrafos al DivCita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);
            //Agregar las citas al HTML
            contenedorCitas.appendChild(divCita);
        } )
    }
   limpiarHTML() {
    while(contenedorCitas.firstChild){
        contenedorCitas.removeChild(contenedorCitas.firstChild);
    }

   }
}
const ui = new UI();
const administrarCitas = new Citas();
//Registrar eventos
EventListener();
function EventListener(){
    mascotaInput.addEventListener("input", datosCita);
    propietarioInput.addEventListener("input", datosCita);
    telefonoInput.addEventListener("input", datosCita);
    fechaInput.addEventListener("input", datosCita);
    horaInput.addEventListener("input", datosCita);
    sintomasInput.addEventListener("input", datosCita);

    formulario.addEventListener("submit", nuevaCita);
}
//Objetos de la cita
const citaObj = {
    mascota: "",
    propietario: "",
    telefono:"",
    fecha:"",
    hora: "",
    sintomas:"",
}
//Agregar datos al objeto de cita
function datosCita(e){
    citaObj[e.target.name] = e.target.value;
}

//Validar y agregar nuevas citas a la clase de citas
function nuevaCita(e){
    e.preventDefault();
    //Extraer informacion del objeto de cita
    const { mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;
    //Validar
    if(mascota ==="" || propietario ===""|| telefono ==="" || fecha ===""|| hora === ""|| sintomas === ""){
        ui.ImprimirAlerta("Todos los campos son obligatorios", "error");
        return;
    }
    if(editando){
       ui.ImprimirAlerta("Editado Correctamente");
       //Pasar la cita a edicion
       administrarCitas.editarCita({...citaObj})
       //Texto de boton a su estado original
       formulario.querySelector("button[type='submit']").textContent = "Crear Cita";
       //Quitar modo edicion para reinicar formulario
       editando = false;
    }else {
          //Generar un id unico
    citaObj.id = Date.now();
    //Crear una nueva cita
    administrarCitas.agregarCita({...citaObj});
    //Mensaje de agregado correctamente
    ui.ImprimirAlerta("Se agrego correctamente");
    }

    //reinicar el objeto para la validacion
    reinicarObjeto();
    //reinicar formulario
    formulario.reset();
    //Mostrar el HTML de las citas creadas
    ui.imprimirCitas(administrarCitas);
}

function reinicarObjeto() {
    citaObj.mascota = "";
    citaObj.propietario = "";
    citaObj.telefono = "";
    citaObj.fecha = "";
    citaObj.hora = "";
    citaObj.sintomas = "";
}

function eliminarCita (id){
    //Eliminar la cita
    administrarCitas.eliminarCita(id);
    //Mostrar un mensaje
    ui.ImprimirAlerta("La cita fue eliminada correctamente");
    //Actualizar las citas restantes
    ui.imprimirCitas(administrarCitas);
}

function cargarEdicion(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;
    //Llenar los input
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;
    //Llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    //Cambiar el texto del boton
    formulario.querySelector("button[type='submit']").textContent = "Guardar Cambios";
    editando = true;
}
