// ===============================
// PREGUNTAS
// ===============================

const questions = [
  { text: "Me preocupo por el bienestar emocional de mi equipo.", style: "Afable" },
  { text: "Prefiero mantener armonía antes que confrontar.", style: "Afable" },
  { text: "Escucho antes de decidir.", style: "Afable" },
  { text: "Soy paciente con errores.", style: "Afable" },

  { text: "Tomo decisiones basadas en datos.", style: "Analitico" },
  { text: "Planifico antes de actuar.", style: "Analitico" },
  { text: "Analizo riesgos antes de decidir.", style: "Analitico" },
  { text: "Busco precisión en el trabajo.", style: "Analitico" },

  { text: "Me enfoco en resultados.", style: "Emprendedor" },
  { text: "Tomo decisiones bajo presión.", style: "Emprendedor" },
  { text: "Disfruto retos y competencia.", style: "Emprendedor" },
  { text: "Voy directo al punto.", style: "Emprendedor" },

  { text: "Motivo a otros.", style: "Expresivo" },
  { text: "Transmito entusiasmo.", style: "Expresivo" },
  { text: "Genero nuevas ideas.", style: "Expresivo" },
  { text: "Inspiro visión.", style: "Expresivo" }
];

const scale = ["Nunca","Rara vez","A veces","Frecuentemente","Siempre"];

let current = 0;
let answers = [];
let chartInstance = null;
let generatedPrompt = "";

// ===============================
// ELEMENTOS DOM
// ===============================

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const progressEl = document.getElementById("progress");
const resultEl = document.getElementById("result");

// ===============================
// MOSTRAR PREGUNTA
// ===============================

function showQuestion() {

  questionEl.innerText = questions[current].text;
  optionsEl.innerHTML = "";

  scale.forEach((label, index) => {

    const btn = document.createElement("button");
    btn.innerText = label;

    btn.onclick = () => {

      answers[current] = index + 1;
      current++;

      if (current < questions.length) {
        showQuestion();
      } else {
        calculateResult();
      }

      updateProgress();
    };

    optionsEl.appendChild(btn);
  });

  updateProgress();
}

// ===============================
// PROGRESO
// ===============================

function updateProgress() {
  const percent = (current / questions.length) * 100;
  progressEl.style.width = percent + "%";
}

// ===============================
// CALCULAR RESULTADOS
// ===============================

function calculateResult() {

  const scores = {
    Afable: 0,
    Analitico: 0,
    Emprendedor: 0,
    Expresivo: 0
  };

  answers.forEach((value, index) => {
    scores[questions[index].style] += value;
  });

  const sorted = Object.entries(scores)
    .sort((a,b)=>b[1]-a[1]);

  const dominant = sorted[0][0];
  const secondary = sorted[1][0];

  showResult(scores, dominant, secondary);
}

// ===============================
// SIGNIFICADO COMBINACIONES
// ===============================

function combinationMeaning(a,b){

  const map = {

    "Afable-Analitico": "Liderazgo confiable, estructurado y orientado a relaciones sostenibles.",
    "Afable-Emprendedor": "Liderazgo cercano con fuerte orientación a resultados.",
    "Afable-Expresivo": "Liderazgo inspirador y humano, enfocado en personas.",
    "Analitico-Emprendedor": "Liderazgo estratégico orientado a eficiencia y ejecución.",
    "Analitico-Expresivo": "Liderazgo visionario con pensamiento estructurado.",
    "Emprendedor-Expresivo": "Liderazgo carismático orientado a impacto y crecimiento."
  };

  return map[`${a}-${b}`] || map[`${b}-${a}`] || "Combinación equilibrada de estilos de liderazgo.";
}

// ===============================
// ANALISIS DETALLADO
// ===============================

function detailedAnalysis(dominant, secondary){

return `
Tu combinación predominante es ${dominant} con influencia ${secondary}.

Esto significa que tu forma natural de liderar integra características de ambos estilos, lo que genera mayor flexibilidad conductual y capacidad de adaptación a distintos contextos.

FORTALEZAS PRINCIPALES
• Mayor rango de influencia interpersonal
• Capacidad de equilibrar personas y resultados
• Adaptación al contexto organizacional
• Pensamiento más completo que perfiles extremos

RIESGOS POTENCIALES
• Conflicto interno en toma de decisiones
• Sensación de sobrecarga por expectativas
• Inconsistencia percibida por otros
• Estrés por intentar cumplir múltiples roles

CÓMO LIDERAS EQUIPOS
Tiendes a combinar dirección con apoyo, ajustando tu estilo según las necesidades del entorno y del equipo.

CÓMO TE PERCIBEN
Generalmente como un líder versátil, con capacidad de adaptación y visión amplia.

EVOLUCIÓN RECOMENDADA
El desarrollo consiste en aprender cuándo activar cada estilo y no intentar usar todos simultáneamente.
`;
}

// ===============================
// PROMPT PERSONALIZADO
// ===============================

function buildPrompt(style1, style2){

return `Actúa como coach ejecutivo experto.

Mi combinación de liderazgo es ${style1} con influencia ${style2}.

Quiero un análisis profundo que incluya:

- Fortalezas
- Riesgos
- Cómo lidero equipos
- Cómo me perciben
- Evolución
- Roles ideales
- Recomendaciones prácticas

Entrega un análisis profesional detallado.`;

}

// ===============================
// MOSTRAR RESULTADO
// ===============================

function showResult(scores, dominant, secondary){

  document.getElementById("questionContainer").style.display = "none";

  resultEl.classList.remove("hidden");

  const meaning = combinationMeaning(dominant, secondary);
  const analysis = detailedAnalysis(dominant, secondary);

  resultEl.innerHTML = `
  
  <div class="result-box">

    <h2>${dominant} — ${secondary}</h2>

    <p><strong>Significado:</strong> ${meaning}</p>

    <p>${analysis}</p>

    <canvas id="chart"></canvas>

    <button class="action-btn" onclick="copyPrompt()">
      Copiar análisis para ChatGPT
    </button>

    <button class="action-btn" onclick="downloadPDF()">
      Descargar PDF
    </button>

  </div>
  
  `;

  generatedPrompt = buildPrompt(dominant, secondary);

  createChart(scores);
}

// ===============================
// GRAFICO
// ===============================

function createChart(scores){

  const ctx = document.getElementById("chart");

  if(chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: Object.keys(scores),
      datasets: [{
        label: 'Perfil de Liderazgo',
        data: Object.values(scores),
        backgroundColor: 'rgba(79,70,229,0.25)',
        borderColor: '#4f46e5',
        pointBackgroundColor: '#4f46e5',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        r: {
          beginAtZero: true,
          grid: { color: "#e5e7eb" },
          pointLabels: { font: { size: 12 } }
        }
      }
    }
  });
}

// ===============================
// COPIAR PROMPT
// ===============================

function copyPrompt(){
  navigator.clipboard.writeText(generatedPrompt);
  alert("Prompt copiado");
}

// ===============================
// PDF
// ===============================

async function downloadPDF(){

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Resultado de Estilo de Liderazgo", 20, 20);

  doc.setFontSize(12);

  const text = resultEl.innerText;

  doc.text(text, 20, 35, { maxWidth: 170 });

  doc.save("resultado_liderazgo.pdf");
}

// ===============================
// INICIAR
// ===============================

showQuestion();
