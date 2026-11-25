import Encabezado from "../components/Encabezado";
import "./globals.css";

export const metadata = {
  title: "Voltio Verde | Equipos eficientes",
  description: "Compara equipos eficientes y estima el ahorro energético de tu hogar."
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="contenedor">
        <Encabezado />
        {children}
        <footer className="pie">
          <p>Ingeniería Web I · IU Digital de Antioquia · 2026-2</p>
        </footer>
      </body>
    </html>
  );
}
