// =========================================================
// AVISO DE COOKIES - NEXATA INSIGHT MEDIA STUDIO
// HTML + CSS CONTROLADOS DESDE JAVASCRIPT
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

  // ---------------------------------------------------------
  // COMPROBAR SI EL VISITANTE YA TOMÓ UNA DECISIÓN
  // ---------------------------------------------------------

  const decisionCookies =
    localStorage.getItem("nexataCookies");

  if (decisionCookies) {
    return;
  }


  // ---------------------------------------------------------
  // CREAR ESTILOS DEL AVISO
  // ---------------------------------------------------------

  const estilos = document.createElement("style");

  estilos.textContent = `

    /* ===================================
          AVISO DE COOKIES
          NEXATA INSIGHT MEDIA STUDIO
    =================================== */

    #avisoCookies{

      position:fixed;

      left:20px;
      right:20px;
      bottom:20px;

      z-index:99999;

      box-sizing:border-box;

      padding:20px 24px;

      background:linear-gradient(
        135deg,
        #031A3D,
        #07122F
      );

      border:1px solid rgba(255,255,255,.14);

      border-radius:16px;

      box-shadow:
        0 10px 35px rgba(0,0,0,.35),
        0 0 0 1px rgba(37,99,235,.08);

      animation:entradaCookies .35s ease;

    }


    /* ===================================
          CONTENIDO
    =================================== */

    .cookies-contenido{

      max-width:1100px;

      margin:auto;

      display:flex;

      align-items:center;

      justify-content:space-between;

      gap:30px;

    }


    /* ===================================
          TEXTO
    =================================== */

    .cookies-texto{

      flex:1;

    }


    .cookies-titulo{

      display:flex;

      align-items:center;

      gap:8px;

      color:#ffffff;

      font-size:18px;

      font-weight:bold;

      margin-bottom:7px;

    }


    .cookies-texto p{

      color:#d9e2f2;

      font-size:14px;

      margin:0 0 7px 0;

      line-height:1.5;

    }


    /* ===================================
          POLÍTICA DE PRIVACIDAD
    =================================== */

    .cookies-privacidad{

      color:#7db4ff;

      font-size:13px;

      text-decoration:none;

    }


    .cookies-privacidad:hover{

      color:#ffffff;

      text-decoration:underline;

    }


    /* ===================================
          BOTONES
    =================================== */

    .cookies-botones{

      display:flex;

      align-items:center;

      gap:10px;

      flex-shrink:0;

    }


    .cookies-botones button{

      border:none;

      min-width:100px;

      padding:10px 18px;

      border-radius:8px;

      font-size:14px;

      font-weight:bold;

      cursor:pointer;

      transition:
        transform .2s ease,
        opacity .2s ease,
        background .2s ease;

    }


    .cookies-botones button:hover{

      transform:translateY(-1px);

    }


    /* ===================================
          BOTÓN RECHAZAR
    =================================== */

    .cookies-rechazar{

      background:transparent;

      color:#ffffff;

      border:1px solid rgba(255,255,255,.35) !important;

    }


    .cookies-rechazar:hover{

      background:rgba(255,255,255,.08);

    }


    /* ===================================
          BOTÓN ACEPTAR
    =================================== */

    .cookies-aceptar{

      background:#ffffff;

      color:#031A3D;

    }


    .cookies-aceptar:hover{

      opacity:.88;

    }


    /* ===================================
          ANIMACIÓN
    =================================== */

    @keyframes entradaCookies{

      from{

        opacity:0;

        transform:translateY(20px);

      }

      to{

        opacity:1;

        transform:translateY(0);

      }

    }


    /* ===================================
          MÓVIL
    =================================== */

    @media (max-width:700px){

      #avisoCookies{

        left:10px;

        right:10px;

        bottom:10px;

        padding:18px;

        border-radius:14px;

      }


      .cookies-contenido{

        flex-direction:column;

        align-items:stretch;

        gap:15px;

      }


      .cookies-titulo{

        font-size:17px;

      }


      .cookies-texto p{

        font-size:13px;

      }


      .cookies-botones{

        width:100%;

      }


      .cookies-botones button{

        flex:1;

        min-width:0;

        padding:11px 8px;

      }

    }

  `;


  // ---------------------------------------------------------
  // AGREGAR ESTILOS AL DOCUMENTO
  // ---------------------------------------------------------

  document.head.appendChild(estilos);


  // ---------------------------------------------------------
  // CREAR AVISO
  // ---------------------------------------------------------

  const aviso = document.createElement("div");

  aviso.id = "avisoCookies";


  aviso.innerHTML = `

    <div class="cookies-contenido">

      <div class="cookies-texto">

        <div class="cookies-titulo">
          🍪 Usamos cookies
        </div>

        <p>
          Utilizamos cookies y tecnologías similares para
          mejorar tu experiencia de navegación.
        </p>

        <a
          href="https://nexata.site/html/Politica%20de%20privacidad.html"
          class="cookies-privacidad"
        >
          Política de privacidad
        </a>

      </div>


      <div class="cookies-botones">

        <button
          id="rechazarCookies"
          class="cookies-rechazar"
        >
          Rechazar
        </button>


        <button
          id="aceptarCookies"
          class="cookies-aceptar"
        >
          Aceptar
        </button>

      </div>

    </div>

  `;


  // ---------------------------------------------------------
  // AGREGAR AVISO A LA PÁGINA
  // ---------------------------------------------------------

  document.body.appendChild(aviso);


  // ---------------------------------------------------------
  // BOTÓN ACEPTAR
  // ---------------------------------------------------------

  document
    .getElementById("aceptarCookies")
    .addEventListener("click", () => {

      localStorage.setItem(
        "nexataCookies",
        "aceptadas"
      );

      aviso.remove();

    });


  // ---------------------------------------------------------
  // BOTÓN RECHAZAR
  // ---------------------------------------------------------

  document
    .getElementById("rechazarCookies")
    .addEventListener("click", () => {

      localStorage.setItem(
        "nexataCookies",
        "rechazadas"
      );

      aviso.remove();

    });

});
