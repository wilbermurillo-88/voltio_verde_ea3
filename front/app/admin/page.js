"use client";

import { useEffect, useState } from "react";
import { actualizarProducto, crearProducto, eliminarProducto, obtenerProductos } from "../../lib/api";

const inicial = {
  nombre: "",
  categoria: "iluminacion",
  precio: "",
  wattsAntes: "",
  wattsDespues: "",
  horasDia: ""
};

export default function Administracion() {
  const [productos, setProductos] = useState([]);
  const [formulario, setFormulario] = useState(inicial);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");

  async function cargarProductos() {
    setCargando(true);
    try {
      setProductos(await obtenerProductos());
      setError("");
    } catch (mensaje) {
      setError(mensaje.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargarProductos(); }, []);

  function cambiarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  }

  async function guardar(evento) {
    evento.preventDefault();
    setError("");
    setMensaje("");
    try {
      const datos = {
        ...formulario,
        precio: Number(formulario.precio),
        wattsAntes: Number(formulario.wattsAntes),
        wattsDespues: Number(formulario.wattsDespues),
        horasDia: Number(formulario.horasDia)
      };
      if (editandoId) {
        await actualizarProducto(editandoId, datos);
        setMensaje("Producto actualizado correctamente.");
      } else {
        await crearProducto(datos);
        setMensaje("Producto creado correctamente.");
      }
      setFormulario(inicial);
      setEditandoId(null);
      await cargarProductos();
    } catch (mensaje) {
      setError(mensaje.message);
    }
  }

  function editar(producto) {
    setEditandoId(producto.id);
    setError("");
    setMensaje("");
    setFormulario({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: String(producto.precio),
      wattsAntes: String(producto.wattsAntes),
      wattsDespues: String(producto.wattsDespues),
      horasDia: String(producto.horasDia)
    });
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setFormulario(inicial);
    setError("");
    setMensaje("");
  }

  async function borrar(id) {
    setError("");
    setMensaje("");
    try {
      await eliminarProducto(id);
      if (editandoId === id) cancelarEdicion();
      await cargarProductos();
    } catch (mensaje) {
      setError(mensaje.message);
    }
  }

  return (
    <main>
      <section className="catalogo-intro">
        <h1>Administración de productos</h1>
        <p>Crea productos y administra el catálogo conectado a la API.</p>
      </section>
      <section className="formulario-contenedor" aria-labelledby="formulario-titulo">
        <h2 id="formulario-titulo">{editandoId ? "Editar producto" : "Crear producto"}</h2>
        <form onSubmit={guardar}>
          <div className="rejilla-formulario">
            <label>Nombre<input className="form-control" name="nombre" value={formulario.nombre} onChange={cambiarCampo} minLength="2" required /></label>
            <label>Categoría
              <select className="form-control" name="categoria" value={formulario.categoria} onChange={cambiarCampo}>
                <option value="iluminacion">Iluminación</option>
                <option value="electrodomesticos">Electrodomésticos</option>
                <option value="solar">Energía solar</option>
              </select>
            </label>
            <label>Precio (COP)<input className="form-control" name="precio" type="number" min="0" step="1" value={formulario.precio} onChange={cambiarCampo} required /></label>
            <label>Potencia anterior (W)<input className="form-control" name="wattsAntes" type="number" min="0" step="any" value={formulario.wattsAntes} onChange={cambiarCampo} required /></label>
            <label>Potencia nueva (W)<input className="form-control" name="wattsDespues" type="number" min="0" step="any" value={formulario.wattsDespues} onChange={cambiarCampo} required /></label>
            <label>Horas de uso por día<input className="form-control" name="horasDia" type="number" min="0" step="any" value={formulario.horasDia} onChange={cambiarCampo} required /></label>
          </div>
          <div className="acciones-carrito">
            <button className="btn btn-primary" type="submit">{editandoId ? "Actualizar producto" : "Guardar producto"}</button>
            {editandoId && <button className="btn btn-secundario" type="button" onClick={cancelarEdicion}>Cancelar</button>}
          </div>
        </form>
      </section>
      {error && <p className="mensaje-error" role="alert">{error}</p>}
      {mensaje && <p className="mensaje-exito" role="status">{mensaje}</p>}
      <section aria-labelledby="tabla-titulo">
        <h2 id="tabla-titulo">Productos registrados</h2>
        {cargando ? <p>Cargando productos...</p> : (
          <div className="tabla-contenedor">
            <table>
              <thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Acción</th></tr></thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.nombre}</td><td>{producto.categoria}</td>
                    <td>${producto.precio.toLocaleString("es-CO")}</td>
                    <td>
                      <div className="acciones-tabla">
                        <button className="btn btn-editar" type="button" onClick={() => editar(producto)}>Editar</button>
                        <button className="btn btn-eliminar" type="button" onClick={() => borrar(producto.id)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
