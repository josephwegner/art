// Geometric Pyramids Pattern

let pyramids = [];

function calculateCanvasSize() {
  let size = min(windowWidth - 40, windowHeight - 40);
  if (windowWidth > 768) {
    size = min(600, size);
  } else {
    size = min(windowWidth * 0.9, windowHeight * 0.6);
  }
  return size;
}

// Perspective settings
const perspectiveFactor = -0.0005; // How strong the perspective effect is

// Apply perspective transformation to a point
function applyPerspective(x, y) {
  let vanishingX = width / 2; // X position of vanishing point
  let vanishingY = height / 4; // Y position of vanishing point (horizon line)

  // Use y as depth - higher y = further away
  let depth = y - vanishingY;
  let scale = 1 / (1 + depth * perspectiveFactor);

  // Scale and shift toward vanishing point
  let px = (x - vanishingX) * scale + vanishingX;
  let py = (y - vanishingY) * scale + vanishingY;

  return { x: px, y: py };
}

function setup() {
  let size = calculateCanvasSize();
  createCanvas(size, size);
  colorMode(HSB, 360, 100, 100);
  noStroke();
  noLoop();

  // Recursive binary space partitioning for organic tiling
  function subdivide(x, y, w, h) {
    // Minimum size for a pyramid
    const minSize = 20;
    const maxRatio = 2;

    // If area is small enough, make it a pyramid
    if ((w < minSize * 2 || h < minSize * 2) && (Math.max(w, h) / Math.min(w, h) < 2)) {
      // Assign random hue for this pyramid
      let hue = random(360);
      pyramids.push({ x, y, width: w, height: h, hue: hue });
      return;
    }

    // Randomly decide split direction based on aspect ratio
    let splitVertical;
    if (w > h * 1.5) {
      splitVertical = true; // Wide rectangle, split vertically
    } else if (h > w * 1.5) {
      splitVertical = false; // Tall rectangle, split horizontally
    } else {
      splitVertical = random() > 0.5; // Roughly square, random choice
    }

    if (splitVertical) {
      // Split left/right at a random position
      let splitPos = random(minSize, w - minSize);
      subdivide(x, y, splitPos, h);
      subdivide(x + splitPos, y, w - splitPos, h);
    } else {
      // Split top/bottom at a random position
      let splitPos = random(minSize, h - minSize);
      subdivide(x, y, w, splitPos);
      subdivide(x, y + splitPos, w, h - splitPos);
    }
  }

  // Start recursive subdivision with full canvas
  subdivide(0, 0, width, height);

  // Draw all pyramids
  background(0, 0, 100); // White background in HSB
  for (let pyramid of pyramids) {
    drawPyramid(pyramid.x, pyramid.y, pyramid.width, pyramid.height, pyramid.hue);
  }
}

function drawPyramid(x, y, width, height, hue) {
  // Original corners
  let topLeft = { x: x, y: y };
  let topRight = { x: x + width, y: y };
  let bottomLeft = { x: x, y: y + height };
  let bottomRight = { x: x + width, y: y + height };
  let center = { x: x + width / 2, y: y + height / 2 };

  // Apply perspective to all points
  let pTopLeft = applyPerspective(topLeft.x, topLeft.y);
  let pTopRight = applyPerspective(topRight.x, topRight.y);
  let pBottomLeft = applyPerspective(bottomLeft.x, bottomLeft.y);
  let pBottomRight = applyPerspective(bottomRight.x, bottomRight.y);
  let pCenter = applyPerspective(center.x, center.y);

  // Define the four brightness levels for 3D effect (using same hue)
  let saturation = 10; // Saturation level
  let darkest = color(hue, saturation, 55);
  let dark = color(hue, saturation, 65);
  let light = color(hue, saturation, 75);
  let lightest = color(hue, saturation, 85);

  // Top triangle (lightest)
  fill(lightest);
  triangle(pCenter.x, pCenter.y, pTopLeft.x, pTopLeft.y, pTopRight.x, pTopRight.y);

  // Right triangle (light)
  fill(light);
  triangle(pCenter.x, pCenter.y, pTopRight.x, pTopRight.y, pBottomRight.x, pBottomRight.y);

  // Bottom triangle (dark)
  fill(dark);
  triangle(pCenter.x, pCenter.y, pBottomRight.x, pBottomRight.y, pBottomLeft.x, pBottomLeft.y);

  // Left triangle (darkest)
  fill(darkest);
  triangle(pCenter.x, pCenter.y, pBottomLeft.x, pBottomLeft.y, pTopLeft.x, pTopLeft.y);
}

function draw() {
  // Drawing happens in setup
}

function windowResized() {
  pyramids = [];
  let size = calculateCanvasSize();
  resizeCanvas(size, size);
  setup();
}
