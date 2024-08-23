const mongoose = require("mongoose")

exports.conectar = async function(){
    try {
        console.log("Conectando con la bb.dd...")
        
        await mongoose.connect(process.env.mongodb_url)
        console.log("Conexión establecida.")
    } catch (error) {
        console.log(error)
        throw ({ codigo : "500",  mensaje : "no se pudo onectar con la bb.dd"} )        
    }
}