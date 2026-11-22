import * as repositorio from "../repositorios/productosRepositorio.js";

const categorias = new Set(["iluminacion", "electrodomesticos", "solar"]);
const camposNumericos = ["precio", "wattsAntes", "wattsDespues", "horasDia"];

function incluirAhorro(producto) {
  if (!producto) return producto;
  const ahorroKwhMes = (producto.wattsAntes - producto.wattsDespues) * producto.horasDia * 30 / 1000;
  return { ...producto, ahorroKwhMes, ahorroPesosMes: ahorroKwhMes * 950 };
}

function validarProducto(datos) {
  const errores = [];
  if (typeof datos.nombre !== "string" || datos.nombre.trim().length < 2) {
    errores.push("El nombre debe tener al menos 2 caracteres.");
  }
  if (!categorias.has(datos.categoria)) {
    errores.push("La categoría debe ser iluminacion, electrodomesticos o solar.");
  }
  for (const campo of camposNumericos) {
    if (typeof datos[campo] !== "number" || !Number.isFinite(datos[campo]) || datos[campo] < 0) {
      errores.push(`${campo} debe ser un número mayor o igual a cero.`);
    }
  }
  if (Number.isFinite(datos.wattsDespues) && Number.isFinite(datos.wattsAntes)
      && datos.wattsDespues > datos.wattsAntes) {
    errores.push("wattsDespues no puede superar wattsAntes.");
  }
  return errores;
}

export function listar(categoria) {
  return repositorio.listar(categoria).map(incluirAhorro);
}

export function buscarPorId(id) {
  return incluirAhorro(repositorio.buscarPorId(id));
}

export function crear(datos) {
  const errores = validarProducto(datos);
  if (errores.length) return { errores };
  return { producto: incluirAhorro(repositorio.crear({ ...datos, nombre: datos.nombre.trim() })) };
}

export function actualizar(id, datos) {
  const errores = validarProducto(datos);
  if (errores.length) return { errores };
  return { producto: incluirAhorro(repositorio.actualizar(id, { ...datos, nombre: datos.nombre.trim() })) };
}

export function borrar(id) {
  if (repositorio.estaEnPedido(id)) return { eliminado: false, conflicto: true };
  return { eliminado: repositorio.borrar(id), conflicto: false };
}
