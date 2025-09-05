const status = document.getElementById('status');
const connectBtn = document.getElementById('connectBtn');
const shareScreenBtn = document.getElementById('shareScreenBtn');
const screenVideo = document.getElementById('screenVideo');
const tempestCanvas = document.getElementById('tempestCanvas');
const tempestCtx = tempestCanvas.getContext('2d');
const hiddenCanvas = document.createElement('canvas');
const hiddenCtx = hiddenCanvas.getContext('2d');

// Event listener for connecting to the USB SDR
connectBtn.addEventListener('click', async () => {
  try {
    const device = await navigator.usb.requestDevice({ filters: [{ vendorId: 0x0bda }] });
    await device.open();
    await device.selectConfiguration(1);
    await device.claimInterface(0);
    status.textContent = `Connected: ${device.productName}`;
    console.log(device);
  } catch (err) {
    status.textContent = `Error: ${err.message}`;
    console.error(err);
  }
});

// Event listener for sharing the screen as a demonstration
shareScreenBtn.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    screenVideo.srcObject = stream;
    status.textContent = 'Screen shared successfully!';
    // Start Tempest simulation when video metadata is loaded
    screenVideo.onloadedmetadata = () => {
      startTempestSimulation();
    };
  } catch (err) {
    status.textContent = `Screen share error: ${err.message}`;
    console.error(err);
  }
});

function startTempestSimulation() {
  hiddenCanvas.width = screenVideo.videoWidth;
  hiddenCanvas.height = screenVideo.videoHeight;
  tempestCanvas.width = screenVideo.videoWidth;
  tempestCanvas.height = screenVideo.videoHeight;
  requestAnimationFrame(processFrame);
}

function processFrame() {
  if (screenVideo.readyState >= 2) {
    hiddenCtx.drawImage(screenVideo, 0, 0, hiddenCanvas.width, hiddenCanvas.height);
    const frame = hiddenCtx.getImageData(0, 0, hiddenCanvas.width, hiddenCanvas.height);
    // Convert to grayscale to simulate electromagnetic intensity
    for (let i = 0; i < frame.data.length; i += 4) {
      const r = frame.data[i];
      const g = frame.data[i + 1];
      const b = frame.data[i + 2];
      const brightness = (r + g + b) / 3;
      frame.data[i] = frame.data[i + 1] = frame.data[i + 2] = brightness;
    }
    tempestCtx.putImageData(frame, 0, 0);
  }
  requestAnimationFrame(processFrame);
}
