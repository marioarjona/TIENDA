const negocioUsuarios = require("../modelo/negocio/negocioUsuarios")
//const express = require("express")
//let router = express.Router()
//router.get('/usuarios', ...)
const router = require("express").Router()

router.post("/usuarios", insertarUsuario)
router.put("/seguro/usuarios/:id", modificarUsuario)
router.delete("/seguro/usuarios/:id", bajaUsuario)
router.head("/usuarios", comprobarLoginUsuario)

exports.router = router;

///////////////////////////////////////
// FUNCIONES DE LA LÓGICA DE CONTROL //
///////////////////////////////////////


/* let reglasUsrInsercion = {
  login    : "required|min:3|max:20",
  password : "required|min:3|max:20",
  nombre   : "required|min:3|max:50",
  correoE  : "required|min:3|max:30|email"
}

let reglasUsrModificacion = {
  login     : "required|min:3|max:20",
  password  : "required|min:3|max:20",
  nombre    : "required|min:3|max:50",
  correoE   : "required|min:3|max:30|email",
  telefono  : "required|min:3|max:20",
  direccion : "required|min:3|max:50",
}
 */

async function insertarUsuario(request, response) {
  let usuario = request.body;
  try {
    let resultado = await negocioUsuarios.insertarUsuario(usuario);

    response.status(201).json(resultado); // que el resultado dice que id
  } catch (error) {
    console.log(error);
    response.status(error.codigo).json(error);
  }
}

async function bajaUsuario(request, response) {
  try {
    let idUsuario = request.params.id; //que hay que sacar de la peticion
    let autoridad = request.autoridad;
    await negocioUsuarios.borrarUsuario(idUsuario, autoridad); // a quien hay que llamar
    response.json({
      codigo: 200,
      mensaje: "El cliente se ha borrado correctamente",
    });
  } catch (error) {
    console.log(error);
    response.status(error.codigo).json(error);
  }
}

//HEAD /usuarios?login=xXx
async function comprobarLoginUsuario(request, response) {
  let login = request.query.login;
  if (!login) {
    response.status(400).end("Falta el login");
    return;
  }
  try {
    let usuarioEncontrado = await negocioUsuarios.buscarPorLogin(login);
    if (usuarioEncontrado) {
      response.json(); //Es un head, no pondremos nada en el body
    } else {
      response
        .status(404)
        .json({ codigo: 404, mensaje: "No existe un usuario con ese login" });
    }
  } catch (error) {
    console.log(error);
    response.status(error.codigo).json(error);
  }
}
// PUT /usuarios/87
//ct application json
//authoritation: Bearer portador  ñsjhñsadfñlksañdflk.ñksjdhñflasdjhf.slkdñfjsañlkdfj
//----------------
//{
//_id :87
//nombre: "bart"
//direccion: ...
// }

async function modificarUsuario(request, response) {
  let idUsuario = request.params.id
  let usuario = request.body

  if (usuario._id != idUsuario) {
    response.status(400).json("Qué cojones estas haciendo con los ids");
    return
  }
  try{
    let autoridad = request.autoridad
    await negocioUsuarios.modificarUsuario(usuario, autoridad)
    response.json({ mensaje: "El usuario se modifico correctamente" })
  }catch (error) {
    console.log(error)
    response.status(error.codigo).json(error)
  }
}