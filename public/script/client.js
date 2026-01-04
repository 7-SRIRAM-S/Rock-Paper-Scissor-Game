const clientSocket = io();

// console.log(clientSocket);

let images = { 'Rock': 'images/icon-rock.svg', 'Paper': 'images/icon-paper.svg', 'Scissors': 'images/icon-scissors.svg', 'Lizard': 'images/icon-lizard.svg', 'Spock': 'images/icon-spock.svg' };
let currentRoom = null;

const connectBtn = document.querySelector("#connect-btn");
const quitBtn = document.querySelector("#quit-btn");
const statusTag = document.querySelector("#status");
const p1Score = document.querySelector("#p1-score");
const p2Score = document.querySelector("#p2-score");
const opponentImg = document.querySelector(".computer .image img");
const opponentText = document.querySelector(".computer p");



const parameters = new URLSearchParams(window.location.search);

currentRoom = parameters.get("room");
const roomPass = parameters.get("pass");
// statusTag.innerText = `Waiting for Player 2 in Room : ${currentRoom}`;
statusTag.innerText = `click connect button to play game ...`;

console.log("room id : ", currentRoom, "password  : ", roomPass);


let p1 = 0, p2 = 0;
gameStarted = false;

connectBtn.addEventListener("click", () => {
     statusTag.style.color = "white";
     gameStarted = true;
     clientSocket.emit("connect-player");
     statusTag.innerText = "waiting for player-2...";
})

quitBtn.addEventListener("click", () => {
     clientSocket.emit("quit");
     window.location.reload();
})

clientSocket.on("player-connected", (msg) => {
     statusTag.innerText = msg;
})

clientSocket.on("status", (msg) => {
     statusTag.innerText = msg;
})

clientSocket.on("sent-result", ({ opponentChoice, result }) => {
     opponentImg.src = images[opponentChoice];
     opponentImg.style.display = 'block';
     opponentText.innerText = opponentChoice;
     opponentText.style.color = "white";

     if (result == "win") {
          statusTag.innerText = "You Won";
          p1++;
     }
     else if (result == "lose") {
          statusTag.innerText = "Opponent Won";
          p2++;
     }
     else {
          statusTag.innerText = "Match Draw";
     }

     updateScore();
})

let previouslySelected = "";

function sendMove(playerClickedImg) {
     if (!gameStarted) {
          statusTag.style.color = "red";
          return;
     }
     if (previouslySelected) {
          previouslySelected.style.borderColor = "white";
     }
     border = playerClickedImg.parentElement;
     previouslySelected = border;
     border.style.borderColor = "red";
     const playerChoice = playerClickedImg.alt;
     if (currentRoom) {
          clientSocket.emit("room-player-choice", {
               roomId: currentRoom,
               choice: playerChoice
          });
     }
     else {
          clientSocket.emit("player-choice", playerChoice);
     }
     statusTag.innerText = "opponent is thinking...";
}

function updateScore() {
     p1Score.innerText = p1;
     p2Score.innerText = p2;
}