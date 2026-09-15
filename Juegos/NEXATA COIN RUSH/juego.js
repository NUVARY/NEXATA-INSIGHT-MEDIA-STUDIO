const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800; canvas.height = 500;

const monedasTexto = document.getElementById("monedas");
const recordTexto = document.getElementById("record");
const nivelTexto = document.getElementById("nivel");
const pantallaInicio = document.getElementById("pantallaInicio");
const pantallaGameOver = document.getElementById("pantallaGameOver");
const monedasFinales = document.getElementById("monedasFinales");
const recordFinal = document.getElementById("recordFinal");
const botonIniciar = document.getElementById("botonIniciar");
const botonReiniciar = document.getElementById("botonReiniciar");
const botonIzquierda = document.getElementById("izquierda");
const botonDerecha = document.getElementById("derecha");

// --- SONIDOS CORREGIDO ---
const sonidoMoneda = new Audio("sonidos/moneda.mp3");
const sonidoChoque = new Audio("sonidos/choque.mp3");
const sonidoNivel = new Audio("sonidos/nivel.mp3");
const musica = new Audio("sonidos/musica.mp3");

sonidoMoneda.preload = "auto";
sonidoChoque.preload = "auto";
sonidoNivel.preload = "auto";
musica.preload = "auto";

musica.loop = true;
musica.volume = 0.4;
sonidoMoneda.volume = 1.0;
sonidoChoque.volume = 1.0;
sonidoNivel.volume = 1.0;

let sonidoActivado = true;

function reproducirSonido(sonido) {
  if (!sonidoActivado) return;
  const clon = sonido.cloneNode();
  clon.volume = sonido.volume;
  clon.play().catch(() => {});
}

let juegoActivo = false;
let monedas = 0;
let nivel = 1;
let velocidad = 3;
let tiempo = 0;
let record = Number(localStorage.getItem("nexataCoinRushRecord")) || 0;
recordTexto.textContent = record;

const jugador = { x: canvas.width / 2 - 25, y: canvas.height - 70, ancho: 50, alto: 35, velocidad: 7, movimientoIzquierda: false, movimientoDerecha: false };
let monedasObjetos = [];
let obstaculos = [];
const estrellas = [];
for (let i = 0; i < 70; i++) {
  estrellas.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, tamaño: Math.random() * 2 + 1, velocidad: Math.random() * 1.5 + 0.5 });
}
function dibujarFondo() {
  ctx.fillStyle = "#020817"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  estrellas.forEach(estrella => {
    ctx.fillStyle = "#ffffff"; ctx.globalAlpha = 0.3 + Math.random() * 0.7;
    ctx.fillRect(estrella.x, estrella.y, estrella.tamaño, estrella.tamaño);
  });
  ctx.globalAlpha = 1;
}
function actualizarEstrellas() {
  estrellas.forEach(estrella => {
    estrella.y += estrella.velocidad;
    if (estrella.y > canvas.height) { estrella.y = -5; estrella.x = Math.random() * canvas.width; }
  });
}
function dibujarJugador() {
  const x = jugador.x; const y = jugador.y;
  ctx.beginPath(); ctx.moveTo(x + jugador.ancho / 2, y); ctx.lineTo(x + jugador.ancho, y + jugador.alto); ctx.lineTo(x + jugador.ancho / 2, y + jugador.alto - 10); ctx.lineTo(x, y + jugador.alto); ctx.closePath();
  ctx.fillStyle = "#00eaff"; ctx.fill();
  ctx.beginPath(); ctx.arc(x + jugador.ancho / 2, y + 15, 8, 0, Math.PI * 2); ctx.fillStyle = "#ffffff"; ctx.fill();
  ctx.fillStyle = "#ffb300"; ctx.fillRect(x + 15, y + jugador.alto - 2, 8, 10); ctx.fillRect(x + 27, y + jugador.alto - 2, 8, 10);
}
function crearMoneda() {
  const tamaño = 20;
  monedasObjetos.push({ x: Math.random() * (canvas.width - tamaño * 2) + tamaño, y: -30, tamaño: tamaño, velocidad: velocidad + 1, rotacion: 0 });
}
function dibujarMoneda(moneda) {
  ctx.save(); ctx.translate(moneda.x, moneda.y); moneda.rotacion += 0.08;
  const escala = Math.abs(Math.cos(moneda.rotacion)); ctx.scale(escala, 1);
  ctx.beginPath(); ctx.arc(0, 0, moneda.tamaño, 0, Math.PI * 2); ctx.fillStyle = "#ffd700"; ctx.fill();
  ctx.strokeStyle = "#fff3a3"; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = "#8a6500"; ctx.font = "bold 18px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("$", 0, 1);
  ctx.restore();
}
function crearObstaculo() {
  const tamaño = Math.random() * 25 + 30;
  obstaculos.push({ x: Math.random() * (canvas.width - tamaño), y: -tamaño, tamaño: tamaño, velocidad: velocidad });
}
function dibujarObstaculo(obstaculo) {
  ctx.save(); ctx.translate(obstaculo.x + obstaculo.tamaño / 2, obstaculo.y + obstaculo.tamaño / 2); ctx.rotate(tiempo * 0.02);
  ctx.beginPath(); const puntas = 8;
  for (let i = 0; i < puntas * 2; i++) {
    const radio = i % 2 === 0? obstaculo.tamaño / 2 : obstaculo.tamaño / 4;
    const angulo = (Math.PI * i) / puntas;
    const x = Math.cos(angulo) * radio; const y = Math.sin(angulo) * radio;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath(); ctx.fillStyle = "#ff4057"; ctx.fill(); ctx.strokeStyle = "#ff9aa7"; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
}
function hayColision(a, b) { return a.x < b.x + b.tamaño && a.x + a.ancho > b.x && a.y < b.y + b.tamaño && a.y + a.alto > b.y; }
function jugadorTomaMoneda(moneda) { return jugador.x < moneda.x + moneda.tamaño && jugador.x + jugador.ancho > moneda.x - moneda.tamaño && jugador.y < moneda.y + moneda.tamaño && jugador.y + jugador.alto > moneda.y - moneda.tamaño; }
function actualizarJugador() {
  if (jugador.movimientoIzquierda) jugador.x -= jugador.velocidad;
  if (jugador.movimientoDerecha) jugador.x += jugador.velocidad;
  if (jugador.x < 0) jugador.x = 0;
  if (jugador.x + jugador.ancho > canvas.width) jugador.x = canvas.width - jugador.ancho;
}
function actualizarMonedas() {
  for (let i = monedasObjetos.length - 1; i >= 0; i--) {
    const moneda = monedasObjetos[i]; moneda.y += moneda.velocidad; dibujarMoneda(moneda);
    if (jugadorTomaMoneda(moneda)) {
      monedas++; monedasTexto.textContent = monedas;
      reproducirSonido(sonidoMoneda);
      comprobarNivel();
      monedasObjetos.splice(i, 1); continue;
    }
    if (moneda.y > canvas.height + 40) monedasObjetos.splice(i, 1);
  }
}
function actualizarObstaculos() {
  for (let i = obstaculos.length - 1; i >= 0; i--) {
    const obstaculo = obstaculos[i]; obstaculo.y += obstaculo.velocidad; dibujarObstaculo(obstaculo);
    if (hayColision(jugador, obstaculo)) { terminarJuego(); return; }
    if (obstaculo.y > canvas.height + 50) obstaculos.splice(i, 1);
  }
}
function comprobarNivel() {
  const nuevoNivel = Math.floor(monedas / 100) + 1;
  if (nuevoNivel > nivel) { nivel = nuevoNivel; velocidad += 0.5; nivelTexto.textContent = nivel; reproducirSonido(sonidoNivel); }
}
function generarObjetos() {
  tiempo++;
  if (tiempo % Math.max(35, 75 - nivel * 3) === 0) crearMoneda();
  if (tiempo % Math.max(55, 110 - nivel * 4) === 0) crearObstaculo();
}
function terminarJuego() {
  juegoActivo = false; musica.pause(); reproducirSonido(sonidoChoque);
  if (monedas > record) { record = monedas; localStorage.setItem("nexataCoinRushRecord", record); }
  recordTexto.textContent = record; monedasFinales.textContent = monedas; recordFinal.textContent = record;
  pantallaGameOver.classList.remove("oculto");
}
function iniciarJuego() {
  monedas = 0; nivel = 1; velocidad = 3; tiempo = 0;
  monedasObjetos = []; obstaculos = [];
  jugador.x = canvas.width / 2 - jugador.ancho / 2;
  jugador.movimientoIzquierda = false; jugador.movimientoDerecha = false;
  monedasTexto.textContent = "0"; nivelTexto.textContent = "1";
  pantallaInicio.classList.add("oculto"); pantallaGameOver.classList.add("oculto");
  juegoActivo = true;
  musica.currentTime = 0;
  musica.play().catch(() => {});
}
function juego() {
  dibujarFondo(); actualizarEstrellas();
  if (juegoActivo) { actualizarJugador(); generarObjetos(); actualizarMonedas(); actualizarObstaculos(); }
  else { monedasObjetos.forEach(dibujarMoneda); obstaculos.forEach(dibujarObstaculo); }
  dibujarJugador(); requestAnimationFrame(juego);
}
document.addEventListener("keydown", function(event) {
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") jugador.movimientoIzquierda = true;
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") jugador.movimientoDerecha = true;
});
document.addEventListener("keyup", function(event) {
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") jugador.movimientoIzquierda = false;
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") jugador.movimientoDerecha = false;
});
function activarIzquierda(event) { event.preventDefault(); jugador.movimientoIzquierda = true; }
function desactivarIzquierda(event) { event.preventDefault(); jugador.movimientoIzquierda = false; }
function activarDerecha(event) { event.preventDefault(); jugador.movimientoDerecha = true; }
function desactivarDerecha(event) { event.preventDefault(); jugador.movimientoDerecha = false; }
botonIzquierda.addEventListener("touchstart", activarIzquierda); botonIzquierda.addEventListener("touchend", desactivarIzquierda); botonIzquierda.addEventListener("touchcancel", desactivarIzquierda);
botonDerecha.addEventListener("touchstart", activarDerecha); botonDerecha.addEventListener("touchend", desactivarDerecha); botonDerecha.addEventListener("touchcancel", desactivarDerecha);
botonIniciar.addEventListener("click", iniciarJuego);
botonReiniciar.addEventListener("click", iniciarJuego);
juego();