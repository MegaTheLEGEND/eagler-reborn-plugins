PluginAPI.require("settings");
PluginAPI.require("player");


// set the stick dead zones
let leftStickDeadZone = .4;
let rightStickDeadZone = .4;

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
    <div id="infoText"> <p>Press "\\" to show/hide this menu</p><p>Warning this plugin seems to crash the game if it is used while not in a server.</p></div>
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
		if (document.pointerLockElement != null) {
			document.exitPointerLock();
		}
	} else if (isIt == "show"){
		modMenu.style.display = "block";
        document.exitPointerLock()
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

function assignInput(buttonName, preMap) {

    if (preMap == null){
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
					saveButtonMappings();
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
  }else if (preMap != null){
    const assignedButton = buttonList.find(button => button.name === buttonName);

        assignedButton.key = preMap;
        assignedButton.isPressed = false;

        const checkGamepad = () => {
            const gamepad = navigator.getGamepads()[0];

            if (true) { //idk why lol 
                const pressedButtonIndex = preMap;

                if (true /*pressedButtonIndex !== -1 && !buttonList.some(button => button.key === pressedButtonIndex)*/) {
					console.log("line 368 has ran! "+ assignedButton);
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
                    console.log(`auto Assigned input for ${buttonName}: Button ${pressedButtonIndex}`);
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

// Function to handle gamepad input
function handleGamepad() {
    const gamepad = navigator.getGamepads()[0];

    if (gamepad && gamepad.buttons) {
        buttonList.forEach(button => {
            const buttonState = gamepad.buttons[button.key];

            if (buttonState && buttonState.pressed && !button.isPressed) {
                button.isPressed = true;
                button.buttonElement.classList.add('pressed');
                console.log(`${button.name} pressed`);
                button.onPress();
				button.onPressAction();
            } else if (buttonState && !buttonState.pressed && button.isPressed) {
                button.isPressed = false;
                button.buttonElement.classList.remove('pressed');
                console.log(`${button.name} released`);
                button.onRelease();
				button.onReleaseAction();
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
  PluginAPI.player.inventory.reload();
}

// Throttle the function to be called once every so many seconds
var throttledSetHotbarSlot = throttle(setHotbarSlot, 050); 



// Function to handle gamepad axis changes
function handleGamepadAxes() {
    const gamepad = navigator.getGamepads()[0];
		
		
		if (gamepad && gamepad.axes) {
        // Access the axes values
        const [leftStickX, leftStickY, rightStickX, rightStickY] = gamepad.axes;

        // Log the axes values
        //console.log(`Left Stick X: ${leftStickX}, Left Stick Y: ${leftStickY}`);
        //console.log(`Right Stick X: ${rightStickX}, Right Stick Y: ${rightStickY}`);
		
    //set the average speed (but not working. it crashes the game)
    // var averageSpeed = (Math.abs(leftStickX) + Math.abs(leftStickY) + Math.abs(rightStickX) + Math.abs(rightStickY)) / 4;

		//handle left stick
		
		if (leftStickY > leftStickDeadZone){
			setKeybindFromString("key.back", true); //move backwards
      //setPlayerWalkSpeed({speed: averageSpeed});
		} else if (leftStickY < Math.abs(leftStickDeadZone) * -1){
			setKeybindFromString("key.forward", true);// move forwards
     // setPlayerWalkSpeed({speed: Math.abs(averageSpeed)});
		}else {
			setKeybindFromString("key.forward", false); //disable the W/S buttons when stick is neutral
			setKeybindFromString("key.back", false);
     // setPlayerWalkSpeed({speed: 1});
		}
		
		if (leftStickX > leftStickDeadZone){
			setKeybindFromString("key.right", true);// move right
     // setPlayerWalkSpeed({speed: averageSpeed});
		} else if (leftStickX < Math.abs(leftStickDeadZone) * -1){
			setKeybindFromString("key.left", true); //move left
    //  setPlayerWalkSpeed({speed: Math.abs(averageSpeed)});
		}else {
			setKeybindFromString("key.left", false); //disable the a/d buttons when stick is neutral
			setKeybindFromString("key.right", false);
     // setPlayerWalkSpeed({speed: 1});
		}
		
		//handle right stick
		
		if (rightStickY > rightStickDeadZone){
			// write a script to move the view down
			
		} else if (rightStickY < Math.abs(rightStickDeadZone) * -1){
			// write a script to move the view up
			
			
		}else {
			// write a script to stop movement
			
		}
		
		if (rightStickX > rightStickDeadZone){
			// write a script to move the view right
			
		} else if (rightStickX < Math.abs(rightStickDeadZone) * -1){
			// write a script to move the view left
			
			
		}else {
			// write a script to stop movement
			
		}
		
	}

    // Request the next animation frame
    requestAnimationFrame(handleGamepadAxes);
}



// Define an empty JSON object to store button mappings
let buttonMappingJSON = {};

// Function to save button mappings to JSON
function saveButtonMappings() {
	console.log("saving buttons!")
    buttonMappingJSON = {};
    buttonList.forEach(button => {
        buttonMappingJSON[button.name] = button.key;
    });

    // Convert the JSON object to a string and save it to local storage
    localStorage.setItem('buttonMappingJSON', JSON.stringify(buttonMappingJSON));
}


// Function to load button mappings from JSON
function loadButtonMappings() {
    // Retrieve the JSON string from local storage
    const savedButtonMappings = localStorage.getItem('buttonMappingJSON');
	console.log("loading button save!")
    if (savedButtonMappings) {
        // Parse the JSON string to get the button mappings
        buttonMappingJSON = JSON.parse(savedButtonMappings);

        // Apply the saved button mappings
        buttonList.forEach(button => {
            const savedKey = buttonMappingJSON[button.name];
            if (savedKey !== undefined && savedKey !== null) {
                button.key = savedKey;
                // Call assignInput to apply the loaded mapping
                assignInput(button.name, savedKey);
            }
        });
    }
}


// lets gooooo
function initializePlugin() {
    handleGamepadAxes();
	setTimeout(() => setupButtons(), 9500);
    handleGamepad();
	setTimeout(() => loadButtonMappings(), 8000);
}

// Call the initialization function
initializePlugin();
