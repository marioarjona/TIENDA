const endPointProductos = require("./endPointProductos").endPointProductos

const router = require("express").Router()


router.get("/seguro/productos/:id", endPointProductos.buscarProductoPorId.bind(endPointProductos))
router.get("/seguro/productos",endPointProductos.listarProductos.bind(endPointProductos))//quiero que llames a esta funcion a traves del objeto que la tiene ...... 
router.post("/seguro/productos", endPointProductos.insertarProducto.bind(endPointProductos))


exports.router = router
