import { db } from "../db.js";

export function listar(categoria) {
  if (categoria) {
    return db.prepare("SELECT * FROM productos WHERE categoria = ? ORDER BY id").all(categoria);
  }
  return db.prepare("SELECT * FROM productos ORDER BY id").all();
}

export function buscarPorId(id) {
  return db.prepare("SELECT * FROM productos WHERE id = ?").get(id);
}

export function crear(producto) {
  const resultado = db.prepare(`
    INSERT INTO productos (nombre, categoria, precio, wattsAntes, wattsDespues, horasDia)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    producto.nombre,
    producto.categoria,
    producto.precio,
    producto.wattsAntes,
    producto.wattsDespues,
    producto.horasDia
  );
  return buscarPorId(Number(resultado.lastInsertRowid));
}

export function actualizar(id, producto) {
  const resultado = db.prepare(`
    UPDATE productos
    SET nombre = ?, categoria = ?, precio = ?, wattsAntes = ?, wattsDespues = ?, horasDia = ?
    WHERE id = ?
  `).run(
    producto.nombre,
    producto.categoria,
    producto.precio,
    producto.wattsAntes,
    producto.wattsDespues,
    producto.horasDia,
    id
  );
  return resultado.changes > 0 ? buscarPorId(id) : null;
}

export function borrar(id) {
  return db.prepare("DELETE FROM productos WHERE id = ?").run(id).changes > 0;
}

export function estaEnPedido(id) {
  return db.prepare("SELECT 1 FROM pedido_productos WHERE producto_id = ? LIMIT 1").get(id) !== undefined;
}
