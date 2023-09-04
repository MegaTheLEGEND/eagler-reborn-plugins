const haveEvents = "ongamepadconnected" in window;
const controllers = {};
let isControllerVisible = false;
const keyMappings = {};

// Define the CSS styles inline
const cssStyles = `
  /* Style for the grey background */
  body {
    position: relative;
    background-color: rgba(0, 0, 0, 0.5); /* Grey background with some transparency */
    margin: 0;
    padding: 0;
    height: 100vh; /* Full viewport height */
  }

  /* Style for the controller UI */
  .controller {
    position: absolute;
    top: 50%; /* Center vertically */
    left: 50%; /* Center horizontally */
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border: 2px solid #ccc;
    border-radius: 5px;
    z-index: 999; /* Make sure the UI is on top of everything */
  }

  /* Style for the close button (red 'X') */
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    color: red; /* Red color for the 'X' button */
  }

  /* Style for the key mapping modal */
  .key-mapping-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .key-mapping-modal input[type="text"] {
    width: 100px;
  }
`;

// Create a style element and append the CSS styles to it
const styleElement = document.createElement("style");
styleElement.textContent = cssStyles;
document.head.appendChild(styleElement);

function connecthandler(e) {
  if (!isControllerVisible) {
    addgamepad(e.gamepad);
  }
}

function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad;

  const d = document.createElement("div");
  d.setAttribute("id", `controller${gamepad.index}`);
  d.className = "controller";

  // Create a close button
  const closeButton = document.createElement("div");
  closeButton.textContent = "X";
  closeButton.className = "close-button";
  closeButton.addEventListener("click", () => {
    // Handle close button click
    removegamepad(gamepad);
  });
  d.appendChild(closeButton);

  // Create a "Map Keys" button
  const mapKeysButton = document.createElement("button");
  mapKeysButton.textContent = "Map Keys";
  mapKeysButton.addEventListener("click", () => {
    openKeyMappingModal(gamepad.index);
  });
  d.appendChild(mapKeysButton);

  // Create content for controller UI
  const t = document.createElement("h1");
  t.textContent = `gamepad: ${gamepad.id}`;
  d.appendChild(t);

  const b = document.createElement("ul");
  b.className = "buttons";
  gamepad.buttons.forEach((button, i) => {
    const e = document.createElement("li");
    e.className = "button";
    e.textContent = `Button ${i}`;
    b.appendChild(e);
  });
  d.appendChild(b);

  const a = document.createElement("div");
  a.className = "axes";
  gamepad.axes.forEach((axis, i) => {
    const p = document.createElement("progress");
    p.className = "axis";
    p.setAttribute("max", "2");
    p.setAttribute("value", "1");
    p.textContent = i;
    a.appendChild(p);
  });
  d.appendChild(a);

  document.body.appendChild(d);
  requestAnimationFrame(updateStatus);

  // Set the controller UI as visible
  isControllerVisible = true;
}

function disconnecthandler(e) {
  removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
  const d = document.getElementById(`controller${gamepad.index}`);
  if (d) {
    document.body.removeChild(d);
  }
  delete controllers[gamepad.index];
  // Set the controller UI as not visible if no controllers are left
  if (Object.keys(controllers).length === 0) {
    isControllerVisible = false;
    console.log("No controller connected");
  }
}

function updateStatus() {
  if (!haveEvents) {
    scangamepads();
  }

  Object.entries(controllers).forEach(([i, controller]) => {
    const d = document.getElementById(`controller${i}`);
    const buttons = d.getElementsByClassName("button");

    controller.buttons.forEach((button, i) => {
      const b = buttons[i];
      let pressed = button === 1.0;
      let val = button;

      if (typeof button === "object") {
        pressed = val.pressed;
        val = val.value;
      }

      const pct = `${Math.round(val * 100)}%`;
      b.style.backgroundSize = `${pct} ${pct}`;
      b.textContent = pressed ? `Button ${i} [PRESSED]` : `Button ${i}`;
      b.style.color = pressed ? "#42f593" : "#2e2d33";
      b.className = pressed ? "button pressed" : "button";
    });

    const axes = d.getElementsByClassName("axis");
    controller.axes.forEach((axis, i) => {
      const a = axes[i];
      a.textContent = `${i}: ${axis.toFixed(4)}`;
      a.setAttribute("value", axis + 1);
    });
  });

  requestAnimationFrame(updateStatus);
}

function scangamepads() {
  const gamepads = navigator.getGamepads();
  const noDevicesElement = document.querySelector("#noDevices");

  if (noDevicesElement) {
    noDevicesElement.style.display = gamepads && gamepads.length && gamepads.filter(Boolean).length
      ? "none"
      : "block";
  }

  for (const gamepad of gamepads) {
    if (gamepad) {
      // Can be null if disconnected during the session
      if (gamepad.index in controllers) {
        controllers[gamepad.index] = gamepad;
      } else {
        addgamepad(gamepad);
      }
    }
  }
}

// Function to open the key mapping modal
function openKeyMappingModal(gamepadIndex) {
  const modal = document.createElement("div");
  modal.className = "key-mapping-modal";

  // Create a list of buttons
  const buttonList = document.createElement("ul");
  controllers[gamepadIndex].buttons.forEach((button, i) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Button ${i}: `;

    // Input field for key mapping
    const input = document.createElement("input");
    input.type = "text";
    input.value = keyMappings[gamepadIndex]?.[i] || ""; // Use existing mapping if available
    input.addEventListener("input", (event) => {
      keyMappings[gamepadIndex] = keyMappings[gamepadIndex] || {};
      keyMappings[gamepadIndex][i] = event.target.value;
    });

    listItem.appendChild(input);
    buttonList.appendChild(listItem);
  });

  // Save button
  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.addEventListener("click", () => {
    // Close the modal and update key mappings
    document.body.removeChild(modal);
  });

  modal.appendChild(buttonList);
  modal.appendChild(saveButton);

  document.body.appendChild(modal);
}

// Update event listeners to use key mappings
function handleButtonPress(event) {
  const gamepadIndex = event.gamepad.index;
  const buttonIndex = event.button;

  const keyMapping = keyMappings[gamepadIndex]?.[buttonIndex];
  if (keyMapping) {
    // Handle keyboard key press based on the user-defined key mapping
    // You will need to implement this part.
    console.log(`Button ${buttonIndex} mapped to key: ${keyMapping}`);
  } else {
    // Handle the button press as before
    // ...
  }
}

// Update event listeners to use the new handler
window.addEventListener("gamepadbuttondown", handleButtonPress);
