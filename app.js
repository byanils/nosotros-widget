// ⏱️ FECHA DE INICIO (UTC FIJO)
const startDate = new Date("2025-12-27T10:45:00Z");

// 💬 MENSAJES ESCRITOS DESDE EL PRINCIPIO
const messages = [
  { day: 0, text: "Este widget no pide nada.\nSolo está aquí.\nIgual que yo." },
  { day: 3, text: "Amor,\nno ha pasado mucho tiempo,\npero lo suficiente para saber\nque pensarte se siente bien." },
  { day:6, text: "Amor,\nhay personas que llegan despacio\ny sin hacer ruido,\npero se quedan en lugares importantes." },
  { day:9, text: "Amor,\nno todo se explica con palabras,\nalgunas cosas simplemente se sienten…\ny tú eres una de ellas." },
  { day:12, text: "Amor,\nmientras los días pasan,\nme doy cuenta de algo simple:\nme gusta que seas parte de ellos." },
  { day:15, text: "Amor,\nquince días no son una promesa\nni una eternidad,\npero sí el tiempo suficiente\npara elegirte con calma.\n\nNo por costumbre,\nno por emoción del momento,\nsino porque contigo\ntodo se siente en su lugar.\n\nY eso…\neso vale mucho para mí." },
  { day:2, text: "Amor,\nincluso en los días cortos,\ntu presencia se siente completa." },
  { day:4, text: "Amor,\nhay momentos simples\nque se vuelven especiales\nsolo porque estás tú en ellos." },
  { day:6, text: "Amor,\npensar en ti no interrumpe mi día,\nlo mejora." },
  { day:8, text: "Amor,\nno necesito razones grandes,\nlas pequeñas contigo ya son suficientes." },
  { day:10, text: "Amor,\ndiez días pueden parecer poco,\npero cuando alguien importa,\nel tiempo se mide distinto.\n\nSe mide en calma,\nen sonrisas que no se fuerzan,\nen ganas de compartir sin pedir.\n\nY contigo,\ntodo eso aparece\nde forma natural.\n\nPor eso este mensaje esperó.\nPorque lo que vale la pena,\nnunca tiene prisa." }
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

    if (activeMessage.day === 15 || activeMessage.day === 10) {
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