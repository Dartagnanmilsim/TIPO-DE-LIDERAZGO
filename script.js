// =====================
// (TODO LO QUE YA TENÍAS)
// =====================

// preguntas iguales (no cambiadas)
const questions = [
  { text: "Antes de tomar decisiones importantes considero el impacto en las personas.", style: "Afable" },
  { text: "Prefiero resolver conflictos mediante diálogo y consenso.", style: "Afable" },
  { text: "Las personas suelen confiar en mí para hablar de problemas.", style: "Afable" },
  { text: "Dedico tiempo a conocer personalmente a mi equipo.", style: "Afable" },
  { text: "Me preocupa mantener un ambiente laboral positivo.", style: "Afable" },
  { text: "Evito decisiones que puedan afectar emocionalmente al equipo.", style: "Afable" },

  { text: "Antes de actuar necesito información suficiente y datos claros.", style: "Analitico" },
  { text: "Analizo riesgos antes de tomar decisiones relevantes.", style: "Analitico" },
  { text: "Prefiero procesos estructurados y organizados.", style: "Analitico" },
  { text: "Me enfoco en precisión y calidad más que en velocidad.", style: "Analitico" },
  { text: "Suelo cuestionar ideas hasta entenderlas completamente.", style: "Analitico" },
  { text: "Planifico escenarios antes de ejecutar.", style: "Analitico" },

  { text: "Tomo decisiones rápidamente incluso con información incompleta.", style: "Emprendedor" },
  { text: "Me siento cómodo asumiendo riesgos.", style: "Emprendedor" },
  { text: "Me enfoco intensamente en lograr objetivos.", style: "Emprendedor" },
  { text: "Prefiero acción inmediata antes que análisis prolongado.", style: "Emprendedor" },
  { text: "Me motiva superar desafíos difíciles.", style: "Emprendedor" },
  { text: "Exijo alto rendimiento de mi equipo.", style: "Emprendedor" },

  { text: "Me entusiasma compartir ideas y visiones de futuro.", style: "Expresivo" },
  { text: "Las personas suelen contagiarse de mi energía.", style: "Expresivo" },
  { text: "Disfruto persuadir e influir en otros.", style: "Expresivo" },
  { text: "Prefiero entornos dinámicos y creativos.", style: "Expresivo" },
  { text: "Me resulta natural motivar equipos.", style: "Expresivo" },
  { text: "Comunico con entusiasmo y emoción.", style: "Expresivo" }
];

const scale = ["Nunca","Rara vez","A veces","Frecuentemente","Siempre"];

let current = 0;
let answers = [];
let chartInstance = null;
let generatedPrompt = "";

// DOM
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const progressEl = document.getElementById("progress");
const resultEl = document.getElementById("result");

function showQuestion() {

  questionEl.innerText = questions[current].text;
  optionsEl.innerHTML = "";

  scale.forEach((label, index) => {

    const btn = document.createElement("button");
    btn.innerText = label;

    btn.onclick = () => {

      answers[current] = index + 1;
      current++;

      if (current < questions.length) showQuestion();
      else calculateResult();

      updateProgress();
    };

    optionsEl.appendChild(btn);
  });

  updateProgress();
}

function updateProgress() {
  progressEl.style.width = (current / questions.length) * 100 + "%";
}

// =====================
// NUEVO ANALISIS DETALLADO DE PUNTAJES
// =====================

function buildProfileDetails(scores){

  const total = Object.values(scores).reduce((a,b)=>a+b,0);

  const percentages = {};

  Object.keys(scores).forEach(key=>{
    percentages[key] = Math.round((scores[key]/total)*100);
  });

  const intensity = (value)=>{
    if(value >= 75) return "Muy alto";
    if(value >= 55) return "Alto";
    if(value >= 35) return "Moderado";
    return "Bajo";
  };

  let text = "INFORMACIÓN DETALLADA DEL PERFIL\n\n";

  Object.keys(scores).forEach(style=>{
    text += `${style}: ${scores[style]} puntos (${percentages[style]}%) — Nivel ${intensity(percentages[style])}\n`;
  });

  return text;
}

// =====================
// CALCULO
// =====================

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

  const sorted = Object.entries(scores).sort((a,b)=>b[1]-a[1]);

  const dominant = sorted[0][0];
  const secondary = sorted[1][0];

  showResult(scores, dominant, secondary);
}

// =====================
// RESULTADO
// =====================

function showResult(scores, dominant, secondary){

  document.getElementById("questionContainer").style.display = "none";

  resultEl.classList.remove("hidden");

  const profileDetails = buildProfileDetails(scores);

  resultEl.innerHTML = `
  
  <div class="result-box">

    <h2>${dominant} — ${secondary}</h2>

    <p><strong>Datos del perfil:</strong></p>
    <pre>${profileDetails}</pre>

    <canvas id="chart"></canvas>

    <button class="action-btn" onclick="copyPrompt()">Copiar análisis para ChatGPT</button>
    <button class="action-btn" onclick="downloadPDF()">Descargar PDF</button>

  </div>
  
  `;

  generatedPrompt = `
Mi perfil de liderazgo es ${dominant} con influencia ${secondary}.

${profileDetails}

Analiza este perfil profesionalmente.
`;

  createChart(scores);
}

// =====================
// GRAFICO
// =====================

function createChart(scores){

  const ctx = document.getElementById("chart");

  if(chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: Object.keys(scores),
      datasets: [{
        data: Object.values(scores),
        backgroundColor: 'rgba(79,70,229,0.25)',
        borderColor: '#4f46e5'
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { r: { beginAtZero: true } }
    }
  });
}

// =====================
// COPIAR
// =====================

function copyPrompt(){
  navigator.clipboard.writeText(generatedPrompt);
  alert("Prompt copiado");
}

// =====================
// PDF
// =====================

async function downloadPDF(){

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Resultado de Liderazgo", 20, 20);

  doc.setFontSize(12);
  doc.text(resultEl.innerText, 20, 35, { maxWidth: 170 });

  doc.save("resultado_liderazgo.pdf");
}

// =====================

showQuestion();
