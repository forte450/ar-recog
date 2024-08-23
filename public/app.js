const socket = io();

const videoElement = document.getElementById('video-element');
const canvasElement = document.getElementById('canvas-element');
const ctx = canvasElement.getContext('2d');

let model;

async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    return new Promise((resolve) => {
        videoElement.onloadedmetadata = () => {
            resolve(videoElement);
        };
    });
}

async function loadModel() {
    model = await blazeface.load();
}

async function detectFaces() {
    const predictions = await model.estimateFaces(videoElement, false);
    
    ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    
    predictions.forEach(face => {
        const start = face.topLeft;
        const end = face.bottomRight;
        const size = [end[0] - start[0], end[1] - start[1]];
        
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 2;
        ctx.strokeRect(start[0], start[1], size[0], size[1]);
    });
}

async function main() {
    const video = await setupCamera();
    video.play();
    
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;
    
    await loadModel();
    
    setInterval(detectFaces, 100);
}

main();