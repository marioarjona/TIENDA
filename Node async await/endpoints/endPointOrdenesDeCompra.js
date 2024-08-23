const negocioOrdenesDeCompra = require("../modelo/negocio/negocioOrdenesCompra")
const router = require("express").Router()

router.post("/seguro/ordenesDeCompra", procesarOrdenDeCompra)


exports.router = router;

///////////////////////////////////////
// FUNCIONES DE LA LÓGICA DE CONTROL //
///////////////////////////////////////


async function procesarOrdenDeCompra(request, response) {
    try {
        let ordenDeCompra = request.body
        let autoridad = request.autoridad
        const resultado = await negocioOrdenesDeCompra.procesarOrdenDeCompra(ordenDeCompra, autoridad)
        
    response
    .status(201)
    .json(resultado.factura)
  } catch (error) {
    console.log(error);
    response.status(error.codigo).json(error);
  }
}

