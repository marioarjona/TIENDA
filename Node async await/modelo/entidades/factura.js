
let mongoose = require("mongoose")
const Producto = require("./producto").Producto
const Usuario = require("./usuario").Usuario

esquemaFactura = new mongoose.Schema({
    codigo   : String,
    fecha    : String,
    total    : Number,
    formaPago: String,
    direccionFacturacion: String,
    direccionEntrega: String,
    estado: String,
    usuario: Usuario.schema,
    detalles: [{
        cantidad: Number,
        precio  : Number,
        producto: Producto.schema
    }],
    //pagos
    //estado
})    

exports.Factura = mongoose.model('facturas', esquemaFactura)