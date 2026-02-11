const canvas = document.getElementById("juego");
const ctx = canvas.getContext("2d");
const botonReintentar = document.getElementById("reintentar");

const botonInicio = document.getElementById("inicio");
const pantallaInicio = document.getElementById("pantallaInicio");

// Imagen del avión PNG
const avionImg = new Image();
avionImg.src = "avion.png"; // el nombre exacto del archivo

/* Variables del juego */
let puntuacion = 0;
let gameOver = false;
let juegoIniciado = false;

/* Avión */
const avion = {
  x: 50,
  y: 0,
  width: 100,
  height: 100,
  dx: 8
};

/* Disparos */
const disparos = [];

/* Meteoritos */
const meteoritos = [];

/* Fondo con estrellas */
let estrellas = [];

/* Ajustar canvas */
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  avion.y = canvas.height - avion.height - 10;

  estrellas = [];
  for (let i = 0; i < 80; i++) {
    estrellas.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2
    });
  }
}

window.addEventListener("resize", resizeCanvas);

/* Generar meteoritos */
function generarMeteoritos() {
  if (meteoritos.length < 5) {
    meteoritos.push({
      x: Math.random() * (canvas.width - 60),
      y: -60,
      width: 60,
      height: 60,
      dy: 2 + Math.random()
    });
  }
}

/* Botones táctiles */
let movIzq = false;
let movDer = false;

document.getElementById("izq").addEventListener("touchstart", () => movIzq = true);
document.getElementById("izq").addEventListener("touchend", () => movIzq = false);

document.getElementById("der").addEventListener("touchstart", () => movDer = true);
document.getElementById("der").addEventListener("touchend", () => movDer = false);

/* Disparo automático */
setInterval(() => {
  if (!gameOver) {
    disparos.push({
      x: avion.x + avion.width / 2 - 15,
      y: avion.y,
      width: 30,
      height: 30,
      dy: 8
    });
  }
}, 400);

/* Dibujar fondo */
function dibujarFondo() {
  ctx.fillStyle = "white";

  estrellas.forEach(e => {
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function dibujarAvion() {
  ctx.drawImage(avionImg, avion.x, avion.y, avion.width, avion.height);
}

/* Dibujar disparos */
function dibujarDisparos() {
  ctx.font = `${canvas.width * 0.05}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  disparos.forEach(d => {
    ctx.fillText("❤️", d.x + d.width / 2, d.y + d.height / 2);
  });
}

/* Dibujar meteoritos */
function dibujarMeteoritos() {
  ctx.font = `${canvas.width * 0.07}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  meteoritos.forEach(m => {
    ctx.fillText("☄️", m.x + m.width / 2, m.y + m.height / 2);
  });
}

/* Dibujar puntuación */
function dibujarPuntuacion() {
  ctx.fillStyle = "white";
  ctx.font = `${Math.floor(canvas.width * 0.05)}px Arial`;
  ctx.fillText("Puntos: " + puntuacion, 20, 50);
}

/* Actualizar juego */
function actualizar() {
  if (gameOver) return;
  if (!juegoIniciado) return;

  /* Movimiento avión */
  if (movIzq && avion.x > 0) avion.x -= avion.dx;
  if (movDer && avion.x + avion.width < canvas.width) avion.x += avion.dx;

  /* Movimiento disparos */
  for (let i = disparos.length - 1; i >= 0; i--) {
    disparos[i].y -= disparos[i].dy;
    if (disparos[i].y < -30) disparos.splice(i, 1);
  }

  /* Movimiento meteoritos */
  meteoritos.forEach(m => m.y += m.dy);

  /* Colisiones */
  for (let i = meteoritos.length - 1; i >= 0; i--) {
    for (let j = disparos.length - 1; j >= 0; j--) {

      if (
        disparos[j].x < meteoritos[i].x + meteoritos[i].width &&
        disparos[j].x + disparos[j].width > meteoritos[i].x &&
        disparos[j].y < meteoritos[i].y + meteoritos[i].height &&
        disparos[j].y + disparos[j].height > meteoritos[i].y
      ) {
        disparos.splice(j, 1);
        meteoritos.splice(i, 1);
        puntuacion++;

        if (puntuacion >= 15) finalizarJuego(true);
        break;
      }
    }
  }

  /* Meteoritos que pasan */
  meteoritos.forEach(m => {
    if (m.y > canvas.height) finalizarJuego(false);
  });

  generarMeteoritos();
}

/* Finalizar juego */
function finalizarJuego(gano) {
  gameOver = true;
  botonReintentar.style.display = "block";

  if (gano) {
    setTimeout(() => alert("🎉 ¡Ganaste! Puntos: " + puntuacion), 100);
  } else {
    setTimeout(() => alert("💥 Game Over. Puntos: " + puntuacion), 100);
  }
}

/* Reiniciar */
botonReintentar.addEventListener("click", () => {
  puntuacion = 0;
  gameOver = false;

  disparos.length = 0;
  meteoritos.length = 0;

  avion.x = canvas.width / 2 - avion.width / 2;

  botonReintentar.style.display = "none";

  loop();
});

/* Dibujar todo */
function dibujar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  dibujarFondo();
  dibujarAvion();
  dibujarDisparos();
  dibujarMeteoritos();
  dibujarPuntuacion();
}

/* Loop */
function loop() {
  actualizar();
  dibujar();

  if (!gameOver) requestAnimationFrame(loop);
}

botonInicio.addEventListener("click", () => {
  juegoIniciado = true;
  pantallaInicio.style.display = "none";
});

/* Inicializar */
resizeCanvas();

// Esperar a que cargue el PNG antes de iniciar
avionImg.onload = () => {
  loop();
};

