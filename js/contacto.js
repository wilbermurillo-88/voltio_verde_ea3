const formularioContacto = document.querySelector("#formulario-contacto");
const estadoFormulario = document.querySelector("#estado-formulario");

formularioContacto.addEventListener("submit", function (evento) {
    evento.preventDefault();
    estadoFormulario.textContent =
        "Gracias por escribirnos. Este formulario es una demostración y no envía datos a un servidor.";
    formularioContacto.reset();
});
