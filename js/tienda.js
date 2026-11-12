const TARIFA = 950;
const DIAS_MES = 30;
const productos = [
    { id: 1, nombre: "Bombillo LED 9 W", categoria: "iluminacion", precio: 8900, wattsAntes: 60, wattsDespues: 9, horasDia: 5 },
    { id: 2, nombre: "Panel LED 18 W", categoria: "iluminacion", precio: 35000, wattsAntes: 40, wattsDespues: 18, horasDia: 8 },
    { id: 3, nombre: "Reflector LED 50 W", categoria: "iluminacion", precio: 59000, wattsAntes: 250, wattsDespues: 50, horasDia: 6 },
    { id: 4, nombre: "Nevera eficiente", categoria: "electrodomesticos", precio: 1890000, wattsAntes: 80, wattsDespues: 40, horasDia: 24 },
    { id: 5, nombre: "Aire acondicionado inverter", categoria: "electrodomesticos", precio: 2100000, wattsAntes: 1400, wattsDespues: 900, horasDia: 6 },
    { id: 6, nombre: "Regleta con apagado automático", categoria: "electrodomesticos", precio: 65000, wattsAntes: 15, wattsDespues: 0, horasDia: 20 },
    { id: 7, nombre: "Calentador solar de agua", categoria: "solar", precio: 1200000, wattsAntes: 3500, wattsDespues: 0, horasDia: 0.5 },
    { id: 8, nombre: "Kit de panel solar 550 W", categoria: "solar", precio: 2400000, wattsAntes: 550, wattsDespues: 0, horasDia: 4.5 }
];

let carrito = [];
let categoriaActiva = "todas";
let textoBusqueda = "";

function ahorroKwhMes(producto) {
    return (producto.wattsAntes - producto.wattsDespues) * producto.horasDia * DIAS_MES / 1000;
}

function ahorroPesosMes(producto) {
    return ahorroKwhMes(producto) * TARIFA;
}

function pesos(valor) {
    return "$" + Math.round(valor).toLocaleString("es-CO");
}

function nombreCategoria(categoria) {
    if (categoria === "iluminacion") {
        return "Iluminación";
    } else if (categoria === "electrodomesticos") {
        return "Electrodomésticos";
    }
    return "Energía solar";
}

function mostrarProductos() {
    const contenedor = document.querySelector("#productos");
    const productosVisibles = [];

    for (const producto of productos) {
        const coincideCategoria =
            categoriaActiva === "todas" || producto.categoria === categoriaActiva;
        const coincideBusqueda =
            producto.nombre.toLocaleLowerCase("es").includes(textoBusqueda);

        if (coincideCategoria && coincideBusqueda) {
            productosVisibles.push(producto);
        }
    }

    if (productosVisibles.length === 0) {
        contenedor.innerHTML = '<p class="sin-resultados">No encontramos productos con esos criterios.</p>';
        return;
    }

    contenedor.innerHTML = "";
    for (const producto of productosVisibles) {
        contenedor.innerHTML += `
            <article class="tarjeta tarjeta-producto">
                <span class="categoria">${nombreCategoria(producto.categoria)}</span>
                <h2>${producto.nombre}</h2>
                <p>Potencia reemplazada: ${producto.wattsAntes} W · equipo nuevo: ${producto.wattsDespues} W.</p>
                <p>Uso estimado: ${producto.horasDia} horas al día.</p>
                <p>Ahorro estimado: <span class="ahorro">${ahorroKwhMes(producto).toFixed(1)} kWh</span> al mes.</p>
                <p class="precio">${pesos(producto.precio)}</p>
                <p>Ahorro mensual: <span class="ahorro">${pesos(ahorroPesosMes(producto))}</span></p>
                <button class="btn btn-primary btn-sm" type="button" data-id="${producto.id}">
                    Agregar al carrito
                </button>
            </article>`;
    }
}

function agregarAlCarrito(id) {
    const producto = productos.find(function (item) {
        return item.id === id;
    });

    if (producto) {
        carrito.push(producto);
        mostrarCarrito();
    }
}

function mostrarCarrito() {
    const lista = document.querySelector("#lista-carrito");
    const avisoVacio = document.querySelector("#carrito-vacio");
    let total = 0;
    let ahorroMes = 0;

    lista.innerHTML = "";
    for (const producto of carrito) {
        lista.innerHTML += `<li>${producto.nombre}: ${pesos(producto.precio)}</li>`;
        total += producto.precio;
        ahorroMes += ahorroPesosMes(producto);
    }

    document.querySelector("#total").textContent = `Total: ${pesos(total)}`;
    document.querySelector("#ahorro").textContent =
        `Ahorro estimado: ${pesos(ahorroMes)} al mes.`;
    avisoVacio.hidden = carrito.length > 0;

    if (carrito.length === 0) {
        document.querySelector("#recuperacion").textContent =
            "Agrega productos para estimar la recuperación de la compra.";
    } else if (ahorroMes > 0) {
        const meses = Math.ceil(total / ahorroMes);
        document.querySelector("#recuperacion").textContent =
            `Con este ahorro estimado, la compra se compensaría en aproximadamente ${meses} meses.`;
    } else {
        document.querySelector("#recuperacion").textContent =
            "No es posible estimar la recuperación con el ahorro calculado.";
    }
}

const botonesFiltro = document.querySelectorAll(".filtro");
for (const boton of botonesFiltro) {
    boton.addEventListener("click", function () {
        categoriaActiva = boton.dataset.categoria;

        for (const otroBoton of botonesFiltro) {
            const estaActivo = otroBoton === boton;
            otroBoton.classList.toggle("activo", estaActivo);
            otroBoton.setAttribute("aria-pressed", String(estaActivo));
        }

        mostrarProductos();
    });
}

document.querySelector("#buscador").addEventListener("input", function (evento) {
    textoBusqueda = evento.target.value.trim().toLocaleLowerCase("es");
    mostrarProductos();
});

document.querySelector("#productos").addEventListener("click", function (evento) {
    const boton = evento.target.closest("button[data-id]");
    if (boton) {
        agregarAlCarrito(Number(boton.dataset.id));
    }
});

document.querySelector("#vaciar").addEventListener("click", function () {
    carrito = [];
    mostrarCarrito();
});

mostrarProductos();
mostrarCarrito();
