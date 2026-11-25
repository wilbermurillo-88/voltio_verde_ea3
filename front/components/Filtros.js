const categorias = [
  { valor: "", etiqueta: "Todas" },
  { valor: "iluminacion", etiqueta: "Iluminación" },
  { valor: "electrodomesticos", etiqueta: "Electrodomésticos" },
  { valor: "solar", etiqueta: "Energía solar" }
];

export default function Filtros({ categoria, onCambiar }) {
  return (
    <div className="filtros" role="group" aria-label="Filtrar por categoría">
      {categorias.map((opcion) => (
        <button
          className={`filtro${categoria === opcion.valor ? " activo" : ""}`}
          type="button"
          key={opcion.valor || "todas"}
          aria-pressed={categoria === opcion.valor}
          onClick={() => onCambiar(opcion.valor)}
        >
          {opcion.etiqueta}
        </button>
      ))}
    </div>
  );
}
