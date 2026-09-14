// =========================================================
// AVISO DE COOKIES - NEXATA INSIGHT MEDIA STUDIO
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
