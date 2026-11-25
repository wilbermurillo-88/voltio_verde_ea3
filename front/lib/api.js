const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/$/, "");

async function solicitar(ruta, opciones = {}) {
  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      ...opciones,
      headers: {
        ...(opciones.body ? { "Content-Type": "application/json" } : {}),
        ...opciones.headers
      }
    });
  } catch {
    throw new Error("No fue posible conectarse con la API. Verifica que el backend esté ejecutándose.");
  }

  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    const detalle = datos.errores?.join(" ") || datos.error || "La solicitud no pudo completarse.";
    throw new Error(detalle);
  }
  return datos;
}

export function obtenerProductos(categoria = "") {
  const filtro = categoria ? `?categoria=${encodeURIComponent(categoria)}` : "";
  return solicitar(`/productos${filtro}`);
}

export function crearProducto(producto) {
  return solicitar("/productos", { method: "POST", body: JSON.stringify(producto) });
}

export function actualizarProducto(id, producto) {
  return solicitar(`/productos/${id}`, { method: "PUT", body: JSON.stringify(producto) });
}

export function eliminarProducto(id) {
  return solicitar(`/productos/${id}`, { method: "DELETE" });
}

export function crearPedido(pedido) {
  return solicitar("/pedidos", { method: "POST", body: JSON.stringify(pedido) });
}
