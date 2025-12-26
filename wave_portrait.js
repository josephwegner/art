// Converted from Turtle graphics to p5.js

const NUM_WAVES = 1200;
const ILLUSTRATION_HEIGHT = 800;

function setup() {
	createCanvas(800, 600);
	background(255);
	stroke(0, 0, 0, 84); // 0.33 opacity = 84/255
	noFill();

	noiseDetail(3); // Use 3 octaves like the original

	// Calculate the y-range based on NUM_WAVES
	const minY = -100;
	const maxY = 0.1 * (NUM_WAVES - 1) + 100;

	// Center the illustration vertically using ILLUSTRATION_HEIGHT
	const centerY = height / 2;
	const targetMinY = centerY - ILLUSTRATION_HEIGHT / 2;
	const targetMaxY = centerY + ILLUSTRATION_HEIGHT / 2;

	// Draw all waves at once
	for (let i = 0; i < NUM_WAVES; i++) {
		beginShape();
		for (let j = -101; j < 100; j++) {
			const h = noise(100 + j * 0.01, 100 + i * 0.01);
			// Map coordinates to canvas space
			const x = map(j, -101, 100, 0, width);
			const y = map(0.1 * i + h * 200 - 100, minY, maxY, targetMinY, targetMaxY);
			vertex(x, y);
		}
		endShape();
	}

	noLoop();
}
