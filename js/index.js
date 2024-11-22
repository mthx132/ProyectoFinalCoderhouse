// Declaración de variables
let nombre
let saldo = parseFloat(localStorage.getItem("saldo")) || 0;
let transacciones = JSON.parse(localStorage.getItem("historialTransferencias")) || [];
let nombreTextoHtml = document.getElementById("txtmarcoAlto");
let contrasenia = JSON.parse(localStorage.getItem("contrasenia"));
let botonEnviarDinero = document.getElementById("enviarDinero");
let botonRecibirDinero = document.getElementById("botonRecibirDinero");
let intentos = 6;
let botonCerrarSesion = document.getElementById("botonCerrarSesion");
let detalleActividad = document.getElementById("detalleActividad");
let cotizacionesDolares = []
const botonConversor = document.getElementById("botonConversor");
const botonInicio = document.getElementById("active");
const contenedorInicio = document.getElementById("contenedorInicio"); 
const contenedorConversor = document.querySelector(".container");
const botonNoche = document.getElementById("botonNoche");

// funcion para convertir de peso a dolar

function convert() {
  const pesoAmount = parseFloat(document.getElementById('pesoInput').value); 
  const dollarType = document.getElementById('dollarType').value; 
  const resultElement = document.getElementById('result'); 

  if (!pesoAmount || pesoAmount <= 0) {
      resultElement.textContent = "Por favor, ingresa una cantidad válida en pesos.";
      return;
  }

  // Llamada a la API
  fetch('https://dolarapi.com/v1/dolares')
      .then(response => response.json())
      .then(data => {
          console.log(data); // Verifica la estructura de los datos

          // Accede al valor del tipo de dólar
          let dolarInfo = data[dollarType];
          let exchangeRate = typeof dolarInfo === 'object' ? dolarInfo.value : dolarInfo;

          if (exchangeRate) {
              // Calcula la conversión
              const conversion = (pesoAmount / exchangeRate).toFixed(2);
              // Muestra el resultado
              resultElement.textContent = `Con $${pesoAmount} ARS obtienes $${conversion} USD (${dollarType.replace('_', ' ').toUpperCase()}).`;
          } else {
              resultElement.textContent = "No se pudo obtener el tipo de cambio seleccionado.";
          }
      })
      .catch(error => {
          console.error('Error al obtener los datos:', error);
          resultElement.textContent = "Hubo un error al obtener los datos de la API.";
      });
}
//función para activar el modo Noche o modo dia

botonNoche.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    botonNoche.textContent = "modo día";
  } else {
    botonNoche.textContent = "modo noche";
  }
});

// cotizaciones de los Dolares
function traerCotizacionesDolares() {
 cotizacionesDolares = fetch('https://dolarapi.com/v1/dolares')
}
traerCotizacionesDolares()
//funcion para convertir de peso a dolar
  function Convertir() {
    const pesoAmount = parseFloat(document.getElementById('pesoInput').value); // Cantidad ingresada
    const dollarType = document.getElementById('dollarType').value; // Tipo de dólar seleccionado
    const resultElement = document.getElementById('result'); // Contenedor para el resultado

    if (!pesoAmount || pesoAmount <= 0) {
        resultElement.textContent = "Por favor, ingresa una cantidad válida en pesos.";
        return;
    }
    fetch('https://dolarapi.com/v1/dolares')
        .then(response => response.json())
        .then(data => {
            console.log(data);

            const dolarInfo = data.find(item => item.casa === dollarType);

            if (dolarInfo && dolarInfo.venta) {
                const exchangeRate = parseFloat(dolarInfo.venta);
                const conversion = (pesoAmount / exchangeRate).toFixed(2); // Calcula la conversión
                resultElement.textContent = `Con $${pesoAmount} ARS obtienes $${conversion} USD (${dolarInfo.nombre}).`;
            } else {
                resultElement.textContent = "No se pudo obtener el tipo de cambio seleccionado.";
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
            resultElement.textContent = "Hubo un error al obtener los datos de la API.";
        });
}

// Mostrar historial de la Ultima Actividad si es que existe

transacciones.forEach((transaccion) => {
  detalleActividad.innerHTML += generarTarjetaHTML(transaccion);
});

// Función para registrar una transacción
function registrarTransaccion(tipoTransaccion, nombreTransaccion, cantidadTransaccion) {
  const nuevaTransaccion = {
    destinatario: nombreTransaccion,
    cantidad: cantidadTransaccion,
    tipoTransaccion: tipoTransaccion,
    fecha: new Date().toLocaleString(),
  };

  // Guardar la transacción en el historial
  transacciones.push(nuevaTransaccion);
  localStorage.setItem("historialTransferencias", JSON.stringify(transacciones));

  // Mostrar la transacción en la interfaz
  detalleActividad.innerHTML += generarTarjetaHTML(nuevaTransaccion);
}

// Función para generar el HTML de una tarjeta de transacción
function generarTarjetaHTML(transaccion) {
  return `
    <div class="tarjeta-transaccion">
      Nombre del transferido: ${transaccion.destinatario}<br>
      Cantidad: $${transaccion.cantidad}<br>
      Tipo de Transacción: ${transaccion.tipoTransaccion}<br>
      Fecha: ${transaccion.fecha}
    </div>`;
}

// Funcion para cerrar sesion mediante el Botón
botonCerrarSesion.onclick = function() {
  localStorage.clear();
location.reload();
}

// Función para mostrar el mensaje de Bienvenida en HTML
async function mostrarMensajeBienvenida() {
  nombre = localStorage.getItem("nombre");
  if (!nombre) {
    const { value: nombreIngresado } = await Swal.fire({
      icon: "question",
      title: "Nombre",
      text: "Ingrese su Nombre",
      input: "text",
      inputPlaceholder: "Nombre",
      showCancelButton: false,
    });
    
    // Si el usuario ingresó un nombre
    if (nombreIngresado) {
      localStorage.setItem("nombre", JSON.stringify(nombreIngresado));
      nombre = nombreIngresado; // Actualizamos la variable de nombre
      almacenarContrasenia()
    }
  }

  // Mostrar el nombre en el HTML (ya sea que sea cargado o recién ingresado)
  nombreTextoHtml.textContent = `¡¡Bienvenido, ${nombre}!!`;
}

// Función para almacenar la contraseña si no está registrada
async function almacenarContrasenia() {
  console.log('entre en la funcion')
  if (!contrasenia) {
    const { value: contrasenia } = await Swal.fire({
      icon: "question",
      title: "Contraseña",
      text: "Ingrese su Contraseña",
      input: "password",
      inputPlaceholder: "Escriba Aqui",
      showCancelButton: false,
    });
    
    // Si el usuario ingresó una contraseña: 
    if (contrasenia) {
      localStorage.setItem("contrasenia", JSON.stringify(contrasenia));
      return contrasenia;
    }
  }
}

// Función para inicializar el saldo
function inicializarSaldo() {
  if (!saldo) {
    localStorage.setItem("saldo", JSON.stringify(saldo));
  }

  let saldoTexto = document.getElementById("txtCuadroPrincipal");
  if (saldoTexto) {
    saldoTexto.textContent = `$${saldo}`;
  }
}

// Función para solicitar la contraseña
async function pedirContraseña() {
  const { value: contraseniaIngresada } = await Swal.fire({
    icon: "warning",
    title: "Aviso",
    input: "password",
    inputLabel: "Ingrese su contraseña:",
    inputPlaceholder: "Contraseña",
    showCancelButton: true,
  });
  return contraseniaIngresada;
}

// Función para verificar si la contraseña es correcta
async function validarContrasenia() {
  let contraseniaIngresada = await pedirContraseña();
  console.log(contraseniaIngresada , contrasenia)
  if (contraseniaIngresada === contrasenia) {
    return true; // Contraseña correcta
  } else {
    intentos--;
    await Swal.fire({
      icon: "warning",
      title: "Aviso",
      text: `Contraseña incorrecta. Te quedan ${intentos} intentos.`,
    });
    if (intentos > 0) {
      return await validarContrasenia(); // Reintentar
    } else {
      await Swal.fire({
        icon: "error",
        title: "Intentos agotados",
        text: "Superaste el límite de intentos.",
      });
      intentos = 6; // Reiniciar intentos
      return false;
    }
  }
}

// Función para registrar una transacción
function registrarTransaccion(tipoTransaccion, nombreTransaccion, cantidadTransaccion) {
  const nuevaTransaccion = {
    destinatario: nombreTransaccion,
    cantidad: cantidadTransaccion,
    tipoTransaccion: tipoTransaccion,
    fecha: new Date().toLocaleString(),
  };

  // se guarda la transacción en el historial
  transacciones.push(nuevaTransaccion);
  localStorage.setItem("historialTransferencias", JSON.stringify(transacciones));

  // Mostrar la transacción en la pagina ("tu ultima actividad)")
  detalleActividad.innerHTML += generarTarjetaHTML(nuevaTransaccion);
}

// Función para generar el HTML de una tarjeta de transacción
function generarTarjetaHTML(transaccion) {
  return `
    <div class="tarjeta-transaccion">
      Nombre del transferido: ${transaccion.destinatario}<br>
      Cantidad: $${transaccion.cantidad}<br>
      Tipo de Transacción: ${transaccion.tipoTransaccion}<br>
      Fecha: ${transaccion.fecha}
    </div>`;
}

// Función para enviar dinero
botonEnviarDinero.onclick = async function () {
  try {
    const { value: destinatario, isConfirmed: isDestinatarioConfirmed } = await Swal.fire({
      title: "Transferencia",
      text: "¿A quién le deseas transferir?",
      icon: "question",
      input: "text",
      inputPlaceholder: "Nombre del destinatario",
      showCancelButton: true,
      confirmButtonText: "Enviar",
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage("Por favor, ingresa un nombre");
        }
        return value;
      },
    });

    if (!isDestinatarioConfirmed) return;

    // se pide la cantidad que desea transferir el usuario
    const { value: cantidadInput, isConfirmed: isCantidadConfirmed } = await Swal.fire({
      title: "Cantidad a Transferir",
      text: `¿Cuánto deseas transferir a ${destinatario}?`,
      icon: "question",
      input: "number",
      inputPlaceholder: "Cantidad en pesos",
      showCancelButton: true,
      confirmButtonText: "Transferir",
      preConfirm: (value) => {
        const cantidad = parseFloat(value);
        if (isNaN(cantidad) || cantidad <= 0) {
          Swal.showValidationMessage("Por favor, ingresa una cantidad válida");
        }
        return cantidad;
      },
    });

    if (!isCantidadConfirmed) return;

    const cantidad = parseFloat(cantidadInput);

    if (cantidad > saldo) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No posees el dinero suficiente",
      });
      return;
    }

    // se valida la contraseña
    const esValido = await validarContrasenia();

    if (esValido) {
      saldo -= cantidad;
      localStorage.setItem("saldo", JSON.stringify(saldo));

      // se actualiza el saldo en el DOM
      let saldoTexto = document.getElementById("txtCuadroPrincipal");
      if (saldoTexto) {
        saldoTexto.textContent = `$${saldo}`;
      }

      // se registra la transacción
      registrarTransaccion("Egreso", destinatario, cantidad);

      // Notificar que la transferencia fue realizada con exito
      await Swal.fire({
        icon: "success",
        title: "¡Transferencia Exitosa!",
        text: `Has transferido $${cantidad} a ${destinatario}.`,
      });
    }
  } catch (error) {
    console.error("Error en la transferencia:", error);
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un error durante la transferencia. Por favor, intenta nuevamente.",
    });
  }
};

// Función para recibir dinero
botonRecibirDinero.onclick = async function () {
  const { value: recibirNombre } = await Swal.fire({
    icon: "question",
    title: "Alias o Usuario",
    input: "text",
    inputLabel: "¿De quién deseas recibir dinero?",
    inputPlaceholder: "Alias",
    showCancelButton: true,
  });

  const { value: recibirCantidad } = await Swal.fire({
    icon: "question",
    title: "Monto",
    input: "number",
    inputLabel: "¿Cuánto deseas recibir?",
    inputPlaceholder: "Cantidad",
    showCancelButton: true,
  });

  // Convertir recibirCantidad a número
  const cantidadNumerica = parseFloat(recibirCantidad);

  if (recibirNombre !== "" && cantidadNumerica > 0) {
    const esValido = await validarContrasenia();

    if (esValido) {
      saldo += cantidadNumerica;

      let saldoTexto = document.getElementById("txtCuadroPrincipal");
      if (saldoTexto) {
        saldoTexto.textContent = `$${saldo}`;
      }

      localStorage.setItem("saldo", JSON.stringify(saldo));
      registrarTransaccion("Ingreso", recibirNombre, cantidadNumerica);

      await Swal.fire({
        icon: "success",
        title: "Depósito realizado con éxito",
        text: `Se ha recibido $${cantidadNumerica} de ${recibirNombre}.`,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Validación fallida. No se pudo completar la operación.",
      });
    }
  } else {
    Swal.fire({
      icon: "warning",
      title: "Datos faltantes",
      text: "Por favor, ingrese los valores solicitados correctamente.",
    });
  }
};
      //invoco a las funciones
      mostrarMensajeBienvenida()
      inicializarSaldo()