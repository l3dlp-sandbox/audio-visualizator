const canvasElement = document.getElementById("canvas");
const canvasCtx = canvasElement.getContext("2d");
const barWidth = 2;
const barHeight = 2;
const barSpacing = 2;
const radius = 140;
const beta = Math.PI * 0.75;
const URL = "modulisme.mp3";
let started = false;

class AnalyserFromSourceURL extends AnalyserNode {
  constructor(url, context = new AudioContext()) {
    super(context);

    this.audioElement = new Audio(url);
    this.audioElement.crossOrigin = "anonymous";

    this.audioSourceNode = context.createMediaElementSource(this.audioElement);

    this.audioSourceNode.connect(this);
    this.connect(context.destination);
  }

  getFrequencyData() {
    const frequencyData = new Uint8Array(this.frequencyBinCount);

    this.getByteFrequencyData(frequencyData);

    return frequencyData;
  }

  playAudio() {
    this.audioElement.play();
  }

  pauseAudio() {
    this.audioElement.pause();
  }
}



function start() {
  let shockWaveSize = 0;
  let oldIntensity = 0;

  setCanvasFullscreen();
  onWindowResize(() => setCanvasFullscreen());

  const analyser = new AnalyserFromSourceURL(URL);
  analyser.playAudio();

  startFrameLooper(() => {
    clearCanvas();

    let intensity = 0;

    const frequencyData = analyser.getFrequencyData();
    const numOfBars = getNumOfBars(radius, barWidth + barSpacing);
    const bars = [];

    for (let index = 0; index < numOfBars; index++) {
      const amplitude = getAmplitudeForBar(index, frequencyData, numOfBars);
      bars[index] = amplitude;

      intensity += amplitude;
    }

    bars.map((amplitude, index) =>
      drawFrequencyBar(
        radius + (intensity - 10000) / 400,
        barWidth,
        barHeight + amplitude,
        getBarRotation(index, numOfBars) - beta
      )
    );

    shockWaveSize += 60;

    if (intensity - oldIntensity > 3000) {
      shockWaveSize = 0;
    }

    oldIntensity = intensity;

    drawShockwave(shockWaveSize + radius);
  });
}

function onPressCanvas(callback) {
  canvasElement.addEventListener("click", callback);
}

function getAmplitudeForBar(barIndex, frequencyData, maxOfBars) {
  const frequencyJump = Math.floor(frequencyData.length / maxOfBars);

  return frequencyData[frequencyJump * barIndex];
}

function getBarRotation(barIndex, maxOfBars) {
  return (barIndex * 2 * Math.PI) / maxOfBars;
}

function clearCanvas() {
  canvasCtx.save();

  canvasCtx.setTransform(1, 0, 0, 1, 0, 0);
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  canvasCtx.restore();
}

function getNumOfBars(circleRadius, barsize) {
  return getCircleDiameter(circleRadius) / barsize;
}

function getCircleDiameter(cicleRadius) {
  return cicleRadius * 2 * Math.PI;
}

function startFrameLooper(callback) {
  requestAnimationFrame(() => {
    callback();
    startFrameLooper(callback);
  });
}

function onWindowResize(callback) {
  window.addEventListener("resize", callback);
}

function drawShockwave(radius) {
  const middleX = canvasElement.width / 2;
  const middleY = canvasElement.height / 2;

  canvasCtx.lineWidth = 8;
  canvasCtx.strokeStyle = "rgb(255, 255, 255)";
  canvasCtx.beginPath();
  canvasCtx.arc(middleX, middleY, radius, 0, Math.PI * 2, false);
  canvasCtx.stroke();
}

function styleCanvas() {
  canvasCtx.fillStyle = "rgba(255, 255, 255)";
}

function drawFrequencyBar(y, w, h, rotation) {
  const middleX = canvasElement.width / 2;
  const middleY = canvasElement.height / 2;

  canvasCtx.save();
  canvasCtx.translate(middleX, middleY);
  canvasCtx.rotate(rotation);
  canvasCtx.fillRect(0, y, w, h);
  canvasCtx.restore();
}

function drawPlayButton() {
  const middleX = canvasElement.width / 2;
  const middleY = canvasElement.height / 2;

  canvasCtx.save();

  canvasCtx.beginPath();
  canvasCtx.fillStyle = "#ffffff";
  canvasCtx.moveTo(middleX - 20, middleY - 30);
  canvasCtx.lineTo(middleX - 20, middleY + 30);
  canvasCtx.lineTo(middleX + 30, middleY);

  canvasCtx.fill();

  canvasCtx.restore();
}

function setCanvasFullscreen() {
  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;
  styleCanvas();
}

drawPlayButton();

onPressCanvas(() => {
  if (!started) {
    start();
    started = true;
  }
});

function updateGradient()
{
  
  if ( $===undefined ) return;
  
var c0_0 = colors[colorIndices[0]];
var c0_1 = colors[colorIndices[1]];
var c1_0 = colors[colorIndices[2]];
var c1_1 = colors[colorIndices[3]];

var istep = 1 - step;
var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
var color1 = "rgba("+r1+","+g1+","+b1+",0.7)";

var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
var color2 = "rgba("+r2+","+g2+","+b2+",0.7)";

 $('canvas').css({
   background: "-webkit-gradient(linear, left top, right top, from("+color1+"), to("+color2+"))"}).css({
    background: "-moz-linear-gradient(left, "+color1+" 0%, "+color2+" 100%)"});
  
  step += gradientSpeed;
  if ( step >= 1 )
  {
    step %= 1;
    colorIndices[0] = colorIndices[1];
    colorIndices[2] = colorIndices[3];
    
    //pick two new target color indices
    //do not pick the same as the current one
    colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
    colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
    
  }
}