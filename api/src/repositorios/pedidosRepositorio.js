import { db } from "../db.js";

export function crear({ cliente, productos, total }) {
  db.exec("BEGIN");
  try {
    const resultado = db.prepare(
      "INSERT INTO pedidos (cliente, fecha, total) VALUES (?, ?, ?)"
    ).run(cliente, new Date().toISOString(), total);
    const pedidoId = Number(resultado.lastInsertRowid);
    const insertarProducto = db.prepare(
      "INSERT INTO pedido_productos (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)"
    );

    for (const producto of productos) {
      insertarProducto.run(pedidoId, producto.id, producto.cantidad, producto.precio);
    }

    db.exec("COMMIT");
    return buscarPorId(pedidoId);
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function listar() {
  const pedidos = db.prepare("SELECT * FROM pedidos ORDER BY fecha DESC, id DESC").all();
  const productos = db.prepare(`
    SELECT pp.pedido_id, pp.producto_id, pp.cantidad, pp.precio_unitario, p.nombre
    FROM pedido_productos pp
    JOIN productos p ON p.id = pp.producto_id
    ORDER BY pp.pedido_id, pp.producto_id
  `).all();
  return pedidos.map((pedido) => ({
    ...pedido,
    productos: productos.filter((producto) => producto.pedido_id === pedido.id)
  }));
}

function buscarPorId(id) {
  return listar().find((pedido) => pedido.id === id);
}
