/* =========================================================
   NEXATA RUNNER
========================================================= */


/* =========================================================
   ELEMENTOS HTML
========================================================= */

const canvas =
  document.getElementById("canvas");

const ctx =
  canvas.getContext("2d");


const inicio =
  document.getElementById("inicio");


const gameOver =
  document.getElementById("gameOver");


const btnJugar =
  document.getElementById("btnJugar");


const btnReintentar =
  document.getElementById("btnReintentar");


const btnSaltar =
  document.getElementById("btnSaltar");


const btnSonido =
  document.getElementById("btnSonido");


const puntosTexto =
  document.getElementById("puntos");


const recordTexto =
  document.getElementById("record");


const puntuacionFinal =
  document.getElementById("puntuacionFinal");


const mensajeRecord =
  document.getElementById("mensajeRecord");



/* =========================================================
   SONIDOS
========================================================= */

const sonidoSalto =
  new Audio("sonidos/salto.mp3");


const sonidoChoque =
  new Audio("sonidos/choque.mp3");


const sonidoPunto =
  new Audio("sonidos/punto.mp3");


const musica =
  new Audio("sonidos/musica.mp3");


musica.loop = true;

musica.volume = 1.0;

sonidoSalto.volume = 1.0;

sonidoChoque.volume = 1.0;

sonidoPunto.volume = 1.0;



/* =========================================================
   ESTADO DEL SONIDO
========================================================= */

let sonidoActivado = true;



/* =========================================================
   REPRODUCIR SONIDO
========================================================= */

function reproducirSonido(sonido) {

  if (!sonidoActivado) {

    return;

  }


  sonido.currentTime = 0;


  sonido.play().catch(() => {});

}



/* =========================================================
   CONTROL DE SONIDO
========================================================= */

function actualizarSonido() {

  if (sonidoActivado) {

    btnSonido.textContent = "🔊";

    musica.muted = false;

    sonidoSalto.muted = false;

    sonidoChoque.muted = false;

    sonidoPunto.muted = false;

  }

  else {

    btnSonido.textContent = "🔇";

    musica.muted = true;

    sonidoSalto.muted = true;

    sonidoChoque.muted = true;

    sonidoPunto.muted = true;

  }

}



/* =========================================================
   BOTÓN DE SONIDO
========================================================= */

btnSonido.addEventListener(
  "click",
  function() {

    sonidoActivado =
      !sonidoActivado;


    actualizarSonido();

  }
);



/* =========================================================
   CONFIGURACIÓN
========================================================= */

let ancho;

let alto;

let jugando = false;

let puntos = 0;

let velocidad = 6;

let gravedad = 0.7;

let fuerzaSalto = -13;

let ultimoTiempo = 0;

let tiempoObstaculo = 0;

let intervaloObstaculo = 1000;

let obstaculos = [];

let estrellas = [];

let acumuladorPuntos = 0;


/* =========================================================
   NIVELES
========================================================= */

let nivelAlcanzado = 0;



/* =========================================================
   RÉCORD
========================================================= */

let record =
  Number(
    localStorage.getItem(
      "nexataRunnerRecord"
    )
  ) || 0;


recordTexto.textContent =
  record;



/* =========================================================
   JUGADOR
========================================================= */

const jugador = {

  x: 80,

  y: 0,

  ancho: 42,

  alto: 42,

  velocidadY: 0,

  enSuelo: false

};



/* =========================================================
   AJUSTAR CANVAS
========================================================= */

function ajustarCanvas() {

  const rect =
    canvas.getBoundingClientRect();


  canvas.width =
    rect.width;


  canvas.height =
    rect.height;


  ancho =
    canvas.width;


  alto =
    canvas.height;


  jugador.y =
    alto - 55 - jugador.alto;

}


window.addEventListener(
  "resize",
  ajustarCanvas
);


ajustarCanvas();



/* =========================================================
   CREAR ESTRELLAS
========================================================= */

function crearEstrellas() {

  estrellas = [];


  for (
    let i = 0;
    i < 80;
    i++
  ) {

    estrellas.push({

      x:
        Math.random() * ancho,

      y:
        Math.random() *
        alto *
        0.75,

      tamaño:
        Math.random() * 2 + 0.5,

      velocidad:
        Math.random() *
        0.8 +
        0.2

    });

  }

}


crearEstrellas();



/* =========================================================
   DIBUJAR FONDO
========================================================= */

function dibujarFondo() {

  ctx.fillStyle =
    "#030b1d";


  ctx.fillRect(
    0,
    0,
    ancho,
    alto
  );



  /* ESTRELLAS */

  for (
    const estrella
    of estrellas
  ) {

    estrella.x -=
      estrella.velocidad;


    if (
      estrella.x < 0
    ) {

      estrella.x =
        ancho;

    }


    ctx.fillStyle =
      "rgba(130,180,255,0.8)";


    ctx.fillRect(

      estrella.x,

      estrella.y,

      estrella.tamaño,

      estrella.tamaño

    );

  }



  /* LÍNEAS FUTURISTAS */

  ctx.strokeStyle =
    "rgba(50,120,220,0.12)";


  ctx.lineWidth = 1;


  for (
    let y = alto - 90;
    y < alto;
    y += 30
  ) {

    ctx.beginPath();


    ctx.moveTo(
      0,
      y
    );


    ctx.lineTo(
      ancho,
      y
    );


    ctx.stroke();

  }



  /* SUELO */

  ctx.fillStyle =
    "#061733";


  ctx.fillRect(

    0,

    alto - 55,

    ancho,

    55

  );


  ctx.strokeStyle =
    "#1675d1";


  ctx.beginPath();


  ctx.moveTo(
    0,
    alto - 55
  );


  ctx.lineTo(
    ancho,
    alto - 55
  );


  ctx.stroke();

}



/* =========================================================
   DIBUJAR JUGADOR
========================================================= */

function dibujarJugador() {

  const x =
    jugador.x;


  const y =
    jugador.y;



  /* BRILLO */

  ctx.shadowBlur =
    18;


  ctx.shadowColor =
    "#178cff";



  /* CUERPO */

  ctx.fillStyle =
    "#dcecff";


  ctx.beginPath();


  ctx.moveTo(
    x + 5,
    y + 30
  );


  ctx.lineTo(
    x + 5,
    y + 15
  );


  ctx.lineTo(
    x + 27,
    y + 5
  );


  ctx.lineTo(
    x + 40,
    y + 21
  );


  ctx.lineTo(
    x + 27,
    y + 37
  );


  ctx.closePath();


  ctx.fill();



  /* VENTANA */

  ctx.shadowBlur =
    0;


  ctx.fillStyle =
    "#1268d8";


  ctx.beginPath();


  ctx.arc(

    x + 27,

    y + 20,

    6,

    0,

    Math.PI * 2

  );


  ctx.fill();



  /* FUEGO */

  ctx.fillStyle =
    "#ff9d32";


  ctx.beginPath();


  ctx.moveTo(
    x + 5,
    y + 20
  );


  ctx.lineTo(
    x - 7,
    y + 27
  );


  ctx.lineTo(
    x + 5,
    y + 30
  );


  ctx.closePath();


  ctx.fill();

}



/* =========================================================
   SALTO
========================================================= */

function saltar() {

  if (!jugando) {

    return;

  }


  if (jugador.enSuelo) {

    jugador.velocidadY =
      fuerzaSalto;


    jugador.enSuelo =
      false;


    reproducirSonido(
      sonidoSalto
    );

  }

}



/* =========================================================
   CREAR OBSTÁCULO
========================================================= */

function crearObstaculo() {

  const altura =
    Math.random() *
    35 +
    30;


  const anchoObstaculo =
    Math.random() *
    20 +
    25;


  obstaculos.push({

    x:
      ancho + 20,

    y:
      alto -
      55 -
      altura,

    ancho:
      anchoObstaculo,

    alto:
      altura

  });

}



/* =========================================================
   DIBUJAR OBSTÁCULOS
========================================================= */

function dibujarObstaculos() {

  for (
    const obstaculo
    of obstaculos
  ) {

    ctx.shadowBlur =
      12;


    ctx.shadowColor =
      "#ff315d";


    ctx.fillStyle =
      "#d9254d";


    ctx.fillRect(

      obstaculo.x,

      obstaculo.y,

      obstaculo.ancho,

      obstaculo.alto

    );


    ctx.shadowBlur =
      0;


    ctx.strokeStyle =
      "#ff7690";


    ctx.strokeRect(

      obstaculo.x,

      obstaculo.y,

      obstaculo.ancho,

      obstaculo.alto

    );

  }

}



/* =========================================================
   ACTUALIZAR JUGADOR
========================================================= */

function actualizarJugador() {

  jugador.velocidadY +=
    gravedad;


  jugador.y +=
    jugador.velocidadY;


  const suelo =
    alto -
    55 -
    jugador.alto;


  if (
    jugador.y >= suelo
  ) {

    jugador.y =
      suelo;


    jugador.velocidadY =
      0;


    jugador.enSuelo =
      true;

  }

}



/* =========================================================
   ACTUALIZAR OBSTÁCULOS
========================================================= */

function actualizarObstaculos(delta) {

  tiempoObstaculo +=
    delta;


  if (
    tiempoObstaculo >
    intervaloObstaculo
  ) {

    crearObstaculo();


    tiempoObstaculo =
      0;


    intervaloObstaculo =
      Math.max(

        550,

        1100 -
        puntos * 2

      );

  }



  for (
    const obstaculo
    of obstaculos
  ) {

    obstaculo.x -=
      velocidad;

  }



  obstaculos =
    obstaculos.filter(

      obstaculo =>

        obstaculo.x +
        obstaculo.ancho >
        0

    );

}



/* =========================================================
   COLISIONES
========================================================= */

function comprobarColisiones() {

  const margen = 7;


  for (
    const obstaculo
    of obstaculos
  ) {

    if (

      jugador.x +
      jugador.ancho -
      margen >

      obstaculo.x &&


      jugador.x +
      margen <

      obstaculo.x +
      obstaculo.ancho &&


      jugador.y +
      jugador.alto -
      margen >

      obstaculo.y &&


      jugador.y +
      margen <

      obstaculo.y +
      obstaculo.alto

    ) {

      terminarJuego();


      return;

    }

  }

}



/* =========================================================
   MOSTRAR NIVEL
========================================================= */

function mostrarNivel(mensaje) {

  const aviso =
    document.createElement("div");


  aviso.className =
    "aviso-nivel";


  aviso.textContent =
    mensaje;


  document.body.appendChild(
    aviso
  );


  setTimeout(
    function() {

      aviso.classList.add(
        "mostrar"
      );

    },
    50
  );


  setTimeout(
    function() {

      aviso.classList.remove(
        "mostrar"
      );


      setTimeout(
        function() {

          aviso.remove();

        },
        500
      );

    },
    3000
  );

}



/* =========================================================
   COMPROBAR NIVEL
========================================================= */

function comprobarNivel() {

  if (
    puntos >= 5000 &&
    nivelAlcanzado < 3
  ) {

    nivelAlcanzado = 3;


    mostrarNivel(
      "👑 ¡MAESTRO NEXATA!"
    );

  }

  else if (
    puntos >= 2000 &&
    nivelAlcanzado < 2
  ) {

    nivelAlcanzado = 2;


    mostrarNivel(
      "🔥 ¡NIVEL ÉLITE!"
    );

  }

  else if (
    puntos >= 1000 &&
    nivelAlcanzado < 1
  ) {

    nivelAlcanzado = 1;


    mostrarNivel(
      "🏆 ¡NIVEL PROFESIONAL!"
    );

  }

}



/* =========================================================
   ACTUALIZAR PUNTOS
========================================================= */

function actualizarPuntos(delta) {

  acumuladorPuntos +=
    delta;


  if (
    acumuladorPuntos >= 100
  ) {

    puntos++;


    acumuladorPuntos =
      0;


    puntosTexto.textContent =
      puntos;



    /* COMPROBAR NIVEL */

    comprobarNivel();



    /* SONIDO CADA 100 PUNTOS */

    if (
      puntos % 100 === 0
    ) {

      reproducirSonido(
        sonidoPunto
      );

    }



    /* AUMENTAR VELOCIDAD */

    if (
      puntos % 10 === 0
    ) {

      velocidad +=
        0.5;

    }

  }

}



/* =========================================================
   BUCLE PRINCIPAL
========================================================= */

function juegoLoop(tiempo) {

  if (!jugando) {

    return;

  }


  const delta =
    Math.min(

      tiempo -
      ultimoTiempo,

      50

    );


  ultimoTiempo =
    tiempo;



  dibujarFondo();


  actualizarJugador();


  actualizarObstaculos(
    delta
  );


  actualizarPuntos(
    delta
  );


  comprobarColisiones();


  dibujarObstaculos();


  dibujarJugador();



  requestAnimationFrame(
    juegoLoop
  );

}



/* =========================================================
   INICIAR JUEGO
========================================================= */

function iniciarJuego() {

  inicio.classList.add(
    "oculto"
  );


  gameOver.classList.add(
    "oculto"
  );


  puntos = 0;


  nivelAlcanzado = 0;


  velocidad = 6;


  intervaloObstaculo =
    1000;


  tiempoObstaculo =
    0;


  acumuladorPuntos =
    0;


  obstaculos = [];


  puntosTexto.textContent =
    "0";


  jugador.x =
    80;


  jugador.y =
    alto -
    55 -
    jugador.alto;


  jugador.velocidadY =
    0;


  jugador.enSuelo =
    true;


  jugando = true;


  /* MÚSICA */

  if (sonidoActivado) {

    musica.currentTime =
      0;


    musica.play().catch(
      () => {}
    );

  }


  ultimoTiempo =
    performance.now();


  requestAnimationFrame(
    juegoLoop
  );

}



/* =========================================================
   GAME OVER
========================================================= */

function terminarJuego() {

  jugando = false;


  puntuacionFinal.textContent =
    puntos;



  /* SONIDO DE CHOQUE */

  reproducirSonido(
    sonidoChoque
  );



  /* DETENER MÚSICA */

  musica.pause();



  /* NUEVO RÉCORD */

  if (
    puntos > record
  ) {

    record =
      puntos;


    localStorage.setItem(

      "nexataRunnerRecord",

      record

    );


    recordTexto.textContent =
      record;


    mensajeRecord.textContent =
      "🏆 ¡NUEVO RÉCORD!";

  }

  else {

    mensajeRecord.textContent =
      "Tu récord es: " +
      record;

  }



  gameOver.classList.remove(
    "oculto"
  );

}



/* =========================================================
   TECLADO
========================================================= */

document.addEventListener(

  "keydown",

  function(event) {

    if (

      event.code ===
      "Space" ||

      event.code ===
      "ArrowUp"

    ) {

      event.preventDefault();


      saltar();

    }

  }

);



/* =========================================================
   CONTROL TÁCTIL
========================================================= */

btnSaltar.addEventListener(

  "touchstart",

  function(event) {

    event.preventDefault();


    saltar();

  },

  {
    passive: false
  }

);



canvas.addEventListener(

  "touchstart",

  function(event) {

    event.preventDefault();


    saltar();

  },

  {
    passive: false
  }

);



/* =========================================================
   BOTONES
========================================================= */

btnJugar.addEventListener(

  "click",

  iniciarJuego

);


btnReintentar.addEventListener(

  "click",

  iniciarJuego

);



/* =========================================================
   ESTADO INICIAL DEL SONIDO
========================================================= */

actualizarSonido();