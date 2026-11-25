import Link from "next/link";

export default function Inicio() {
  return (
    <main>
      <section className="hero">
        <p className="sobrelinea">Energía inteligente para todos los días</p>
        <h1>Que el calor no se lleve también tu presupuesto.</h1>
        <p>En temporadas de menor disponibilidad hídrica, consumir cada kilovatio con eficiencia importa. Compara equipos y conoce un estimado del ahorro antes de comprar.</p>
        <Link className="btn btn-primary" href="/catalogo">Explorar equipos eficientes</Link>
      </section>
      <section aria-labelledby="datos-titulo">
        <h2 id="datos-titulo">El contexto energético en cifras</h2>
        <div className="tarjetas">
          <article className="tarjeta dato"><span className="dato-valor">212 COP/kWh</span><h3>Precio de bolsa en enero</h3><p>Dato reportado en el material de clase para el mercado de energía.</p></article>
          <article className="tarjeta dato"><span className="dato-valor">942 COP/kWh</span><h3>Precio de bolsa en agosto</h3><p>El valor reportado es cerca de 4,4 veces el de enero.</p></article>
          <article className="tarjeta dato"><span className="dato-valor">1.612 COP/kWh</span><h3>Referencia de hora pico</h3><p>Valor de referencia citado para septiembre de 2026 en el material base.</p></article>
        </div>
      </section>
      <section aria-labelledby="beneficios-titulo">
        <h2 id="beneficios-titulo">¿Por qué elegir un equipo eficiente?</h2>
        <div className="tarjetas">
          <article className="tarjeta"><h3>Reduce el consumo</h3><p>Una menor potencia para el mismo uso puede traducirse en menos kWh consumidos.</p></article>
          <article className="tarjeta"><h3>Estima tu inversión</h3><p>Compara el precio con un ahorro mensual estimado y calcula en cuánto tiempo podría compensarse.</p></article>
          <article className="tarjeta"><h3>Elige con información</h3><p>Revisa potencia, horas de uso y categoría para encontrar una opción adecuada a tu hogar.</p></article>
        </div>
      </section>
    </main>
  );
}
