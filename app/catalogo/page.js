"use client";

import { useEffect, useState } from "react";
import Carrito from "../../components/Carrito";
import Filtros from "../../components/Filtros";
import TarjetaProducto from "../../components/TarjetaProducto";
import { crearPedido, obtenerProductos } from "../../lib/api";

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [error, setError] = useState("");
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    let vigente = true;
    async function cargarProductos() {
      try {
        const datos = await obtenerProductos(categoria);
        if (vigente) {
          setProductos(datos);
          setError("");
        }
      } catch (mensaje) {
        if (vigente) setError(mensaje.message);
      }
    }

    cargarProductos();
    return () => { vigente = false; };
  }, [categoria]);

  async function confirmarPedido(cliente) {
    setOcupado(true);
    try {
      await crearPedido({
        cliente,
        productos: carrito.map((producto) => ({ productoId: producto.id, cantidad: 1 }))
      });
      setCarrito([]);
      setError("¡Pedido confirmado y guardado!");
    } catch (mensaje) {
      throw mensaje;
    } finally {
      setOcupado(false);
    }
  }

  return (
    <main>
      <section className="catalogo-intro">
        <h1>Catálogo de eficiencia</h1>
        <p>Estimaciones con una tarifa de referencia de 950 COP/kWh y 30 días por mes. Los resultados dependen del uso real y del equipo reemplazado.</p>
      </section>
      <Filtros categoria={categoria} onCambiar={setCategoria} />
      {error && <p className={error.startsWith("¡") ? "mensaje-exito" : "mensaje-error"} role="status">{error}</p>}
      <div className="catalogo">
        <section aria-label="Productos disponibles">
          <div className="tarjetas">
            {productos.length
              ? productos.map((producto) => <TarjetaProducto key={producto.id} producto={producto} onAgregar={(item) => setCarrito((actual) => [...actual, item])} />)
              : !error && <p className="sin-resultados">No hay productos para mostrar.</p>}
          </div>
        </section>
        <Carrito
          productos={carrito}
          onQuitar={(indice) => setCarrito((actual) => actual.filter((_, posicion) => posicion !== indice))}
          onVaciar={() => setCarrito([])}
          onConfirmar={confirmarPedido}
          ocupado={ocupado}
        />
      </div>
    </main>
  );
}
