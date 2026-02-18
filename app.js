import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot, getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyCv12bIT9P0Ezho4CidHYfRLMqCN3LVq1o",
    authDomain: "nuestro-universo-70d52.firebaseapp.com",
    projectId: "nuestro-universo-70d52",
    storageBucket: "nuestro-universo-70d52.firebasestorage.app",
    appId: "1:979401273604:web:ca547072488f746ca7e051"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const startDate = new Date("2024-12-27T10:45:00");
let currentUser = "";
let photoIndex = 1;

// GİRİŞ
window.loginUser = (u) => {
    currentUser = u;
    document.getElementById("login-overlay").style.display = "none";
    document.getElementById("main-page").classList.add("active");
    startApp();
};

// 9 FOTOĞRAFLIK ALBÜM DÖNGÜSÜ (YEREL DOSYALAR)
window.nextPhoto = () => {
    photoIndex = photoIndex >= 9 ? 1 : photoIndex + 1;
    document.getElementById("album-photo").src = `foto${photoIndex}.jpg`;
};

// SİSTEMLER
function startApp() {
    // Selfie Senkronizasyonu
    onSnapshot(doc(db, "settings", "selfies"), (snap) => {
        if(snap.exists()){
            const data = snap.data();
            if(data.anil) document.getElementById("slot-anil").innerHTML = `<img src="${data.anil}">`;
            if(data.camila) document.getElementById("slot-camila").innerHTML = `<img src="${data.camila}">`;
        }
    });

    setInterval(updateStats, 1000);
}

// FOTOĞRAF YÜKLEME (KARŞILIKLI GÖRÜNÜM İÇİN)
window.uploadPhoto = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const sRef = ref(storage, `selfies/${currentUser}.jpg`);
    await uploadBytes(sRef, file);
    const url = await getDownloadURL(sRef);
    
    // Sadece kendi alanını değil, ortak dokümanı güncelle
    const docRef = doc(db, "settings", "selfies");
    const snap = await getDoc(docRef);
    let updateData = snap.exists() ? snap.data() : {};
    updateData[currentUser] = url;
    await setDoc(docRef, updateData);
};

// OYUN VE 9 SANDIK (sandik.png)
function initAdventure() {
    const container = document.getElementById("chest-container");
    container.innerHTML = "";
    for(let i=1; i<=9; i++) {
        const img = document.createElement("img");
        img.src = "sandik.png";
        img.className = "chest";
        img.id = `chest-${i}`;
        container.appendChild(img);
    }
    
    // Galibiyet sayısına göre sandıkları aktifleştir (Örnek mantık)
    onSnapshot(doc(db, "games", "stats"), (snap) => {
        const wins = snap.exists() ? snap.data().totalWins || 0 : 0;
        for(let i=1; i<=9; i++) {
            if(wins >= i) document.getElementById(`chest-${i}`).classList.add("active");
        }
    });
}

// ... (Sayaç ve TicTacToe hücre mantığı aynı kalacak şekilde buraya eklenir)
// Not: TicTacToe hücrelerini oluştururken initAdventure() fonksiyonunu da çağırın.

window.goToUniverse = () => {
    document.getElementById("main-page").classList.remove("active");
    document.getElementById("game-page").classList.add("active");
    initAdventure(); // Sandıkları yükle
    // TicTacToe Grid oluşturma kodun...
};
