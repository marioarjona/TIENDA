
const ServicioProductos = require("../modelo/negocio/negocioProductos").ServicioProductos
const crearError = require("../util/errorUtil").crearError
///////////////////////////////////////

class EndPointProductos {

  servicioProductos
  
  constructor(){
    this.servicioProductos = new ServicioProductos()
  }

  async insertarProducto(request, response) {
      try {
        let autoridad = request.autoridad
          let producto = request.body;
          let resultado = await this.servicioProductos.insertarProducto(producto, autoridad);

      response.status(201).json(resultado); // que el resultado dice que id
    } catch (error) {
      console.log(error);
      response.status(error.codigo).json(error);
    }
  }

  async listarProductos(request, response) {
    try {
      let productos = await this.servicioProductos.listarProductos({})
  
      response.status(200).json(productos)
    } catch (error) {
      console.log(error);
      response.status(error.codigo).json(error);
    }
  }

  async buscarProductoPorId(request, response) {
    let idProducto = request.params.id
  
    try {

      let productoEncontrado = await this.servicioProductos.buscarProductoPorId(idProducto)
        if(productoEncontrado){
        response.status(200).json(productoEncontrado)
        }else
        {
          response.status(404).json(crearError(404, "pa tu culo mi zapato"))
        } //Es un head, no pondremos nada en el body
      } catch(error) 
      {
      console.log(error)
      response.status(error.codigo).json(error);
    }
  }


}//clase 100% funcionalidad

exports.endPointProductos = new EndPointProductos()