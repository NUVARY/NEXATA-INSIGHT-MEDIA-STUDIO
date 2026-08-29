fetch('/COMPONENTES/header-global.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header-global').innerHTML = data;
  });