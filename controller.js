PluginAPI.require("settings");
const cssStyles = `
    .mod-menu {
        display: none;
        position: fixed;
        top: 10px;
        left: 10px;
        background-color: white;
        border: 2px solid #ccc;
        border-radius: 5px;
        padding: 10px;
        z-index: 999;
        resize: both;
        overflow: auto;
        max-height: 80vh;
        max-width: 80vw;
        min-height: 50px;
        min-width: 100px;
    }

    .close-button {
        cursor: pointer;
        color: red;
        float: right;
    }

    .controller-options {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .button {
        padding: 10px;
        margin: 5px;
        border: 1px solid #000;
        cursor: pointer;
    }

    .pressed {
        background-color: green;
    }
`;


const styleElement = document.createElement("style");
styleElement.textContent = cssStyles;
document.head.appendChild(styleElement);

const modMenu = document.createElement("div");
modMenu.className = "mod-menu";
modMenu.innerHTML = `
    <div class="close-button" onclick="toggleModMenu()">X</div>
    <h1>Controller Menu</h1>
    <p>Press "\\" to show/hide this menu</p>
    <div class="controller-options" id="controller-options"></div>
`;


document.body.appendChild(modMenu);

// Variable to track the visibility of the mod menu
let isModMenuVisible = false;

// Function to open and close the mod menu visibility
function toggleModMenu() {
    isModMenuVisible = !isModMenuVisible;
    modMenu.style.display = isModMenuVisible ? "block" : "none";
}

// Listen \ key press to open and close the mod menu visibility
document.addEventListener("keydown", (event) => {
    if (event.key === "\\") {
        toggleModMenu();
    }
});

// Define the list of controller buttons
let buttonList = [
    { 
        name: "Jump", 
        key: null, //this key is used for mapping the the physical key on the controller
        onPress: () => setKeybindFromString("key.jump", true), 
        onRelease: () => setKeybindFromString("key.jump", false), 
        isPressed: false 
    },
    { 
        name: "Sprint", 
        key: null, 
        onPress:  () => setKeybindFromString("key.sprint", false), 
        onRelease: () => setKeybindFromString("key.sprint", false), 
        isPressed: false 
    },
    { 
        name: "Use", 
        key: null, 
        onPress: () => setKeybindFromString("key.use", false), 
        onRelease:  () => setKeybindFromString("key.use", false), 
        isPressed: false 
    },
    { 
        name: "Mine", 
        key: null, 
        onPress: () => setKeybindFromString("key.attack", false), 
        onRelease: () => setKeybindFromString("key.attack", false), 
        isPressed: false 
    },
	{ 
        name: "sneak", 
        key: null, 
        onPress: () => setKeybindFromString("key.sneak", false), 
        onRelease: () => setKeybindFromString("key.sneak", false), 
        isPressed: false 
    }
];

// Variable to track if assigning input is in progress
let assigningInput = false;

// Function to assign input to controller buttons
function assignInput(buttonName) {
    const assignedButton = buttonList.find(button => button.name === buttonName);

    assignedButton.key = null;
    assignedButton.isPressed = false;

    const promptMessage = `Press the corresponding button on the controller for ${buttonName}`;
    const promptContainer = document.createElement("div");
    promptContainer.innerHTML = `<p>${promptMessage}</p>`;
    document.body.appendChild(promptContainer);

    const checkGamepad = () => {
        const gamepad = navigator.getGamepads()[0];

        if (gamepad && gamepad.buttons) {
            const pressedButtonIndex = gamepad.buttons.findIndex(button => button.pressed);

            if (pressedButtonIndex !== -1 && !buttonList.some(button => button.key === pressedButtonIndex)) {
                assignedButton.key = pressedButtonIndex;
                assignedButton.onPress = () => {
                    if (!assignedButton.isPressed) {
                        assignedButton.isPressed = true;
                        assignedButton.buttonElement.classList.add('pressed');
                        console.log(`${buttonName} pressed`);
						assignedButton.onPress();
                    }
                };
                assignedButton.onRelease = () => {
                    if (assignedButton.isPressed) {
                        assignedButton.isPressed = false;
                        assignedButton.buttonElement.classList.remove('pressed');
                        console.log(`${buttonName} released`);
						assignedButton.onRelease();
                    }
                };
                console.log(`Assigned input for ${buttonName}: Button ${pressedButtonIndex}`);
                promptContainer.innerHTML += `<p>Input assigned: ${buttonName} (Button: ${pressedButtonIndex})</p>`;
                setTimeout(() => {
                    promptContainer.remove();
                    assigningInput = false;
                }, 1000); // Remove the prompt after 1 second
            } else {
                // No button pressed or already assigned
                setTimeout(checkGamepad, 100);
            }
        } else {
            setTimeout(checkGamepad, 100);
        }
    };

    checkGamepad();
}

// Function to set up the controller buttons
function setupButtons() {
    const controllerOptions = document.getElementById('controller-options');

    buttonList.forEach(button => {
        button.buttonElement = document.createElement("div");
        button.buttonElement.classList.add('button');
        button.buttonElement.innerText = button.name;
        button.buttonElement.addEventListener('click', () => {
            if (!assigningInput) {
                assigningInput = true;
                assignInput(button.name);
            }
        });
        controllerOptions.appendChild(button.buttonElement);
    });
}

// function to handle gamepad input
function handleGamepad() {
    const gamepad = navigator.getGamepads()[0];

    if (gamepad && gamepad.buttons) {
        console.log(gamepad.buttons); // log button states

        buttonList.forEach(button => {
            const buttonState = gamepad.buttons[button.key];

            if (buttonState && buttonState.pressed && button.onPress) {
                
                button.onPress();
            } else if (buttonState && !buttonState.pressed && button.onRelease) {
                
                button.onRelease();
            }
        });
    }

    requestAnimationFrame(handleGamepad);
}

function setKeybindFromString(keybindId, pressed) {
    PluginAPI.settings.keyBindings.forEach(k => {
        if (k.keyDescription === keybindId) {
            k.pressed = pressed;
            k.reload();
        }
    });
}

// set up the controller buttons and handle gamepad input
setupButtons();
handleGamepad();
