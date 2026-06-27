const tg = window.Telegram.WebApp;
tg.expand();

// ========== ТУТОРИАЛ ==========
const pages = [
    { title: "🔥 ДОБРО ПОЖАЛОВАТЬ!", content: `Ты находишься в официальном боте банды <strong>СИБИРЬ</strong> на серверах RADMIR RP.<br><br>Здесь всё — от вступления до повышения.<br><br>📋 Заявки на вступление<br>⭐ Система рангов<br>📈 Повышения<br>⚖️ Апелляции<br>🏅 Медали и достижения` },
    { title: "СИСТЕМА РАНГОВ", content: `<strong>МЛАДШИЙ СОСТАВ</strong><br>(1) Шнырь<br>(2) Шпана<br>(3) Освоившийся<br><br><strong>СРЕДНИЙ СОСТАВ</strong><br>(4) Опытный<br>(5) Свояк<br>(6) Положенец<br><br><strong>СТАРШИЙ СОСТАВ</strong><br>(7) Инструктор<br>(8) Инспектор<br><br><strong>КОМАНДОВАНИЕ</strong><br>(9) Командир<br>(10) Лидер` },
    { title: "КАК ВСТУПИТЬ", content: `<strong>ОНЛАЙН — ты сейчас в игре</strong><br>1. Вводишь игровой ник<br>2. Получаешь уникальный код<br>3. Говоришь код представителю СИБИРИ<br>4. После одобрения — ссылка на 2 минуты<br><br><strong>ОФФЛАЙН — тебя нет в игре</strong><br>1. Вводишь ник, телефон, соцсети<br>2. Получаешь код #XXXX (24 часа)<br>3. Представитель сам свяжется с тобой` },
    { title: "ВАЖНЫЕ ПРАВИЛА", content: `<strong>КОМАНДЫ В ИГРЕ</strong><br>/setspawn — «Дом Банды»<br>/f — чат банды<br>/b — сигнал помощи<br>/makekey — крафт стимула<br><br><strong>ФОРМАТ НИКА</strong><br>Nick_Name<br>Первые буквы заглавные<br>Разделены подчёркиванием<br><br>Ты готов!` }
];

let currentPage = 0;

function renderTutorial() {
    const c = document.getElementById('tutorialContent');
    const p = pages[currentPage];
    c.innerHTML = `<h1>${p.title}</h1><div class="subtitle">${p.content}</div>`;
    document.getElementById('tPage').textContent = `${currentPage + 1} / ${pages.length}`;
    document.getElementById('tPrev').style.display = currentPage === 0 ? 'none' : 'inline-block';
    document.getElementById('tNext').textContent = currentPage === pages.length - 1 ? '✅ Начать' : 'Дальше →';
}

document.getElementById('tNext').onclick = () => {
    if (currentPage === pages.length - 1) {
        localStorage.setItem('sibir_tutorial', 'true');
        document.getElementById('tutorial').style.display = 'none';
        document.getElementById('mainMenu').style.display = 'block';
        loadUserData();
    } else { currentPage++; renderTutorial(); }
};
document.getElementById('tPrev').onclick = () => { if (currentPage > 0) { currentPage--; renderTutorial(); } };
document.getElementById('skipTut').onclick = () => {
    localStorage.setItem('sibir_tutorial', 'true');
    document.getElementById('tutorial').style.display = 'none';
    document.getElementById('mainMenu').style.display = 'block';
    loadUserData();
};

// ========== ДАННЫЕ ==========
let userData = {
    nickname: null,
    rank: '(0) Гость',
    status: 'не создана',
    server: null
};

function loadUserData() {
    const saved = localStorage.getItem('sibir_user');
    if (saved) {
        try {
            userData = JSON.parse(saved);
        } catch (e) {
            userData = { nickname: null, rank: '(0) Гость', status: 'не создана', server: null };
        }
    }
    updateUI();
}

function saveUserData() {
    localStorage.setItem('sibir_user', JSON.stringify(userData));
}

function updateUI() {
    document.getElementById('pName').innerHTML = `Ник: <span class="gold">${userData.nickname || 'Гость'}</span>`;
    document.getElementById('pRank').textContent = `Ранг: ${userData.rank || '(0) Гость'}`;
    document.getElementById('pStatus').textContent = `Статус: ${userData.status || 'не создана'}`;
}

// ========== НАВИГАЦИЯ ==========
function showPage(page) {
    const pages = ['mainMenu', 'onlinePage', 'offlinePage', 'helpPage'];
    pages.forEach(p => document.getElementById(p).style.display = 'none');
    if (page === 'menu') {
        document.getElementById('mainMenu').style.display = 'block';
    } else {
        document.getElementById(page + 'Page').style.display = 'block';
    }
}

// ========== ЗАЯВКИ ==========
function submitOnline() {
    const nick = document.getElementById('onlineNick').value.trim();
    if (!nick) { alert('Введи ник!'); return; }
    
    const server = document.getElementById('onlineServer').value;
    
    userData.nickname = nick;
    userData.status = 'на рассмотрении';
    userData.server = server;
    saveUserData();
    updateUI();
    
    const data = {
        action: 'application',
        nickname: nick,
        server: server,
        type: 'онлайн'
    };
    
    try {
        tg.sendData(JSON.stringify(data));
        console.log('📤 Отправлено:', data);
    } catch (e) {
        console.error('❌ Ошибка:', e);
        alert('Ошибка отправки!');
        return;
    }
    
    alert('✅ Заявка подана! Ожидай решения.');
    document.getElementById('onlineNick').value = '';
    showPage('menu');
}

function submitOffline() {
    const nick = document.getElementById('offlineNick').value.trim();
    const phone = document.getElementById('offlinePhone').value.trim();
    if (!nick || !phone) { alert('Заполни все поля!'); return; }
    
    const server = document.getElementById('offlineServer').value;
    
    userData.nickname = nick;
    userData.status = 'на рассмотрении';
    userData.server = server;
    saveUserData();
    updateUI();
    
    const data = {
        action: 'application',
        nickname: nick,
        server: server,
        type: 'оффлайн'
    };
    
    try {
        tg.sendData(JSON.stringify(data));
        console.log('📤 Отправлено:', data);
    } catch (e) {
        console.error('❌ Ошибка:', e);
        alert('Ошибка отправки!');
        return;
    }
    
    alert('✅ Заявка подана! Ожидай решения.');
    document.getElementById('offlineNick').value = '';
    document.getElementById('offlinePhone').value = '';
    showPage('menu');
}

function getStatus() {
    tg.sendData(JSON.stringify({ action: 'get_status' }));
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
if (localStorage.getItem('sibir_tutorial')) {
    document.getElementById('tutorial').style.display = 'none';
    document.getElementById('mainMenu').style.display = 'block';
    loadUserData();
} else {
    renderTutorial();
}

tg.ready();
console.log('✅ Мини-приложение загружено');
