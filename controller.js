// This gets controller input to the page.
// but idk how to make it control the game itself.


const plugin_name = "controller support";
const haveEvents = "ongamepadconnected" in window;
const controllers = {};
let isControllerVisible = false;

// Define predefined functions for each button
const buttonFunctions = {
  Button0: () => {
    // Predefined function for Button 0
    console.log("Button 0 function executed.");
    // Add your custom action code here
  },
  Button1: () => {
    // Predefined function for Button 1
    console.log("Button 1 function executed.");
    // Add your custom action code here
  },
  ExampleFunction1: () => {
    // Example predefined function 1
    console.log("Example Function 1 executed.");
    alert("This is an example function. You can customize it.");
    // Add your custom action code here
  },
  ExampleFunction2: () => {
    // Example predefined function 2
    console.log("Example Function 2 executed.");
    // Add your custom action code here
  },
  // Add more predefined functions for other buttons as needed
};

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

  /* Style for pressed buttons (green text color) */
  .button.pressed {
    color: #42f593; /* Green color for pressed buttons */
  }

  /* Style for dropdown containers */
  .dropdown-container {
    margin-top: 10px; /* Add some spacing below the button */
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
    toggleControllerVisibility();
  });
  d.appendChild(closeButton);

  // Create content for controller UI
  const t = document.createElement("h1");
  t.textContent = `gamepad: ${gamepad.id}`;
  d.appendChild(t);

  const b = document.createElement("ul");
  b.className = "buttons";
  gamepad.buttons.forEach((button, i) => {
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    const e = document.createElement("li");
    e.className = "button";

    // Create a label for the button
    const label = document.createElement("span");
    label.textContent = `Button ${i}`;
    e.appendChild(label);

    // Create a unique ID for the dropdown
    const dropdownId = `dropdown${i}`;

    // Create the dropdown menu
    const dropdown = document.createElement("select");
    dropdown.className = "dropdown-menu";

    // Create options in the dropdown menu for predefined functions
    for (const functionName in buttonFunctions) {
      const option = document.createElement("option");
      option.textContent = functionName;
      dropdown.appendChild(option);
    }

    // Load the selected option from localStorage (if available)
    const savedOption = loadSelectedOption(i);
    if (savedOption) {
      dropdown.value = savedOption;
    }

    // Add an event listener to execute the selected predefined function
    dropdown.addEventListener("change", () => {
      const selectedFunctionName = dropdown.value;
      const selectedFunction = buttonFunctions[selectedFunctionName];
      if (selectedFunction) {
        selectedFunction(); // Execute the selected function
      }
      e.classList.add("pressed"); // Add a "pressed" class for button press
      // Save the selected option to localStorage
      saveSelectedOption(i, selectedFunctionName);
    });

    // Wrap the dropdown in the div with a unique ID
    buttonContainer.appendChild(dropdown);
    buttonContainer.id = dropdownId;

    // Add an event listener for button press to execute the selected function
    e.addEventListener("click", () => {
      const selectedFunctionName = dropdown.value;
      const selectedFunction = buttonFunctions[selectedFunctionName];
      if (selectedFunction) {
        selectedFunction(); // Execute the selected function
      }
      e.classList.add("pressed"); // Add a "pressed" class for button press
    });

    // Add an event listener for button release to remove the "pressed" class
    e.addEventListener("mouseup", () => {
      e.classList.remove("pressed");
    });

    // Append the button and dropdown container to the button list
    buttonContainer.appendChild(e);
    b.appendChild(buttonContainer);
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

// Function to save the selected option to localStorage
function saveSelectedOption(buttonIndex, selectedOption) {
  localStorage.setItem(`selectedOption${buttonIndex}`, selectedOption);
}

// Function to load the selected option from localStorage
function loadSelectedOption(buttonIndex) {
  return localStorage.getItem(`selectedOption${buttonIndex}`);
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

// Listen for the "\" key press to toggle the controller UI visibility
document.addEventListener("keydown", (event) => {
  if (event.key === "\\") {
    toggleControllerVisibility();
  }
});

// Toggle the controller UI visibility
function toggleControllerVisibility() {
  isControllerVisible = !isControllerVisible;
  const controllersDivs = document.querySelectorAll(".controller");
  controllersDivs.forEach((div) => {
    div.style.display = isControllerVisible ? "block" : "none";
  });
}

window.addEventListener("gamepadconnected", connecthandler);
window.addEventListener("gamepaddisconnected", disconnecthandler);

if (!haveEvents) {
  setInterval(scangamepads, 500);
}
