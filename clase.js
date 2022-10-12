const fs = require("fs")

class Contenedor{
    constructor(archivo){
        this.archivo = archivo
    }

    async save(data){
        let contenido = await fs.promises.readFile(this.archivo)
        let contenidoObj = JSON.parse(contenido)
        contenidoObj.push(data)
        await fs.promises.writeFile(this.archivo, JSON.stringify(contenidoObj))
    }

    async getById(num){
         let contenido = await fs.promises.readFile(this.archivo)
         let contenidoObj = JSON.parse(contenido)
         let resultado = contenidoObj.find(objeto => objeto.id === num)
         if(!resultado){
            console.log(null)
            return null
         }
         console.log(resultado)  
         return resultado 
    }

    async getAll(){
        let contenido = await fs.promises.readFile(this.archivo)
        let contenidoObj = JSON.parse(contenido)
        // console.log(contenidoObj)
        return contenidoObj;
        
    }

   async deleteById(num){
        let contenido = await fs.promises.readFile(this.archivo)
        let contenidoObj = JSON.parse(contenido)
        let buscar = contenidoObj.filter(objeto => objeto.id !== num)
        await fs.promises.writeFile(this.archivo, JSON.stringify(buscar))
        let eliminado = contenidoObj.find(objeto => objeto.id === num)
        console.log(eliminado) 
    }

    async deleteAll(){
        await fs.promises.writeFile(this.archivo, "[]")
        console.log("Objetos eliminados")
    }
}

module.exports = Contenedor