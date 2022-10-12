const express = require("express")
const { Server: IOServer } = require("socket.io")
const { Server: HttpServer } = require("http")

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.static("./public")) 

const Contenedor = require("./clase")
const contenedorMensajes = new Contenedor("mensajes.txt")
const contenedorProductos = new Contenedor("productos.txt")

let mensajes = []

let productos = []

io.on("connection", function (socket) {
    console.log("Nuevo cliente conectado!")
    socket.emit("mensajes", mensajes) // emitimos los mensajes al nuevo cliente
    socket.emit("productos", productos) // emitimos los productos al cliente

    socket.on("new-message", function (data) {
        io.sockets.emit("mensajes", mensajes); // emitimos todos lo mensajes a todos
        if(mensajes.length === 0){
            mensajes.push(data); // le pasamos todos los mensajes a la base de datos y txt
            contenedorMensajes.save(mensajes)
        }else{
            mensajes.push(data) // le pasamos 1 mensaje a la base de datos y txt
            contenedorMensajes.save(data)
        }
    })

    socket.on("new-product", function (producto){
        io.sockets.emit("productos", productos) // mostramos todos los productos
        if(productos.length === 0){
            productos.push(producto) // ingresamos todos los productos en el array y txt
            contenedorProductos.save(productos)
        }else{
            productos.push(producto) // ingresamos 1 solo producto en el array y txt
            contenedorProductos.save(producto)
        }
    })
})


const PORT = process.env.PORT || 8080
const connectedServer = httpServer.listen(PORT, () =>{
    console.log(`Servidor con WebSocket escuchando en el puerto ${connectedServer.address().port}`)
})
httpServer.on("error", error => console.log(`Error en servidor ${error}`))