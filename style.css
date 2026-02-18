:root { 
    --primary: #ff4d4d; 
    --gold: #ffd700;
    --bg: #0b0e14;
}

* { box-sizing: border-box; margin: 0; padding: 0; outline: none; }

body { 
    background-color: var(--bg);
    color: white; font-family: 'Poppins', sans-serif;
    overflow: hidden; height: 100vh;
}

.page-layer { 
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    display: none; flex-direction: column; align-items: center; justify-content: center;
    background: radial-gradient(circle at center, #1a1a2e 0%, #0b0e14 100%);
}
.page-layer.active { display: flex; }

/* LOGIN */
.login-box { background: rgba(255,255,255,0.05); padding: 40px; border-radius: 40px; backdrop-filter: blur(15px); text-align: center; border: 1px solid rgba(255,255,255,0.1); }
.login-btns { margin-top: 20px; }
.login-btns button { background: var(--primary); color: white; border: none; padding: 15px 30px; border-radius: 50px; cursor: pointer; font-weight: bold; margin: 5px; transition: 0.3s; }

/* SAYAÇ (İSPANYOLCA) */
#counter { display: flex; gap: 15px; margin: 30px 0; }
.time-unit { display: flex; flex-direction: column; align-items: center; min-width: 70px; }
.time-unit span { font-size: 2.5rem; font-weight: 700; color: white; }
.time-unit small { font-size: 0.7rem; letter-spacing: 2px; opacity: 0.6; text-transform: uppercase; }

/* KALP VE MESAJ */
.heart-container { 
    width: 250px; height: 230px; margin-bottom: 20px;
    -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>');
    mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>');
    mask-size: contain; mask-repeat: no-repeat; mask-position: center;
}
.heart-container img { width: 100%; height: 100%; object-fit: cover; }
#message { font-family: 'Dancing Script', cursive; font-size: 1.4rem; text-align: center; padding: 0 20px; max-width: 400px; min-height: 60px; color: #ffb3b3; }

/* NAV */
.main-nav { margin-top: 30px; display: flex; flex-direction: column; gap: 10px; }
.btn-nav { background: transparent; border: 1px solid var(--primary); color: white; padding: 12px 25px; border-radius: 50px; cursor: pointer; transition: 0.3s; font-weight: 600; }
.btn-nav:hover { background: var(--primary); }

/* EVREN VE S-YOLU */
#star-map-page { overflow-y: auto; display: block; }
#vault-container { position: relative; width: 100%; min-height: 150vh; padding: 100px 0; }
.chest { 
    position: absolute; width: 60px; height: 60px; 
    background: url('sandik.png') no-repeat center/contain;
    transform: translate(-50%, -50%); cursor: pointer; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    filter: drop-shadow(0 0 10px var(--gold));
}
.chest:hover { transform: translate(-50%, -50%) scale(1.3); filter: drop-shadow(0 0 20px var(--gold)); }
.chest::after { content: attr(data-date); position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); font-size: 0.6rem; opacity: 0.5; white-space: nowrap; }

/* MODAL */
.modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 1000; }
.modal-content { background: white; color: #333; margin: 10% auto; padding: 30px; border-radius: 30px; width: 90%; max-width: 400px; text-align: center; position: relative; }
.photo-display { display: flex; justify-content: space-around; margin: 20px 0; }
.photo-slot img { width: 120px; height: 120px; border-radius: 15px; object-fit: cover; }
.locked { filter: blur(15px) grayscale(1); }
.upload-button { background: var(--primary); color: white; border: none; padding: 15px 30px; border-radius: 50px; font-weight: bold; width: 100%; cursor: pointer; }
.close { position: absolute; right: 20px; top: 15px; font-size: 1.5rem; cursor: pointer; color: #999; }
#back-btn { position: fixed; top: 20px; left: 20px; background: rgba(255,255,255,0.1); border: none; color: white; padding: 10px 15px; border-radius: 20px; z-index: 2000; cursor: pointer; }
