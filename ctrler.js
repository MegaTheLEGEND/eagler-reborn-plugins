let controllerUiVisible = false;
let controllerUiBackslashKey = '\\';

function createControllerUi() {
  const controllerUiContainer = document.createElement('div');
  controllerUiContainer.style.position = 'fixed';
  controllerUiContainer.style.top = '50%';
  controllerUiContainer.style.left = '50%';
  controllerUiContainer.style.transform = 'translate(-50%, -50%)';
  controllerUiContainer.style.width = '400px'; // Adjust the width as desired
  controllerUiContainer.style.height = '300px'; // Adjust the height as desired
  controllerUiContainer.style.backgroundColor = 'white';
  controllerUiContainer.style.border = '1px solid black';

  const controllerUiCloseButton = document.createElement('button');
  controllerUiCloseButton.innerText = 'Close UI';
  controllerUiCloseButton.addEventListener('click', () => {
    controllerUiContainer.remove();
    controllerUiVisible = false;
  });

  const controllerUiInfo = document.createElement('div');
  controllerUiInfo.id = 'controller-info'; // Assign an ID for updating
  controllerUiInfo.innerText = 'Controller Readings:';
  controllerUiContainer.appendChild(controllerUiInfo);

  document.body.appendChild(controllerUiContainer);
}

function updateControllerUiInfo() {
  const gamepads = navigator.getGamepads();

  const controllerUiInfo = document.querySelector('#controller-info');
  controllerUiInfo.innerHTML = 'Controller Readings:<br>';

  for (const gamepad of gamepads) {
    if (gamepad) {
      controllerUiInfo.innerHTML += `<strong>Controller ${gamepad.index + 1}:</strong><br>`;
      controllerUiInfo.innerHTML += `Buttons: ${JSON.stringify(gamepad.buttons)}<br>`;
      controllerUiInfo.innerHTML += `Axes: ${JSON.stringify(gamepad.axes)}<br><br>`;
    }
  }
}

document.addEventListener('keydown', (event) => {
  if (event.key === controllerUiBackslashKey) {
    if (!controllerUiVisible) {
      createControllerUi();
      controllerUiVisible = true;
      updateControllerUiInfo();
    }
  }
});

// Regularly update controller info
setInterval(updateControllerUiInfo, 100); // Update every 100 milliseconds
