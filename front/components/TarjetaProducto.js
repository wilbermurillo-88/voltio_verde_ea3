const TARIFA = 950;
const DIAS_MES = 30;
const pesos = (valor) => `$${Math.round(valor).toLocaleString("es-CO")}`;

const nombresCategoria = {
  iluminacion: "Iluminación",
  electrodomesticos: "Electrodomésticos",
  solar: "Energía solar"
};

export default function TarjetaProducto({ producto, onAgregar }) {
  const ahorroKwh = producto.ahorroKwhMes
    ?? (producto.wattsAntes - producto.wattsDespues) * producto.horasDia * DIAS_MES / 1000;
  const ahorroPesos = producto.ahorroPesosMes ?? ahorroKwh * TARIFA;
  return (
    <article className="tarjeta tarjeta-producto">
      <span className="categoria">{nombresCategoria[producto.categoria] || producto.categoria}</span>
      <h2>{producto.nombre}</h2>
      <p>Potencia reemplazada: {producto.wattsAntes} W · equipo nuevo: {producto.wattsDespues} W.</p>
      <p>Uso estimado: {producto.horasDia} horas al día.</p>
      <p>Ahorro estimado: <span className="ahorro">{ahorroKwh.toFixed(1)} kWh</span> al mes.</p>
      <p className="precio">{pesos(producto.precio)}</p>
      <p>Ahorro mensual: <span className="ahorro">{pesos(ahorroPesos)}</span></p>
      <button className="btn btn-primary" type="button" onClick={() => onAgregar(producto)}>
        Agregar al carrito
      </button>
    </article>
  );
}
