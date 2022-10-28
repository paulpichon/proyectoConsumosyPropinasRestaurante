//variables

let cliente = {
    mesa: '',
    hora: '',
    pedido: ''
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
        console.log("si hay campos vacios");
    }else {
        console.log("los campos estan llenos");
    }
    
}