function obtenerHoraActual(codigo) {
    return new Promise((resolve, reject) => {
        fetch('json/paisesTimeZone.json')
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
fetch('json/data.json')
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
    bandera.alt = paisSelect.options[paisSelect.selectedIndex].text;

    // Almacenar el último valor seleccionado en localStorage
    localStorage.setItem('ultimoPaisSeleccionado', paisSeleccionado);
}

// Paso 1: Agregar un nuevo array para almacenar los favoritos en el localStorage
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

// Paso 2: Modificar la función actualizarHora
function actualizarHora() {
    const paisSelect = document.getElementById("country-select");
    const zonaHoraria = paisSelect.value;

    // Verificar si el país seleccionado está en la lista de favoritos y actualizar el estilo del botón
    const esFavorito = favoritos.includes(zonaHoraria);
    document.getElementById('agregarFavorito').classList.toggle('favorito', esFavorito);

    obtenerHoraActual(zonaHoraria)
        .then(horaActual => {
            document.getElementById('hora-actual').textContent = horaActual;
        })
        .catch(error => console.error(error));
}

// Paso 3: Crear funciones para agregar y eliminar países de la lista de favoritos
function agregarFavorito() {
    const paisSelect = document.getElementById("country-select");
    const zonaHoraria = paisSelect.value;

    if (!favoritos.includes(zonaHoraria)) {
        favoritos.push(zonaHoraria);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        cargarFavoritos();
    }
}

function eliminarFavorito(zonaHoraria) {
    favoritos = favoritos.filter(favorito => favorito !== zonaHoraria);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    cargarFavoritos();
}

// Paso 4: Modificar la función generaBandera
function generaBandera() {
    const paisSelect = document.getElementById("country-select");
    const paisSeleccionado = paisSelect.value;
    const bandera = document.querySelector('img');
    bandera.src = `https://flagcdn.com/48x36/${paisSeleccionado}.png`;
    bandera.alt = paisSelect.options[paisSelect.selectedIndex].text;

    // Almacenar el último valor seleccionado en localStorage
    localStorage.setItem('ultimoPaisSeleccionado', paisSeleccionado);

    // Actualizar el estilo del botón de favoritos
    document.getElementById('agregarFavorito').classList.toggle('favorito', favoritos.includes(paisSeleccionado));

    // Actualizar la hora al cambiar el país seleccionado
    actualizarHora();
}

document.getElementById('editarFavoritos').addEventListener('click', toggleEdicion);

// Paso 5: Crear una función para cargar y mostrar los favoritos almacenados en el localStorage
// Paso 5: Modificar la función cargarFavoritos
function cargarFavoritos() {
    const favoritosContainer = document.getElementById('favoritos-container');
    favoritosContainer.innerHTML = '';

    favoritos.forEach(favorito => {
        const div = document.createElement('div');
        div.classList.add('favorito-item');

        // Cambiar la bandera de un <img> a un <button>
        const banderaBtn = document.createElement('button');
        banderaBtn.classList.add('btn', 'btn-link', 'p-0');
        banderaBtn.style.cursor = 'pointer';
        banderaBtn.addEventListener('click', () => {
            // Seleccionar el país en el select y actualizar la hora
            selector.value = favorito;  // Utilizar el selector en lugar del paisSelect
            generaBandera();
        });

        const banderaImg = document.createElement('img');
        banderaImg.src = `https://flagcdn.com/48x36/${favorito}.png`;
        banderaImg.alt = favorito;

        // Añadir la banderaImg al botón
        banderaBtn.appendChild(banderaImg);

        

        // Añadir los botones al contenedor de favoritos
        div.appendChild(banderaBtn);
        favoritosContainer.appendChild(div);

        // Crear un botón para eliminar el favorito
        const eliminarBtn = document.createElement('button');
        eliminarBtn.classList.add('btn', 'btn-danger', 'btn-sm');
        eliminarBtn.textContent = '-';
        eliminarBtn.title = 'Eliminar de favoritos'; // Agregar el título
        eliminarBtn.addEventListener('click', () => eliminarFavorito(favorito));

        // Añadir el botón de eliminar al div
        div.appendChild(eliminarBtn);


    });

    // Ocultar o mostrar botones de eliminar según el modo de edición
    const botonesEliminar = document.querySelectorAll('.btn-danger');
    botonesEliminar.forEach(btn => btn.style.display = modoEdicion ? 'block' : 'none');
}

let modoEdicion = false;


// Función para cambiar el modo de edición
function toggleEdicion() {
    modoEdicion = !modoEdicion;
    cargarFavoritos();

    // Cambiar el contenido del botón entre "✎" y "✔"
    const editarIcono = document.getElementById('editarIcono');
    editarIcono.textContent = modoEdicion ? '✔' : '✎';
}

document.getElementById('agregarFavorito').addEventListener('click', agregarFavorito);
document.getElementById('country-select').addEventListener('change', generaBandera);

cargarFavoritos();



