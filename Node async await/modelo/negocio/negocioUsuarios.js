
const Usuario = require("../entidades/usuario").Usuario
const Producto = require("../entidades/producto").Producto
const UsuarioHistorico = require("../entidades/usuarioHistorico").UsuarioHistorico
const crearError = require("../../util/errorUtil").crearError
const mongoose = require("mongoose")


exports.buscarPorLogin = async function (login) {
  try {
/*     return await mongodbUtil.esquema
      .collection("usuarios")
      .findOne({ login: login })*/

   return await Usuario.findOne({login:login})

    
  } catch (error) {
    console.log(error); // capturamos el error
    throw crearError(500, "Error al conectar con la base de datos"); //lanzamos otro
  }
};


exports.buscarPorId = async function (id) {
  try {
/*     return await mongodbUtil.esquema
      .collection("usuarios")
      .findOne({ login: login })*/

   return await Usuario.findById(id)

    
  } catch (error) {
    console.log(error); // capturamos el error
    throw crearError(500, "Error al conectar con la base de datos"); //lanzamos otro
  }
};


exports.insertarUsuario = async function (usuario) {
  //Validar los datos
  //Comprobar que el login no está repetido
  //insertar el usuario
  if (
    !usuario.login ||
    usuario.login.trim() == "" ||
    !usuario.correoE ||
    usuario.correoE.trim() == "" ||
    !usuario.nombre ||
    usuario.nombre.trim() == ""
  ) {
    throw crearError(400, "Datos inválidos");
  }

  try {
    let usuarioEncontrado = await exports.buscarPorLogin(usuario.login);

    //Si se ha encontrado significa que NO DEBEMOS insertar
    if (usuarioEncontrado) {
      throw crearError(400, "Ya existe el login");
    }
    usuario.rol = "CLIENTE";
    usuario.fechaAlta = Date.now()
    usuario.estado= "ACTIVO"
    //QUITAR EL _ID
    delete usuario._id

    let usuarioMG = new Usuario(usuario)
   return await usuarioMG.save()
    //return await mongodbUtil.esquema.collection("usuarios").insertOne(usuario);
  } catch (error) {
    if (error.codigo) {
      throw error;
    }
    console.log(error); // capturamos el error
    throw crearError(500, "Fallo en la bb.dd al insertar usuario"); //lanzamos otro
  }
};
//Autenticación: si
//Autorización :
//-empleados: pueden modificar cualquier usuario
//-clientes : solo pueden modificarse a si mismos
exports.modificarUsuario = async function (usuario, autoridad) {
  try {
    //Validación
    if (
      !usuario.login ||
      usuario.login.trim() == "" ||
      !usuario.correoE ||
      usuario.correoE.trim() == "" ||
      !usuario.nombre ||
      usuario.nombre.trim() == "" ||
      !usuario.direccion ||
      usuario.direccion.trim() == "" ||
      !usuario.telefono ||
      usuario.telefono.trim() == ""
    ) {
      throw crearError(400, "Datos inválidos");
      //pa no seguir
    }

    if (autoridad.rol != "EMPLEADO" && autoridad._id != usuario._id) {
      throw crearError(403, "Los clientes solo pueden modificarse a si mismos");
    }

    //Modificar
    let resultado = await Usuario
      .findByIdAndUpdate(
        /*  { _id : new ObjectId(usuario._id) },  */
        usuario._id,
        {
          $set: {
            //Aqui no podemos colocar el _id (es inmutable)
            nombre: usuario.nombre,
            correoE: usuario.correoE,
            telefono: usuario.telefono,
            direccion: usuario.direccion,
          },
        }
      )

    if (!resultado) {
      throw crearError(404, "El usuario no existe");
    }
  } catch (error) {
    if (error.codigo) {
      throw error;
    }
    console.log(error); // capturamos el error
    throw crearError(500, "Fallo en la bb.dd al insertar usuario"); //lanzamos otro
  }
};

exports.borrarUsuario = async function (idUsuario, autoridad) {
  console.log("autoridad rol", autoridad.rol);
  console.log("autoridad id", autoridad._id);
  console.log("usuario", idUsuario);

  if (autoridad.rol != "EMPLEADO" && autoridad._id != idUsuario) {
    throw crearError(403, "Los clientes solo pueden darse de baja a si mismos");
  }

  let session;

  try {
    //Autorización
    //buscamos el usuario a partir del id
    // lo insertamos en la coleccion usuarios historicos
    //lo elmininamos de la coleccion usuarios

    //inicio de la transacion

   session = await mongoose.startSession()
   
    session.startTransaction();

    let usuario = await Usuario.findById(idUsuario)//este findbyid no necesita estar dentro de la transaccion
   

    if (!usuario) {
      throw crearError(404, "El cliente no existe");
    }
   let usuarioAPaloSeco = usuario.toObject()
   delete usuarioAPaloSeco._id
    let usuarioHistorico = new UsuarioHistorico(usuarioAPaloSeco)
    
    usuarioHistorico.fechaBaja = Date.now()

    await usuarioHistorico.save({session})
      
   /*  await Usuario.findByIdAndDelete(usuario._id).session(session); */
    await usuario.deleteOne({session})

    await session.commitTransaction();
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    if (error.codigo) {
      throw error;
    }
    throw crearError(500, "Error con la bb.dd. al eliminar el usuario.");
  } finally {
    await session.endSession()
  }
};
