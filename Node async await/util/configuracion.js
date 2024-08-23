const fs = require("fs")



console.log("Leyendo la configuracion...")

let json = fs.readFileSync('./configuracion.json').toString()
console.log(json)
let objCfg = JSON.parse(json)

/* process.env["mongodb.url"] = objCfg["mongodb.url"] //se que eres un array asociativo te voy a meter esta clave con este valor
process.env["mongodb.esquema"] = objCfg["mongodb.esquema"] 
process.env["mongodb.puerto"] = objCfg["mongodb.puerto"]  */

for (let propiedad in objCfg){
    process.env[propiedad] = objCfg[propiedad]
}