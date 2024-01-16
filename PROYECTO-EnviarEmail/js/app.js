document.addEventListener("DOMContentLoaded", function() {

    const email = {
        email: "",
        asunto: "",
        mensaje: "",
    }


    //seleecionar los elementos de la interfaz
    const inmputEmail = document.querySelector("#email");
    const inmputAsunto = document.querySelector("#asunto");
    const inmputMensaje = document.querySelector("#mensaje");
    const formulario = document.querySelector("#formulario");
    const btnSubmit = document.querySelector("#formulario button[type='submit']");
    const btnReset = document.querySelector("#formulario button[type='reset']");
    const spinner = document.querySelector("#spinner");

    //asignar eventos                                   //inmput se ejecuta en tiempo real mientras escribes en el campo
    inmputEmail.addEventListener("input", validar); //blur se ejecuta cuando estas en un campo y cambias de parte de DOM
    inmputAsunto.addEventListener("input", validar);
    inmputMensaje.addEventListener("input", validar);
    formulario.addEventListener("submit", enviarEmail);

    btnReset.addEventListener("click", function(e) {
        e.preventDefault();

        resetFormulario();
    });        

    function enviarEmail(e){
        e.preventDefault();
        
        spinner.classList.add("flex");
        spinner.classList.remove("hidden");

        setTimeout(()=> {
            spinner.classList.remove("flex");
            spinner.classList.add("hidden");
            resetFormulario();

            //crear una alerta
            const alertaExito = document.createElement("P");
            alertaExito.classList.add("bg-green-500", "text-white", "p-2", "text-center", "rounded-lg", "mt-10", "font-blod", "text-sm", "uppercase");
            alertaExito.textContent = "Mensaje enviado correctamente";

            formulario.appendChild(alertaExito);
            setTimeout(()=>{
            alertaExito.remove();
        }, 3000);
        },3000);
    }

    function validar (e) { //funcion reutilizable para los anteriores 3 eventos
        if(e.target.value.trim() === "") {   //.trim elimina el texto vacio del formulario
            mostrarAlerta(`El campo ${e.target.id} es obligatorio`, e.target.parentElement);
            email[e.target.name] = "";
            comprobarEmail();
            return;  
        } 

        if (e.target.id === "email" && !validarEmail(e.target.value)){
            mostrarAlerta("El email no es valido", e.target.parentElement);
            email[e.target.name] = "";
            comprobarEmail();
            return;
        }

        limpiarAlerta(e.target.parentElement);

        //asignar los valores
        email[e.target.name] = e.target.value.trim().toLowerCase();
        
        //comprobar el objeto del emial
        comprobarEmail();
    }

    function mostrarAlerta(mensaje, referencia) {
      limpiarAlerta(referencia);

        //generar alerta en HTML
        const error = document.createElement("P");
        error.textContent = mensaje;
        error.classList.add("bg-red-600", "text-whit", "p-2", "text-center");
        //mostrar el error en el formulario del HTML
        referencia.appendChild(error);
    }

    function limpiarAlerta(referencia) {
        //comprueba si ya existe una alerta en dicho elemento
        const alerta = referencia.querySelector(".bg-red-600");
        if(alerta){
            alerta.remove();
        }
    }

    function validarEmail (email) {
        const regex =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/ //expresion regular para emails JS
        const resultado = regex.test(email);
        return resultado;
    }

    function comprobarEmail(){
        if(Object.values(email).includes("")){
            btnSubmit.classList.add("opacity-50");
            btnSubmit.disabled = true;
            return;
        }
            btnSubmit.classList.remove("opacity-50");
            btnSubmit.disabled = false;
        
    }

    function resetFormulario() {
        //eliminar informacion del formulario
        email.email = "";
        email.asunto = ""; 
        email.mensaje = "";

        formulario.reset();
        comprobarEmail();
    }
});