//variables
//inicio 28/10/2022
//avance 31/10/2022

let cliente = {
    mesa: '',
    hora: '',
    pedido: []
}

//crear una variable objeto de categorias para definir el nombre de la categoria
const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
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
        //llamos la funcion mostrarPlatillos para poder mostrar lso platos desde la API
        .then( resultado => mostrarPlatillos( resultado ) )
        //error
        .catch( error => console.log( error ) )
}
//funcion para mostrar los platillos desde la API
function mostrarPlatillos( platillos ) {
    ///variable que representa donde se mostraran los platillos
    const contenido = document.querySelector('#platillos .contenido');

    //iterar con foreach() sobre cada platillo
    platillos.forEach( platillo => {
        //destructuring
        const { id, nombre, precio, categoria } = platillo;
        //construi el html
        const row = document.createElement('DIV');
        //estilos
        row.classList.add('row', 'py-3', 'border-top');

        //div nombre platillo
        const nombrePlatillo = document.createElement('DIV');
        //estilos
        nombrePlatillo.classList.add('col-md-4');
        //texcontent
        nombrePlatillo.textContent = nombre;

        //precio del platillo
        const precioPlatillo = document.createElement('DIV');
        //estilos
        precioPlatillo.classList.add('col-md-3', 'fw-bold');
        //textcontent
        precioPlatillo.textContent = `$${ precio }`;

        //categoria de los platillos
        const categoriaPlatillo = document.createElement('DIV');
        //estilos
        categoriaPlatillo.classList.add('col-md-3');
        //textcontent
        //con la ayuda del objeto creado mas arriba entre corchetes ponemos la categoria que nos trae la API
        //es similar a poner lo siguiente
        //categorias[1] = Comida, categorias[2] = Bebidas, categorias[3] = Postres
        categoriaPlatillo.textContent = categorias[categoria];


        //INPUT CANTIDAD
        const inputCantidad = document.createElement('INPUT');
        //TIPO DEL INPUT
        inputCantidad.type = 'number';
        //CANTIDAD MINIMA A SELECCIONAR 0, PARA QUE NO SE PUEDA SELECCIONAR -1,-2,-3, ETC...
        inputCantidad.min = 0;
        //VALOR POR DEFECTO DEL INPUT
        inputCantidad.value = 0;
        //crear el id del platillo
        inputCantidad.id = `producto-${ id }`;
        //estilos
        inputCantidad.classList.add('form-control');


        //funcion que detecta la cantidad y el platillo que se agrega
        //no se puede crear un event listener sobre un elento que ha sido creado despues del HTML original
        //le pasamos como arguemento/parametro el id del platillo
        inputCantidad.onchange = function() {
            //detectar la cantidad de determinado platillo
            //convertimos el string en numero con parseint
            const cantidad = parseInt( inputCantidad.value );
            //pasamos el arreglo platillo completo
            //lo convertimos en objeto, platillo = { platillo }
            //usamos spread operator para que sea lo que el objeto trar mas la nuevo informacion
            agregarPlatillo( { ...platillo, cantidad } );
        };


        //crear un div para el input
        const agregar = document.createElement('DIV');
        //estilos
        agregar.classList.add('col-md-2');
        //agregarle al div el input
        agregar.appendChild( inputCantidad );
        
        
        //console.log( inputCantidad );

        //agregar el nombre al row
        row.appendChild( nombrePlatillo );
        //agregar el precio al row
        row.appendChild( precioPlatillo );
        //agreagr al row la categori
        row.appendChild( categoriaPlatillo );
        //agregar al row el div agregar
        row.appendChild( agregar );


        //renderizar en el html
        contenido.appendChild( row );

    });

}
//funcion que detecta la cantidad y el platillo que se agrega
function agregarPlatillo( producto ) {
    //destructuring del pedido actual
    //se pone let ya que el pedido puede ser modificado N veces
    let { pedido } = cliente;
    //console.log( pedido );
    //revisar que la cantidad sea mayor a 0
    if ( producto.cantidad > 0 ) {

        //verificar si en el arreglo ya existe un producto
        if ( pedido.some( articulo => articulo.id === producto.id )) {
            //el articulo ya existe actualizar la cantidad
            //identificar cual es el producto que se esta repitiend
            const pedidoActualizado = pedido.map( articulo => {
                //con un if() identificamos el articulos repetido
                if ( articulo.id === producto.id ) {
                    //actualizamos la cantidad
                    articulo.cantidad = producto.cantidad;
                }
                //retornamos el articulo para que lo vaya asignando al arreglo pedidoActualizado
                //y para que no pierda referencia de los objetos que ya esten en el array
                return articulo;
                
            });
            //se asigna el nuevo array a cliente.pedido
            cliente.pedido = [ ...pedidoActualizado ];
            
        }else {
            //el articulo no existe lo agregamos al array de pedido
            //se va actualizando el arreglo cliente.pedido, con lo que ya tiene el arreglo ...pedido, más lo nuevo que se va agregar= producto
            cliente.pedido = [ ...pedido, producto ];
        }    
    
    }else {
        //eliminar elementos cuando la cantidad es 0
        const resultado = pedido.filter( articulo => articulo.id !== producto.id );
        //reescribir el cliente.pedido
        cliente.pedido = [ ...resultado ];
    }

    //limpiar el html anterior
    limpiarHTML();

    //mostrar el resumen
    //llamamos funcion para actualizar el resumen del pedido del cliente
    actualizarResumen();

}

//funcion para actualizar el resumen del pedido
function actualizarResumen() {
    //variable que representa donde se mostrar el resumen
    const contenido = document.querySelector('#resumen .contenido');

    //crear el html
    //div contenedor
    const resumen = document.createElement('div');
    //estilos
    resumen.classList.add('col-md-6', 'card', 'py-5', 'px-3', 'shadow');


    //informacion de la mesa
    //mesa
    const mesa = document.createElement('P');
    //textcontent
    mesa.textContent = 'Mesa: ';
    //estilos
    mesa.classList.add('fw-bold');

    //span mesa
    const mesaSpan = document.createElement('SPAN');
    //textcontent
    mesaSpan.textContent = cliente.mesa;
    //estilos
    mesaSpan.classList.add('fw-normal');


    //informacion de la hora
    //hora
    const hora = document.createElement('P');
    //textcontent
    hora.textContent = 'Hora: ';
    //estilos
    hora.classList.add('fw-bold');

    //span hora
    const horaSpan = document.createElement('SPAN');
    //textcontent
    horaSpan.textContent = cliente.hora;
    //estilos
    horaSpan.classList.add('fw-normal');


    //integrar a los elementos padre
    //mesa
    mesa.appendChild( mesaSpan );
    //hora
    hora.appendChild( horaSpan );


    //titulo de la seccion
    const heading = document.createElement('H3');
    heading.textContent = 'Platillos Consumidos';
    heading.classList.add('my-4', 'text-center');


    //se agrega la info al div contenedor
    //mesa
    resumen.appendChild( mesa );
    //hora
    resumen.appendChild( hora );
    //heading
    resumen.appendChild( heading );

    //renderizar
    contenido.appendChild( resumen );

}
//funcion para limpiar el html previo
function limpiarHTML() {
    //variable que representa donde se limpiara el html
    const contenido = document.querySelector('#resumen .contenido');

    while ( contenido.firstChild ) {
        contenido.removeChild( contenido.firstChild );
    }
}