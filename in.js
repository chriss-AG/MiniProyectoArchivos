// Obtener elementos de la página
const archivoCSV = document.getElementById("archivoCSV");
const nombreArchivo = document.getElementById("nombreArchivo");
const convertirBtn = document.getElementById("convertirBtn");
const resultadoJSON = document.getElementById("resultadoJSON");
const descargarBtn = document.getElementById("descargarBtn");

// Variable para almacenar el archivo seleccionado
let archivoSeleccionado = null;

// Variable para almacenar el JSON generado
let jsonGenerado = null;


// Cuando el usuario selecciona un archivo
archivoCSV.addEventListener("change", function () {

    archivoSeleccionado = archivoCSV.files[0];

    if (!archivoSeleccionado) {
        nombreArchivo.textContent = "Ningún archivo seleccionado";
        convertirBtn.disabled = true;
        return;
    }

    // Verificar que sea un archivo CSV
    if (!archivoSeleccionado.name.toLowerCase().endsWith(".csv")) {
        alert("Por favor, seleccione un archivo CSV.");
        archivoCSV.value = "";
        nombreArchivo.textContent = "Ningún archivo seleccionado";
        convertirBtn.disabled = true;
        return;
    }

    nombreArchivo.textContent =
        `Archivo seleccionado: ${archivoSeleccionado.name}`;

    convertirBtn.disabled = false;

    // Limpiar resultados anteriores
    resultadoJSON.textContent =
        "El archivo está listo para ser convertido.";

    descargarBtn.disabled = true;
});


// Cuando se presiona el botón de convertir
convertirBtn.addEventListener("click", function () {

    if (!archivoSeleccionado) {
        alert("Primero seleccione un archivo CSV.");
        return;
    }

    // Leer el contenido del archivo
    const lector = new FileReader();

    lector.onload = function (evento) {

        const contenidoCSV = evento.target.result;

        try {

            // Convertir CSV a JSON
            const datos = convertirCSVaJSON(contenidoCSV);

            // Guardar el resultado
            jsonGenerado = JSON.stringify(datos, null, 4);

            // Mostrar el resultado
            resultadoJSON.textContent = jsonGenerado;

            // Activar botón de descarga
            descargarBtn.disabled = false;

        } catch (error) {

            resultadoJSON.textContent =
                "Error al convertir el archivo.";

            alert("No se pudo convertir el archivo CSV.");
            console.error(error);
        }
    };

    lector.onerror = function () {
        alert("No se pudo leer el archivo.");
    };

    lector.readAsText(archivoSeleccionado, "UTF-8");
});


// Función principal para convertir CSV a JSON
function convertirCSVaJSON(csv) {

    // Eliminar espacios y saltos de línea innecesarios
    csv = csv.trim();

    if (!csv) {
        throw new Error("El archivo CSV está vacío.");
    }

    // Separar el archivo en líneas
    const lineas = csv.split(/\r?\n/);

    if (lineas.length < 2) {
        throw new Error(
            "El archivo CSV debe tener encabezados y al menos un registro."
        );
    }

    // Obtener los encabezados de la primera línea
    const encabezados = separarCSV(lineas[0]);

    // Crear arreglo donde se guardarán los objetos
    const datos = [];

    // Recorrer las filas restantes
    for (let i = 1; i < lineas.length; i++) {

        // Ignorar líneas vacías
        if (lineas[i].trim() === "") {
            continue;
        }

        const valores = separarCSV(lineas[i]);

        const objeto = {};

        // Relacionar cada valor con su encabezado
        encabezados.forEach(function (encabezado, indice) {

            objeto[encabezado.trim()] =
                valores[indice] !== undefined
                    ? valores[indice].trim()
                    : "";

        });

        datos.push(objeto);
    }

    return datos;
}


// Función para separar correctamente una línea CSV
// También permite valores entre comillas
function separarCSV(linea) {

    const valores = [];
    let valorActual = "";
    let dentroDeComillas = false;

    for (let i = 0; i < linea.length; i++) {

        const caracter = linea[i];

        if (caracter === '"') {

            // Si hay dos comillas juntas, representan una comilla
            if (dentroDeComillas && linea[i + 1] === '"') {
                valorActual += '"';
                i++;
            } else {
                dentroDeComillas = !dentroDeComillas;
            }

        } else if (caracter === "," && !dentroDeComillas) {

            valores.push(valorActual);
            valorActual = "";

        } else {

            valorActual += caracter;
        }
    }

    // Agregar el último valor
    valores.push(valorActual);

    return valores;
}


// Descargar el JSON generado
descargarBtn.addEventListener("click", function () {

    if (!jsonGenerado) {
        alert("Primero debe convertir un archivo CSV.");
        return;
    }

    // Crear un archivo JSON en memoria
    const archivoJSON = new Blob(
        [jsonGenerado],
        { type: "application/json" }
    );

    // Crear una URL temporal
    const url = URL.createObjectURL(archivoJSON);

    // Crear enlace de descarga
    const enlace = document.createElement("a");

    enlace.href = url;

    // Obtener nombre del CSV y cambiar extensión
    let nombreJSON = archivoSeleccionado.name
        .replace(/\.csv$/i, "")
        + ".json";

    enlace.download = nombreJSON;

    // Ejecutar descarga
    enlace.click();

    // Liberar la URL temporal
    URL.revokeObjectURL(url);
});
