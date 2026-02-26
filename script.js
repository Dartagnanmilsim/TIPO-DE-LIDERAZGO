const questions = [
"Me preocupo por el bienestar del equipo",
"Escucho antes de decidir",
"Mantengo armonía",
"Resuelvo conflictos dialogando",
"Genero confianza",
"Apoyo personas",
"Considero impacto emocional",
"Valoro colaboración",

"Decido con datos",
"Planifico antes de actuar",
"Analizo riesgos",
"Cuido calidad",
"Prefiero procesos claros",
"Corrijo errores",
"Trabajo con información compleja",
"Busco eficiencia",

"Decido rápido",
"Me enfoco en metas",
"Asumo riesgos",
"Prefiero liderar",
"Exijo rendimiento",
"Me impaciento",
"Priorizo resultados",
"Actúo con determinación",

"Motivo con entusiasmo",
"Comunico ideas",
"Inspiro cambios",
"Disfruto presentar",
"Genero ideas",
"Influyo en otros",
"Inicio proyectos",
"Prefiero innovación"
];

const assessmentDiv = document.getElementById("assessment");

questions.forEach((q, i) => {

    let div = document.createElement("div");

    div.innerHTML = `
        <p>${i+1}. ${q}</p>
        <select id="q${i}">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3" selected>3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select>
    `;

    assessmentDiv.appendChild(div);
});


function calculate() {

    let answers = [];

    for(let i=0;i<32;i++){
        answers.push(parseInt(document.getElementById(`q${i}`).value));
    }

    let amable = sum(answers.slice(0,8));
    let analitico = sum(answers.slice(8,16));
    let emprendedor = sum(answers.slice(16,24));
    let expresivo = sum(answers.slice(24,32));

    document.getElementById("results").classList.remove("hidden");

    document.getElementById("amableCard").innerHTML = "Amable: " + amable;
    document.getElementById("analiticoCard").innerHTML = "Analítico: " + analitico;
    document.getElementById("emprendedorCard").innerHTML = "Emprendedor: " + emprendedor;
    document.getElementById("expresivoCard").innerHTML = "Expresivo: " + expresivo;

    createRadar(amable, analitico, emprendedor, expresivo);
    createQuadrant(amable, analitico, emprendedor, expresivo);
}


function sum(arr){
    return arr.reduce((a,b)=>a+b,0);
}


function createRadar(a,b,c,d){

    new Chart(document.getElementById("radarChart"), {
        type: 'radar',
        data: {
            labels: ['Amable','Analítico','Emprendedor','Expresivo'],
            datasets: [{
                label: 'Perfil',
                data: [a,b,c,d]
            }]
        }
    });
}


function createQuadrant(a,b,c,d){

    let x = d - b;
    let y = a - c;

    new Chart(document.getElementById("quadrantChart"), {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Perfil Liderazgo',
                data: [{x:x, y:y}]
            }]
        },
        options: {
            scales: {
                x: {
                    title: { display: true, text: 'Procesos ← → Innovación'}
                },
                y: {
                    title: { display: true, text: 'Personas ↑ ↓ Resultados'}
                }
            }
        }
    });
}
