const status = document.getElementById('status');
const connectBtn = document.getElementById('connectBtn');

connectBtn.addEventListener('click', async () => {
  try {
    const device = await navigator.usb.requestDevice({
      filters: [{ vendorId: 0x0bda }]
    });
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
