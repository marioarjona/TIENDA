const Producto = require("../entidades/producto").Producto// aveces puedo inciar trnasacciones desde aqui sin llamar a mongoose .begin transaccion
const crearError = require("../../util/errorUtil").crearError
//const mongoose = require("mongoose")// solo para transacciones 
const validar = require("../../util/validacionUtil").validar


let reglasProductoInsercion = {
    nombre      : "required|min:3|max:20",
    categoria   : "required|min:3|max:20",
    fabricante  : "required|min:3|max:50",
    descripcion : "required|min:20",
    precio      : "numeric",
    existencias : "numeric",
    //"fabricante.nombre" : "required" si fabricante fuerra un objeto
}
exports.ServicioProductos = class {

    async insertarProducto  (producto, autoridad){

        try{
            
            if(autoridad.rol!="EMPLEADO"){
                throw crearError(403, "que hace un cliente insertando un producto")
            }
            
            //validar. . .
        /*   let validador  = new Validator(producto, reglasProductoInsercion)//dentro del constructor le paso el objeto que quietro validadr 
            if(validador.fails()){
                throw crearError(400, "Datos inválidos", validador.errors.errors);
            } */
            let error = validar(producto, reglasProductoInsercion)
            if(error){
                throw error
            }
        
            
            

            let productoMG = new Producto(producto)//
            return await productoMG.save()


        }catch(error) {
            if (error.codigo) {
            throw error
            }
            console.log(error); // capturamos el error
            throw crearError(500, "Fallo en la bb.dd al insertar producto")
        }
    }

    async listarProductos (criterio){
        try{
            return await Producto.find(criterio)
        }catch(error){
            console.log(error)
            throw crearError(500, "Fallo al listar productos")
        }


    }

    async buscarProductoPorId (idProducto){

        try{
            return await Producto.findById(idProducto)
        }catch(error) {
        
            console.log(error); // capturamos el error
            throw crearError(500, "Error buscar producto")
        }

    }
}
