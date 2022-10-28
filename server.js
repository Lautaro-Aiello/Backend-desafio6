const express = require("express")
const { Server: IOServer } = require("socket.io")
const { Server: HttpServer } = require("http")

const {optionsSQL} = require ("./options/SQLite3")
const {optionsMA} = require ("./options/mariaDB")

const Cliente = require("./client")

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.static("./public")) 

const Contenedor = require("./clase")
const contenedorMensajes = new Contenedor("mensajes.txt")
const contenedorProductos = new Contenedor("productos.txt")

const sql = new Cliente(optionsSQL)
const mDB= new Cliente(optionsMA)

let mensajes = []

let productos = []

io.on("connection", function (socket) {
    console.log("Nuevo cliente conectado!")
    socket.emit("mensajes", mensajes) // emitimos los mensajes al nuevo cliente
    socket.emit("productos", productos) // emitimos los productos al cliente

    socket.on("new-message", function (data) {
        try{
            if(mensajes.length === 0){
                mensajes.push(data); // le pasamos todos los mensajes a la base de datos y txt
                contenedorMensajes.save(mensajes)
                sql.crearTablaMsj()
                .then(()=>{
                    console.log("tabla creada")
                    return sql.insertarMsj(mensajes)
                })
                .then(() => {
                    console.log("articulos insertados")
                    return sql.listarMsj()
                })
                .then(mensajes =>{
                    console.log("listar articulos")
                    console.table(mensajes)
                })
                io.sockets.emit("mensajes", mensajes); // emitimos todos lo mensajes a todos
            }else{
                mensajes.push(data) // le pasamos 1 mensaje a la base de datos y txt
                contenedorMensajes.save(data)
                sql.crearTablaMsj()
                .then(()=>{
                    console.log("tabla creada")
                    return sql.insertarMsj(data)
                })
                .then(() => {
                    console.log("articulos insertados")
                    return sql.listarMsj()
                })
                .then(data =>{
                    console.log("listar articulos")
                    console.table(data)
                })
                io.sockets.emit("mensajes", mensajes); // emitimos todos lo mensajes a todos
            }
            }catch (error){
                console.log(error)
            }   
        })

    socket.on("new-product", function (producto){
        if(productos.length === 0){
            productos.push(producto) // ingresamos todos los productos en el array y txt
            contenedorProductos.save(productos)
            mDB.crearTablaProductos()
            .then(()=>{
                console.log("tabla creada")
                return mDB.insertarProductos(productos)
            })
            .then(()=>{
                console.log("productos insertados")
                return mDB.listarProductos()
            })
            .then(productos =>{
                console.log("listar productos")
                console.table(productos)
            })
            io.sockets.emit("productos", productos) // mostramos todos los productos
        }else{
            productos.push(producto) // ingresamos 1 solo producto en el array y txt
            contenedorProductos.save(producto)
            mDB.crearTablaProductos()
            .then(()=>{
                console.log("tabla creada")
                return mDB.insertarProductos(producto)
            })
            .then(()=>{
                console.log("productos insertados")
                return mDB.listarProductos()
            })
            .then(producto =>{
                console.log("listar productos")
                console.table(producto)
            })
            io.sockets.emit("productos", productos) // mostramos todos los productos
        }
    })
})


const PORT = process.env.PORT || 8080
const connectedServer = httpServer.listen(PORT, () =>{
    console.log(`Servidor con WebSocket escuchando en el puerto ${connectedServer.address().port}`)
})
httpServer.on("error", error => console.log(`Error en servidor ${error}`))