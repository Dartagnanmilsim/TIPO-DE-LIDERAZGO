const questions = [
  { text: "Me preocupo por el bienestar emocional de mi equipo.", style: "Afable" },
  { text: "Prefiero mantener un ambiente armonioso antes que confrontar.", style: "Afable" },
  { text: "Escucho antes de tomar decisiones.", style: "Afable" },
  { text: "Soy paciente cuando alguien comete errores.", style: "Afable" },

  { text: "Tomo decisiones basadas en datos.", style: "Analitico" },
  { text: "Me gusta planificar antes de actuar.", style: "Analitico" },
  { text: "Analizo riesgos antes de decidir.", style: "Analitico" },
  { text: "Soy exigente con la calidad.", style: "Analitico" },

  { text: "Me enfoco en resultados rápidos.", style: "Emprendedor" },
  { text: "Tomo decisiones bajo presión.", style: "Emprendedor" },
  { text: "Disfruto retos y competencia.", style: "Emprendedor" },
  { text: "Voy directo al punto.", style: "Emprendedor" },

  { text: "Me gusta motivar a otros.", style: "Expresivo" },
  { text: "Transmito entusiasmo.", style: "Expresivo" },
  { text: "Propongo nuevas ideas.", style: "Expresivo" },
  { text: "Inspiro a pensar en grande.", style: "Expresivo" }
];

const scale = ["Nunca","Rara vez","A veces","Frecuentemente","Siempre"];

let current = 0;
let answers = [];

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const progressEl = document.getElementById("progress");
const resultEl = document.getElementById("result");

function showQuestion() {

  const q = questions[current];
  questionEl.innerText = q.text;

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

function getAnalysis(style){

  const analysis = {

    Afable: "Tu liderazgo se orienta a las personas, confianza y estabilidad emocional del equipo.",

    Analitico: "Tu liderazgo se basa en lógica, planificación y decisiones racionales.",

    Emprendedor: "Tu liderazgo está enfocado en acción, resultados y logro de objetivos.",

    Expresivo: "Tu liderazgo se caracteriza por inspiración, comunicación y visión."
  };

  return analysis[style];
}

function buildPrompt(style){

return `Actúa como coach ejecutivo experto.

Mi estilo de liderazgo predominante es ${style}.

Quiero un análisis profundo que incluya:

- Fortalezas naturales
- Riesgos y puntos ciegos
- Cómo lidero equipos
- Cómo me perciben
- Recomendaciones para evolucionar
- Qué tipo de roles de liderazgo son ideales

Entrega un análisis profesional.`;

}

function showResult(scores, dominant){

  questionEl.style.display = "none";
  optionsEl.style.display = "none";

  resultEl.classList.remove("hidden");

  resultEl.innerHTML = `
  
  <h2>Resultado: ${dominant}</h2>

  <div class="result-box">
    <p>${getAnalysis(dominant)}</p>

    <canvas id="chart"></canvas>

    <h3>Prompt personalizado</h3>
    <div class="copy-box" id="promptBox">${buildPrompt(dominant)}</div>

    <button class="copy" onclick="copyPrompt()">Copiar Prompt</button>

  </div>
  
  `;

  createChart(scores);
}

function createChart(scores){

  new Chart(document.getElementById("chart"), {
    type: 'radar',
    data: {
      labels: Object.keys(scores),
      datasets: [{
        label: 'Resultado',
        data: Object.values(scores)
      }]
    }
  });
}

function copyPrompt(){
  const text = document.getElementById("promptBox").innerText;
  navigator.clipboard.writeText(text);
  alert("Prompt copiado");
}

showQuestion();
