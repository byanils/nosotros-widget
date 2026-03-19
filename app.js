import { messages } from './messages.js';
import { vaults } from './vaults.js';

// --- SUPABASE CONFIGURATION ---
const supabaseUrl = "https://keghnzprzywaszfxludu.supabase.co"; 
const supabaseKey = "sb_publishable_WvNvlJRpO0w2tAIXGXuOmA_Kkwqc_4f";

// Supabase'i başlat
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

const myApiKey = "2e2dcf335d4c97a7c182b0c041eea672";
const startDate = new Date("2025-12-27T10:45:00");
const photos = ["foto1.jpg", "foto2.jpg", "foto3.jpg", "foto4.jpg", "foto5.jpg", "foto6.jpg", "foto7.jpg", "foto8.jpg", "foto9.jpg", "foto10.jpg"];
let currentIdx = 0;
let currentUser = null;

// OYUN DEĞİŞKENLERİ (5x5 Grid)
let board = Array(25).fill("");
let turn = "Anıl"; 
let scores = { "Anıl": 0, "Camila": 0 };
let weeklyScores = { "Anıl": 0, "Camila": 0 };
let lastResetWeek = ""; 
const WIN_COUNT = 4; // 4 yan yana gelen kazanır
const GRID_SIZE = 5; 

// GİRİŞ FONKSİYONU
function login(user) {
    currentUser = user;
    localStorage.setItem("nosotros_user", user);
    
    // UI Güncelleme
    document.getElementById("login-screen").classList.remove("active");
    document.getElementById("main-page").classList.add("active");
    
    startSupabaseListeners();
    checkDailyReset();
    updateSelfieUI();
}

function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                document.getElementById("enable-notifications").style.display = "none";
            }
        });
    }
}
window.requestNotificationPermission = requestNotificationPermission;

// Supabase dinleyicilerini başlatalım
async function startSupabaseListeners() {
    if (!supabase) return;

    try {
        // --- OYUN VERİLERİNİ ÇEK VE DİNLE ---
        const { data: initialGame, error: gameError } = await supabase.from('game_state').select('*').eq('id', 1).maybeSingle();
        
        if (initialGame) {
            // Önce tüm verileri yerel değişkenlere ata
            board = initialGame.board || Array(GRID_SIZE * GRID_SIZE).fill("");
            turn = initialGame.turn || "Anıl";
            scores = initialGame.scores || { "Anıl": 0, "Camila": 0 };
            weeklyScores = initialGame.weekly_scores || { "Anıl": 0, "Camila": 0 };
            lastResetWeek = initialGame.last_reset_week;

            // Haftalık reset kontrolü
            const currentWeek = getISOWeek();
            if (lastResetWeek !== currentWeek) {
                lastResetWeek = currentWeek;
                weeklyScores = { "Anıl": 0, "Camila": 0 };
                saveGameState();
            }

            // Eğer board boyutu yanlışsa düzelt
            if (board.length !== GRID_SIZE * GRID_SIZE) {
                board = Array(GRID_SIZE * GRID_SIZE).fill("");
                saveGameState();
            }
            
            updateGameUI();
        } else {
            // Eğer tabloda hiç veri yoksa ilk satırı oluştur
            board = Array(GRID_SIZE * GRID_SIZE).fill("");
            lastResetWeek = getISOWeek();
            const { error: insertError } = await supabase.from('game_state').insert([{ 
                id: 1, 
                board: board, 
                turn: turn, 
                scores: scores,
                weekly_scores: weeklyScores,
                last_reset_week: lastResetWeek
            }]);
            if (insertError) console.error("Insert hatası:", insertError);
        }

        // Gerçek zamanlı oyun takibi
        supabase.channel('game_state_changes')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_state', filter: 'id=eq.1' }, payload => {
            const data = payload.new;
            const oldTurn = turn;
            
            board = data.board;
            turn = data.turn;
            scores = data.scores;
            weeklyScores = data.weekly_scores || { "Anıl": 0, "Camila": 0 };
            lastResetWeek = data.last_reset_week;
            
            updateGameUI();

            // Bildirim gönder: Sıra sana geçtiyse
            if (turn === currentUser && oldTurn !== currentUser) {
                sendTurnNotification();
            }
        }).subscribe();

        // --- SELFIE VERİLERİNİ ÇEK VE DİNLE ---
        const today = new Date().toLocaleDateString("en-US", {timeZone: "America/Bogota"}).replace(/\//g, "-");
        const { data: initialSelfie, error: selfieError } = await supabase.from('selfies').select('*').eq('day', today).maybeSingle();
        
        if (initialSelfie) {
            if (initialSelfie.anil) localStorage.setItem("nosotros_anil_photo", initialSelfie.anil);
            if (initialSelfie.camila) localStorage.setItem("nosotros_camila_photo", initialSelfie.camila);
            updateSelfieUI();
        }

        // Gerçek zamanlı selfie takibi
        supabase.channel('selfies_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'selfies', filter: `day=eq.${today}` }, payload => {
            const data = payload.new;
            if (data.anil) localStorage.setItem("nosotros_anil_photo", data.anil);
            if (data.camila) localStorage.setItem("nosotros_camila_photo", data.camila);
            updateSelfieUI();
        }).subscribe();
    } catch (err) {
        console.error("Supabase başlatma hatası:", err);
    }
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
    // Artık loadGameState (localStorage) kullanmıyoruz, 
    // startSupabaseListeners zaten verileri canlı tutuyor.
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
function saveGameState() {
    if (supabase) {
        supabase.from('game_state').update({
            board: board,
            turn: turn,
            scores: scores,
            weekly_scores: weeklyScores,
            last_reset_week: lastResetWeek
        }).eq('id', 1).then();
    }
}

function updateGameUI() {
    const cells = document.querySelectorAll(".cell");
    const winningPattern = getWinningPattern();

    // Bildirim butonu kontrolü
    const notifyBtn = document.getElementById("enable-notifications");
    if (notifyBtn) {
        if ("Notification" in window && Notification.permission === "default") {
            notifyBtn.style.display = "inline-block";
        } else {
            notifyBtn.style.display = "none";
        }
    }

    cells.forEach((cell, i) => {
        cell.innerText = board[i];
        cell.className = "cell" + (board[i] ? " taken" : "");
        if (winningPattern && winningPattern.includes(i)) {
            cell.classList.add("winner");
        }
    });

    const turnEl = document.getElementById("game-turn");
    const weeklyScoreEl = document.getElementById("weekly-score");
    const totalScoreEl = document.getElementById("total-score");
    
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

    if (weeklyScoreEl) weeklyScoreEl.innerText = `Anıl: ${weeklyScores["Anıl"]} - Camila: ${weeklyScores["Camila"]}`;
    if (totalScoreEl) totalScoreEl.innerText = `Anıl: ${scores["Anıl"]} - Camila: ${scores["Camila"]}`;
}

function makeMove(index) {
    if (board[index] !== "" || turn !== currentUser || checkWinner()) return;

    board[index] = (turn === "Anıl" ? "X" : "O");
    
    if (checkWinner()) {
        scores[turn]++;
        weeklyScores[turn]++;
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

// YARDIMCI FONKSİYONLAR
function getISOWeek() {
    const d = new Date();
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${d.getUTCFullYear()}-W${weekNo}`;
}

function sendTurnNotification() {
    if (!("Notification" in window)) return;
    
    if (Notification.permission === "granted") {
        new Notification("¡Tu turno! 🎮", {
            body: `Es momento de jugar Tic-Tac-Toe con ${currentUser === "Anıl" ? "Camila" : "Anıl"}`,
            icon: "foto1.jpg"
        });
    }
}

function getWinningPattern() {
    // 5x5 tahtada her hücre için 4 yöne doğru 4-lü kontrolü
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            const startIdx = r * GRID_SIZE + c;
            const symbol = board[startIdx];
            if (!symbol) continue;

            // Kontrol edilecek 4 yön: Sağ, Aşağı, Çapraz Sağ-Aşağı, Çapraz Sol-Aşağı
            const directions = [
                { dr: 0, dc: 1 },  // Sağ
                { dr: 1, dc: 0 },  // Aşağı
                { dr: 1, dc: 1 },  // Çapraz Sağ-Aşağı
                { dr: 1, dc: -1 }  // Çapraz Sol-Aşağı
            ];

            for (const { dr, dc } of directions) {
                let pattern = [startIdx];
                let match = true;
                for (let step = 1; step < WIN_COUNT; step++) {
                    const nr = r + dr * step;
                    const nc = c + dc * step;
                    if (nr < 0 || nr >= GRID_SIZE || nc < 0 || nc >= GRID_SIZE) {
                        match = false;
                        break;
                    }
                    const nextIdx = nr * GRID_SIZE + nc;
                    if (board[nextIdx] !== symbol) {
                        match = false;
                        break;
                    }
                    pattern.push(nextIdx);
                }
                if (match) return pattern;
            }
        }
    }
    return null;
}

function checkWinner() {
    return getWinningPattern() !== null;
}

function resetBoard(resetScores = true) {
    board = Array(GRID_SIZE * GRID_SIZE).fill("");
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
    reader.onload = async function(event) {
        let base64 = event.target.result;
        
        // FOTOĞRAFI SIKIŞTIRMA (Supabase ve veritabanı performansı için)
        const img = new Image();
        img.src = base64;
        img.onload = async function() {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 600; // Genişliği 600px ile sınırla
            let width = img.width;
            let height = img.height;

            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Kaliteyi %60'a düşürerek boyutu küçült
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
            
            const today = new Date().toLocaleDateString("en-US", {timeZone: "America/Bogota"}).replace(/\//g, "-");

            if (supabase) {
                const updateData = {};
                updateData[currentUser === "Anıl" ? "anil" : "camila"] = compressedBase64;
                updateData["day"] = today;

                console.log("Selfie yükleniyor...");
                const { data, error } = await supabase.from('selfies').upsert(updateData, { onConflict: 'day' }).select();
                
                if (error) {
                    console.error("Yükleme hatası:", error);
                    alert("Error al subir la foto: " + error.message);
                } else {
                    console.log("Yükleme başarılı!");
                }
            }
        };
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

    // Otomatik login kontrolü (İşte bu verilerin sıfırlanmasını engelleyecek olan kısım)
    const savedUser = localStorage.getItem("nosotros_user");
    if (savedUser) {
        // Login ekranını hemen gizle, login() fonksiyonu geri kalan her şeyi yapacak
        document.getElementById("login-screen").classList.remove("active");
        login(savedUser);
    } else {
        // Eğer kullanıcı yoksa giriş ekranını göster
        document.getElementById("login-screen").classList.add("active");
    }
};
