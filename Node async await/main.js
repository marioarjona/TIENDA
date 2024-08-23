require("./util/configuracion")
const express = require("express")
const https = require("https")
const mongooseUtil = require("./util/mongooseUtil")
const interceptorCORS = require("./middleware/interceptorCORS").interceptorCORS
const interceptorLog = require("./middleware/interceptorLog").interceptorLog
const interceptorJWT = require("./autenticacion/iterceptorJWT").interceptorJWT
const usuariosRouter = require("./endpoints/endpointUsuarios").router
const productosRouter = require("./endpoints/routerProductos").router 
const ordenesDeCompraRouter = require("./endpoints/endPointOrdenesDeCompra").router
const getCertificado = require('./util/CertUtil').getCertificado
const autenticacionRouter = require('./autenticacion/loginRouter').router



mongooseUtil.conectar()
.then(arrancarServidor)
/* .then(()=>{
    
    arrancarServidor()
}) */
.catch(error => console.log("No pudo conectarse a la bbdd"))

function arrancarServidor(){

    let app = express()

    //Middleware

     
    app.use(interceptorCORS)
    app.use(interceptorLog)
    app.use(interceptorJWT)

    
    app.use(express.json({
        limit: '5mb' //Tamaño máximo del body que estamos dispuestos a leer. IMPRESCINDIBLE
    }))
    app.use(autenticacionRouter)
    app.use (usuariosRouter)
    app.use (productosRouter)
    app.use(ordenesDeCompraRouter)

    app.use(express.static("./recursos"))
    
    app.disable("x-powered-by") 


    

    let puerto = process.env.http_puerto

    https.createServer(getCertificado(), app).listen(puerto, 
        function(){
        console.log(`esperando peticiones en el ${puerto}`)
    })

}




