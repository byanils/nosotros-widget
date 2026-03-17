import { messages } from './messages.js';
import { vaults } from './vaults.js';

const myApiKey = "2e2dcf335d4c97a7c182b0c041eea672";
const startDate = new Date("2025-12-27T10:45:00");
const photos = ["foto1.jpg", "foto2.jpg", "foto3.jpg", "foto4.jpg", "foto5.jpg", "foto6.jpg", "foto7.jpg", "foto8.jpg", "foto9.jpg", "foto10.jpg"];
let currentIdx = 0;
let currentUser = null;

// OYUN DEĞİŞKENLERİ
let board = Array(9).fill("");
let turn = "Anıl"; // Oyuna Anıl başlar (varsayılan)
let scores = { "Anıl": 0, "Camila": 0 };

// GİRİŞ FONKSİYONU
function login(user) {
    currentUser = user;
    document.getElementById("login-screen").classList.remove("active");
    document.getElementById("main-page").classList.add("active");
    localStorage.setItem("nosotros_user", user);
    checkDailyReset();
    updateSelfieUI();
    loadGameState();
}

function goToUniverse() { 
    document.getElementById("main-page").classList.remove("active"); 
    document.getElementById("star-map-page").classList.add("active"); 
    initUniverse(); 
}

function goToHome() { 
    document.getElementById("star-map-page").classList.remove("active"); 
    document.getElementById("main-page").classList.add("active"); 
}

function openSelfie() {
    document.getElementById("main-page").classList.remove("active");
    document.getElementById("selfie-page").classList.add("active");
    updateSelfieUI();
}

function closeSelfie() {
    document.getElementById("selfie-page").classList.remove("active");
    document.getElementById("main-page").classList.add("active");
}

function openGame() {
    document.getElementById("main-page").classList.remove("active");
    document.getElementById("game-page").classList.add("active");
    loadGameState();
    updateGameUI();
}

function closeGame() {
    document.getElementById("game-page").classList.remove("active");
    document.getElementById("main-page").classList.add("active");
}

// Export functions to window for onclick handlers
window.login = login;
window.goToUniverse = goToUniverse;
window.goToHome = goToHome;
window.openSelfie = openSelfie;
window.closeSelfie = closeSelfie;
window.openGame = openGame;
window.closeGame = closeGame;
window.resetBoard = resetBoard;

// XOX OYUN MANTIĞI
function loadGameState() {
    const savedBoard = localStorage.getItem("nosotros_game_board");
    const savedTurn = localStorage.getItem("nosotros_game_turn");
    const savedScores = localStorage.getItem("nosotros_game_scores");

    if (savedBoard) board = JSON.parse(savedBoard);
    if (savedTurn) turn = savedTurn;
    if (savedScores) scores = JSON.parse(savedScores);
    
    updateGameUI();
}

function saveGameState() {
    localStorage.setItem("nosotros_game_board", JSON.stringify(board));
    localStorage.setItem("nosotros_game_turn", turn);
    localStorage.setItem("nosotros_game_scores", JSON.stringify(scores));
}

function updateGameUI() {
    const cells = document.querySelectorAll(".cell");
    const winningPattern = getWinningPattern();

    cells.forEach((cell, i) => {
        cell.innerText = board[i];
        cell.className = "cell" + (board[i] ? " taken" : "");
        if (winningPattern && winningPattern.includes(i)) {
            cell.classList.add("winner");
        }
    });

    const turnEl = document.getElementById("game-turn");
    const scoreEl = document.getElementById("game-score");
    
    if (turnEl) {
        if (checkWinner()) {
            const winner = board[getWinningPattern()[0]] === "X" ? "Anıl" : "Camila";
            turnEl.innerText = `¡${winner} ha ganado! 🎉`;
        } else if (board.every(cell => cell !== "")) {
            turnEl.innerText = "¡Empate! 🤝";
        } else if (turn === currentUser) {
            turnEl.innerText = "¡Es tu turno! ✨";
        } else {
            turnEl.innerText = `Turno de ${turn} ⏳`;
        }
    }

    if (scoreEl) scoreEl.innerText = `Anıl: ${scores["Anıl"]} - Camila: ${scores["Camila"]}`;
}

function makeMove(index) {
    if (board[index] !== "" || turn !== currentUser || checkWinner()) return;

    board[index] = (turn === "Anıl" ? "X" : "O");
    
    if (checkWinner()) {
        scores[turn]++;
        saveGameState();
        updateGameUI();
        // 2 saniye sonra otomatik tahtayı temizle (skor kalsın)
        setTimeout(() => resetBoard(false), 2000);
    } else if (board.every(cell => cell !== "")) {
        saveGameState();
        updateGameUI();
        setTimeout(() => resetBoard(false), 2000);
    } else {
        turn = (turn === "Anıl" ? "Camila" : "Anıl");
        saveGameState();
        updateGameUI();
    }
}

function getWinningPattern() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Satırlar
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Sütunlar
        [0, 4, 8], [2, 4, 6]             // Çaprazlar
    ];
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return pattern;
        }
    }
    return null;
}

function checkWinner() {
    return getWinningPattern() !== null;
}

function resetBoard(resetScores = true) {
    board = Array(9).fill("");
    if (resetScores) {
        scores = { "Anıl": 0, "Camila": 0 };
    }
    saveGameState();
    updateGameUI();
}

// Cell click events
document.addEventListener("DOMContentLoaded", () => {
    const boardEl = document.getElementById("game-board");
    if (boardEl) {
        boardEl.addEventListener("click", (e) => {
            if (e.target.classList.contains("cell")) {
                makeMove(parseInt(e.target.dataset.index));
            }
        });
    }
});

// Depolama değişikliğini dinle (Diğer sekme/kullanıcı oynarsa güncelle)
window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith('nosotros_game_')) {
        loadGameState();
    }
});

// SİHİRLİ YILDIZ TOZU (MOUSE & TOUCH)
document.addEventListener('mousemove', (e) => createSparkle(e.clientX, e.clientY));
document.addEventListener('touchmove', (e) => createSparkle(e.touches[0].clientX, e.touches[0].clientY));

function createSparkle(x, y) {
    const s = document.createElement("div");
    s.className = "sparkle";
    s.style.left = x + "px"; s.style.top = y + "px";
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 700);
}

// KALP YAĞMURU
function createFloatingHeart() {
    const heart = document.createElement("div");
    heart.innerHTML = "❤️"; heart.className = "floating-heart";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (Math.random() * 20 + 10) + "px";
    heart.style.animationDuration = (Math.random() * 2 + 3) + "s";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 4000);
}

// GERÇEK HAVA DURUMU VERİSİ
async function fetchWeather() {
    try {
        const rMilan = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Milan,it&units=metric&appid=${myApiKey}`);
        const dMilan = await rMilan.json();
        const rBogota = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Bogota,co&units=metric&appid=${myApiKey}`);
        const dBogota = await rBogota.json();
        
        if(dMilan.main) document.getElementById("milan-temp").innerText = `${Math.round(dMilan.main.temp)}°C ${getWEmoji(dMilan.weather[0].main)}`;
        if(dBogota.main) document.getElementById("bogota-temp").innerText = `${Math.round(dBogota.main.temp)}°C ${getWEmoji(dBogota.weather[0].main)}`;
    } catch(e) { console.log("Hava durumu verisi şu an alınamıyor."); }
}

function getWEmoji(s) {
    const m = {"Clear":"☀️","Clouds":"☁️","Rain":"🌧️","Snow":"❄️","Drizzle":"🌦️"};
    return m[s] || "✨";
}

// İKİNCİ SAYFA VE SANDIKLARIN OLUŞUMU
function initUniverse() {
    const starContainer = document.getElementById("stars-container");
    const vaultContainer = document.getElementById("vault-container");

    if (vaultContainer.children.length > 0) return;

    // Yıldızlar
    for (let i = 0; i < 80; i++) {
        const s = document.createElement("div"); s.className = "star";
        s.style.left = Math.random() * 100 + "vw"; s.style.top = Math.random() * 100 + "vh";
        s.style.width = "2px"; s.style.height = "2px"; s.style.position = "absolute"; s.style.background = "white"; s.style.borderRadius = "50%";
        s.style.setProperty('--d', (Math.random() * 3 + 2) + "s");
        starContainer.appendChild(s);
    }

    // Sandıklar
    vaults.forEach((v, index) => {
        const div = document.createElement("div"); 
        div.className = `chest ${v.b ? 'birthday' : ''}`;
        const ratio = index / (vaults.length - 1);
        div.style.top = (20 + (ratio * 58)) + "%";
        div.style.left = (82 - (ratio * 64) + (Math.sin(ratio * Math.PI) * 15)) + "%";

        div.onclick = (e) => { 
            e.stopPropagation(); 
            if (new Date() < new Date(v.d)) alert(v.b ? v.lock : "Se abrirá el: " + v.d); 
            else alert(v.t); 
        };
        vaultContainer.appendChild(div);
    });
}

// SAAT VE SAYAÇ GÜNCELLEME
function update() {
    const now = new Date();
    const milan = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Rome"}));
    const bogota = new Date(now.toLocaleString("en-US", {timeZone: "America/Bogota"}));
    
    document.getElementById("milan-time").innerText = milan.getHours() + ":" + String(milan.getMinutes()).padStart(2, '0');
    document.getElementById("bogota-time").innerText = bogota.getHours() + ":" + String(bogota.getMinutes()).padStart(2, '0');

    if(bogota.getHours() >= 18 || bogota.getHours() < 6) document.body.classList.add("night-mode");
    else document.body.classList.remove("night-mode");

    const diff = Math.floor((bogota - startDate) / 1000);
    const d = Math.floor(diff/86400), h = Math.floor((diff%86400)/3600), m = Math.floor((diff%3600)/60), s = diff%60;
    document.getElementById("counter").innerHTML = `<span>${d}d</span><span>${h}h</span><span>${m}m</span><span style="color:#ff4d4d">${s}s</span>`;
    
    const dayDiff = Math.floor((new Date(bogota.getFullYear(), bogota.getMonth(), bogota.getDate()) - new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())) / 86400000);
    document.getElementById("message").innerText = messages[dayDiff] || "Contigo, siempre. 🤍";

    // Reset bilgisi güncelleme
    const resetTime = new Date(bogota);
    resetTime.setHours(24, 0, 0, 0);
    const timeToReset = Math.floor((resetTime - bogota) / 1000);
    const rh = Math.floor(timeToReset / 3600), rm = Math.floor((timeToReset % 3600) / 60);
    const resetInfo = document.getElementById("reset-info");
    if (resetInfo) resetInfo.innerText = `Las fotos se reinician en: ${rh}h ${rm}m (Bogotá 00:00)`;

    checkDailyReset();
}

// SELFIE LOGIC
function checkDailyReset() {
    const bogotaDate = new Date().toLocaleDateString("en-US", {timeZone: "America/Bogota"});
    const lastReset = localStorage.getItem("nosotros_last_reset");
    
    if (lastReset !== bogotaDate) {
        localStorage.removeItem("nosotros_anil_photo");
        localStorage.removeItem("nosotros_camila_photo");
        localStorage.setItem("nosotros_last_reset", bogotaDate);
        updateSelfieUI();
    }
}

function updateSelfieUI() {
    const anilPhoto = localStorage.getItem("nosotros_anil_photo");
    const camilaPhoto = localStorage.getItem("nosotros_camila_photo");

    const anilImg = document.getElementById("anil-photo");
    const camilaImg = document.getElementById("camila-photo");
    const anilPlaceholder = document.getElementById("anil-placeholder");
    const camilaPlaceholder = document.getElementById("camila-placeholder");

    if (anilPhoto) {
        anilImg.src = anilPhoto;
        anilImg.classList.add("active");
        anilPlaceholder.style.display = "none";
    } else {
        anilImg.classList.remove("active");
        anilPlaceholder.style.display = "flex";
    }

    if (camilaPhoto) {
        camilaImg.src = camilaPhoto;
        camilaImg.classList.add("active");
        camilaPlaceholder.style.display = "none";
    } else {
        camilaImg.classList.remove("active");
        camilaPlaceholder.style.display = "flex";
    }

    // Blurring logic: If both uploaded, unblur both. Else, blur the other's photo.
    if (anilPhoto && camilaPhoto) {
        anilImg.classList.remove("blurred");
        camilaImg.classList.remove("blurred");
    } else {
        if (anilPhoto) anilImg.classList.remove("blurred"); else anilImg.classList.add("blurred");
        if (camilaPhoto) camilaImg.classList.remove("blurred"); else camilaImg.classList.add("blurred");
        
        // Specific requirement: if I uploaded, I see mine clear, but the other one remains blurred until they upload.
        // Wait, the user said: "eğer ben fotoğraf yüklemissem o gün içinde o fotoğrafı bulanık olarak görebilecek, sonra fotoğraf yükleyecek ve bulanıklık gidecek"
        // This means:
        // If I (Anıl) uploaded, and she (Camila) hasn't, I see hers blurred (if she had one? No, if she uploads, it's blurred until I upload too).
        // Let's re-read: "Camila girerken kendi ismini seçti, giriş yaptı ve butona bastı eğer ben fotoğraf yüklemissem o gün içinde o fotoğrafı bulanık olarak görebilecek, sonra fotoğraf yükleyecek ve bulanıklık gidecek ve fotoğrafı görebilecek."
        // Translation: Camila enters, if Anıl has uploaded, she sees Anıl's photo blurred. Then she uploads her own, and the blur goes away (she sees both clearly).
        
        if (currentUser === "Anıl") {
            if (anilPhoto) anilImg.classList.remove("blurred");
            if (camilaPhoto && !anilPhoto) camilaImg.classList.add("blurred");
            if (camilaPhoto && anilPhoto) camilaImg.classList.remove("blurred");
        } else if (currentUser === "Camila") {
            if (camilaPhoto) camilaImg.classList.remove("blurred");
            if (anilPhoto && !camilaPhoto) anilImg.classList.add("blurred");
            if (anilPhoto && camilaPhoto) anilImg.classList.remove("blurred");
        }
    }
}

// Fotoğraf yükleme işlemi
document.getElementById("selfie-input")?.addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const base64 = event.target.result;
        if (currentUser === "Anıl") {
            localStorage.setItem("nosotros_anil_photo", base64);
        } else {
            localStorage.setItem("nosotros_camila_photo", base64);
        }
        updateSelfieUI();
    };
    reader.readAsDataURL(file);
});

// Fotoğraf Değiştirici
setInterval(() => {
    const img = document.getElementById("album-photo");
    if(img && document.getElementById("main-page").classList.contains("active")) {
        img.style.opacity = 0;
        setTimeout(() => { currentIdx = (currentIdx + 1) % photos.length; img.src = photos[currentIdx]; img.style.opacity = 1; }, 500);
    }
}, 4000);

// Döngüsel Başlatıcılar
setInterval(createFloatingHeart, 600);
window.onload = () => { 
    update(); 
    setInterval(update, 1000); 
    fetchWeather(); 
    setInterval(fetchWeather, 3600000); 

    // Otomatik login kontrolü (isteğe bağlı ama kullanıcı her seferinde seçmek isteyebilir)
    // const savedUser = localStorage.getItem("nosotros_user");
    // if (savedUser) login(savedUser);
};
