//variables

let cliente = {
    mesa: '',
    hora: '',
    pedido: []
}

//boton para crear una orden de cliente
const btnGuardarCliente = document.querySelector('#guardar-cliente');
//añadir listener a btnGuardarCliente
btnGuardarCliente.addEventListener('click', guardarCliente);


//funcion para guardar la orden del cliente
function guardarCliente() {
    //variables para los inputs
    //mesa
    const mesa = document.querySelector('#mesa').value;
    //hora
    const hora = document.querySelector('#hora').value;
    //validar que no esten vacios los inputs
    //haciendo uso de .some()
    //[ mesa, hora ] es igual a un arreglo y por lo tanto ya se puede usar con .some()
    const camposVacios = [ mesa, hora ].some( campo => campo === '');

    //verificar
    if ( camposVacios ) {
        //verificar que no haya alerta previa
        const alertas = document.querySelector('.invalid-feedback');
        //si no hay alertas previas muestra la alerta
        if ( !alertas ) {
            //crear la alerta 
            const alerta = document.createElement('DIV');
            //estilos
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
            //textcontent
            alerta.textContent = 'TODOS LOS CAMPOS SON OBLIGATORIOS';
            //renderizar
            document.querySelector('.modal-body form').appendChild( alerta );

            //quitar la alerta despues de 5 s
            setTimeout(() => {
                //quitar alerta
                alerta.remove();
            }, 5000);

            //return para no ejecutar mas codigo
            return;
        }

    }

    //ASIGANR DATOS DEL FORMULARIO A CLIENTE
    //cliente = { mesa, hora, ...cliente };//si lo dejamos asi pasa esto= mesa: '', hora: '', pedido: Array(0)}
    //por lo tanto debemos poner primero el spread operator dentro del objeto
    //para que tome una copia de ese arreglo y despues reescriba los valores de mesa y hora
    cliente = { ...cliente, mesa, hora }
    //console.log( cliente);
    
    //ocultar modal
    //modal formulario
    const modalFormulario = document.querySelector('#formulario');
    //modal bootstrap
    //obtenemos una instancia de modalFormulario
    const modalBootstrap = bootstrap.Modal.getInstance( modalFormulario );
    //y escondemos el modal
    modalBootstrap.hide();


    //llamar funcion para mostrar secciones
    mostrarSecciones();

    //obtener los platilos de la API JSON SERVER
    obtenerPlatillos();
}
//funcion para mostrar las secciones coultas
function mostrarSecciones() {
    //seleccionamos la clase d-none para seleccionar las secciones ocultas
    //al haber mas de 2 elementos con esa clase usamos querySelectorAll
    const seccionesOcultas = document.querySelectorAll('.d-none');
    //iterarcon foreach
    //y removemos las clases con este codigo seccion.classList.remove('d-none')
    seccionesOcultas.forEach( seccion => seccion.classList.remove('d-none'));
}
//funcion para mostrar los PLATILLOS desde la API
function obtenerPlatillos() {
    //url
    const url = 'http://localhost:4000/platillos';
    
    //fetch
    fetch( url )
    //se da por implicito el return respuesta.json()
    .then( respuesta => respuesta.json() )
        .then( resultado => console.log( resultado ) )
        //error
        .catch( error => console.log( error ) )
}