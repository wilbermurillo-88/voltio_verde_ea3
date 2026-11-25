import { db } from "../db.js";

db.exec(`
  CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    categoria TEXT NOT NULL CHECK (categoria IN ('iluminacion', 'electrodomesticos', 'solar')),
    precio REAL NOT NULL CHECK (precio >= 0),
    wattsAntes REAL NOT NULL CHECK (wattsAntes >= 0),
    wattsDespues REAL NOT NULL CHECK (wattsDespues >= 0 AND wattsDespues <= wattsAntes),
    horasDia REAL NOT NULL CHECK (horasDia >= 0)
  );

  CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente TEXT NOT NULL,
    fecha TEXT NOT NULL,
    total REAL NOT NULL CHECK (total >= 0)
  );

  CREATE TABLE IF NOT EXISTS pedido_productos (
    pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario REAL NOT NULL CHECK (precio_unitario >= 0),
    PRIMARY KEY (pedido_id, producto_id)
  );
`);

const cantidad = db.prepare("SELECT COUNT(*) AS total FROM productos").get().total;
if (cantidad === 0) {
  const insertar = db.prepare(`
    INSERT INTO productos (nombre, categoria, precio, wattsAntes, wattsDespues, horasDia)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const productos = [
    ["Bombillo LED 9 W", "iluminacion", 8900, 60, 9, 5],
    ["Panel LED 18 W", "iluminacion", 35000, 40, 18, 8],
    ["Reflector LED 50 W", "iluminacion", 59000, 250, 50, 6],
    ["Nevera eficiente", "electrodomesticos", 1890000, 80, 40, 24],
    ["Aire acondicionado inverter", "electrodomesticos", 2100000, 1400, 900, 6],
    ["Regleta con apagado automático", "electrodomesticos", 65000, 15, 0, 20],
    ["Calentador solar de agua", "solar", 1200000, 3500, 0, 0.5],
    ["Kit de panel solar 550 W", "solar", 2400000, 550, 0, 4.5]
  ];
  db.exec("BEGIN");
  try {
    for (const producto of productos) insertar.run(...producto);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

console.log(`Base de datos lista: ${cantidad === 0 ? "8 productos cargados." : "productos existentes conservados."}`);
db.close();
