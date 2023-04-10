function actualizarHoraActual() {
    // Obtener la hora actual
    var fecha = new Date();
    var horaActual = fecha.toLocaleTimeString();
  
    // Enviar la hora actual al script de fondo (background.js)
    chrome.runtime.sendMessage({hora: horaActual});
  }
  
  // Llamar a la función actualizarHoraActual cada segundo
  setInterval(actualizarHoraActual, 1000);
  