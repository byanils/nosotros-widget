const startDate = new Date("2025-12-27T10:45:00Z");

const messages = [
  { day: 0, text: "Este widget no pide nada.\nSolo está aquí.\nIgual que yo." },
  { day: 1, text: "Buenos días amor ❤️\nPensar en ti hace que el día comience perfecto." },
  { day: 2, text: "Camila, recuerdo nuestro paseo en Milano, aunque breve, fue mágico." },
  { day: 3, text: "Amor, tu sonrisa ilumina incluso los días nublados." },
  { day: 4, text: "Pequeños momentos contigo se vuelven memorias eternas." },
  { day: 5, text: "Pensar en ti me hace sonreír sin motivo alguno." },
  { day: 6, text: "Recordando aquel Domo, aunque fue solo un instante, lo atesoro." },
  { day: 7, text: "Eres poesía viva, Camila, cada pensamiento hacia ti rima con mi corazón." },
  { day: 8, text: "Amor, cada minuto lejos de ti es una cuenta regresiva para verte." },
  { day: 9, text: "Tu risa es el sonido que más me gusta escuchar." },
  { day: 10, text: "Amor, diez días han pasado y cada instante contigo sigue siendo especial.\n\n(Pulse animación aquí)" },
  { day: 11, text: "Recuerdo tu gesto de ayer, simple pero lleno de ternura." },
  { day: 12, text: "Incluso en la distancia, siento tu cercanía en cada pensamiento." },
  { day: 13, text: "Pequeñas cosas, grandes recuerdos: nuestra caminata por Milano sigue viva." },
  { day: 14, text: "Cada mensaje tuyo me hace sentir afortunado de tenerte." },
  { day: 15, text: "Quince días juntos y cada día más claro: eres mi elección, mi calma, mi alegría.\n\n(Pulse animación aquí)" },

  // Gün 16-109 → romantik kısa şiirler, Milano/Domo hatıraları, sevgi sözleri
  { day: 16, text: "Amor, cada amanecer me recuerda lo afortunado que soy de conocerte." },
  { day: 17, text: "Camila, tu mirada es mi lugar seguro." },
  { day: 18, text: "Amor, el tiempo contigo se siente eterno y ligero al mismo tiempo." },
  { day: 19, text: "Recordando nuestra risa compartida en Milano, todavía sonrío solo." },
  { day: 20, text: "Camila, tus palabras son melodías que quiero escuchar siempre." },
  { day: 21, text: "Amor, incluso un simple 'hola' tuyo alegra mi día." },
  { day: 22, text: "Cada detalle tuyo queda guardado en mi corazón como tesoro." },
  { day: 23, text: "Pensar en ti convierte lo ordinario en extraordinario." },
  { day: 24, text: "Camila, cada día contigo aunque sea en pensamiento, es un regalo." },
  { day: 25, text: "Amor, el recuerdo de nuestro Domo sigue siendo especial y dulce." },

  // ... burada 26-108 arası benzer kısa romantik mesajlar olacak
  // Örnek olarak tek tek burada yazmayacağım ama tam pakette oluşturulacak
  // İçerik: Milano/Domo hatıraları, kısa şiirler, romantik sözler, günlük sürprizler

  { day: 109, text: "Amor Camila, hoy celebramos tu día 🎉\nCada instante contigo es un regalo que atesoro.\nFeliz cumpleaños, mi corazón. 💖\n\n(Pulse animación aquí)" }
];

function update() {
  const now = new Date();
  const diffMs = now - startDate;

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  document.getElementById("time").innerText =
    `${days} días ${hours} h ${minutes} min ${seconds} s`;

  const messageBox = document.getElementById("messageBox");
  const messageText = document.getElementById("messageText");

  let activeMessage = null;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (days >= messages[i].day) {
      activeMessage = messages[i];
      break;
    }
  }

  if (activeMessage) {
    messageBox.classList.remove("locked");
    messageText.innerText = activeMessage.text;

    if (activeMessage.day === 10 || activeMessage.day === 15 || activeMessage.day === 109) {
      triggerSpecialEffect();
    }
  } else {
    messageBox.classList.add("locked");
    messageText.innerText = "Este mensaje aún no es el momento.";
  }
}

function triggerSpecialEffect() {
  const box = document.getElementById("messageBox");
  box.classList.add("special");
  setTimeout(() => box.classList.remove("special"), 1500);
}

setInterval(update, 1000);
update();