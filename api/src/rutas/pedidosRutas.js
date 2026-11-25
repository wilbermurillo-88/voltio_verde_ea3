import { Router } from "express";
import * as servicio from "../servicios/pedidosServicio.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json(servicio.listar());
});

router.post("/", (req, res) => {
  const resultado = servicio.crear(req.body ?? {});
  if (resultado.errores) {
    return res.status(resultado.noEncontrado ? 404 : 400).json({ errores: resultado.errores });
  }
  return res.status(201).json(resultado.pedido);
});

export default router;
