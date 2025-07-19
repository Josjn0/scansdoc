const scannedFiles = new Set();
const fileInput = document.getElementById("fileInput");
const uploadArea = document.getElementById("upload-area");
const messageDiv = document.getElementById("message");
const qrBtn = document.getElementById("scanQR");
const qrReader = document.getElementById("qr-reader");

fileInput.addEventListener("change", handleFile);
uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadArea.classList.add("dragging");
});
uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("dragging");
});
uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadArea.classList.remove("dragging");
  const file = e.dataTransfer.files[0];
  if (file) scanFile(file);
});

function handleFile(e) {
  const file = e.target.files[0];
  if (file) scanFile(file);
}

function scanFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const hash = btoa(reader.result).slice(0, 100);
    if (scannedFiles.has(hash)) {
      showMessage("❌ Sorry, this file has already been scanned.", "error");
    } else {
      scannedFiles.add(hash);
      showMessage("✅ File scanned successfully.", "success");
    }
  };
  reader.readAsBinaryString(file);
}

function showMessage(msg, type) {
  messageDiv.textContent = msg;
  messageDiv.className = type;
}

qrBtn.addEventListener("click", () => {
  qrReader.style.display = "block";
  const qrScanner = new Html5Qrcode("qr-reader");
  qrScanner.start(
    { facingMode: "environment" },
    {
      fps: 10,
      qrbox: 250
    },
    (decodedText, decodedResult) => {
      showMessage(`✅ QR Code Scanned: ${decodedText}`, "success");
      qrScanner.stop().then(() => {
        qrReader.style.display = "none";
      });
    },
    (errorMsg) => {
      console.log("QR error: ", errorMsg);
    }
  ).catch((err) => {
    showMessage("❌ Unable to start QR scanner.", "error");
    console.error(err);
  });
});
