import Link from "next/link";

export default function Encabezado() {
  return (
    <header className="encabezado">
      <Link className="marca" href="/" aria-label="Voltio Verde, inicio">
        <span className="marca-icono" aria-hidden="true">VV</span>
        <span>Voltio Verde</span>
      </Link>
      <p>Decisiones eficientes para un hogar que consume mejor.</p>
      <nav className="menu" aria-label="Navegación principal">
        <Link href="/">Inicio</Link>
        <Link href="/catalogo">Catálogo</Link>
        <Link href="/admin">Administración</Link>
      </nav>
    </header>
  );
}
