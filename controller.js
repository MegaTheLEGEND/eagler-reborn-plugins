PluginAPI.require("settings");
PluginAPI.require("player");
const cssStyles = `
	@import url('https://fonts.googleapis.com/css?family=Roboto');
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
	.header{
		font-family: 'Roboto';
	}
`;


const styleElement = document.createElement("style");
styleElement.textContent = cssStyles;
document.head.appendChild(styleElement);

const modMenu = document.createElement("div");
modMenu.className = "mod-menu";
modMenu.innerHTML = `
    <div class="close-button" onclick="toggleModMenu()">X</div>
    <h1 class="header">Controller Menu by MegaTheLEGEND</h1>
    <div id="infoText"> <p>Press "\\" to show/hide this menu</p></div>
    <div class="controller-options" id="controller-options"></div>
`;

document.body.appendChild(modMenu);

// Variable to track the visibility of the mod menu
let isModMenuVisible = false;

// Function to open and close the mod menu visibility
function toggleModMenu(isIt) {
	
	if (isIt == null){
		isModMenuVisible = !isModMenuVisible;
		modMenu.style.display = isModMenuVisible ? "block" : "none";
	} else if (isIt == "show"){
		modMenu.style.display = "block";
	} else if (isIt == "hide"){
		modMenu.style.display = "none";
	}
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
        name: "jump", 
        key: null, 
        onPressAction: () => setKeybindFromString("key.jump", true), 
        onReleaseAction: () => setKeybindFromString("key.jump", false), 
        isPressed: false,
        onPress: null,
        onRelease: null
    },
    { 
        name: "sprint", 
        key: null, 
        onPressAction: () => setKeybindFromString("key.sprint", true), 
        onReleaseAction: () => setKeybindFromString("key.sprint", false), 
        isPressed: false,
        onPress: null,
        onRelease: null
    },
    { 
        name: "use", 
        key: null, 
        onPressAction: () => setKeybindFromString("key.use", true), 
        onReleaseAction: () => setKeybindFromString("key.use", false), 
        isPressed: false,
        onPress: null,
        onRelease: null
    },
    { 
        name: "attack", 
        key: null, 
        onPressAction: () => setKeybindFromString("key.attack", true), 
        onReleaseAction: () => setKeybindFromString("key.attack", false), 
        isPressed: false,
        onPress: null,
        onRelease: null
    },
    { 
        name: "sneak", 
        key: null, 
        onPressAction: () => setKeybindFromString("key.sneak", true), 
        onReleaseAction: () => setKeybindFromString("key.sneak", false), 
        isPressed: false,
        onPress: null,
        onRelease: null
    },
    { 
        name: "inventory", 
        key: null, 
        onPressAction: () => setKeybindFromString("key.inventory", true), 
        onReleaseAction: () => setKeybindFromString("key.inventory", false), 
        isPressed: false,
        onPress: null,
        onRelease: null
    },
    { 
        name: "drop", 
        key: null, 
        onPressAction: () => setKeybindFromString("key.drop", true), 
        onReleaseAction: () => setKeybindFromString("key.drop", false), 
        isPressed: false,
        onPress: null,
        onRelease: null
    },
    { 
        name: "pickItem", 
        key: null, 
        onPressAction: () => setKeybindFromString("key.pickItem", true), 
        onReleaseAction: () => setKeybindFromString("key.pickItem", false), 
        isPressed: false,
        onPress: null,
        onRelease: null
    },
    { 
        name: "chat", 
        key: null, 
        onPressAction: () => setKeybindFromString("key.chat", true), 
        onReleaseAction: () => setKeybindFromString("key.chat", false), 
        isPressed: false,
        onPress: null,
        onRelease: null
    },
    { 
        name: "playerlist", 
        key: null, 
        onPressAction: () => setKeybindFromString("key.playerlist", true), 
        onReleaseAction: () => setKeybindFromString("key.playerlist", false), 
        isPressed: false,
        onPress: null,
        onRelease: null
    },
    { 
        name: "command", 
        key: null, 
        onPressAction: () => setKeybindFromString("key.command", true), 
        onReleaseAction: () => setKeybindFromString("key.command", false), 
        isPressed: false,
        onPress: null,
        onRelease: null
    },
    { 
        name: "screenshot", 
        key: null, 
        onPressAction: () => setKeybindFromString("key.screenshot", true), 
        onReleaseAction: () => setKeybindFromString("key.screenshot", false), 
        isPressed: false,
        onPress: null,
        onRelease: null
    },
    { 
        name: "togglePerspective", 
        key: null, 
        onPressAction: () => setKeybindFromString("key.togglePerspective", true), 
        onReleaseAction: () => setKeybindFromString("key.togglePerspective", false), 
        isPressed: false,
        onPress: null,
        onRelease: null
    },
    { 
        name: "smoothCamera", 
        key: null, 
        onPressAction: () => setKeybindFromString("key.smoothCamera", true), 
        onReleaseAction: () => setKeybindFromString("key.smoothCamera", false), 
        isPressed: false,
        onPress: null,
        onRelease: null
    },
    { 
        name: "zoomCamera", 
        key: null, 
        onPressAction: () => setKeybindFromString("key.zoomCamera", true), 
        onReleaseAction: () => setKeybindFromString("key.zoomCamera", false), 
        isPressed: false,
        onPress: null,
        onRelease: null
    },
    { 
        name: "function", 
        key: null, 
        onPressAction: () => setKeybindFromString("key.function", true), 
        onReleaseAction: () => setKeybindFromString("key.function", false), 
        isPressed: false,
        onPress: null,
        onRelease: null
    },
    { 
        name: "close", 
        key: null, 
        onPressAction: () => setKeybindFromString("key.close", true), 
        onReleaseAction: () => setKeybindFromString("key.close", false), 
        isPressed: false,
        onPress: null,
        onRelease: null
    },
	{ 
        name: "Increment Inventory", 
        key: null, 
        onPressAction: () =>{
		
		let newHotbarNumber = PluginAPI.player.inventory.currentItem + 1;
		if (newHotbarNumber > 8){
			newHotbarNumber = 0;
			throttledSetHotbarSlot(newHotbarNumber);
			console.log("setting bar to: "+ newHotbarNumber);//log
			}else {
			throttledSetHotbarSlot(newHotbarNumber);
			console.log("setting bar to: "+ newHotbarNumber);//log
			}
		}, 
        onReleaseAction: () => PluginAPI.player.inventory.reload(), 
        isPressed: false,
        onPress: null,
        onRelease: null
    },
	{ 
        name: "Decrement Inventory", 
        key: null, 
        onPressAction: () =>{ 
		
		let newHotbarNumber = PluginAPI.player.inventory.currentItem - 1;
		if (newHotbarNumber < 0){
			newHotbarNumber = 8;
			throttledSetHotbarSlot(newHotbarNumber);
			console.log("setting bar to: "+ newHotbarNumber); //log
			} else {
			throttledSetHotbarSlot(newHotbarNumber);
			console.log("setting bar to: "+ newHotbarNumber);//log
			}
		
		}, 
        onReleaseAction: () => PluginAPI.player.inventory.reload(), 
        isPressed: false,
        onPress: null,
        onRelease: null
    }
	
];



// Variable to track if assigning input is in progress
let assigningInput = false;

// Function to assign input to controller buttons
function assignInput(buttonName) {
    const assignedButton = buttonList.find(button => button.name === buttonName);

    //assignedButton.key = null;
    assignedButton.isPressed = false;

    const promptMessage = `Press the corresponding button on the controller for ${buttonName}`;
    document.getElementById("infoText").innerHTML = `<p>${promptMessage}</p>`;

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
                document.getElementById("infoText").innerHTML += `<p>Input assigned: ${buttonName} (Button: ${pressedButtonIndex})</p>`;
                setTimeout(() => {
                    document.getElementById("infoText").innerHTML += `<p>Press "\\" to show/hide this menu</p>`;
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
        //console.log(gamepad.buttons); // log button states

        buttonList.forEach(button => {
            const buttonState = gamepad.buttons[button.key];

            if (buttonState && buttonState.pressed && button.onPress) {
                button.onPress();// turn the button green
		button.onPressAction(); // do the actual in game action
				
				
            } else if (buttonState && !buttonState.pressed && button.onRelease) {
                button.onRelease(); // turn the button white
		button.onReleaseAction(); // stop the actual in game action
				
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

//rate limit the hot bar lol
//if you dont it skips to many bar spots on one click
function throttle(func, delay) {
  let lastCall = 0;

  return function (...args) {
    const now = new Date().getTime();

    if (now - lastCall >= delay) {
      func(...args);
      lastCall = now;
    }
  };
}


function setHotbarSlot(slot) {
  PluginAPI.player.inventory.currentItem = slot;
}

// Throttle the function to be called once every so many seconds
var throttledSetHotbarSlot = throttle(setHotbarSlot, 120); 




// set up the controller buttons and handle gamepad input
setupButtons();
handleGamepad();
