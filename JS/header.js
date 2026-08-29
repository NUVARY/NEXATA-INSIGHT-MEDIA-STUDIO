// ========================================
// HEADER GLOBAL
// ========================================

document.addEventListener("DOMContentLoaded", function () {

  const contenedor = document.getElementById("header-global");

  if (!contenedor) {
    console.error("No existe #header-global");
    return;
  }


  // ======================================
  // CARGAR HTML DEL HEADER
  // ======================================

  fetch("componentes/header-global.html")

    .then(response => {

      if (!response.ok) {

        throw new Error(
          "No se pudo cargar header-global.html"
        );

      }

      return response.text();

    })

    .then(data => {

      contenedor.innerHTML = data;


      // ==================================
      // CARGAR CSS DEL HEADER
      // ==================================

      if (!document.querySelector(
        'link[data-header-css]'
      )) {

        const css = document.createElement("link");

        css.rel = "stylesheet";

        css.href =
          "css/header-global.css";

        css.dataset.headerCss = "true";

        document.head.appendChild(css);

      }


      // ==================================
      // CARGAR FUENTE ORBITRON
      // ==================================

      if (!document.querySelector(
        'link[data-orbitron]'
      )) {

        const font = document.createElement("link");

        font.rel = "stylesheet";

        font.href =
          "https://fonts.googleapis.com/css2?family=Orbitron:wght@700;800;900&display=swap";

        font.dataset.orbitron = "true";

        document.head.appendChild(font);

      }

    })

    .catch(error => {

      console.error(
        "Error cargando Header Global:",
        error
      );

    });

});