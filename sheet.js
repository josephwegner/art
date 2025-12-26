// Simplex Noise Waves - p5.js version
// Original by Reinder Nijhoff 2020 - @reindernijhoff

const seed = 69;
const wrinkles = 7;
const frequency = 1.5;
const waveSize = 25;

const gridX = 1000;
const xDisplacement = 0.8;
const gridY = 120;
const fieldSize = 160;

let minHeights = [];

function setup() {
  createCanvas(800, 800);
  background(255); // White background
  noiseSeed(seed);
  noFill();
  stroke(0, 0, 0, 191); // 0.75 opacity (191/255)
  strokeWeight(0.5);

  // Initialize minHeights array
  for (let x = 0; x < gridX; x++) {
    minHeights[x] = 100;
  }

  // Set up coordinate system for drawing
  push();
  translate(width / 2, height / 2);
  const scaleFactor = width / fieldSize * 0.85;
  scale(scaleFactor);

  // Draw all waves
  for (let gy = 0; gy < gridY; gy++) { // gy = grid y index (wave number)
    beginShape();
    for (let gx = 0; gx < gridX; gx++) { // gx = grid x index (point along wave)
      // Base x,y coordinates in field space
      const x = gx * fieldSize / (gridX - 1) - fieldSize / 2;
      const y = (gridY - gy) / gridY * fieldSize - fieldSize / 2;

      // r = vertical ripple displacement from noise
      let r = waveSize * 0.2 * wrinkleNoise(x * frequency / fieldSize, y * frequency / fieldSize);

      // h = height of wave at this point (constrained by previous waves to create layering)
      const h = minHeights[gx] = min(y + r, minHeights[gx]);

      // px, py = final vertex position with horizontal displacement effect
      const px = x + (h - y) * xDisplacement;
      const py = h;

      vertex(px, py);
    }
    endShape();
  }

  pop();
  noLoop();
}

function wrinkleNoise(x, y) {
  // p5.js noise returns 0-1, map to -1 to 1
  let n = noise(x, y) * 2 - 1;
  return sin(n * 3 * wrinkles) * pow(0.5 + 0.5 * n, 2);
}

function draw() {
  // Drawing happens in setup
}
