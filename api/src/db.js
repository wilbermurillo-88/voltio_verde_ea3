import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const directorio = dirname(fileURLToPath(import.meta.url));
const rutaBaseDatos = process.env.DB_PATH
  ? resolve(process.env.DB_PATH)
  : join(directorio, "..", "datos", "tienda.db");

mkdirSync(dirname(rutaBaseDatos), { recursive: true });

export const db = new DatabaseSync(rutaBaseDatos);
db.exec("PRAGMA foreign_keys = ON");
