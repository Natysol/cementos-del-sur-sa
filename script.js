
const tbody = document.getElementById("tbody");

document.getElementById("fecha").innerHTML =
  new Date().toLocaleDateString("es-AR");

document.getElementById("numero").value =
  "PRES-" + Math.floor(Math.random() * 100000);

function agregarFila(){

  const fila = document.createElement("tr");

  fila.innerHTML = `
    <td>
      <input type="number" class="cantidad" value="1">
    </td>

    <td>
      <input type="text" class="descripcion">
    </td>

    <td>
      <input type="number" class="precio" value="0">
    </td>

    <td class="totalFila">$0</td>

    <td>
      <button class="eliminar">X</button>
    </td>
  `;

  tbody.appendChild(fila);

  eventos(fila);

  calcular();

}

function eventos(fila){

  fila.querySelector(".cantidad")
    .addEventListener("input", calcular);

  fila.querySelector(".precio")
    .addEventListener("input", calcular);

  fila.querySelector(".eliminar")
    .addEventListener("click", ()=>{

      fila.remove();
      calcular();

    });

}

function calcular(){

  let subtotal = 0;

  document.querySelectorAll("#tbody tr")
    .forEach(fila=>{

      const cantidad =
        parseFloat(fila.querySelector(".cantidad").value) || 0;

      const precio =
        parseFloat(fila.querySelector(".precio").value) || 0;

      const total = cantidad * precio;

      fila.querySelector(".totalFila").innerHTML =
        "$ " + total.toLocaleString("es-AR");

      subtotal += total;

    });

  const iva = subtotal * 0.21;
  const totalFinal = subtotal + iva;

  document.getElementById("subtotal").innerHTML =
    "$ " + subtotal.toLocaleString("es-AR");

  document.getElementById("iva").innerHTML =
    "$ " + iva.toLocaleString("es-AR");

  document.getElementById("total").innerHTML =
    "$ " + totalFinal.toLocaleString("es-AR");

}

function guardarPresupuesto(){

  const datos = {
    cliente: document.getElementById("cliente").value,
    domicilio: document.getElementById("domicilio").value
  };

  localStorage.setItem("presupuesto", JSON.stringify(datos));

  alert("Presupuesto guardado");

}

function nuevoPresupuesto(){

  location.reload();

}

async function generarPDF(){

  const elemento = document.getElementById("presupuesto");

  const canvas = await html2canvas(elemento, {
    scale:2
  });

  const imgData = canvas.toDataURL("image/png");

  const { jsPDF } = window.jspdf;

  const pdf = new jsPDF("p", "mm", "a4");

  const width = pdf.internal.pageSize.getWidth();

  const height = (canvas.height * width) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, width, height);

  pdf.save("presupuesto.pdf");

}

agregarFila();
