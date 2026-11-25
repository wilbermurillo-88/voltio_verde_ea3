import * as pedidosRepositorio from "../repositorios/pedidosRepositorio.js";
import * as productosRepositorio from "../repositorios/productosRepositorio.js";

export function crear(datos) {
  if (typeof datos.cliente !== "string" || datos.cliente.trim().length < 2) {
    return { errores: ["El nombre del cliente debe tener al menos 2 caracteres."] };
  }
  if (!Array.isArray(datos.productos) || datos.productos.length === 0) {
    return { errores: ["El pedido debe incluir al menos un producto."] };
  }

  const cantidades = new Map();
  for (const linea of datos.productos) {
    if (!Number.isInteger(linea.productoId) || !Number.isInteger(linea.cantidad) || linea.cantidad < 1) {
      return { errores: ["Cada producto debe tener un productoId y una cantidad entera mayor a cero."] };
    }
    cantidades.set(linea.productoId, (cantidades.get(linea.productoId) || 0) + linea.cantidad);
  }

  const lineas = [];
  for (const [productoId, cantidad] of cantidades) {
    const producto = productosRepositorio.buscarPorId(productoId);
    if (!producto) return { errores: [`No existe el producto ${productoId}.`], noEncontrado: true };
    lineas.push({ id: producto.id, precio: producto.precio, cantidad });
  }

  const total = lineas.reduce((suma, linea) => suma + linea.precio * linea.cantidad, 0);
  return {
    pedido: pedidosRepositorio.crear({ cliente: datos.cliente.trim(), productos: lineas, total })
  };
}

export function listar() {
  return pedidosRepositorio.listar();
}
