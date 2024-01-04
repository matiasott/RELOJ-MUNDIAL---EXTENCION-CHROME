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
            option.setAttribute('data-translate', data[key]);
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

        const banderaContainer = document.createElement('div');
        banderaContainer.classList.add('bandera-container');

        const banderaBtn = document.createElement('button');
        banderaBtn.classList.add('btn', 'btn-link', 'p-0', 'bandera-btn');
        banderaBtn.style.cursor = 'pointer';
        banderaBtn.addEventListener('click', () => {
            selector.value = favorito;
            generaBandera();
        });

        const banderaImg = document.createElement('img');
        banderaImg.src = `https://flagcdn.com/48x36/${favorito}.png`;
        banderaImg.alt = favorito;

        banderaBtn.appendChild(banderaImg);
        banderaContainer.appendChild(banderaBtn);

        const eliminarBtn = document.createElement('button');
        eliminarBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'eliminar-btn', 'bandera-btn');
        eliminarBtn.textContent = '-';
        eliminarBtn.title = 'Eliminar de favoritos';
        eliminarBtn.setAttribute('data-translate', 'btn_eliminar_favorito');

        eliminarBtn.addEventListener('click', () => eliminarFavorito(favorito));

        banderaContainer.appendChild(eliminarBtn);
        div.appendChild(banderaContainer);

        favoritosContainer.appendChild(div);
    });

    const botonesEliminar = document.querySelectorAll('.eliminar-btn');
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

    if (editarIcono.classList.contains("✔")) {
        // Cambiar a editar
        editarIcono.setAttribute("data-translate", "editar");
        editarIcono.setAttribute("title", "Editar favoritos");
    } else {
        // Cambiar a confirmar
        editarIcono.setAttribute("data-translate", "confirmar");
        editarIcono.setAttribute("title", "Confirmar");
    }
}

document.getElementById('agregarFavorito').addEventListener('click', agregarFavorito);
document.getElementById('country-select').addEventListener('change', generaBandera);

cargarFavoritos();



let idiomaActual = 'es';

function cambiarIdioma(idioma) {
    idiomaActual = idioma;

    // Llama a la función para cargar las traducciones
    cargarTraducciones();
}

// Función para cargar las traducciones según el idioma actual
function cargarTraducciones() {
    fetch('json/translations.json')
        .then(response => response.json())
        .then(translations => aplicarTraducciones(translations[idiomaActual]))
        .catch(error => console.error('Error al cargar las traducciones:', error));
}

// Función para aplicar las traducciones a los elementos con data-translate
function aplicarTraducciones(translationObject) {
    const elementosTraducir = document.querySelectorAll('[data-translate]');

    elementosTraducir.forEach(elemento => {
        const claveTraduccion = elemento.getAttribute('data-translate');
        if (claveTraduccion) {
            if (elemento.hasAttribute('title')) {
                elemento.title = translationObject[claveTraduccion];
            } else {
                elemento.textContent = translationObject[claveTraduccion];
            }
        }
    });
}

cargarTraducciones();


const languageSelect = document.getElementById('language-select');
languageSelect.addEventListener('change', function () {
    cambiarIdioma(this.value);
});