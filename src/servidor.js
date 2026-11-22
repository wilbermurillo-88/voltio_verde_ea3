import express from "express";
import productosRutas from "./rutas/productosRutas.js";
import pedidosRutas from "./rutas/pedidosRutas.js";

const app = express();
const puerto = Number(process.env.PORT) || 3001;
const origenesPermitidos = new Set(
  (process.env.ORIGENES_PERMITIDOS || "http://localhost:3000,http://127.0.0.1:3000")
    .split(",")
    .map((origen) => origen.trim())
);

app.use((req, res, next) => {
  const origen = req.headers.origin;
  if (origen && origenesPermitidos.has(origen)) {
    res.setHeader("Access-Control-Allow-Origin", origen);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  return next();
});
app.use(express.json({ limit: "100kb" }));
app.use("/api/productos", productosRutas);
app.use("/api/pedidos", pedidosRutas);
app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ error: "El cuerpo de la solicitud debe ser JSON válido." });
  }
  console.error(error);
  return res.status(500).json({ error: "Ocurrió un error interno en la API." });
});

app.listen(puerto, () => {
  console.log(`API Voltio Verde disponible en http://localhost:${puerto}`);
});
