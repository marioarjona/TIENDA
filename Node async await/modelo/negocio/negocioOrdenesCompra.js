const { default: mongoose } = require("mongoose")

const crearError = require("../../util/errorUtil").crearError
const validar = require("../../util/validacionUtil").validar     
const Producto = require("../entidades/producto").Producto   
const Factura = require("../entidades/factura").Factura
const Usuario = require("../entidades/usuario").Usuario
const negocioUsuarios = require("./negocioUsuarios")
const OrdenDeCompra = require("../entidades/ordenDeCompra").OrdenDeCompra

let reglasOrdenDeCompra = {
   
    formaPago                 : "required",
    direccionFacturacion      : "required",
    direccionEntrega          : "required",
    "usuario._id"             : "required",
    detalles                  : "required|array",
   
  
}


exports.procesarOrdenDeCompra = async function(ordenDeCompra, autoridad){

// el orden de lsa cosas aes importante y cuidado con las transacciones

//Validaciones
let session
try{
let error = validar(ordenDeCompra, reglasOrdenDeCompra )
if(error){
    throw error
}

//Autorizacion
if(autoridad._id != ordenDeCompra.usuario._id ){

    throw crearError(400, "te vamos a bloquear la cuenta hdp")
    
}
//begin transaccion   BEGIN TRANSACCION

session = await mongoose.startSession() 
session.startTransaction()


let usuario = await negocioUsuarios.buscarPorId(ordenDeCompra.usuario._id)
if(!usuario){
    throw crearError(400, "El usuario no existe")
}
if(usuario.estado != "ACTIVO"){
    throw crearError(400, "El usuario esta baneado")
}

//comprobar las existencias

//reducir las existencias

//obtener los precios y recalcular el total
let total = 0
let detallesFactura = []
for( detalleOrdenDeCompra of ordenDeCompra.detalles){
    let cantidad = detalleOrdenDeCompra.cantidad
    let idProducto = detalleOrdenDeCompra.producto._id
    let producto = await Producto.findById(idProducto).session(session)//sesion
    if(!producto){
        throw crearError(400, `No existe el producto:  ${producto.nombre} ` )
         }
    total += producto.precio * cantidad

    
    if(producto.existencias  - cantidad < 0){
       throw crearError(400, `No hay exitencias del ${producto.nombre} `, 
        { producto: producto._id,
            solicitado: cantidad,
            disponible: producto.existencias
        })

    }
    producto.existencias -= cantidad
     
    await producto.save({session})//sesion
    let detalleFactura= {
        cantidad : detalleOrdenDeCompra.cantidad,
        precio   : producto.precio,
        producto : producto

    }
    detallesFactura.push(detalleFactura)
}
//emitir factura
let factura = new Factura({
    
    total                 : total,
    detalles              : detallesFactura,
    formaPago             : ordenDeCompra.formaPago, // falta validar
    direccionFacturacion  : ordenDeCompra.direccionFacturacion,//falta validar
    direccionEntrega      : ordenDeCompra.direccionEntrega,//falta validar
    usuario               : usuario
})
/* 
let usuario = await Usuario.findById(ordenDeCompra.usuario._id) */
    factura.fecha = Date.now()
    factura.codigo = "FAC-"+(Math.round(Date.now()/10000))
    factura.estado = "EMITIDA"

    await factura.save({session})

    //preparar los cobros
    //enviar un correo electronico con el pdf de la factura...
    //crear un albaran
    //preparar el envio


 



//guardar orden de compra

let ordenDeCompraMG = new OrdenDeCompra(ordenDeCompra)
ordenDeCompraMG.fecha = Date.now()
ordenDeCompra.estado = "ACEPTADA"
await ordenDeCompraMG.save({session})//session 
//commit
await session.commitTransaction()

return {
    factura // Asegúrate de que `factura` esté incluido en el resultado
}


}catch(error){
    if(session){
        await session.abortTransaction()
    }
    if(error.codigo){
        throw error
    }
    console.log(error)
    throw crearError(500, "error en el servidor ")
    
}

}



