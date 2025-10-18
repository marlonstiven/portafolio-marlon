// app.js - Lógica del convertidor de divisas
// Guarda este archivo en: portafolio-marlon/proyectos/convertidor/app.js

// Tasas definidas localmente (base: USD = 1).
// En un proyecto real usarías una API para obtener tasas actualizadas.
const rates = {
  USD: 1,
  EUR: 0.95,
  GBP: 0.82,
  JPY: 149.3,
  CNY: 7.22,
  CAD: 1.36,
  AUD: 1.53,
  CHF: 0.88,
  MXN: 18.75,
  BRL: 5.10,
  KRW: 1330,
  INR: 83.5,
  RUB: 98.2,
  ARS: 375.0,
  CLP: 820.0,
  COP: 4120,
  SEK: 11.5,
  NOK: 10.9,
  ZAR: 18.0,
  TRY: 37.2
};

// Banderas (emoji) para mostrar junto a las divisas
const flags = {
  USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", JPY: "🇯🇵", CNY: "🇨🇳",
  CAD: "🇨🇦", AUD: "🇦🇺", CHF: "🇨🇭", MXN: "🇲🇽", BRL: "🇧🇷",
  KRW: "🇰🇷", INR: "🇮🇳", RUB: "🇷🇺", ARS: "🇦🇷", CLP: "🇨🇱",
  COP: "🇨🇴", SEK: "🇸🇪", NOK: "🇳🇴", ZAR: "🇿🇦", TRY: "🇹🇷"
};

// --- Referencias al DOM ---
const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const amountInput = document.getElementById("amount");
const convertBtn = document.getElementById("convertBtn");
const resultCard = document.getElementById("resultCard");
const resultText = document.getElementById("resultText");
const metaP = document.getElementById("meta");
const swapBtn = document.getElementById("swapBtn");
const clearBtn = document.getElementById("clearBtn");
const aboutBtn = document.getElementById("aboutBtn");
const aboutCard = document.getElementById("aboutCard");

// Si algún elemento no se encuentra, evitar errores (modo robusto)
if (!fromSelect || !toSelect || !amountInput) {
  console.warn("Faltan elementos DOM para el convertidor. Revisa el HTML.");
}

// Rellenar selects con las monedas definidas en `rates`
function populateSelects() {
  if (!fromSelect || !toSelect) return;
  const keys = Object.keys(rates);
  keys.forEach(code => {
    const optFrom = document.createElement("option");
    optFrom.value = code;
    optFrom.textContent = `${flags[code] ?? ""} ${code}`;
    fromSelect.appendChild(optFrom);

    const optTo = document.createElement("option");
    optTo.value = code;
    optTo.textContent = `${flags[code] ?? ""} ${code}`;
    toSelect.appendChild(optTo);
  });

  // Valores por defecto (ajusta si quieres otra configuración)
  if (keys.includes("USD")) fromSelect.value = "USD";
  if (keys.includes("COP")) toSelect.value = "COP";
}
populateSelects();

// Formateo de fecha/hora para mostrar cuándo se hizo la conversión
function formatDateTime(date = new Date()) {
  // usa configuración local de Colombia (es-CO)
  return date.toLocaleString("es-CO", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit"
  });
}

// Validaciones básicas de entrada
function validateInput(amount, from, to) {
  const errors = [];
  if (amount === "" || amount === null || amount === undefined) errors.push("Ingresa un monto.");
  if (isNaN(amount)) errors.push("El monto debe ser un número válido.");
  if (Number(amount) < 0) errors.push("El monto no puede ser negativo.");
  if (!rates[from]) errors.push("Moneda de origen inválida.");
  if (!rates[to]) errors.push("Moneda destino inválida.");
  return errors;
}

// Función de conversión usando la fórmula: (monto / tasaOrigen) * tasaDestino
function convert(amount, from, to) {
  const rateFrom = rates[from];
  const rateTo = rates[to];
  const result = (Number(amount) / rateFrom) * rateTo;
  return result;
}

// Mostrar resultado en la interfaz
function showResult(amount, from, to, converted) {
  if (!resultText || !metaP || !resultCard) return;
  resultText.textContent = `${flags[to] ?? ""} ${to} ${Number(converted).toFixed(2)}`;
  const usedRate = (rates[to] / rates[from]).toFixed(6);
  metaP.textContent = `Equivalencia: 1 ${from} = ${usedRate} ${to} · ${formatDateTime()}`;
  resultCard.classList.remove("hidden");

  // Doble click para copiar el resultado al portapapeles
  resultText.ondblclick = () => {
    const textToCopy = `${Number(converted).toFixed(2)} ${to}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        const prev = metaP.textContent;
        metaP.textContent = "Resultado copiado al portapapeles ✅";
        setTimeout(() => metaP.textContent = prev, 1500);
      }).catch(() => {
        // si falla, no pasa nada
      });
    } else {
      // Fallback: selección y copia manual
      const tmp = document.createElement("textarea");
      tmp.value = textToCopy;
      document.body.appendChild(tmp);
      tmp.select();
      try { document.execCommand("copy"); metaP.textContent = "Resultado copiado al portapapeles ✅"; }
      catch (e) { /* ignore */ }
      document.body.removeChild(tmp);
      setTimeout(() => metaP.textContent = `Equivalencia: 1 ${from} = ${usedRate} ${to} · ${formatDateTime()}`, 1500);
    }
  };
}

// --- Eventos ---
if (convertBtn) {
  convertBtn.addEventListener("click", () => {
    const amount = amountInput.value.trim();
    const from = fromSelect.value;
    const to = toSelect.value;

    const errors = validateInput(amount, from, to);
    if (errors.length) {
      alert(errors.join("\n"));
      return;
    }

    const converted = convert(amount, from, to);
    showResult(amount, from, to, converted);
  });
}

if (swapBtn) {
  swapBtn.addEventListener("click", () => {
    const a = fromSelect.value;
    const b = toSelect.value;
    fromSelect.value = b;
    toSelect.value = a;
    // opcional: recalcular automáticamente si hay monto
    // if (amountInput.value.trim() !== "") convertBtn.click();
  });
}

if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    amountInput.value = "";
    if (resultCard) resultCard.classList.add("hidden");
  });
}

if (aboutBtn && aboutCard) {
  aboutBtn.addEventListener("click", () => {
    aboutCard.classList.toggle("hidden");
    if (!aboutCard.classList.contains("hidden")) aboutCard.scrollIntoView({ behavior: "smooth" });
  });
}

// Permitir Enter para ejecutar la conversión desde el campo de monto
if (amountInput) {
  amountInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (convertBtn) convertBtn.click();
    }
  });
}

// Inicialización adicional si quieres que la conversión se realice al cambiar selects:
// fromSelect.addEventListener("change", () => { if (amountInput.value.trim() !== "") convertBtn.click(); });
// toSelect.addEventListener("change", () => { if (amountInput.value.trim() !== "") convertBtn.click(); });

// --- Fin de app.js ---
