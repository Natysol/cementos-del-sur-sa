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

  const { jsPDF } = window.jspdf;

  const pdf = new jsPDF(
    "p",
    "mm",
    "a4"
  );

  let y = 15;

  const cliente =
  document.getElementById("cliente").value;

  const domicilio =
  document.getElementById("domicilio").value;

  const condicion =
  document.getElementById("condicionIVA")
  .options[
    document.getElementById("condicionIVA")
    .selectedIndex
  ].text;

  const numero =
  document.getElementById("numero").value;

  const observaciones =
  document.getElementById("observaciones").value;

  pdf.setFontSize(18);
  pdf.text(
    "CEMENTOS DEL SUR S.A.",
    15,
    y
  );

  y += 8;

  pdf.setFontSize(10);

  pdf.text(
    "Planta: Parque Industrial - Viedma",
    15,
    y
  );

  y += 5;

  pdf.text(
    "Administracion: Colon Nº 639 - Viedma",
    15,
    y
  );

  y += 10;

  pdf.setFontSize(14);

  pdf.text(
    "PRESUPUESTO",
    15,
    y
  );

  y += 10;

  pdf.setFontSize(11);

  pdf.text(
    "Presupuesto Nº: " + numero,
    15,
    y
  );

  y += 7;

  pdf.text(
    "Cliente: " + cliente,
    15,
    y
  );

  y += 7;

  pdf.text(
    "Domicilio: " + domicilio,
    15,
    y
  );

  y += 7;

  pdf.text(
    "Condicion IVA: " + condicion,
    15,
    y
  );

  y += 12;

  pdf.setFontSize(10);

  pdf.text("Cant",10,y);
  pdf.text("Descripcion",35,y);
  pdf.text("P.Unit",130,y);
  pdf.text("Total",170,y);

  y += 5;

  pdf.line(
    10,
    y,
    200,
    y
  );

  y += 8;

  let subtotal = 0;

  document
  .querySelectorAll("#tbody tr")
  .forEach(fila=>{

    const cantidad =
    fila.querySelector(".cantidad").value;

    const descripcion =
    fila.querySelector(".descripcion").value;

    const precio =
    parseFloat(
      fila.querySelector(".precio").value
    ) || 0;

    const total =
    cantidad * precio;

    subtotal += total;

    pdf.text(
      cantidad.toString(),
      10,
      y
    );

    pdf.text(
      descripcion,
      35,
      y
    );

    pdf.text(
      "$ " +
      precio.toLocaleString("es-AR"),
      130,
      y
    );

    pdf.text(
      "$ " +
      total.toLocaleString("es-AR"),
      170,
      y
    );

    y += 8;

    if(y > 260){

      pdf.addPage();

      y = 20;

    }

  });

  let iva = 0;

  let totalFinal = subtotal;

  if(
    document
    .getElementById("condicionIVA")
    .value === "ri"
  ){

    iva = subtotal * 0.21;

    totalFinal =
    subtotal + iva;

  }

  y += 5;

  pdf.line(
    120,
    y,
    200,
    y
  );

  y += 10;

  pdf.text(
    "Subtotal: $" +
    subtotal.toLocaleString("es-AR"),
    120,
    y
  );

  y += 8;

  if(iva > 0){

    pdf.text(
      "IVA 21%: $" +
      iva.toLocaleString("es-AR"),
      120,
      y
    );

    y += 8;

  }

  pdf.setFontSize(13);

  pdf.text(
    "TOTAL: $" +
    totalFinal.toLocaleString("es-AR"),
    120,
    y
  );

  y += 15;

  pdf.setFontSize(11);

  pdf.text(
    "OBSERVACIONES:",
    15,
    y
  );

  y += 8;

  const lineas =
  pdf.splitTextToSize(
    observaciones,
    180
  );

  pdf.text(
    lineas,
    15,
    y
  );

  y += 30;

  pdf.text(
    "Vigencia de la oferta: 7 dias corridos.",
    15,
    y
  );

  y += 25;

  pdf.text(
    "________________________",
    130,
    y
  );

  y += 6;

  pdf.text(
    "CEMENTOS DEL SUR S.A.",
    135,
    y
  );

  pdf.save(
    numero + ".pdf"
  );

}
agregarFila();

