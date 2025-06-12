let inputBox;           // The box where you type your answer
let submitButton;       // The button you click to send or refresh
let eraseCounter = 0;   // Counts how many times we erased your input so far
let maxErases = 2;      // How many times we erase input before stopping glitches
let userInput = "";     // Stores your final answer when you submit
let submitted = false;  // True if you already sent your answer, false at start

let lastGlitchTime = 0;     // Keeps track of when the last glitch happened
let glitchInterval = 1200;  // Time between glitches in milliseconds (1.2 seconds)
let glitchWords = [         // Funny words used to replace your words during glitches
  "BLABLABLA", "SoWHAT?", "BORING", "DontCare", "Go Cry About It", "UR DUMB"
];

let errorMessage = ""; // Stores message if you try to submit empty input

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);                 // Make all text centered
  textSize(30);                             // font size

  // Create the input box and put it in the middle of the screen
  inputBox = createInput("");
  inputBox.position(width / 2 - 200, height / 2);
  inputBox.style('font-size', '20px');     // Make the text inside input box size 20
  inputBox.size(400);                       // Make input box wide enough for typing

  // Create the button and put it below the input box
  submitButton = createButton("Refresh");  // Button starts labeled "Refresh"
  submitButton.position(width / 2 - 40, height / 2 + 50);
  submitButton.mousePressed(handleSubmit); // When clicked, run the handleSubmit function
}

function draw() {
  background(30);        // background color
  fill(255);             // text color

  // Write instructions at the top center of the screen
  text("Describe what is bothering you:", width / 2, 150);

  // If you haven't submitted yet, and haven't erased input twice,
  // and you've typed more than 8 characters, do glitch every 1.2 seconds
  if (!submitted && eraseCounter < maxErases && inputBox.value().length > 8) {
    if (millis() - lastGlitchTime > glitchInterval) {
      glitchInput();               // Make your input glitch
      lastGlitchTime = millis();  // Remember the time glitch happened
    }
  }

  // If there is an error message, show it in red under the input box
  if (errorMessage !== "") {
    fill(255, 100, 100);           // error text color
    textSize(24);                  // error text size
    text(errorMessage, width / 2, height / 2 + 120);
    fill(255);                    // Reset text color to white for other text
    textSize(30);                 // Reset text size back to normal
  }
}

// This function changes the input text to glitch it a little
function glitchInput() {
  // Take what you typed and split it into separate words by spaces
  let words = inputBox.value().split(" ");

  if (words.length === 0) return;   // If input is empty, do nothing

  // Pick a random number 0 or 1
  let choice = floor(random(2));

  // Pick a random word position in your input
  let targetIndex = floor(random(words.length));

  if (choice === 0 && words.length > 1) {
    // Remove one random word from your input if there's more than one word
    words.splice(targetIndex, 1);
  } else {
    // Replace one random word with a funny glitch word
    words[targetIndex] = random(glitchWords);
  }

  // Put all words back together and show the glitched text in the input box
  inputBox.value(words.join(" "));
}

// What happens when you click the button
function handleSubmit() {
  // Get what you typed, and remove spaces at start and end
  let textEntered = inputBox.value().trim();

  if (eraseCounter < maxErases) {
    // If we still need to erase input (glitching phase):
    inputBox.value("");    // Clear the input box (erase what you typed)
    eraseCounter++;       // Add 1 to how many times we've erased

    // After erasing twice, change button label from "Refresh" to "Submit"
    if (eraseCounter >= maxErases) {
      submitButton.html("Submit");
    }
    errorMessage = "";    // Clear any error messages during glitching
  } else if (!submitted) {
    // If glitching is done and you haven't submitted yet:

    if (textEntered === "") {
      // If you try to submit with an empty input, show error message
      errorMessage = "Don't be shy, share with me!";
      return;  // Stop here, don't submit empty input
    }

    // Otherwise, save your input as the final answer
    userInput = textEntered;
    submitted = true;              // Mark that you've submitted your answer
    inputBox.attribute("disabled", "");      // Disable input box 
    submitButton.attribute("disabled", "");  // Disable button
    errorMessage = "";             // Clear error message on successful submit
  }
}
