// Wave portrait that uses waves as a mask over an image

const NUM_WAVES = 1200;
const ILLUSTRATION_HEIGHT = 1200;
const IMAGE_FILE = 'ellis.jpeg';
const STROKE_WEIGHT = 2;
const STROKE_OPACITY = .5

let img;

function preload() {
	img = loadImage(IMAGE_FILE);
}

function setup() {
	const cnv = createCanvas(800, 600);

	clear(); // Transparent background instead of white
	stroke(0, 0, 0, STROKE_OPACITY * 100);
	strokeWeight(STROKE_WEIGHT);
	strokeCap(ROUND);
	noFill();
	noiseDetail(3);

	// Calculate the y-range based on NUM_WAVES
	const minY = -100;
	const maxY = 0.1 * (NUM_WAVES - 1) + 100;

	// Center the illustration vertically using ILLUSTRATION_HEIGHT
	const centerY = height / 2;
	const targetMinY = centerY - ILLUSTRATION_HEIGHT / 2;
	const targetMaxY = centerY + ILLUSTRATION_HEIGHT / 2;

	// Draw waves
	for (let i = 0; i < NUM_WAVES; i++) {
		beginShape();
		for (let j = -101; j < 100; j++) {
			const h = noise(100 + j * 0.01, 100 + i * 0.01);
			const x = map(j, -101, 100, 0, width);
			const y = map(0.1 * i + h * 200 - 100, minY, maxY, targetMinY, targetMaxY);
			vertex(x, y);
		}
		endShape();
	}

	// Apply CSS mask after canvas is ready
	setTimeout(() => {
		const mainCanvas = cnv.elt; // Get the native canvas element from p5
		const imgElement = document.createElement('img');
		imgElement.src = IMAGE_FILE;
		imgElement.style.position = 'absolute';
		imgElement.style.top = '0';
		imgElement.style.left = '0';
		imgElement.style.width = '800px';
		imgElement.style.height = '600px';
		imgElement.style.objectFit = 'cover';
		imgElement.style.webkitMaskImage = `url(${mainCanvas.toDataURL()})`;
		imgElement.style.maskImage = `url(${mainCanvas.toDataURL()})`;
		imgElement.style.webkitMaskSize = '100% 100%';
		imgElement.style.maskSize = '100% 100%';
    imgElement.style.filter = "grayscale(100%)";

		mainCanvas.style.display = 'none';
		mainCanvas.parentElement.appendChild(imgElement);
	}, 100);

	noLoop();
}
