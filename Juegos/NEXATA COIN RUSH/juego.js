// =========================================================
// NEXATA COIN RUSH
// =========================================================


// =========================================================
// CANVAS
// =========================================================

const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;


// =========================================================
// ELEMENTOS HTML
// =========================================================

const monedasTexto =
  document.getElementById("monedas");

const recordTexto =
  document.getElementById("record");

const nivelTexto =
  document.getElementById("nivel");

const pantallaInicio =
  document.getElementById("pantallaInicio");

const pantallaGameOver =
  document.getElementById("pantallaGameOver");

const monedasFinales =
  document.getElementById("monedasFinales");

const recordFinal =
  document.getElementById("recordFinal");

const botonIniciar =
  document.getElementById("botonIniciar");

const botonReiniciar =
  document.getElementById("botonReiniciar");

const botonIzquierda =
  document.getElementById("izquierda");

const botonDerecha =
  document.getElementById("derecha");


// =========================================================
// SONIDOS
// =========================================================

const sonidoMoneda =
  new Audio("sonidos/moneda.mp3");

const sonidoChoque =
  new Audio("sonidos/choque.mp3");

const sonidoNivel =
  new Audio("sonidos/nivel.mp3");

const musica =
  new Audio("sonidos/musica.mp3");


// =========================================================
// CONFIGURACIÓN DEL SONIDO
// =========================================================

let sonidoActivado = true;

musica.loop = true;

musica.volume = 1.0;

sonidoMoneda.volume = 1.0;

sonidoChoque.volume = 1.0;

sonidoNivel.volume = 1.0;


// =========================================================
// REPRODUCIR SONIDO
// =========================================================

function reproducirSonido(sonido) {

  if (!sonidoActivado) {
    return;
  }

  sonido.currentTime = 0;

  sonido.play().catch(() => {});

}


// =========================================================
// VARIABLES DEL JUEGO
// =========================================================

let juegoActivo = false;

let monedas = 0;

let nivel = 1;

let velocidad = 3;

let tiempo = 0;

let record =
  Number(
    localStorage.getItem(
      "nexataCoinRushRecord"
    )
  ) || 0;


// Mostrar récord

recordTexto.textContent = record;


// =========================================================
// JUGADOR
// =========================================================

const jugador = {

  x: canvas.width / 2 - 25,

  y: canvas.height - 70,

  ancho: 50,

  alto: 35,

  velocidad: 7,

  movimientoIzquierda: false,

  movimientoDerecha: false

};


// =========================================================
// OBJETOS
// =========================================================

let monedasObjetos = [];

let obstaculos = [];


// =========================================================
// ESTRELLAS
// =========================================================

const estrellas = [];


for (let i = 0; i < 70; i++) {

  estrellas.push({

    x: Math.random() * canvas.width,

    y: Math.random() * canvas.height,

    tamaño: Math.random() * 2 + 1,

    velocidad:
      Math.random() * 1.5 + 0.5

  });

}


// =========================================================
// DIBUJAR FONDO
// =========================================================

function dibujarFondo() {

  ctx.fillStyle = "#020817";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  estrellas.forEach(estrella => {

    ctx.fillStyle = "#ffffff";

    ctx.globalAlpha =
      0.3 + Math.random() * 0.7;

    ctx.fillRect(

      estrella.x,

      estrella.y,

      estrella.tamaño,

      estrella.tamaño

    );

  });


  ctx.globalAlpha = 1;

}


// =========================================================
// ACTUALIZAR ESTRELLAS
// =========================================================

function actualizarEstrellas() {

  estrellas.forEach(estrella => {

    estrella.y += estrella.velocidad;


    if (estrella.y > canvas.height) {

      estrella.y = -5;

      estrella.x =
        Math.random() * canvas.width;

    }

  });

}


// =========================================================
// DIBUJAR JUGADOR
// =========================================================

function dibujarJugador() {

  const x = jugador.x;

  const y = jugador.y;


  // Nave

  ctx.beginPath();

  ctx.moveTo(
    x + jugador.ancho / 2,
    y
  );

  ctx.lineTo(
    x + jugador.ancho,
    y + jugador.alto
  );

  ctx.lineTo(
    x + jugador.ancho / 2,
    y + jugador.alto - 10
  );

  ctx.lineTo(
    x,
    y + jugador.alto
  );

  ctx.closePath();


  ctx.fillStyle = "#00eaff";

  ctx.fill();


  // Cabina

  ctx.beginPath();

  ctx.arc(

    x + jugador.ancho / 2,

    y + 15,

    8,

    0,

    Math.PI * 2

  );


  ctx.fillStyle = "#ffffff";

  ctx.fill();


  // Motores

  ctx.fillStyle = "#ffb300";


  ctx.fillRect(

    x + 15,

    y + jugador.alto - 2,

    8,

    10

  );


  ctx.fillRect(

    x + 27,

    y + jugador.alto - 2,

    8,

    10

  );

}


// =========================================================
// CREAR MONEDA
// =========================================================

function crearMoneda() {

  const tamaño = 20;


  monedasObjetos.push({

    x:
      Math.random() *
        (canvas.width - tamaño * 2)
      + tamaño,

    y: -30,

    tamaño: tamaño,

    velocidad: velocidad + 1,

    rotacion: 0

  });

}


// =========================================================
// DIBUJAR MONEDA
// =========================================================

function dibujarMoneda(moneda) {

  ctx.save();


  ctx.translate(

    moneda.x,

    moneda.y

  );


  moneda.rotacion += 0.08;


  const escala =
    Math.abs(
      Math.cos(moneda.rotacion)
    );


  ctx.scale(

    escala,

    1

  );


  ctx.beginPath();


  ctx.arc(

    0,

    0,

    moneda.tamaño,

    0,

    Math.PI * 2

  );


  ctx.fillStyle = "#ffd700";

  ctx.fill();


  ctx.strokeStyle = "#fff3a3";

  ctx.lineWidth = 3;

  ctx.stroke();


  ctx.fillStyle = "#8a6500";

  ctx.font = "bold 18px Arial";

  ctx.textAlign = "center";

  ctx.textBaseline = "middle";


  ctx.fillText(

    "$",

    0,

    1

  );


  ctx.restore();

}


// =========================================================
// CREAR OBSTÁCULO
// =========================================================

function crearObstaculo() {

  const tamaño =
    Math.random() * 25 + 30;


  obstaculos.push({

    x:
      Math.random() *
      (canvas.width - tamaño),

    y: -tamaño,

    tamaño: tamaño,

    velocidad: velocidad

  });

}


// =========================================================
// DIBUJAR OBSTÁCULO
// =========================================================

function dibujarObstaculo(obstaculo) {

  ctx.save();


  ctx.translate(

    obstaculo.x +
      obstaculo.tamaño / 2,

    obstaculo.y +
      obstaculo.tamaño / 2

  );


  ctx.rotate(

    tiempo * 0.02

  );


  ctx.beginPath();


  const puntas = 8;


  for (
    let i = 0;
    i < puntas * 2;
    i++
  ) {

    const radio =

      i % 2 === 0

        ? obstaculo.tamaño / 2

        : obstaculo.tamaño / 4;


    const angulo =

      (Math.PI * i) / puntas;


    const x =
      Math.cos(angulo) * radio;


    const y =
      Math.sin(angulo) * radio;


    if (i === 0) {

      ctx.moveTo(x, y);

    } else {

      ctx.lineTo(x, y);

    }

  }


  ctx.closePath();


  ctx.fillStyle = "#ff4057";

  ctx.fill();


  ctx.strokeStyle = "#ff9aa7";

  ctx.lineWidth = 2;

  ctx.stroke();


  ctx.restore();

}


// =========================================================
// COLISIÓN CON OBSTÁCULO
// =========================================================

function hayColision(a, b) {

  return (

    a.x <
      b.x + b.tamaño &&

    a.x + a.ancho >
      b.x &&

    a.y <
      b.y + b.tamaño &&

    a.y + a.alto >
      b.y

  );

}


// =========================================================
// COLISIÓN CON MONEDA
// =========================================================

function jugadorTomaMoneda(moneda) {

  return (

    jugador.x <
      moneda.x + moneda.tamaño &&

    jugador.x + jugador.ancho >
      moneda.x - moneda.tamaño &&

    jugador.y <
      moneda.y + moneda.tamaño &&

    jugador.y + jugador.alto >
      moneda.y - moneda.tamaño

  );

}


// =========================================================
// ACTUALIZAR JUGADOR
// =========================================================

function actualizarJugador() {

  if (
    jugador.movimientoIzquierda
  ) {

    jugador.x -=
      jugador.velocidad;

  }


  if (
    jugador.movimientoDerecha
  ) {

    jugador.x +=
      jugador.velocidad;

  }


  if (jugador.x < 0) {

    jugador.x = 0;

  }


  if (
    jugador.x + jugador.ancho >
    canvas.width
  ) {

    jugador.x =
      canvas.width -
      jugador.ancho;

  }

}


// =========================================================
// ACTUALIZAR MONEDAS
// =========================================================

function actualizarMonedas() {

  for (
    let i =
      monedasObjetos.length - 1;

    i >= 0;

    i--
  ) {

    const moneda =
      monedasObjetos[i];


    moneda.y +=
      moneda.velocidad;


    dibujarMoneda(moneda);


    // Recoger moneda

    if (
      jugadorTomaMoneda(moneda)
    ) {

      monedas++;


      monedasTexto.textContent =
        monedas;


      // Sonido de moneda

      reproducirSonido(
        sonidoMoneda
      );


      comprobarNivel();


      monedasObjetos.splice(
        i,
        1
      );


      continue;

    }


    // Eliminar moneda fuera de pantalla

    if (
      moneda.y >
      canvas.height + 40
    ) {

      monedasObjetos.splice(
        i,
        1
      );

    }

  }

}


// =========================================================
// ACTUALIZAR OBSTÁCULOS
// =========================================================

function actualizarObstaculos() {

  for (
    let i =
      obstaculos.length - 1;

    i >= 0;

    i--
  ) {

    const obstaculo =
      obstaculos[i];


    obstaculo.y +=
      obstaculo.velocidad;


    dibujarObstaculo(
      obstaculo
    );


    // Colisión

    if (
      hayColision(
        jugador,
        obstaculo
      )
    ) {

      terminarJuego();

      return;

    }


    // Eliminar obstáculo

    if (
      obstaculo.y >
      canvas.height + 50
    ) {

      obstaculos.splice(
        i,
        1
      );

    }

  }

}


// =========================================================
// SISTEMA DE NIVELES
// =========================================================

function comprobarNivel() {

  const nuevoNivel =
    Math.floor(
      monedas / 100
    ) + 1;


  if (
    nuevoNivel > nivel
  ) {

    nivel =
      nuevoNivel;


    velocidad +=
      0.5;


    nivelTexto.textContent =
      nivel;


    // Sonido de nivel

    reproducirSonido(
      sonidoNivel
    );

  }

}


// =========================================================
// GENERAR OBJETOS
// =========================================================

function generarObjetos() {

  tiempo++;


  // Generar monedas

  if (
    tiempo %
      Math.max(
        35,
        75 - nivel * 3
      ) === 0
  ) {

    crearMoneda();

  }


  // Generar obstáculos

  if (
    tiempo %
      Math.max(
        55,
        110 - nivel * 4
      ) === 0
  ) {

    crearObstaculo();

  }

}


// =========================================================
// TERMINAR JUEGO
// =========================================================

function terminarJuego() {

  juegoActivo = false;


  // Detener música

  musica.pause();


  // Sonido de choque

  reproducirSonido(
    sonidoChoque
  );


  // Guardar récord

  if (
    monedas > record
  ) {

    record =
      monedas;


    localStorage.setItem(

      "nexataCoinRushRecord",

      record

    );

  }


  recordTexto.textContent =
    record;


  monedasFinales.textContent =
    monedas;


  recordFinal.textContent =
    record;


  pantallaGameOver.classList.remove(
    "oculto"
  );

}


// =========================================================
// INICIAR JUEGO
// =========================================================

function iniciarJuego() {

  monedas = 0;

  nivel = 1;

  velocidad = 3;

  tiempo = 0;


  monedasObjetos = [];

  obstaculos = [];


  jugador.x =
    canvas.width / 2 -
    jugador.ancho / 2;


  jugador.movimientoIzquierda =
    false;

  jugador.movimientoDerecha =
    false;


  monedasTexto.textContent =
    "0";


  nivelTexto.textContent =
    "1";


  pantallaInicio.classList.add(
    "oculto"
  );


  pantallaGameOver.classList.add(
    "oculto"
  );


  juegoActivo = true;


  // Iniciar música

  musica.currentTime = 0;

  musica.play().catch(() => {});

}


// =========================================================
// BUCLE PRINCIPAL
// =========================================================

function juego() {

  dibujarFondo();


  actualizarEstrellas();


  if (juegoActivo) {

    actualizarJugador();

    generarObjetos();

    actualizarMonedas();

    actualizarObstaculos();

  } else {

    monedasObjetos.forEach(
      dibujarMoneda
    );

    obstaculos.forEach(
      dibujarObstaculo
    );

  }


  dibujarJugador();


  requestAnimationFrame(
    juego
  );

}


// =========================================================
// TECLADO
// =========================================================

document.addEventListener(
  "keydown",
  function(event) {

    if (
      event.key === "ArrowLeft" ||
      event.key.toLowerCase() === "a"
    ) {

      jugador.movimientoIzquierda =
        true;

    }


    if (
      event.key === "ArrowRight" ||
      event.key.toLowerCase() === "d"
    ) {

      jugador.movimientoDerecha =
        true;

    }

  }
);


document.addEventListener(
  "keyup",
  function(event) {

    if (
      event.key === "ArrowLeft" ||
      event.key.toLowerCase() === "a"
    ) {

      jugador.movimientoIzquierda =
        false;

    }


    if (
      event.key === "ArrowRight" ||
      event.key.toLowerCase() === "d"
    ) {

      jugador.movimientoDerecha =
        false;

    }

  }
);


// =========================================================
// CONTROLES TÁCTILES
// =========================================================

function activarIzquierda(event) {

  event.preventDefault();

  jugador.movimientoIzquierda =
    true;

}


function desactivarIzquierda(event) {

  event.preventDefault();

  jugador.movimientoIzquierda =
    false;

}


function activarDerecha(event) {

  event.preventDefault();

  jugador.movimientoDerecha =
    true;

}


function desactivarDerecha(event) {

  event.preventDefault();

  jugador.movimientoDerecha =
    false;

}


// Botón izquierda

botonIzquierda.addEventListener(
  "touchstart",
  activarIzquierda
);

botonIzquierda.addEventListener(
  "touchend",
  desactivarIzquierda
);

botonIzquierda.addEventListener(
  "touchcancel",
  desactivarIzquierda
);


// Botón derecha

botonDerecha.addEventListener(
  "touchstart",
  activarDerecha
);

botonDerecha.addEventListener(
  "touchend",
  desactivarDerecha
);

botonDerecha.addEventListener(
  "touchcancel",
  desactivarDerecha
);


// =========================================================
// BOTONES
// =========================================================

botonIniciar.addEventListener(
  "click",
  iniciarJuego
);


botonReiniciar.addEventListener(
  "click",
  iniciarJuego
);


// =========================================================
// INICIAR JUEGO
// =========================================================

juego();