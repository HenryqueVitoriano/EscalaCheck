// ==========================================
// 1. CONFIGURAÇÃO E INJEÇÃO DAS ESCALAS
// ==========================================

// cicloDias é usado só no front para saber quantos "cartões" desenhar
// na caixa "Ciclo da escala" e no texto "Ciclo de X dias contínuo".
// O cálculo de TRABALHO/FOLGA em si continua 100% no backend.
const escalas = [
    { id: 'ESCALA_2X2', nome: '2×2', desc: '2 trabalha — 2 folga', cicloDias: 4 },
    { id: 'ESCALA_2X2X3', nome: '2×2×3', desc: 'Ciclo de 2 e 3 dias', cicloDias: 9 }
];

let escalaSelecionada = '';
let escalaAtual = null;

const containerPatterns = document.getElementById('patterns');

escalas.forEach(escala => {
    const botao = document.createElement('div');
    botao.className = 'pattern-card';
    botao.innerHTML = `
        <div class="pattern-name">${escala.nome}</div>
        <div class="pattern-desc">${escala.desc}</div>
    `;

    botao.addEventListener('click', () => {
        document.querySelectorAll('.pattern-card').forEach(b => b.classList.remove('active'));
        botao.classList.add('active');

        escalaSelecionada = escala.id;
        escalaAtual = escala;

        atualizarCycleNote();

        // No fluxo automático, se as datas já estiverem preenchidas e ele mudar de escala, já calcula tudo de novo!
        buscarEscalaNoJava();
        atualizarProximosDias();
        atualizarCicloDaEscala();
    });

    containerPatterns.appendChild(botao);
});

// ==========================================
// 2. ESCUTADORES DE EVENTO AUTOMÁTICOS
// ==========================================

const inputRef = document.getElementById('dataReferencia');
const inputConsulta = document.getElementById('dataConsulta');

// Monitora a mudança dos calendários
inputRef.addEventListener('change', () => {
    buscarEscalaNoJava();
    atualizarProximosDias();
    atualizarCicloDaEscala();
});

inputConsulta.addEventListener('change', () => {
    buscarEscalaNoJava();
    atualizarProximosDias(); // só para realçar o dia selecionado na grade
});

// Coloca a data de hoje no cabeçalho (caixa "hoje" do seu Figma)
function configurarDataDeHoje() {
    const hoje = new Date();
    const opcoes = { day: '2-digit', month: '2-digit', year: 'numeric' };
    document.getElementById('todayLabel').textContent = hoje.toLocaleDateString('pt-BR', opcoes);
}
configurarDataDeHoje();

function atualizarCycleNote() {
    const nota = document.getElementById('cycleNote');
    if (!nota || !escalaAtual) return;
    nota.textContent = `Ciclo de ${escalaAtual.cicloDias} dias contínuo`;
}

// ==========================================
// 3. COMUNICAÇÃO COM O BACKEND (FETCH API)
// ==========================================

// Função genérica de consulta — usada tanto pelo card principal
// quanto pela grade de 14 dias e pelos chips do ciclo.
function consultarStatus(dataRef, dataAlvo, tipoEscala) {
    const url = `/escalas/verificar?tipoEscala=${tipoEscala}&dataReferencia=${dataRef}&dataAlvo=${dataAlvo}`;

    return fetch(url).then(response => {
        if (!response.ok) {
            throw new Error("Erro na resposta do servidor");
        }
        return response.text(); // "TRABALHO" ou "FOLGA"
    });
}

function buscarEscalaNoJava() {
    const dataRef = inputRef.value;
    const dataAlvo = inputConsulta.value;

    // Defesa: se faltar qualquer dado, sai da função sem quebrar o console
    if (!escalaSelecionada || !dataRef || !dataAlvo) {
        return;
    }

    consultarStatus(dataRef, dataAlvo, escalaSelecionada)
        .then(status => atualizarTelaComResultado(status, dataAlvo))
        .catch(error => console.error("Erro ao conectar com a API:", error));
}

// ==========================================
// 4. ATUALIZAÇÃO DA INTERFACE GRÁFICA (DOM)
// ==========================================

function atualizarTelaComResultado(status, dataAlvo) {
    const resultBox = document.getElementById('resultBox');
    const resultStatus = document.getElementById('resultStatus');
    const resultDate = document.getElementById('resultDate');
    const resultIcon = document.getElementById('resultIcon');
    const resultSub = document.getElementById('resultSub');

    // Formata a exibição da data alvo no padrão BR
    const [ano, mes, dia] = dataAlvo.split('-');
    resultDate.textContent = `${dia}/${mes}/${ano}`;

    if (status === 'TRABALHO') {
        resultStatus.textContent = 'DIA DE TRABALHO';
        resultSub.textContent = 'Prepare o café e o uniforme!';
        resultIcon.textContent = '💼';
        resultBox.className = 'result work'; // Classe correspondente ao vermelho do seu Figma
    } else if (status === 'FOLGA') {
        resultStatus.textContent = 'DIA DE FOLGA';
        resultSub.textContent = 'Aproveite para descansar!';
        resultIcon.textContent = '🎉';
        resultBox.className = 'result off';  // Classe correspondente ao verde do seu Figma
    }
}

// ==========================================
// 5. PRÓXIMOS 14 DIAS
// ==========================================

function atualizarProximosDias() {
    const dataRef = inputRef.value;
    const dataAlvo = inputConsulta.value;
    const grid = document.getElementById('daysGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (!escalaSelecionada || !dataRef) {
        return; // sem escala/referência ainda não dá pra consultar o backend
    }

    for (let i = 0; i < 14; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        const dataISO = d.toISOString().slice(0, 10);

        const cell = document.createElement('div');
        cell.className = 'day-cell';
        cell.innerHTML = `
            <div class="dow">${d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</div>
            <div class="num">${d.getDate()}</div>
            <div class="dot"></div>
        `;

        if (dataAlvo === dataISO) {
            cell.classList.add('selected');
        }

        cell.addEventListener('click', () => {
            inputConsulta.value = dataISO;
            buscarEscalaNoJava();
            atualizarProximosDias();
        });

        grid.appendChild(cell);

        // Consulta o backend para pintar o dia como trabalho/folga
        consultarStatus(dataRef, dataISO, escalaSelecionada)
            .then(status => {
                cell.classList.add(status === 'TRABALHO' ? 'work' : 'off');
            })
            .catch(error => console.error("Erro ao consultar dia da grade:", error));
    }
}

// ==========================================
// 6. CICLO DA ESCALA
// ==========================================

function atualizarCicloDaEscala() {
    const dataRef = inputRef.value;
    const chipsBox = document.getElementById('cycleChips');
    const label = document.getElementById('cycleBoxLabel');
    if (!chipsBox) return;

    chipsBox.innerHTML = '';

    if (!escalaSelecionada || !dataRef || !escalaAtual) {
        if (label) label.textContent = 'CICLO DA ESCALA';
        return;
    }

    if (label) label.textContent = `CICLO DA ESCALA ${escalaAtual.nome.toUpperCase()}`;

    for (let i = 0; i < escalaAtual.cicloDias; i++) {
        // Usa a própria data de referência como base para andar dia a dia pelo ciclo
        const d = new Date(dataRef + 'T00:00:00');
        d.setDate(d.getDate() + i);
        const dataISO = d.toISOString().slice(0, 10);

        const chip = document.createElement('div');
        chip.className = 'cycle-chip';
        chip.textContent = `D${i + 1}`;
        chipsBox.appendChild(chip);

        consultarStatus(dataRef, dataISO, escalaSelecionada)
            .then(status => {
                const trabalho = status === 'TRABALHO';
                chip.classList.add(trabalho ? 'work' : 'off');
                chip.textContent = `D${i + 1} ${trabalho ? 'Trabalho' : 'Folga'}`;
            })
            .catch(error => console.error("Erro ao consultar dia do ciclo:", error));
    }
}