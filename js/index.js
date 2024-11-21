// Variables globales
let nombre = localStorage.getItem("nombre");
let contrasenia = JSON.parse(localStorage.getItem("contrasenia")) || null;
let transacciones = [];
let botonEnviarDinero = document.getElementById("enviarDinero");
let intentos = 6;
let saldo = parseFloat(localStorage.getItem("saldo")) || 0;

//informacion del dolar
  fetch("https://dolarapi.com/v1/dolares/oficial")
  .then(response => response.json())
  .then(data => console.log(data));

// Funciones
function inicializarSaldo() {
  localStorage.setItem("saldo", JSON.stringify(saldo));
  let saldoTexto = document.getElementById("txtCuadroPrincipal");
  if (saldoTexto) saldoTexto.textContent = `$${saldo}`;
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
        saldo = 80000;
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
      recibirDinero.onclick = function () {
       recibirDinero = document.getElementById("recibirDinero");
        let recibirNombre = prompt("Nombre de la cuenta a extraer el dinero");
        let recibirCantidad = parseInt(prompt("Cantidad a recibir"));
        if (recibirNombre !== "" && recibirCantidad > 0 && validarContrasenia(recibirNombre, recibirCantidad)) {
          saldo = saldo + recibirCantidad;
          saldoTexto.textContent = `$${saldo}`;
          localStorage.setItem("saldo", JSON.stringify(saldo));
          let fechaActual = new Date().toLocaleString();
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