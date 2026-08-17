// Recuperar datos de localStorage al iniciar
let inventario = JSON.parse(localStorage.getItem("inventario")) || [];
let totalProductos = parseInt(localStorage.getItem("totalProductos")) || 0;
let productosEliminados = parseInt(localStorage.getItem("productosEliminados")) || 0;
let totalPrecio = parseFloat(localStorage.getItem("totalPrecio")) || 0;

// Obtener elementos del DOM
const formProducto = document.getElementById("formProducto");
const tablaInventario = document.querySelector("#tablaInventario tbody");
const totalProductosElem = document.getElementById("totalProductos");
const productosEliminadosElem = document.getElementById("productosEliminados");
const totalPrecioElem = document.getElementById("totalPrecio");
const listaEliminados = document.getElementById("listaEliminados");
const resetPrecioBtn = document.getElementById("resetPrecio");

// Cargar los datos guardados al iniciar
document.addEventListener("DOMContentLoaded", function () {
    actualizarInventario();
    actualizarResumen();
});

// Evento para agregar un producto
formProducto.addEventListener("submit", function (event) {
    event.preventDefault();

    // Obtener valores del formulario
    const nombre = document.getElementById("nombre").value.trim();
    const cantidad = parseInt(document.getElementById("cantidad").value);
    const precio = parseFloat(document.getElementById("precio").value);

    // Validar datos
    if (!nombre || isNaN(cantidad) || isNaN(precio) || cantidad <= 0 || precio <= 0) {
        alert("Por favor, ingrese datos válidos.");
        return;
    }

    // Crear objeto producto
    const producto = { nombre, cantidad, precio };

    // Agregar al inventario
    inventario.push(producto);
    totalProductos++;
    totalPrecio += precio * cantidad; // Ajustar el total correctamente

    // Guardar en LocalStorage y actualizar la UI
    guardarDatos();
    actualizarInventario();
    actualizarResumen();

    // Limpiar el formulario
    formProducto.reset();
});

// Función para actualizar la tabla de inventario
function actualizarInventario() {
    tablaInventario.innerHTML = "";

    inventario.forEach((producto, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.cantidad}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>
                <button onclick="editarProducto(${index})">✏️ Editar</button>
                <button onclick="eliminarProducto(${index})">🗑️ Eliminar</button>
            </td>
        `;
        tablaInventario.appendChild(fila);
    });

    // Guardar los datos en localStorage después de actualizar la tabla
    guardarDatos();
}

// Función para eliminar un producto
function eliminarProducto(index) {
    if (index >= 0 && index < inventario.length) {
        const productoEliminado = inventario[index].nombre;
        totalPrecio -= inventario[index].precio * inventario[index].cantidad;
        inventario.splice(index, 1);
        totalProductos--;
        productosEliminados++;

        // Agregar a la lista de eliminados
        const itemEliminado = document.createElement("li");
        itemEliminado.textContent = productoEliminado;
        listaEliminados.appendChild(itemEliminado);

        // Guardar cambios en localStorage y actualizar la UI
        guardarDatos();
        actualizarInventario();
        actualizarResumen();
    }
}

// Función para editar un producto
function editarProducto(index) {
    const nuevoNombre = prompt("Nuevo nombre:", inventario[index].nombre);
    const nuevaCantidad = prompt("Nueva cantidad:", inventario[index].cantidad);
    const nuevoPrecio = prompt("Nuevo precio:", inventario[index].precio);

    if (nuevoNombre && !isNaN(nuevaCantidad) && !isNaN(nuevoPrecio)) {
        totalPrecio -= inventario[index].precio * inventario[index].cantidad; // Restar precio anterior
        inventario[index].nombre = nuevoNombre;
        inventario[index].cantidad = parseInt(nuevaCantidad);
        inventario[index].precio = parseFloat(nuevoPrecio);
        totalPrecio += inventario[index].precio * inventario[index].cantidad; // Sumar nuevo precio

        // Guardar cambios y actualizar la UI
        guardarDatos();
        actualizarInventario();
        actualizarResumen();
    } else {
        alert("Entrada no válida. Inténtelo de nuevo.");
    }
}

// Función para actualizar los contadores en pantalla
function actualizarResumen() {
    totalProductosElem.textContent = `Total de productos: ${totalProductos}`;
    productosEliminadosElem.textContent = `Productos eliminados: ${productosEliminados}`;
    totalPrecioElem.textContent = `Total en precio: $${totalPrecio.toFixed(2)}`;
}

// Función para resetear el inventario
function resetearTotalPrecio() {
    totalPrecio = 0;
    totalProductos = 0;
    productosEliminados = 0;
    inventario = [];

    // Limpiar la lista de productos eliminados
    listaEliminados.innerHTML = "";

    // Guardar cambios en LocalStorage y actualizar la UI
    guardarDatos();
    actualizarInventario();
    actualizarResumen();
}

// Evento para el botón de resetear precio
resetPrecioBtn.addEventListener("click", resetearTotalPrecio);

// Función para guardar los datos en LocalStorage
function guardarDatos() {
    localStorage.setItem("inventario", JSON.stringify(inventario));
    localStorage.setItem("totalProductos", totalProductos);
    localStorage.setItem("productosEliminados", productosEliminados);
    localStorage.setItem("totalPrecio", totalPrecio);
}
