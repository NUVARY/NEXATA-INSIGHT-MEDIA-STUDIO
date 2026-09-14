// =========================================================
// FOOTER GLOBAL - NEXATA INSIGHT MEDIA STUDIO
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // ESTILOS DEL FOOTER
  // =========================

  const estilos = document.createElement("style");

  estilos.textContent = `

    #footer-global{
      width:100%;
      margin-top:40px;
      background:#000000;
      color:#ffffff;
      box-sizing:border-box;
    }

    .footer-contenido{
      max-width:1100px;
      margin:auto;
      padding:30px 20px 20px;
      text-align:center;
    }

    .footer-titulo{
      font-size:18px;
      font-weight:bold;
      letter-spacing:1px;
      margin-bottom:18px;
    }

    .footer-enlaces{
      display:flex;
      justify-content:center;
      align-items:center;
      flex-wrap:wrap;
      gap:10px;
    }

    .footer-enlaces a{
      color:#ffffff;
      font-size:14px;
      text-decoration:none;
      transition:opacity .2s ease;
    }

    .footer-enlaces a:hover{
      opacity:.65;
    }

    .footer-separador{
      color:#555555;
      font-size:14px;
    }

    .footer-copy{
      margin-top:20px;
      padding-top:15px;
      border-top:1px solid #222222;
      color:#888888;
      font-size:12px;
    }

    @media (max-width:600px){

      .footer-contenido{
        padding:25px 15px 18px;
      }

      .footer-titulo{
        font-size:16px;
      }

      .footer-enlaces{
        flex-direction:column;
        gap:8px;
      }

      .footer-separador{
        display:none;
      }

      .footer-copy{
        font-size:11px;
      }

    }

  `;

  document.head.appendChild(estilos);


  // =========================
  // CREAR FOOTER
  // =========================

  const footer = document.createElement("footer");

  footer.id = "footer-global";

  footer.innerHTML = `

    <div class="footer-contenido">

      <div class="footer-titulo">
        NEXATA INSIGHT MEDIA STUDIO
      </div>

      <nav class="footer-enlaces">

        <a href="/html/Politica%20de%20privacidad.html">
          Política de privacidad
        </a>

        <span class="footer-separador">|</span>

        <a href="/html/Informacion.html">
          Información
        </a>

        <span class="footer-separador">|</span>

        <a
          href="https://whatsapp.com/channel/0029VbBhlOaEKyZ7x7xpn12m"
          target="_blank"
          rel="noopener noreferrer"
        >
          Canal de WhatsApp
        </a>

      </nav>

      <div class="footer-copy">
        © ${new Date().getFullYear()} NEXATA INSIGHT MEDIA STUDIO
      </div>

    </div>

  `;


  // =========================
  // INSERTAR FOOTER
  // =========================

  document.body.appendChild(footer);

});
