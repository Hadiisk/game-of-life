// Conway's Game of Life
// A zero-player cellular automaton. Each cell lives or dies based on its
// eight neighbours according to four simple rules.

const CELL = 10; // pixel size of each cell
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const COLS = Math.floor(canvas.width / CELL);
const ROWS = Math.floor(canvas.height / CELL);

const COLORS = {
  bg: "#0d1117",
  grid: "#161b22",
  cell: "#2ea043",
};

let grid = createGrid();
let generation = 0;
let running = false;
let fps = 12;
let lastFrame = 0;
let rafId = null;

function createGrid() {
  return Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
}

function randomize() {
  grid = grid.map((row) => row.map(() => (Math.random() > 0.7 ? 1 : 0)));
  generation = 0;
  draw();
  updateGenLabel();
}

// Count the live neighbours of a cell, treating the board edges as dead space.
function liveNeighbours(r, c) {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
        count += grid[nr][nc];
      }
    }
  }
  return count;
}

// Apply the rules to produce the next generation.
function step() {
  const next = createGrid();
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const n = liveNeighbours(r, c);
      if (grid[r][c] === 1) {
        next[r][c] = n === 2 || n === 3 ? 1 : 0;
      } else {
        next[r][c] = n === 3 ? 1 : 0;
      }
    }
  }
  grid = next;
  generation++;
  draw();
  updateGenLabel();
}

function draw() {
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c]) {
        ctx.fillStyle = COLORS.cell;
        ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 1, CELL - 1);
      }
    }
  }
}

function updateGenLabel() {
  document.getElementById("genCount").textContent = `Generation: ${generation}`;
}

function loop(timestamp) {
  if (!running) return;
  if (timestamp - lastFrame >= 1000 / fps) {
    step();
    lastFrame = timestamp;
  }
  rafId = requestAnimationFrame(loop);
}

function toggleRunning() {
  running = !running;
  document.getElementById("startStop").textContent = running ? "Stop" : "Start";
  if (running) {
    lastFrame = performance.now();
    rafId = requestAnimationFrame(loop);
  } else if (rafId) {
    cancelAnimationFrame(rafId);
  }
}

// --- Mouse painting -------------------------------------------------------
let painting = false;

function cellFromEvent(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;
  return { r: Math.floor(y / CELL), c: Math.floor(x / CELL) };
}

canvas.addEventListener("mousedown", (e) => {
  painting = true;
  const { r, c } = cellFromEvent(e);
  if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
    grid[r][c] = grid[r][c] ? 0 : 1;
    draw();
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!painting) return;
  const { r, c } = cellFromEvent(e);
  if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
    grid[r][c] = 1;
    draw();
  }
});

window.addEventListener("mouseup", () => (painting = false));

// --- Controls -------------------------------------------------------------
document.getElementById("startStop").addEventListener("click", toggleRunning);
document.getElementById("step").addEventListener("click", () => {
  if (!running) step();
});
document.getElementById("randomize").addEventListener("click", randomize);
document.getElementById("clear").addEventListener("click", () => {
  grid = createGrid();
  generation = 0;
  draw();
  updateGenLabel();
});
document.getElementById("speed").addEventListener("input", (e) => {
  fps = Number(e.target.value);
});

randomize();
