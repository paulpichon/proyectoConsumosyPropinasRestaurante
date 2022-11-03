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

    //verificar si cliente.pedido tiene algun producto
    if ( cliente.pedido.length ) {
        //mostrar el resumen
        //llamamos funcion para actualizar el resumen del pedido del cliente
        actualizarResumen();
    } else {
        //si no hay ningun elemento/producto llamamos la funcion 
        mensajePedidoVacio();
    }  

}

//funcion para actualizar el resumen del pedido
function actualizarResumen() {
    //variable que representa donde se mostrar el resumen
    const contenido = document.querySelector('#resumen .contenido');

    //crear el html
    //div contenedor
    const resumen = document.createElement('div');
    //estilos
    resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');


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


    //iterar sobre el arreglo de pedidos
    const grupo = document.createElement('UL');
    //estilos
    grupo.classList.add('list-group');    
    //destructuring
    const { pedido } = cliente;
    //recorrer el arreglo
    pedido.forEach( articulo => {
        //console.log( articulo );
        //destructuring
        const { nombre, cantidad, precio, id } = articulo;

        //construir el html de los LI
        const lista = document.createElement('LI');
        //estilos
        lista.classList.add('list-group-item');


        //nombre/titulo dle platillo
        const nombreElemento = document.createElement('H4');
        //estilos
        nombreElemento.classList.add('my-5');
        //texcontent
        nombreElemento.textContent = nombre;


        //cantidad del articulo
        const cantidadElemento = document.createElement('P');
        //estilos
        cantidadElemento.classList.add('fw-bold');
        //texcontent
        cantidadElemento.textContent = 'Cantidad: ';


        //cantidad valor del elemento/articulo
        const cantidadValor = document.createElement('SPAN');
        //estilos
        cantidadValor.classList.add('fw-normal');
        //textcontent
        cantidadValor.textContent = cantidad;


        //precio del articulo
        const precioElemento = document.createElement('P');
        //estilos
        precioElemento.classList.add('fw-bold');
        //texcontent
        precioElemento.textContent = 'Precio: ';


        //precio valor del elemento/articulo
        const precioValor = document.createElement('SPAN');
        //estilos
        precioValor.classList.add('fw-normal');
        //textcontent
        precioValor.textContent = `$${ precio }`;


        //subtotal del articulo
        const subtotalElemento = document.createElement('P');
        //estilos
        subtotalElemento.classList.add('fw-bold');
        //texcontent
        subtotalElemento.textContent = 'Subtotal: ';


        //subtotal  valor del elemento/articulo
        const subtotalValor = document.createElement('SPAN');
        //estilos
        subtotalValor.classList.add('fw-normal');
        //textcontent
        //se llama una funcion para que nos haga la operacion
        subtotalValor.textContent = calcularSubtotal(precio, cantidad);
        


        //boton para eliminar un pedido
        const btnEliminar = document.createElement('BUTTON');
        //estilos
        btnEliminar.classList.add('btn', 'btn-danger');
        //textcontent
        btnEliminar.textContent = 'Eliminar del pedido';

        //agregar funcion para eliminar pedido
        btnEliminar.onclick = function () {
            //llamamos funcion para eliminar producto
            eliminarProducto( id );
        }


        //agregar valores a sus contenedores
        //cantidad de elementos
        cantidadElemento.appendChild( cantidadValor );
        //precio de elementos
        precioElemento.appendChild( precioValor );
        //subtotal
        subtotalElemento.appendChild( subtotalValor );
       


        //agregar Elementos al LI
        lista.appendChild( nombreElemento );
        //cantidad elementos
        lista.appendChild( cantidadElemento );
        //precio de elementos
        lista.appendChild( precioElemento );
        //subtotal
        lista.appendChild( subtotalElemento );
        //boton para eliminar
        lista.appendChild( btnEliminar );
    


        //agregar lista al grupo principal
        grupo.appendChild( lista );
        
    });


    //se agrega la info al div contenedor
    //heading
    resumen.appendChild( heading );
    //mesa
    resumen.appendChild( mesa );
    //hora
    resumen.appendChild( hora );
    //grupo
    resumen.appendChild( grupo );


    //renderizar
    contenido.appendChild( resumen );


    //mostrar formulario de propinas
    //llamamos una funcion para el formulario de propinas
    formularioPropinas();


}
//funcion para limpiar el html previo
function limpiarHTML() {
    //variable que representa donde se limpiara el html
    const contenido = document.querySelector('#resumen .contenido');

    while ( contenido.firstChild ) {
        contenido.removeChild( contenido.firstChild );
    }
}

//funcion para calcular el subtotal 
function calcularSubtotal(precio, cantidad) {
    return `$ ${ precio * cantidad } `;
}
//funcion para eliminar articulo/producto con el BTN para eliminar
function eliminarProducto( id ) {
    //destructuring sobre el arreglo principal de CLIENTE
    const { pedido } = cliente;
    //eliminar elementos cuando la cantidad es 0
    const resultado = pedido.filter( articulo => articulo.id !== id );
    //reescribir el cliente.pedido
    cliente.pedido = [ ...resultado ];

    //limpiar el html anterior
    limpiarHTML();


    //verificar si cliente.pedido tiene algun producto
    if ( cliente.pedido.length ) {
        //mostrar el resumen
        //llamamos funcion para actualizar el resumen del pedido del cliente
        actualizarResumen();
    } else {
        //si no hay ningun elemento/producto llamamos la funcion 
        mensajePedidoVacio();
    } 

    //El producto se elimino por lo tanto regresamos la cantidad a 0 en el input
    //creamos una variable
    const productoEliminado = `#producto-${ id }`;
    //variable que representa al input eliminado
    const inputEliminado = document.querySelector( productoEliminado ); 
    //al ya tener una instancia del elemento podemos ponerle como valor 0
    inputEliminado.value = 0;
    
}
//funcion para mostrar mensaje de pedido vacio una vez que se eliminan productos/articulos
function mensajePedidoVacio() {
    //donde se renderizara el contenido
    const contenido = document.querySelector('#resumen .contenido');

    //crear el htm
    const texto = document.createElement('P');
    //estilos
    texto.classList.add('text-center');
    //textcontent
    texto.textContent = 'Añade los elementos del pedido';

    //renderizar
    contenido.appendChild( texto );

}
//funcion para mostrar el formulario de propinas
function formularioPropinas() {
    //construir el HTML
    //variable donde se renderizara
    const contenido = document.querySelector('#resumen .contenido');
    //crear elemento DIV
    const formulario = document.createElement('DIV');
    //estilos
    formulario.classList.add('col-md-6', 'formulario');

    //divFormulario
    const divFormulario = document.createElement('DIV');
    //estilos
    divFormulario.classList.add('card', 'py-2', 'px-3', 'shadow');

    //crear elemento para el heading
    const heading = document.createElement('H3');
    //estilos
    heading.classList.add('my-4', 'text-center');
    //textcontent
    heading.textContent = 'Propina';

    //AÑADIR RADIO BUTTON AL FORMULARIO
    //radio button de 10%
    const radio10 = document.createElement('INPUT');
    //value
    radio10.type = 'radio';
    //name
    radio10.name = 'propina';
    //value
    radio10.value = '10';
    //estilos
    radio10.classList.add('form-check-input');
    //agregar una funcion 
    radio10.onclick = calcularPropina;

    //Label del input
    const radio10Label = document.createElement('LABEL');
    //texcontent
    radio10Label.textContent = '10%';
    //estilos
    radio10Label.classList.add('form-check-label');

    //div para el radio
    const radio10Div = document.createElement('DIV');
    //estilos al DIV
    radio10Div.classList.add('form-check');


    //añadir el radio y el label a el div radio10Div
    //radio
    radio10Div.appendChild( radio10 );
    //label
    radio10Div.appendChild( radio10Label );



    //AÑADIR RADIO BUTTON AL FORMULARIO
    //radio button de 25%
    const radio25 = document.createElement('INPUT');
    //value
    radio25.type = 'radio';
    //name
    radio25.name = 'propina';
    //value
    radio25.value = '25';
    //estilos
    radio25.classList.add('form-check-input');

    //Label del input
    const radio25Label = document.createElement('LABEL');
    //texcontent
    radio25Label.textContent = '25%';
    //estilos
    radio25Label.classList.add('form-check-label');
    //agregar funcion
    radio25.onclick = calcularPropina;

    //div para el radio
    const radio25Div = document.createElement('DIV');
    //estilos al DIV
    radio25Div.classList.add('form-check');


    //añadir el radio y el label a el div radio25Div
    //radio
    radio25Div.appendChild( radio25 );
    //label
    radio25Div.appendChild( radio25Label );



    //AÑADIR RADIO BUTTON AL FORMULARIO
    //radio button de 50%
    const radio50 = document.createElement('INPUT');
    //value
    radio50.type = 'radio';
    //name
    radio50.name = 'propina';
    //value
    radio50.value = '50';
    //estilos
    radio50.classList.add('form-check-input');

    //Label del input
    const radio50Label = document.createElement('LABEL');
    //texcontent
    radio50Label.textContent = '50%';
    //estilos
    radio50Label.classList.add('form-check-label');
    //agregar funcion
    radio50.onclick = calcularPropina;

    //div para el radio
    const radio50Div = document.createElement('DIV');
    //estilos al DIV
    radio50Div.classList.add('form-check');


    //añadir el radio y el label a el div radio50Div
    //radio
    radio50Div.appendChild( radio50 );
    //label
    radio50Div.appendChild( radio50Label );




    //AGREGAR AL DIV PRINCIPAL
    //agregar el heading al divFormulario
    divFormulario.appendChild( heading );
    //añadir al divFormulario
    //radio 10%   
    divFormulario.appendChild( radio10Div );
    //radio 25%
    divFormulario.appendChild( radio25Div );
    //radio 50%
    divFormulario.appendChild( radio50Div );


    //AGREGARLO AL FORMULARIO
    //agregar divFormulario
    formulario.appendChild( divFormulario );

    //AGREGAR AL FORMULARIO
    //renderizar
    contenido.appendChild( formulario );

}
//funcion para calcular la propina en base al radio input seleccionado
function calcularPropina() {
    //destructuring
    const { pedido } = cliente;
    //creamos una variable para el subtotal
    let subtotal = 0;

    //iteramos el arreglo para calcular el subtotal a pagar
    pedido.forEach( articulo => {
        //operacion para sumar el total de todo el pedido
        subtotal += articulo.cantidad * articulo.precio;
        
    });
    //input seleccionado con la propina del cliente
    const propinaSeleccionada = document.querySelector('input[name="propina"]:checked').value;
    
    //calcular la propina
    //se usa una regla de 3
    //se parsea propinaSeleccionada ya que viene como un string
    const propina = (( subtotal * parseInt( propinaSeleccionada ) ) / 100 );
    //console.log( propina );

    //calcular el total a pagar
    const total = subtotal + propina;

    //llamar funcion para mostrar el total de la cuenta en el HTML
    //se pasan 3 argumentos, subtotal, total y propina
    mostrarTotalHTML( subtotal, total, propina );
}
//funcion para mostrar el total del pedido en el HTML
function mostrarTotalHTML( subtotal, total, propina ) {
    //div para añadir los totales
    const divTotales = document.createElement('DIV');
    //estilos
    divTotales.classList.add('total-pagar');

    //creando el HTML
    //SUBTOTAL
    const subtotalParrafo = document.createElement('P');
    //estilos
    subtotalParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
    //textcontent
    subtotalParrafo.textContent = 'Subtotal Consumo: ';


    //span del subtotal
    const subtotalSpan = document.createElement('SPAN'); 
    //estilos
    subtotalSpan.classList.add('fw-normal');
    //texcontent
    subtotalSpan.textContent = `$${ subtotal }`;
    
    //agregar subtotalSpan a subtotalParrafo
    subtotalParrafo.appendChild( subtotalSpan );


     //PROPINA
     const propinaParrafo = document.createElement('P');
     //estilos
     propinaParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
     //textcontent
     propinaParrafo.textContent = 'Propina: ';
 
 
     //span de la propina
     const propinaSpan = document.createElement('SPAN'); 
     //estilos
     propinaSpan.classList.add('fw-normal');
     //texcontent
     propinaSpan.textContent = `$${ propina }`;
     
     //agregar propinaSpan a propinaParrafo
     propinaParrafo.appendChild( propinaSpan );


     //total
     const totalParrafo = document.createElement('P');
     //estilos
     totalParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
     //textcontent
     totalParrafo.textContent = 'Total del consumo: ';
 
 
     //span del total
     const totalSpan = document.createElement('SPAN'); 
     //estilos
     totalSpan.classList.add('fw-normal');
     //texcontent
     totalSpan.textContent = `$${ total }`;
     
     //agregar totalSpan a totalParrafo
     totalParrafo.appendChild( totalSpan );


    //eliminar el ultimo resultado
    const totalPagarDiv = document.querySelector('.total-pagar', 'my-5');
    //verificar si hay un div anterior
    if (totalPagarDiv) {
        //si existe, eliminarlo
        totalPagarDiv.remove();
    }



    //añadir subtotalParrafo a divTotales
    //subtotal
    divTotales.appendChild( subtotalParrafo );
    //propina
    divTotales.appendChild( propinaParrafo );
    //total
    divTotales.appendChild( totalParrafo );

    //variable donnde se renderizara 
    const formulario = document.querySelector('.formulario > div');
    //renderizar
    formulario.appendChild( divTotales );

}