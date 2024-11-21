// Declaración de variables
let nombre = localStorage.getItem("nombre");
let nombreTextoHtml = document.getElementById("txtmarcoAlto");
let contrasenia;
let transacciones = JSON.parse(localStorage.getItem("historialTransferencias")) || [];
let botonEnviarDinero = document.getElementById("enviarDinero");
let botonRecibirDinero = document.getElementById("botonRecibirDinero");
let intentos = 6;
let saldo = parseFloat(localStorage.getItem("saldo")) || 0;

//informacion del dolar
  fetch("https://dolarapi.com/v1/dolares/oficial")
  .then(response => response.json())
  .then(data => console.log(data));


let detalleActividad = document.getElementById("detalleActividad");

// Mostrar historial inicial si es que existe
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

function mostrarMensajeBienvenida() {
  let nombreTextoHtml = document.getElementById("txtmarcoAlto");
  if (nombre) {
    nombreTextoHtml.textContent = `¡¡Bienvenido, ${nombre}!!`;
  } else {
    nombre = prompt("Ingrese su Nombre Aquí:");
    localStorage.setItem("nombre", JSON.stringify(nombre));
    nombreTextoHtml.textContent = `¡¡Bienvenido, ${nombre}!!`;
  }
}

function almacenarContrasenia() {
  if (!contrasenia) {
    contrasenia = prompt("¿Cuál desea que sea su contraseña?");
    localStorage.setItem("contrasenia", JSON.stringify(contrasenia));
  }
}

      function inicializarSaldo(){
      if (!saldo) {
        localStorage.setItem("saldo", JSON.stringify(saldo));
      }
      
      let saldoTexto = document.getElementById("txtCuadroPrincipal");
      if (saldoTexto) {
        saldoTexto.textContent = `$${saldo}`;
      }}
      botonEnviarDinero.onclick = async function () {
        try {
          // Solicitar el nombre al que le sera transferido
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
            }
          });
      
          if (!isDestinatarioConfirmed) {
            return;
          }
      
          // se solicita la cantidad a transferir
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
            }
          });
      
          if (!isCantidadConfirmed) {
            return;
          }
      
          const cantidad = parseFloat(cantidadInput);
      
          if (cantidad > saldo) {
            await Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "No posees el dinero suficiente",
              footer: '<a href="#">Soporte Técnico</a>'
            });
            return;
          }
      
          // Solicitar la contraseña
          const contraseniaIngresada = prompt("Ingrese su contraseña:");
          if (contraseniaIngresada !== contrasenia) {
            intentos--;
            if (intentos > 0) {
              alert(`Contraseña incorrecta. Te quedan ${intentos} intentos.`);
            } else {
              alert("Has superado el límite de intentos.");
              return;
            }
            return;
          }
      
          // Confirmar la transferencia
          const { isConfirmed: isConfirmado } = await Swal.fire({
            title: "Confirmar Transferencia",
            text: `Transferir $${cantidad} a ${destinatario}. ¿Deseas continuar?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar"
          });
      
          if (!isConfirmado) {
            alert("Transferencia cancelada.");
            return;
          }
      
          // Procesar la transferencia
          saldo -= cantidad;
          localStorage.setItem("saldo", JSON.stringify(saldo));
      
          // Actualizar el saldo en el DOM
          let saldoTexto = document.getElementById("txtCuadroPrincipal");
          if (saldoTexto) {
            saldoTexto.textContent = `$${saldo}`;
          }
      
          //se guarda la transacción para luego ser enviada a "tu ultima actividad"
          registrarTransaccion("Egreso", destinatario, cantidad);
      
          // se le notifica al usuario que ya se hizo la transferencia
          Swal.fire({
            icon: "success",
            title: "¡Transferencia Exitosa!",
            text: `Has transferido $${cantidad} a ${destinatario}.`
          });
      
        } catch (error) {
          console.error("Error en la transferencia:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ocurrió un error durante la transferencia. Por favor, intenta nuevamente."
          });
        }
      };
      
      //función para verificar en caso que la contraseña sea Correcta o Incorrecta
      function validarContrasenia(transferencia, cantidad) {
        while (intentos > 1) {
          let contraseniaIngresada = Swal.fire({
            icon: "warning",
            title: "aviso",
            text: "Ingrese su contraseña:"
          
          })
          if (contraseniaIngresada === contrasenia) {
            Swal.fire({
              icon: "",
              title: "validación",
              text: "En caso que los siguientes datos sean correctos, escribe 'aceptar', de lo contrario escribe 'rechazar'."
          });
            const verificacion_de_datos = prompt(
              "Transferir a: " + transferencia + " " + "Cantidad: " + cantidad
            );
            return verificacion_de_datos === "aceptar";
          } else {
            intentos--;
            Swal.fire({
              icon: "warning",
              title: "aviso",
              text: "contraseña Incorrecta. Te quedan: " + intentos + " intentos."
          });
        }}
        Swal.fire({
          icon: "error",
          title: "intentos",
          text: "Superaste el limite de Intentos"
      });
      }

      //función para recibir Dinero
      botonRecibirDinero.onclick = function () {
       botonRecibirDinero = document.getElementById("botonRecibirDinero");
        let recibirNombre = prompt("Nombre de la cuenta a extraer el dinero");
        let recibirCantidad = parseInt(prompt("Cantidad a recibir"));
        if (recibirNombre !== "" && recibirCantidad > 0 && validarContrasenia(recibirNombre, recibirCantidad)) {
          saldo = saldo + recibirCantidad;
          saldoTexto.textContent = `$${saldo}`;
          localStorage.setItem("saldo", JSON.stringify(saldo));
          registrarTransaccion("Ingreso", recibirNombre, recibirCantidad);
          alert("¡¡Extracción exitosa!!");
        } else {
          alert("Por favor, ingrese los valores solicitados");
        }
      };
      
      //invoco a las funciones
      mostrarMensajeBienvenida()
      almacenarContrasenia()
      inicializarSaldo()