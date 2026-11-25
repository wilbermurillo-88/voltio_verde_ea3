import { Router } from "express";
import * as servicio from "../servicios/productosServicio.js";

const router = Router();

function idValido(valor) {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}

router.get("/", (req, res) => {
  res.json(servicio.listar(req.query.categoria));
});

router.get("/:id", (req, res) => {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ error: "El id es un entero positivo." });
  const producto = servicio.buscarPorId(id);
  if (!producto) return res.status(404).json({ error: "Producto no encontrado." });
  return res.json(producto);
});

router.post("/", (req, res) => {
  const resultado = servicio.crear(req.body ?? {});
  if (resultado.errores) return res.status(400).json({ errores: resultado.errores });
  return res.status(201).json(resultado.producto);
});

router.put("/:id", (req, res) => {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ error: "El id es un entero positivo." });
  const resultado = servicio.actualizar(id, req.body ?? {});
  if (resultado.errores) return res.status(400).json({ errores: resultado.errores });
  if (!resultado.producto) return res.status(404).json({ error: "Producto no encontrado." });
  return res.json(resultado.producto);
});

router.delete("/:id", (req, res) => {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ error: "El id es un entero positivo." });
  const resultado = servicio.borrar(id);
  if (resultado.conflicto) {
    return res.status(409).json({ error: "No podemos eliminar un producto incluido en un pedido." });
  }
  if (!resultado.eliminado) return res.status(404).json({ error: "Producto no encontrado." });
  return res.status(200).json({ mensaje: "Producto eliminado." });
});

export default router;
