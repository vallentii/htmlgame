// ============================================
//                УРОВНИ
// ============================================
const levels = [
    {
        task: "Сделай заголовок «Привет, мир!»",
        hint: "Тег <h1> открывает заголовок, </h1> — закрывает. Текст идёт между ними.",
        answer: ["<h1>", "Привет, мир!", "</h1>"]
    },
    {
        task: "Заголовок «Мой сайт» и абзац «Я учу HTML»",
        hint: "<p> — это абзац. Он тоже парный, как и <h1>.",
        answer: ["<h1>", "Мой сайт", "</h1>", "<p>", "Я учу HTML", "</p>"]
    },
    {
        task: "Заголовок «Мой блог» и абзац, где слово «важно» — жирное",
        hint: "<b> делает текст жирным. Он вставляется внутрь абзаца.",
        answer: ["<h1>", "Мой блог", "</h1>", "<p>", "Это", "<b>", "важно", "</b>", "</p>"]
    },
    {
        task: "Маркированный список покупок: «Молоко» и «Хлеб»",
        hint: "<ul> — список с точками. Каждый пункт — <li>.",
        answer: ["<ul>", "<li>", "Молоко", "</li>", "<li>", "Хлеб", "</li>", "</ul>"]
    },
    {
        task: "Подзаголовок «Покупки» и под ним маркированный список: «Молоко», «Хлеб»",
        hint: "<h2> — подзаголовок поменьше. Сначала заголовок, потом список.",
        answer: ["<h2>", "Покупки", "</h2>", "<ul>", "<li>", "Молоко", "</li>", "<li>", "Хлеб", "</li>", "</ul>"]
    },
    {
        task: "Заголовок «Заметка» и абзац, где слово «важно» — курсивом",
        hint: "<i> делает текст курсивным. Он вставляется внутрь абзаца, как <b>.",
        answer: ["<h2>", "Заметка", "</h2>", "<p>", "Это", "<i>", "важно", "</i>", "</p>"]
    },
    {
        task: "Нумерованный список: «Раз», «Два», «Три»",
        hint: "<ol> — список с цифрами (1, 2, 3...). Пункты — тоже <li>.",
        answer: ["<ol>", "<li>", "Раз", "</li>", "<li>", "Два", "</li>", "<li>", "Три", "</li>", "</ol>"]
    },
    {
        task: "Абзац «Перейти на мой сайт», где «мой сайт» — ссылка на https://mysite.ru",
        hint: "Тег <a> создаёт ссылку. Адрес пишется в атрибуте href.",
        answer: ["<p>", "Перейти на", '<a href="https://mysite.ru">', "мой сайт", "</a>", "</p>"]
    },
    {
        task: "Абзац «Вот кот:» и под ним картинка cat.jpg с подписью «кот»",
        hint: "<img> — одиночный тег, ему не нужна закрывающая часть. src — путь, alt — описание.",
        answer: ["<p>", "Вот кот:", "</p>", '<img src="cat.jpg" alt="кот">']
    },
    {
        task: "Заголовок «Мой блог» и под ним ссылка «Читать» на https://blog.ru",
        hint: "Сначала заголовок, потом абзац, внутри — ссылка.",
        answer: ["<h1>", "Мой блог", "</h1>", "<p>", '<a href="https://blog.ru">', "Читать", "</a>", "</p>"]
    },
    {
        task: "Заголовок «Меню», абзац «Вкусно!» и нумерованный список: «Суп», «Каша»",
        hint: "Собирай по порядку: заголовок → абзац → список.",
        answer: ["<h1>", "Меню", "</h1>", "<p>", "Вкусно!", "</p>", "<ol>", "<li>", "Суп", "</li>", "<li>", "Каша", "</li>", "</ol>"]
    },
    {
        task: "Целая страница: заголовок «Мой сайт», абзац «Привет, я учу HTML» (где HTML жирным) и маркированный список «Дом», «Кот»",
        hint: "Заголовок → абзац с <b> внутри → маркированный список из двух пунктов.",
        answer: [
            "<h1>", "Мой сайт", "</h1>",
            "<p>", "Привет, я учу", "<b>", "HTML", "</b>", "</p>",
            "<ul>", "<li>", "Дом", "</li>", "<li>", "Кот", "</li>", "</ul>"
        ]
    }
];

// ============================================
//                СОСТОЯНИЕ
// ============================================
let current = 0;
let score = 0;
let workspace = [];
let pool = [];

// ============================================
//                УТИЛИТЫ
// ============================================
const $ = id => document.getElementById(id);

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ============================================
//              ЛОГИКА ИГРЫ
// ============================================
function loadLevel() {
    const lvl = levels[current];
    workspace = new Array(lvl.answer.length).fill(null);
    pool = lvl.answer.map((text, id) => ({ text, id }));
    shuffle(pool);

    $("level").textContent = current + 1;
    $("total").textContent = levels.length;
    $("task-text").textContent = lvl.task;
    $("hint").textContent = "💡 " + lvl.hint;
    $("message").className = "message";
    $("preview-box").style.display = "none";
    $("next-btn").style.display = "none";
    $("check-btn").style.display = "inline-block";
    $("progress").style.width = (current / levels.length * 100) + "%";
    render();
}

function render() {
    const ws = $("workspace");
    ws.innerHTML = "";
    workspace.forEach((piece, i) => {
        const slot = document.createElement("div");
        slot.className = "slot" + (piece ? " filled" : "");
        slot.textContent = piece ? piece.text : "?";
        if (piece) {
            slot.onclick = () => {
                pool.push(piece);
                workspace[i] = null;
                render();
            };
        }
        ws.appendChild(slot);
    });

    const poolEl = $("pool");
    poolEl.innerHTML = "";
    if (pool.length === 0) {
        poolEl.innerHTML = '<div class="empty-pool">Все элементы расставлены ✨</div>';
    }
    pool.forEach((piece, i) => {
        const el = document.createElement("div");
        el.className = "piece";
        el.textContent = piece.text;
        el.onclick = () => {
            const idx = workspace.indexOf(null);
            if (idx !== -1) {
                workspace[idx] = piece;
                pool.splice(i, 1);
                render();
            }
        };
        poolEl.appendChild(el);
    });
}

function showMessage(text, type) {
    const m = $("message");
    m.textContent = text;
    m.className = "message show " + type;
}

function check() {
    if (workspace.some(p => !p)) {
        showMessage("⚠️ Заполни все слоты!", "warn");
        return;
    }
    const answer = levels[current].answer;
    const ok = workspace.every((p, i) => p.text === answer[i]);

    if (ok) {
        score += 10;
        $("score").textContent = score;
        showMessage("🎉 Верно! Отличная работа!", "success");
        document.querySelectorAll(".slot").forEach(s => s.classList.add("correct"));

        const html = answer.join(" ");
        $("preview").innerHTML = html;
        $("preview-box").style.display = "block";

        $("check-btn").style.display = "none";
        $("next-btn").style.display = "inline-block";
        $("progress").style.width = ((current + 1) / levels.length * 100) + "%";
    } else {
        showMessage("❌ Не совсем. Попробуй ещё раз!", "error");
        document.querySelectorAll(".slot").forEach(s => {
            s.classList.add("shake");
            setTimeout(() => s.classList.remove("shake"), 500);
        });
    }
}

function reset() {
    const lvl = levels[current];
    workspace = new Array(lvl.answer.length).fill(null);
    pool = lvl.answer.map((text, id) => ({ text, id }));
    shuffle(pool);
    $("message").className = "message";
    $("preview-box").style.display = "none";
    render();
}

function next() {
    current++;
    if (current >= levels.length) {
        $("game-area").style.display = "none";
        $("win-screen").style.display = "block";
        $("final-score").textContent = score;
        $("progress").style.width = "100%";
    } else {
        loadLevel();
    }
}

function restart() {
    current = 0;
    score = 0;
    $("score").textContent = 0;
    $("game-area").style.display = "block";
    $("win-screen").style.display = "none";
    loadLevel();
}

// ============================================
//               ОБРАБОТЧИКИ
// ============================================
$("check-btn").onclick = check;
$("reset-btn").onclick = reset;
$("next-btn").onclick = next;
$("restart-btn").onclick = restart;

// ============================================
//                 СТАРТ
// ============================================
loadLevel();