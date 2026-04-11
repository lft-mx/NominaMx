let modoCalculo = "bruto";
let idioma = localStorage.getItem("idioma") || "es";

// TEXTOS
const textos = {
  es: {
    titulo: "Calculadora Laboral México",
    mensajeNeto: "Sueldo neto = Lo que realmente recibes después de impuestos",
    calcular: "Calcular",
    cloudText: "¿Cuánto te depositan?",
    cloudSubtext: "Usa el sueldo neto para calcular cuánto te retienen",
    fondoAhorroLabel: "Fondo de Ahorro (aportación voluntaria) 🏦",
    fondoAhorroPlaceholder: "Ej: 500 - lo que aportas tú"
  },
  en: {
    titulo: "Mexico Labor Calculator",
    mensajeNeto: "Net salary = What you actually receive after taxes",
    calcular: "Calculate",
    cloudText: "How much do you get deposited?",
    cloudSubtext: "Use net salary to calculate how much is withheld",
    fondoAhorroLabel: "Savings Fund (voluntary contribution) 🏦",
    fondoAhorroPlaceholder: "Ex: 500 - what you contribute"
  }
};

function aplicarIdioma() {
  document.getElementById("titulo").innerText = textos[idioma].titulo;
  document.getElementById("mensajeNeto").innerText = textos[idioma].mensajeNeto;
  document.getElementById("cloudText").innerText = textos[idioma].cloudText;
  document.getElementById("cloudSubtext").innerHTML = textos[idioma].cloudSubtext;
  
  const btn = document.querySelector(".btn");
  if (btn) btn.innerText = textos[idioma].calcular;
  
  const fondoInput = document.getElementById("fondoAhorro");
  if (fondoInput) {
    const labelFondo = document.querySelector("label[for='fondoAhorro']") || 
                       document.querySelector("label:nth-child(12)");
    if (labelFondo) labelFondo.innerText = textos[idioma].fondoAhorroLabel;
    fondoInput.placeholder = textos[idioma].fondoAhorroPlaceholder;
  }
  
  document.getElementById("netoInput").placeholder = idioma === "es" ? "Ej: 12000" : "Ex: 12000";
  
  const switchLang = document.querySelector(".lang-switch");
  if (switchLang) switchLang.classList.toggle("en", idioma === "en");
}

function setIdioma(id) {
  idioma = id;
  localStorage.setItem("idioma", idioma);
  aplicarIdioma();
}

function toggleIdioma() {
  idioma = idioma === "es" ? "en" : "es";
  localStorage.setItem("idioma", idioma);
  aplicarIdioma();
}

function toggleModo() {
  document.body.classList.toggle("dark");
  const btn = document.getElementById("modo-btn");
  const isDark = document.body.classList.contains("dark");
  btn.innerText = isDark ? "☀️" : "🌙";
  localStorage.setItem("modo", isDark ? "dark" : "light");
}

window.onload = () => {
  aplicarIdioma();
  const modoGuardado = localStorage.getItem("modo");
  if (modoGuardado === "dark") {
    document.body.classList.add("dark");
  }
  const btn = document.getElementById("modo-btn");
  if (btn) btn.innerText = modoGuardado === "dark" ? "☀️" : "🌙";
};

function calcularSueldo() {
  if (modoCalculo === "neto") {
    calcularModoNeto();
  } else {
    calcularModoBruto();
  }
}

function calcularModoNeto() {
  const neto = parseFloat(document.getElementById("netoInput").value) || 0;
  
  // Estimación inversa (neto / 0.85 es un aproximado)
  const ingresoTotal = neto / 0.85;
  const isr = ingresoTotal * 0.1;
  const imss = ingresoTotal * 0.03;
  const infonavit = 0;
  const fondoAhorro = 0;
  
  renderGrafica(isr, imss, infonavit, neto, fondoAhorro);
  
  document.getElementById("resultado").innerHTML = `
    <p><strong>💰 Estimación sueldo bruto:</strong> $${Math.round(ingresoTotal).toLocaleString()}</p>
    <p>🧾 ISR estimado: $${Math.round(isr).toLocaleString()}</p>
    <p>🏥 IMSS estimado: $${Math.round(imss).toLocaleString()}</p>
    <hr>
    <h3>💵 Recibes en tu cuenta: $${Math.round(neto).toLocaleString()}</h3>
    <br>
    <small>⚠️ Nota: Esta es una estimación. Los impuestos reales varían según tu salario exacto.</small>
  `;
}

function calcularModoBruto() {
  const salarioInput = parseFloat(document.getElementById("salario").value) || 0;
  const bonos = parseFloat(document.getElementById("bonos").value) || 0;
  const infonavit = parseFloat(document.getElementById("infonavit").value) || 0;
  const fondoAhorro = parseFloat(document.getElementById("fondoAhorro").value) || 0;
  const dias = parseFloat(document.getElementById("dias").value) || 30;
  const periodo = document.getElementById("periodo").value;
  
  // Convertir a diario
  let salarioDiario = 0;
  if (periodo === "mensual") salarioDiario = salarioInput / 30;
  if (periodo === "quincenal") salarioDiario = salarioInput / 15;
  if (periodo === "semanal") salarioDiario = salarioInput / 7;
  
  const salarioReal = salarioDiario * dias;
  const ingresoTotal = salarioReal + bonos;
  
  // Cálculo de ISR más realista
  let isr = 0;
  if (ingresoTotal > 10372) {
    if (ingresoTotal <= 15000) isr = ingresoTotal * 0.1088;
    else if (ingresoTotal <= 30000) isr = ingresoTotal * 0.16;
    else if (ingresoTotal <= 60000) isr = ingresoTotal * 0.219;
    else isr = ingresoTotal * 0.30;
  }
  
  const imss = ingresoTotal * 0.03;
  
  // Fondo de ahorro: normalmente 13% del salario (6.5% patrón + 6.5% empleado)
  // Aquí el usuario ingresa lo que APORTA ÉL, y el patrón duplica
  const aportacionPatron = fondoAhorro; // El patrón aporta lo mismo que el empleado
  const fondoAhorroTotal = fondoAhorro + aportacionPatron;
  
  const deducciones = isr + imss + infonavit + fondoAhorro;
  const neto = ingresoTotal - deducciones;
  
  renderGrafica(isr, imss, infonavit, neto, fondoAhorro);
  
  document.getElementById("resultado").innerHTML = `
    <p><strong>💰 Ingreso bruto calculado:</strong> $${Math.round(ingresoTotal).toLocaleString()}</p>
    <p>📅 Periodo: <strong>${periodo === 'mensual' ? 'Mensual' : periodo === 'quincenal' ? 'Quincenal' : 'Semanal'}</strong> | 👷 Días: ${dias}</p>
    <p>🧾 <strong>ISR:</strong> $${Math.round(isr).toLocaleString()}</p>
    <p>🏥 <strong>IMSS:</strong> $${Math.round(imss).toLocaleString()}</p>
    <p>🏠 <strong>Infonavit:</strong> $${Math.round(infonavit).toLocaleString()}</p>
    ${fondoAhorro > 0 ? `<p>🏦 <strong>Fondo de ahorro (tu aportación):</strong> $${Math.round(fondoAhorro).toLocaleString()}<br>
    <small>✨ El patrón aporta otros $${Math.round(fondoAhorro).toLocaleString()} = Total fondo: $${Math.round(fondoAhorroTotal).toLocaleString()}</small></p>` : ''}
    <hr>
    <h3>💵 Neto que recibes: $${Math.round(neto).toLocaleString()}</h3>
    <br>
    <small>⚠️ Nota: Los impuestos son estimados. Empresas pueden usar tablas oficiales del SAT.</small>
    <br><br>
    <button onclick="verDetalle()" class="btn">📊 Ver desglose detallado</button>
  `;
}

function renderGrafica(isr, imss, infonavit, neto, fondoAhorro) {
  const total = isr + imss + infonavit + neto + (fondoAhorro || 0);
  if (total === 0) return;
  
  const labels = ["ISR", "IMSS", "Infonavit", "Neto"];
  const dataColors = ["#ff4d4d", "#ffa500", "#4da6ff", "#00c853"];
  let dataValues = [isr, imss, infonavit, neto];
  
  if (fondoAhorro && fondoAhorro > 0) {
    labels.splice(3, 0, "Fondo Ahorro");
    dataColors.splice(3, 0, "#9c27b0");
    dataValues.splice(3, 0, fondoAhorro);
  }
  
  const dataPercent = dataValues.map(v => (v / total) * 100);
  
  const ctx = document.getElementById("grafica").getContext("2d");
  if (window.chart) window.chart.destroy();
  
  window.chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [{
        data: dataPercent,
        backgroundColor: dataColors
      }]
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.label + ": " + context.raw.toFixed(1) + "%";
            }
          }
        }
      }
    }
  });
}

function verDetalle() {
  const espanol = idioma === "es";
  alert(espanol 
    ? "📋 Cálculo detallado:\n\n- ISR: Impuesto Sobre la Renta (progresivo según tu ingreso)\n- IMSS: 3% aprox para salud y pensiones\n- Infonavit: Crédito de vivienda\n- Fondo de ahorro: Ahorro voluntario (patrón duplica)\n\n💡 Para más precisión, usa tu recibo de nómina real."
    : "📋 Detailed calculation:\n\n- ISR: Income Tax (progressive based on income)\n- IMSS: ~3% for health and pension\n- Infonavit: Housing credit\n- Savings fund: Voluntary savings (employer matches)\n\n💡 For more accuracy, use your actual pay stub."
  );
}

function cambiarModo(modo) {
  modoCalculo = modo;
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(t => t.classList.remove("active"));
  
  const brutoDiv = document.getElementById("brutoInputs");
  const netoDiv = document.getElementById("netoInputs");
  
  if (modo === "bruto") {
    tabs[0].classList.add("active");
    brutoDiv.style.display = "block";
    netoDiv.style.display = "none";
  } else {
    tabs[1].classList.add("active");
    brutoDiv.style.display = "none";
    netoDiv.style.display = "block";
  }
}

function formatMoney(input) {
  let valor = input.value;
  if (valor === '') return;
  let numeros = valor.replace(/[^0-9.]/g, '');
  if (numeros === '') {
    input.value = '';
    return;
  }
  let numero = parseFloat(numeros);
  if (!isNaN(numero)) {
    input.value = numero.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
                                          }
