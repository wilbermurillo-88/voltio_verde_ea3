# Voltio Verde

Voltio Verde es una aplicación web académica para explorar equipos eficientes para el hogar. El frontend está construido con **React y Next.js** y consume una API REST desarrollada con **Node.js y Express**. La API guarda productos y pedidos en una base de datos **SQLite**.

La aplicación permite consultar y filtrar productos, estimar el ahorro energético y económico, armar un carrito y guardar pedidos. También incluye una página de administración para crear y eliminar productos.

> Los ahorros son estimaciones educativas calculadas con una tarifa de referencia de **950 COP/kWh** y **30 días por mes**. Dependen del uso real y del equipo reemplazado; no son una cotización ni una garantía.

## Requisitos

- Node.js **22.5.0 o posterior** y npm. Node 22.5.0 es necesario porque el backend usa `node:sqlite`.
- No se requiere Docker.

## Inicio rápido

El backend y el frontend se ejecutan en terminales separadas desde la raíz del proyecto.

### 1. Instalar e iniciar la API

```bash
cd api
npm install
npm run crear-bd
npm run dev
```

La API estará disponible en `http://localhost:3001`. El comando `crear-bd` crea el esquema SQLite en `api/datos/tienda.db` y carga ocho productos de ejemplo si el catálogo está vacío. Si ya hay productos, los conserva.

### 2. Instalar e iniciar el frontend

En otra terminal:

```bash
cd front
npm install
npm run dev
```

Abre `http://localhost:3000`. Por defecto, el frontend se conecta a `http://localhost:3001/api`.

Para usar otra dirección de API, copia `front/.env.example` como `front/.env.local` y ajusta la variable:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Configura esta variable antes de iniciar el servidor o generar la exportación estática, ya que Next.js la incorpora al frontend.

## Páginas

- `/`: página de inicio con información sobre eficiencia energética.
- `/catalogo`: catálogo filtrable por iluminación, electrodomésticos y energía solar. Permite agregar productos al carrito, estimar ahorro y confirmar un pedido.
- `/admin`: formulario de creación y listado de productos con opción para eliminarlos.

La administración no incluye autenticación; está pensada para el contexto académico del proyecto.

## API REST

Las rutas están bajo el prefijo `/api`.

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/productos` | Lista productos; acepta el filtro opcional `?categoria=solar`. |
| `GET` | `/productos/:id` | Consulta un producto por identificador. |
| `POST` | `/productos` | Crea un producto. |
| `PUT` | `/productos/:id` | Actualiza un producto. |
| `DELETE` | `/productos/:id` | Elimina un producto, excepto si ya forma parte de un pedido. |
| `GET` | `/pedidos` | Lista pedidos con sus productos. |
| `POST` | `/pedidos` | Registra un pedido; el total se calcula en el servidor. |

Para probar las solicitudes, inicia la API y abre `api/pruebas.http` con la extensión REST Client de VS Code.

### Configuración opcional de la API

- `PORT`: puerto del servidor. Por defecto, `3001`.
- `ORIGENES_PERMITIDOS`: lista de orígenes frontend separados por comas. Por defecto, `http://localhost:3000,http://127.0.0.1:3000`.
- `DB_PATH`: ruta opcional del archivo SQLite. Si no se define, se usa `api/datos/tienda.db`. En un proveedor de hosting, configúrala con la ruta del disco persistente.

## Publicar en GitHub Pages y Render

GitHub Pages solo sirve el frontend estático; no ejecuta Node.js ni la API. Para usar el catálogo y guardar pedidos en línea, despliega la API como un servicio web independiente. Estos pasos usan Render como ejemplo.

### 1. Crear el servicio de API en Render

En Render, crea un **Web Service** conectado al repositorio GitHub que contiene `api/` y `front/` y configura:

- **Root Directory:** `api`
- **Build Command:** `npm install`
- **Start Command:** `npm run crear-bd && npm start`
- **Runtime:** Node.js 22.5.0 o posterior.

Agrega un disco persistente al servicio y usa su ruta de montaje como `DB_PATH` (por ejemplo, `/var/data/tienda.db` si el disco se monta en `/var/data`). Sin un disco persistente, el archivo SQLite puede perderse al reiniciar o volver a desplegar el servicio.

Configura también estas variables de entorno en Render:

```text
DB_PATH=/var/data/tienda.db
ORIGENES_PERMITIDOS=https://josemurillo0731.github.io
```

Cuando el servicio esté desplegado, prueba `https://<nombre-del-servicio>.onrender.com/api/productos`. Debe responder con JSON. Sustituye `<nombre-del-servicio>` por el dominio asignado por Render.

> **Importante:** la API no tiene autenticación. Si la publicas en Internet, cualquier persona que conozca su URL podría crear o eliminar productos. No uses datos privados y considera agregar autenticación antes de usarla fuera de la demostración académica.

### 2. Reconstruir y publicar el frontend

En Windows CMD, desde la raíz local del proyecto, define la URL pública de la API y genera nuevamente la exportación:

```cmd
cd /d "C:\Users\ASUS\OneDrive\Documentos\voltio_verde\front"
set GITHUB_PAGES=true
set NEXT_PUBLIC_API_URL=https://<nombre-del-servicio>.onrender.com/api
npm run build
```

Reemplaza la URL de ejemplo por el dominio real de tu servicio. Luego copia **todo el contenido** de `front/out/` al repositorio y la rama que GitHub Pages publica, conserva las carpetas `_next/` y el archivo `.nojekyll`, y sube los cambios. La URL pública se incorpora al frontend durante la compilación, por eso es necesario volver a compilar después de configurar la API.

## Exportación estática

Next.js está configurado para exportar el frontend como archivos estáticos:

```bash
cd front
npm run build
```

El resultado queda en `front/out/` y puede publicarse en un servidor estático. La API Express debe permanecer disponible para consultar el catálogo, administrar productos y guardar pedidos. Para esta modalidad, define `NEXT_PUBLIC_API_URL` con la dirección pública de la API antes de compilar; `next start` no se usa para servir la exportación.

## Tecnologías y organización

- **Frontend:** React 19, Next.js 16 y CSS.
- **Backend:** Node.js, Express 5 y SQLite integrado en Node.js.
- **Persistencia:** productos, pedidos y detalle de productos de cada pedido.

```text
api/
  src/
    rutas/           # Endpoints HTTP para productos y pedidos
    servicios/       # Validaciones y reglas de negocio
    repositorios/    # Consultas a SQLite
    scripts/         # Creación del esquema y datos iniciales
  pruebas.http       # Solicitudes de ejemplo para REST Client
  datos/             # Base de datos local (no versionada)
front/
  app/               # Páginas Next.js y estilos globales
  components/        # Encabezado, filtros, tarjetas y carrito
  lib/api.js         # Cliente HTTP para consumir la API
  .env.example       # Ejemplo de configuración de la URL de API
```

## Dependencias

Las dependencias del frontend y del backend se instalan de forma independiente en sus respectivas carpetas. Next.js está fijado a la versión exacta **16.4.6** (sin `^`), y las versiones quedan registradas también en cada `package-lock.json`.

La revisión ejecutada el **16 de noviembre de 2026** encontró cero vulnerabilidades en ambas carpetas. Repite la auditoría antes de entregar, porque los avisos de seguridad pueden cambiar:

```bash
cd api
npm audit
cd ../front
npm audit
```
