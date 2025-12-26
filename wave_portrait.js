// Wave portrait that uses waves as a mask over an image

const IMAGE_FILE = 'ellis.jpeg';

// Mutable parameters controlled by sliders
let NUM_WAVES = 600;
let ILLUSTRATION_HEIGHT = 1200;
let STROKE_WEIGHT = 1.5;
let STROKE_OPACITY = 0.4;

let img;
let cnv;
let currentImgElement = null;

function preload() {
	img = loadImage(IMAGE_FILE);
}

function setup() {
	cnv = createCanvas(800, 600);
	noLoop();

	// Initialize sliders
	setupSliders();

	// Draw initial visualization
	drawVisualization();
}

function drawVisualization() {
	// Clear canvas
	clear();

	stroke(0, 0, 0, STROKE_OPACITY * 255);
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
		// Remove previous image element if it exists
		if (currentImgElement) {
			currentImgElement.remove();
		}

		const mainCanvas = cnv.elt;
		const imgElement = document.createElement('img');
    const frameElement = document.getElementById('frame');
		imgElement.src = IMAGE_FILE;
		imgElement.style.width = '800px';
		imgElement.style.height = '600px';
		imgElement.style.objectFit = 'cover';
		imgElement.style.webkitMaskImage = `url(${mainCanvas.toDataURL()})`;
		imgElement.style.maskImage = `url(${mainCanvas.toDataURL()})`;
		imgElement.style.webkitMaskSize = '100% 100%';
		imgElement.style.maskSize = '100% 100%';
		imgElement.style.filter = "grayscale(100%)";

		mainCanvas.style.display = 'none';
		frameElement.appendChild(imgElement);

		currentImgElement = imgElement;
	}, 100);
}

function setupSliders() {
	// Number of Waves
	const numWavesSlider = document.getElementById('numWaves');
	const numWavesValue = document.getElementById('numWavesValue');
	numWavesSlider.addEventListener('input', (e) => {
		NUM_WAVES = parseInt(e.target.value);
		numWavesValue.textContent = NUM_WAVES;
		drawVisualization();
	});

	// Illustration Height
	const illustrationHeightSlider = document.getElementById('illustrationHeight');
	const illustrationHeightValue = document.getElementById('illustrationHeightValue');
	illustrationHeightSlider.value = ILLUSTRATION_HEIGHT;
	illustrationHeightValue.textContent = ILLUSTRATION_HEIGHT;
	illustrationHeightSlider.addEventListener('input', (e) => {
		ILLUSTRATION_HEIGHT = parseInt(e.target.value);
		illustrationHeightValue.textContent = ILLUSTRATION_HEIGHT;
		drawVisualization();
	});

	// Stroke Weight
	const strokeWeightSlider = document.getElementById('strokeWeight');
	const strokeWeightValue = document.getElementById('strokeWeightValue');
	strokeWeightSlider.addEventListener('input', (e) => {
		STROKE_WEIGHT = parseFloat(e.target.value);
		strokeWeightValue.textContent = STROKE_WEIGHT;
		drawVisualization();
	});

	// Stroke Opacity
	const strokeOpacitySlider = document.getElementById('strokeOpacity');
	const strokeOpacityValue = document.getElementById('strokeOpacityValue');
	strokeOpacitySlider.min = "0.1";
	strokeOpacitySlider.max = "1";
	strokeOpacitySlider.step = "0.1";
	strokeOpacitySlider.value = STROKE_OPACITY;
	strokeOpacityValue.textContent = STROKE_OPACITY;
	strokeOpacitySlider.addEventListener('input', (e) => {
		STROKE_OPACITY = parseFloat(e.target.value);
		strokeOpacityValue.textContent = STROKE_OPACITY.toFixed(1);
		drawVisualization();
	});
}
