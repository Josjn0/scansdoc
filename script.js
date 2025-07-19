
let scannedFiles = new Set();
let scannedQR = new Set();

document.getElementById('fileInput').addEventListener('change', async function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const hash = btoa(reader.result).slice(0, 100);
    const msg = document.getElementById("fileMessage");
    if (scannedFiles.has(hash)) {
      msg.textContent = "❌ This file has already been scanned.";
      msg.style.color = "red";
    } else {
      scannedFiles.add(hash);
      msg.textContent = "✅ File scanned successfully.";
      msg.style.color = "green";
    }
  };
  reader.readAsBinaryString(file);
});

// QR Scanner
function onScanSuccess(decodedText, decodedResult) {
  const msg = document.getElementById("qrMessage");
  if (scannedQR.has(decodedText)) {
    msg.textContent = "❌ This QR code has already been scanned.";
    msg.style.color = "red";
  } else {
    scannedQR.add(decodedText);
    msg.textContent = "✅ QR Code scanned: " + decodedText;
    msg.style.color = "green";
  }
}
const html5QrCode = new Html5Qrcode("qr-reader");
Html5Qrcode.getCameras().then(devices => {
  if (devices && devices.length) {
    html5QrCode.start(devices[0].id, { fps: 10, qrbox: 250 }, onScanSuccess);
  }
});

// OCR from Camera
const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream);

function captureImage() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  Tesseract.recognize(canvas, 'eng')
    .then(({ data: { text } }) => {
      document.getElementById("ocrText").textContent = "📝 Recognized text: " + text.trim();
    });
}
