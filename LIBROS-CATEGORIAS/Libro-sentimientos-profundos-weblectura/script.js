/* SCRIPT FINAL */

let current = 0;
const totalPages = 3;
let zoom = 1;
let lupaActive = false;
let magnify = 2.3;

const wrapper = document.getElementById("wrapper");
const lupa = document.getElementById("lupa");
const lupaInner = document.getElementById("lupaInner");

/* PAGINADO */
function showPage(n){
    for(let i=0;i<totalPages;i++){
        document.getElementById("page"+i).classList.remove("active");
    }
    document.getElementById("page"+n).classList.add("active");
    if(lupaActive) updateLupaContent();
}

function playSound() {
    const sound = document.getElementById("flipSound");
    sound.currentTime = 0; 
    sound.play();
}

function next() { 
    if(current < totalPages-1) {
        current++; 
        playSound();
    }
    showPage(current); 
}
function prev() { 
    if(current > 0) {
        current--; 
        playSound();
    }
    showPage(current); 
}


/* ZOOM SOBRE EL LIBRO + CONTROLES */
function zoomIn(){
    zoom += 0.12;
    wrapper.style.transform = "scale(" + zoom + ")";
}
function zoomOut(){
    zoom -= 0.12;
    if(zoom < 0.6) zoom = 0.6;
    wrapper.style.transform = "scale(" + zoom + ")";
}

/* REDIRECCIÓN EXTERNA */
function goToLink(){ window.open("../descargas.html","_blank"); }
function goHome() {window.location.href = "../index.html"; }// o "/" si es la página principal

/* ---- LUPA DE TEXTO ---- */
function toggleLupa(){
    lupaActive = !lupaActive;
    if(lupaActive){
        updateLupaContent();
        lupa.style.display = "block";
    } else {
        lupa.style.display = "none";
    }
}

/* Copia el contenido de la página activa en la lupa */
function updateLupaContent(){
    const active = document.querySelector(".page.active .page-content");
    if(!active) return;

    lupaInner.innerHTML = "";
    const clone = active.cloneNode(true);
    lupaInner.appendChild(clone);
    lupaInner.style.transform = "scale(" + magnify + ")";
}

/* Movimiento de la lupa */
document.addEventListener("mousemove", e=>{
    if(!lupaActive) return;

    const rect = document.querySelector(".page.active .page-content").getBoundingClientRect();
    let relX = e.clientX - rect.left;
    let relY = e.clientY - rect.top;

    lupa.style.left = (e.clientX - lupa.offsetWidth/2) + "px";
    lupa.style.top  = (e.clientY - lupa.offsetHeight/2) + "px";

    lupaInner.style.left = -(relX * magnify - lupa.offsetWidth/2)+"px";
    lupaInner.style.top  = -(relY * magnify - lupa.offsetHeight/2)+"px";
});












