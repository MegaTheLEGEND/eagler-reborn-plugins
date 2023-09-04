// Define some variables
let controllerUiVisible = false;
let controllerUiInfo = `<div></div>`;
let controllerUiButtons = `
  <button onclick="controllerUiInfo('div').style.display = 'none';">Hide</button>
  <button onclick="controllerUiInfo('div').style.display = 'block';">Show</button>
  <button onclick="controllerUiInfo('div').style.top = '50px';">Adjust the top as desired</button>
  <button onclick="controllerUiInfo('div').style.height = '300px';">Adjust the height as desired</button>
  <button onclick="controllerUiInfo('div').style.background = 'white';">Change the background color</button>
`;

// Function to create or update the controller UI
function updateControllerUiInfo() {
  // Check if the controller UI element exists
  const controllerUiElement = document.getElementById('controller-ui');
  if (!controllerUiElement) {
    // If it doesn't exist, create it and set its innerHTML
    const controllerUi = document.createElement('div');
    controllerUi.id = 'controller-ui';
    controllerUi.style.display = 'block';
    controllerUi.style.top = '0';
    controllerUi.style.height = '500px';
    controllerUi.style.background = 'transparent';
    document.body.appendChild(controllerUi);
    controllerUi.innerHTML = controllerUiButtons;
  } else {
    // If it exists, toggle its visibility
    if (controllerUiVisible) {
      controllerUiElement.style.display = 'none';
      controllerUiVisible = false;
    } else {
      controllerUiElement.style.display = 'block';
      controllerUiVisible = true;
    }
  }
}

// Periodically update the controller UI
setInterval(updateControllerUiInfo, 1000);
