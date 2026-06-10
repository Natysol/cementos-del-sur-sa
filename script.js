const tbody = document.getElementById("tbody");

document.getElementById("fecha").innerHTML =
new Date().toLocaleDateString("es-AR");

document.getElementById("numero").value =
"PRES-" + Math.floor(Math.random() * 100000);

document.getElementById("condicionIVA")
.addEventListener("change", calcular);

function agregarFila(){

  const fila = document.createElement("tr");

  fila.innerHTML = `

    <td>
      <input type="number"
             class="cantidad"
             value="1">
    </td>

    <td>
      <input type="text"
             class="descripcion">
    </td>

    <td>
      <input type="number"
             class="precio"
             value="0">
    </td>

    <td class="totalFila">
      $0
    </td>

    <td class="no-pdf">
      <button class="eliminar">
        X
      </button>
    </td>

  `;

  tbody.appendChild(fila);

  eventosFila(fila);

  calcular();

}

function eventosFila(fila){

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
    parseFloat(
      fila.querySelector(".cantidad").value
    ) || 0;

    const precio =
    parseFloat(
      fila.querySelector(".precio").value
    ) || 0;

    const total = cantidad * precio;

    fila.querySelector(".totalFila").innerHTML =
    "$ " + total.toLocaleString("es-AR");

    subtotal += total;

  });

  const condicion =
  document.getElementById("condicionIVA").value;

  let iva = 0;

  let totalFinal = subtotal;

  if(condicion === "ri"){

    iva = subtotal * 0.21;

    totalFinal = subtotal + iva;

    document.getElementById("filaIVA").style.display =
    "flex";

  }else{

    document.getElementById("filaIVA").style.display =
    "none";

  }

  document.getElementById("subtotal").innerHTML =
  "$ " + subtotal.toLocaleString("es-AR");

  document.getElementById("iva").innerHTML =
  "$ " + iva.toLocaleString("es-AR");

  document.getElementById("total").innerHTML =
  "$ " + totalFinal.toLocaleString("es-AR");

}

function nuevoPresupuesto(){

  location.reload();

}

async function generarPDF(){

  const sidebar =
  document.querySelector(".sidebar");

  const elementos =
  document.querySelectorAll(".no-pdf");

  const contenedor =
  document.getElementById("presupuesto");

  // GUARDAR ESTILOS ORIGINALES

  const anchoOriginal =
  contenedor.style.width;

  const marginOriginal =
  contenedor.style.margin;

  // OCULTAR ELEMENTOS

  sidebar.style.display = "none";

  elementos.forEach(el=>{

    el.style.display = "none";

  });

  // AJUSTAR A4

  contenedor.style.width = "794px";

  contenedor.style.margin = "0 auto";

  // ESPERAR RENDER

  await new Promise(resolve =>
    setTimeout(resolve, 500)
  );

  // CAPTURAR

  const canvas = await html2canvas(contenedor, {

    scale:3,

    useCORS:true,

    scrollX:0,

    scrollY:0

  });

  const imgData =
  canvas.toDataURL("image/jpeg", 1.0);

  const { jsPDF } = window.jspdf;

  const pdf =
  new jsPDF({

    orientation:"portrait",

    unit:"mm",

    format:"a4"

  });

  const pdfWidth = 210;

  const pdfHeight =
  (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(

    imgData,

    "JPEG",

    0,

    0,

    pdfWidth,

    pdfHeight

  );

  pdf.save("presupuesto.pdf");

  // RESTAURAR

  contenedor.style.width =
  anchoOriginal;

  contenedor.style.margin =
  marginOriginal;

  sidebar.style.display = "block";

  elementos.forEach(el=>{

    el.style.display = "";

  });

}

agregarFila();
