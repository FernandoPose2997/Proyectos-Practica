let DB;
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

// Contenedor para las citas
const contenedorCitas = document.querySelector('#citas');

// Formulario nuevas citas
const formulario = document.querySelector('#nueva-cita')
formulario.addEventListener('submit', nuevaCita);

// Heading
const heading = document.querySelector('#administra');


let editando = false;


window.onload = () =>{
    eventListeners();
    crearDB();
}


// Eventos
function eventListeners() {
    mascotaInput.addEventListener('change', datosCita);
    propietarioInput.addEventListener('change', datosCita);
    telefonoInput.addEventListener('change', datosCita);
    fechaInput.addEventListener('change', datosCita);
    horaInput.addEventListener('change', datosCita);
    sintomasInput.addEventListener('change', datosCita);
}

const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora:'',
    sintomas: ''
}


function datosCita(e) {
    //  console.log(e.target.name) // Obtener el Input
     citaObj[e.target.name] = e.target.value;
}

// CLasses
class Citas {
    constructor() {
        this.citas = []
    }
    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    }
    editarCita(citaActualizada) {
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    }

    eliminarCita(id) {
        this.citas = this.citas.filter( cita => cita.id !== id);
    }
}

class UI {

    constructor({citas}) {
        this.textoHeading(citas);
    }

    imprimirAlerta(mensaje, tipo) {
        // Crea el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');
        
        // Si es de tipo error agrega una clase
        if(tipo === 'error') {
             divMensaje.classList.add('alert-danger');
        } else {
             divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar en el DOM
        document.querySelector('#contenido').insertBefore( divMensaje , document.querySelector('.agregar-cita'));

        // Quitar el alert despues de 3 segundos
        setTimeout( () => {
            divMensaje.remove();
        }, 3000);
   }

   imprimirCitas() {
       
        this.limpiarHTML();

        this.textoHeading(citas);

        //Leer el contenido de la DB
        const objectStore = DB.transaction("citas").objectStore("citas");

        const funcionTextoHeading = this.textoHeading;

        const total = objectStore.count();
        total.onsuccess = function(){
            funcionTextoHeading(total.result)
        }

        objectStore.openCursor().onsuccess = function(e){

            const cursor = e.target.result;

            if(cursor){
                const { mascota, propietario, telefono, fecha, hora, sintomas, id} = cursor.value;

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
            const cita = cursor.value;
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

            //Ir al siguiente elemento
            cursor.continue();
        }
    }
}

   textoHeading(resultado) {
        if(resultado> 0 ) {
            heading.textContent = 'Administra tus Citas '
        } else {
            heading.textContent = 'No hay Citas, comienza creando una'
        }
    }

   limpiarHTML() {
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
   }
}


const administrarCitas = new Citas();
const ui = new UI(administrarCitas);

function nuevaCita(e) {
    e.preventDefault();

    const {mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    // Validar
    if( mascota === '' || propietario === '' || telefono === '' || fecha === ''  || hora === '' || sintomas === '' ) {
        ui.imprimirAlerta('Todos los mensajes son Obligatorios', 'error')

        return;
    }

    if(editando) {
        // Estamos editando
        administrarCitas.editarCita( {...citaObj} );

        //Edita en IndexDB
        const transaction = DB.transaction(["citas"], "readwrite");
        const objectStore = transaction.objectStore("citas");

        objectStore.put(citaObj);

        transaction.oncomplete = () =>{
            ui.imprimirAlerta('Guardado Correctamente');

            formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
    
            editando = false;
        }

        transaction.onerror = () => {
            console.log("cita no definida");
        }

    } else {
        // Nuevo Registrando

        // Generar un ID único
        citaObj.id = Date.now();
        
        // Añade la nueva cita
        administrarCitas.agregarCita({...citaObj});

        //Insertar registro en IndexedDB
        const transaction = DB.transaction(["citas"], "readwrite");
        //Habilitar el objectStore
        const objectStore = transaction.objectStore("citas");
        //Insertar en el DB
        objectStore.add(citaObj);
        transaction.oncomplete = function() {
            console.log("Cita agregada");
                    // Mostrar mensaje de que todo esta bien...
        ui.imprimirAlerta('Se agregó correctamente')
        }
    }


    // Imprimir el HTML de citas
    ui.imprimirCitas();

    // Reinicia el objeto para evitar futuros problemas de validación
    reiniciarObjeto();

    // Reiniciar Formulario
    formulario.reset();

}

function reiniciarObjeto() {
    // Reiniciar el objeto
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}


function eliminarCita(id) {
    const transaction = DB.transaction(["citas"], "readwrite");
    const objectStore = transaction.objectStore("citas");

    objectStore.delete(id);
    
    transaction.oncomplete = () =>{
        console.log(`Cita ${id} fue eliminada`);
        ui.imprimirCitas()
    }

    transaction.onerror = () =>{
        console.log/"hubo un error";
    }
}

function cargarEdicion(cita) {

    const {mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    // Reiniciar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    // Llenar los Inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;
}

function crearDB(){
    //crear base de datos version 1.0
    const crearDB = window.indexedDB.open("citas", 1);
    //Si hay un error
    crearDB.onerror = function() {
        console.log("hubo un error");
    }
    //Si esta correcto
    crearDB.onsuccess = function() {
        console.log("DB creada");

        DB = crearDB.result;
        //Mostrar citas al cargar
        ui.imprimirCitas();
    }
    //Definir el esquema
    crearDB.onupgradeneeded = function(e) {
        const db = e.target.result;

        const objectStore = db.createObjectStore("citas", {
            keyPath: "id",
            autoIncrement: true,
        });

        //Definir todas las columnas
        objectStore.createIndex("mascota", "mascota", {unique: false} );
        objectStore.createIndex("propietario", "propietario", {unique: false} );
        objectStore.createIndex("telefono", "telefono", {unique: false} );
        objectStore.createIndex("fecha", "fecha", {unique: false} );
        objectStore.createIndex("hora", "hora", {unique: false} );
        objectStore.createIndex("sintomas", "sintomas", {unique: false} );
        objectStore.createIndex("id", "id", {unique: true} );
        console.log("DB creada y lista");
    }
}