const knexLib = require("knex")

class Client{
    constructor(config){
        this.knex = knexLib(config)
    }

    crearTablaMsj(){
        return this.knex.schema.dropTableIfExists('articulos')
        .finally(()=>{
            return this.knex.schema.createTable("mensajes", table =>{
            table.increments('id');
            table.string('email', 50).notNullable();
            table.timestamp('fecha', { useTz: true }).notNullable().defaultTo(knex.fn.now());
            table.string("mensaje", 50).notNullable();;
            })
        })
    }

    insertarMsj(mensajes){
        return this.knex("mensajes").insert(mensajes)
    }

    listarMsj(){
        return this.knex("mensajes").select("*")
    }

    crearTablaProductos(){
        return this.knex.schema.dropTableIfExists('articulos')
        .finally(()=>{
            return this.knex.schema.createTable("productos", table =>{
                table.increments("id").primary();
                table.string("nombre", 50).notNullable();
                table.float("precio");
            })
        })
        
    }

    insertarProductos(productos){
        return this.knex("productos").insert(productos)
    }

    listarProductos(){
        return this.knex("productos").select("*")
    }
    
}

module.exports = Client;