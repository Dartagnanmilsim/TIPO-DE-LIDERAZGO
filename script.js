const questions = [
  { text: "Me preocupo por el bienestar emocional de mi equipo.", style: "Afable" },
  { text: "Prefiero mantener armonía antes que confrontar.", style: "Afable" },
  { text: "Escucho antes de decidir.", style: "Afable" },
  { text: "Soy paciente con errores.", style: "Afable" },

  { text: "Tomo decisiones basadas en datos.", style: "Analitico" },
  { text: "Planifico antes de actuar.", style: "Analitico" },
  { text: "Analizo riesgos.", style: "Analitico" },
  { text: "Busco precisión.", style: "Analitico" },

  { text: "Me enfoco en resultados.", style: "Emprendedor" },
  { text: "Decido bajo presión.", style: "Emprendedor" },
  { text: "Disfruto retos.", style: "Emprendedor" },
  { text: "Voy directo al punto.", style: "Emprendedor" },

  { text: "Motivo a otros.", style: "Expresivo" },
  { text: "Transmito entusiasmo.", style: "Expresivo" },
  { text: "Genero ideas.", style: "Expresivo" },
  { text: "Inspiro visión.", style: "Expresivo" }
];

const scale = ["Nunca","Rara vez","A veces","Frecuentemente","Siempre"];

let current = 0;
let answers = [];
let chartInstance;
let generatedPrompt = "";

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

  const dominant = Object.entries(scores)
    .sort((a,b)=>b[1]-a[1])[0][0];

  showResult(scores, dominant);
}

function analysisText(style){

  const data = {

Afable: "Liderazgo orientado a personas, confianza y cohesión emocional del equipo.",

Analitico: "Liderazgo basado en lógica, estructura, planificación y análisis.",

Emprendedor: "Liderazgo enfocado en resultados, acción rápida y logro de objetivos.",

Expresivo: "Liderazgo inspirador, comunicativo y orientado a visión."
  };

  return data[style];
}

function buildPrompt(style){

return `Actúa como coach ejecutivo experto.

Mi estilo de liderazgo predominante es ${style}.

Quiero un análisis profundo que incluya fortalezas, riesgos, evolución y recomendaciones.`;

}

function showResult(scores, dominant){

  document.getElementById("questionContainer").style.display = "none";

  resultEl.classList.remove("hidden");

  resultEl.innerHTML = `
  
  <div class="result-box">

    <h2>Resultado: ${dominant}</h2>

    <p>${analysisText(dominant)}</p>

    <canvas id="chart"></canvas>

    <button class="action-btn" onclick="copyPrompt()">
      Copiar análisis para ChatGPT
    </button>

    <button class="action-btn" onclick="downloadPDF()">
      Descargar PDF
    </button>

  </div>
  
  `;

  generatedPrompt = buildPrompt(dominant);

  createChart(scores);
}

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
        backgroundColor: 'rgba(79,70,229,0.2)',
        borderColor: '#4f46e5',
        pointBackgroundColor: '#4f46e5'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        r: {
          beginAtZero: true
        }
      }
    }
  });
}

function copyPrompt(){
  navigator.clipboard.writeText(generatedPrompt);
  alert("Prompt copiado");
}

async function downloadPDF(){

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Resultado de Estilo de Liderazgo", 20, 20);

  doc.setFontSize(14);
  doc.text(resultEl.innerText, 20, 40);

  doc.save("resultado_liderazgo.pdf");
}

showQuestion();
