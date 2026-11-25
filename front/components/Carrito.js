"use client";

import { useState } from "react";

const pesos = (valor) => `$${Math.round(valor).toLocaleString("es-CO")}`;

export default function Carrito({ productos, onQuitar, onVaciar, onConfirmar, ocupado }) {
  const [cliente, setCliente] = useState("");
  const [error, setError] = useState("");
  const total = productos.reduce((suma, producto) => suma + producto.precio, 0);
  const ahorroMes = productos.reduce(
    (suma, producto) => suma + (producto.ahorroPesosMes
      ?? (producto.wattsAntes - producto.wattsDespues) * producto.horasDia * 30 / 1000 * 950),
    0
  );

  async function confirmar() {
    setError("");
    try {
      await onConfirmar(cliente);
      setCliente("");
    } catch (mensaje) {
      setError(mensaje.message);
    }
  }

  return (
    <aside id="carrito" aria-labelledby="carrito-titulo">
      <h2 id="carrito-titulo">Tu carrito</h2>
      {productos.length === 0 ? <p>Aún no agregas productos.</p> : (
        <ul className="lista-carrito">
          {productos.map((producto, indice) => (
            <li key={`${producto.id}-${indice}`}>
              {producto.nombre}: {pesos(producto.precio)}
              <button className="enlace-boton" type="button" onClick={() => onQuitar(indice)} aria-label={`Quitar ${producto.nombre}`}>
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="resumen-total">Total: {pesos(total)}</p>
      <p>Ahorro estimado: {pesos(ahorroMes)} al mes.</p>
      <p>{productos.length && ahorroMes > 0
        ? `Recuperación estimada: ${Math.ceil(total / ahorroMes)} meses.`
        : "Agrega productos para estimar la recuperación de la compra."}</p>
      <label className="campo-formulario" htmlFor="nombre-cliente">Nombre para el pedido</label>
      <input id="nombre-cliente" className="form-control" value={cliente} onChange={(evento) => setCliente(evento.target.value)} />
      {error && <p className="mensaje-error" role="alert">{error}</p>}
      <div className="acciones-carrito">
        <button className="btn btn-primary" type="button" onClick={confirmar} disabled={ocupado || !productos.length || cliente.trim().length < 2}>
          {ocupado ? "Enviando..." : "Confirmar pedido"}
        </button>
        <button className="btn btn-secundario" type="button" onClick={onVaciar} disabled={!productos.length}>
          Vaciar carrito
        </button>
      </div>
    </aside>
  );
}
