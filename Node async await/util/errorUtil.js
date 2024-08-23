const mensajes = {
    "400" : "Datos inválidos",
    "401" : "Requerida autenticación",
    "403" : "Permisos insuficientes"
}
//el parametro data será opcional
exports.crearError = function(codigo, mensaje, data){
    if(!mensaje){
        mensaje = mensajes[codigo]
    }

    let error = {
        codigo  : codigo,
        mensaje : mensaje,
        
    }
    
    if(data){
        error.data = data// aunque devolviera undefined no pasaria nada 
    }
    return error
}