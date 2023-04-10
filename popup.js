function obtenerHoraActual(codigo) {
    return new Promise((resolve, reject) => {
        fetch('paisesTimeZone.json')
        .then(response => response.json())
        .then(data => {
            var pais = codigo; // Código del país que deseas obtener
            var zonaHoraria = data[pais].timezone;
    
            console.log("Zona horaria del país " + pais + ": " + zonaHoraria);
            const fecha = new Date();
            const opciones = { timeZone: zonaHoraria };
            const horas = String(fecha.toLocaleString('es-AR', { hour: 'numeric', ...opciones })).padStart(2, '0');
            const minutos = String(fecha.toLocaleString('es-AR', { minute: 'numeric', ...opciones })).padStart(2, '0');
            const segundos = String(fecha.toLocaleString('es-AR', { second: 'numeric', ...opciones })).padStart(2, '0');
            resolve(`${horas}:${minutos}:${segundos}`);
        })
        .catch(error => reject(error));
    });
}

function actualizarHora() {
    const paisSelect = document.getElementById("country-select");
    const zonaHoraria = paisSelect.value; // Obtener la zona horaria del país seleccionado
    obtenerHoraActual(zonaHoraria)
    .then(horaActual => {
        document.getElementById('hora-actual').textContent = horaActual;
    })
    .catch(error => console.error(error));
}

setInterval(actualizarHora, 1000);

const selector = document.getElementById('country-select');
// Cargar opciones de países desde el archivo local data.json
fetch('data.json')
.then(response => response.json())
.then(data => {
    // Obtener un arreglo de las claves (códigos de países) del objeto data
    const keys = Object.keys(data);
    // Ordenar las claves alfabéticamente por el valor que tiene la clave en el objeto data
    keys.sort((a, b) => {
        const valueA = data[a].toLowerCase();
        const valueB = data[b].toLowerCase();
        if (valueA < valueB) {
            return -1;
        }
        if (valueA > valueB) {
            return 1;
        }
        return 0;
    });
    // Iterar sobre las claves ordenadas y agregar opciones al select
    keys.forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.text = data[key];
        option.innerHTML = `${data[key]}`;
        selector.add(option);
    });

    // Cargar el último valor seleccionado desde localStorage
    const ultimoPaisSeleccionado = localStorage.getItem('ultimoPaisSeleccionado');
    if (ultimoPaisSeleccionado) {
        selector.value = ultimoPaisSeleccionado;
        generaBandera();
    }
})
.catch(error => {
    console.error('Error al cargar el archivo data.json:', error);
});



function generaBandera() {
    const paisSelect = document.getElementById("country-select");
    const paisSeleccionado = paisSelect.value;
    const bandera = document.querySelector('img');
    bandera.src = `https://flagcdn.com/48x36/${paisSeleccionado}.png`;
    bandera.alt =  paisSelect.options[paisSelect.selectedIndex].text;

    // Almacenar el último valor seleccionado en localStorage
    localStorage.setItem('ultimoPaisSeleccionado', paisSeleccionado);
}

document.getElementById('country-select').addEventListener('change', generaBandera);

