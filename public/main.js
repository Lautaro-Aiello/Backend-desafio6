let socket = io.connect();

socket.on("mensajes", data => {
    render(data) // recibimos los mensajes del server a traves de la funcion render
})

socket.on("productos", data => {
    renderProducts(data)
})

function render(data){
    const date = new Date()
    let html = data.map( function (element, index){ // hacemos un map con la data
        return(`<div>
                <strong styler="color:blue">${element.email}</strong> <span style="color:brown">${date.getDate()}/${date.getMonth()}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</span>
                <em style="color:green">:${element.mensaje}</em> </div>`)
        }).join(" ");
    document.getElementById("mensajes").innerHTML = html; // por ultimo insertamos la data mapeada en el div del html
}

function addMessage(e){
    let mensaje = {
        email: document.getElementById("email").value,
        mensaje: document.getElementById("texto").value
    };
    socket.emit("new-message", mensaje) //emitimos este nuevo mensaje al server

    document.getElementById("texto").value = ""
    document.getElementById("texto").focus()

    return false
}

function renderProducts(data){
    let html = data.map ( function(elem){
        return(`<div>
                <strong>${elem.nombre}</strong>
                <em>$ ${elem.precio}</em> </div>`)
    })
    
    document.getElementById("productos").innerHTML= html;
}

function addProduct(e){
    let producto = {
        nombre: document.getElementById("name").value,
        precio: document.getElementById("precio").value
    }
    socket.emit("new-product", producto) // pasamos el producto al server

    return false
}