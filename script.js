const questions = [

  // Afable
  { text: "Me preocupo por el bienestar emocional de mi equipo.", style: "Afable" },
  { text: "Prefiero mantener un ambiente armonioso antes que confrontar.", style: "Afable" },
  { text: "Escucho a los demás antes de tomar decisiones importantes.", style: "Afable" },
  { text: "Las personas me consideran cercano y accesible.", style: "Afable" },
  { text: "Soy paciente cuando alguien comete errores.", style: "Afable" },
  { text: "Busco consenso antes de avanzar en proyectos importantes.", style: "Afable" },
  { text: "Me enfoco en construir relaciones de confianza.", style: "Afable" },
  { text: "Prefiero colaborar antes que competir.", style: "Afable" },

  // Expresivo
  { text: "Me gusta motivar a otros con ideas y visión de futuro.", style: "Expresivo" },
  { text: "Disfruto liderar reuniones o hablar frente a grupos.", style: "Expresivo" },
  { text: "Transmito entusiasmo cuando explico proyectos.", style: "Expresivo" },
  { text: "Propongo nuevas ideas con frecuencia.", style: "Expresivo" },
  { text: "Me siento cómodo siendo el centro de atención cuando es necesario.", style: "Expresivo" },
  { text: "Inspiro a otros a pensar en grande.", style: "Expresivo" },
  { text: "Prefiero entornos dinámicos y creativos.", style: "Expresivo" },
  { text: "Mi energía suele contagiar a los demás.", style: "Expresivo" },

  // Analítico
  { text: "Tomo decisiones basadas en datos y evidencia.", style: "Analítico" },
  { text: "Me gusta planificar antes de actuar.", style: "Analítico" },
  { text: "Presto atención a los detalles para evitar errores.", style: "Analítico" },
  { text: "Prefiero procesos claros y organizados.", style: "Analítico" },
  { text: "Me siento cómodo analizando información compleja.", style: "Analítico" },
  { text: "Evalúo riesgos antes de decidir.", style: "Analítico" },
  { text: "Soy exigente con la calidad del trabajo.", style: "Analítico" },
  { text: "Analizo varias opciones antes de elegir una.", style: "Analítico" },

  // Ejecutor
  { text: "Me enfoco en lograr objetivos rápidamente.", style: "Ejecutor" },
  { text: "Tomo decisiones con seguridad incluso bajo presión.", style: "Ejecutor" },
  { text: "Prefiero actuar que analizar demasiado.", style: "Ejecutor" },
  { text: "Me siento cómodo liderando situaciones difíciles.", style: "Ejecutor" },
  { text: "Exijo alto desempeño de mi equipo.", style: "Ejecutor" },
  { text: "Me frustra la lentitud o la indecisión.", style: "Ejecutor" },
  { text: "Disfruto los retos y la competencia.", style: "Ejecutor" },
  { text: "Voy directo al punto cuando comunico algo importante.", style: "Ejecutor" }

];

const scale = ["Nunca", "Rara vez", "A veces", "Frecuentemente", "Siempre"];

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

function updateProgress() {
  const percent = (current / questions.length) * 100;
  progressEl.style.width = percent + "%";
}

function calculateResult() {

  const scores = {
    Afable: 0,
    Expresivo: 0,
    Analítico: 0,
    Ejecutor: 0
  };

  answers.forEach((value, index) => {
    scores[questions[index].style] += value;
  });

  const dominant = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])[0][0];

  showResult(dominant, scores);
}

function showResult(style, scores) {

  questionEl.style.display = "none";
  optionsEl.style.display = "none";

  resultEl.classList.remove("hidden");

  resultEl.innerHTML = `
    <h2>Tu estilo predominante es:</h2>
    <h3>${style}</h3>

    <p><strong>Puntajes:</strong></p>
    <ul>
      <li>Afable: ${scores.Afable}</li>
      <li>Expresivo: ${scores.Expresivo}</li>
      <li>Analítico: ${scores.Analítico}</li>
      <li>Ejecutor: ${scores.Ejecutor}</li>
    </ul>

    <button class="restart" onclick="location.reload()">
      Repetir Test
    </button>
  `;
}

showQuestion();
