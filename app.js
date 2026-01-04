const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const { calculateMac } = require("postman-request/lib/hawk");

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "public")));

const io = new Server(server);

app.get("/", (req, res) => {
     res.sendFile("index.html");
})

app.get("/bot-mode", (req, res) => {
     res.sendFile(path.join(__dirname, "public", "botmode.html"));
})

app.get("/p2p-mode", (req, res) => {
     res.sendFile(path.join(__dirname, 'public', 'p2pmode.html'));
})

let players = [];
let choices = [];
let rooms = {};

io.on("connection", (socket) => {
     socket.on("connect-player", () => {
          players.push(socket.id);
          socket.join("play-area");
          console.log(socket.id + " connected");
          if (players.length > 2) {
               socket.emit("status", "room is full\ntry again later");
          }
          if (players.length == 0) {
               socket.emit("status", "press connect to play...");
          }
          if (players.length == 2) {
               io.emit("player-connected", "player connected\nlet's play");
          }
     })

     socket.on("player-choice", (choice) => {
          if (choices.length > 2) {
               choices = [];
               return;
          }
          choices.push({ id: socket.id, choice });
          if (choices.length == 2) {
               const result = calculateResult(choices[0].choice, choices[1].choice);
               let resultP1, resultP2;
               if (result == "draw") {
                    resultP1 = "draw";
                    resultP2 = "draw";
               }
               else if (result == "player1") {
                    resultP1 = "win";
                    resultP2 = "lose";
               }
               else {
                    resultP1 = "lose";
                    resultP2 = "win";
               }

               io.to(choices[0].id).emit("sent-result", {
                    opponentChoice: choices[1].choice,
                    result: resultP1
               });

               io.to(choices[1].id).emit("sent-result", {
                    opponentChoice: choices[0].choice,
                    result: resultP2
               });
               // socket.emit("opponent-choice",choice);
               choices = [];
          }
     })

     socket.on("create-room", ({ roomName, roomPass }) => {
          if (!rooms[roomName]) {
               rooms[roomName] = { password: roomPass, players: [socket.id] };
               socket.join(roomName);
               socket.emit("status-info", `Room ${roomName} created ! Waiting for player 2...`);
          } else {
               socket.emit("status-info", "Room ID already exists!");
          }
     });

     socket.on("get-rooms", () => {
          const availableRooms = Object.entries(rooms).filter(([id, room]) => room.players.length < 2).map(([id]) => id);
          socket.emit("room-list", availableRooms);
     });

     socket.on("join-room", ({ roomId, roomPass }) => {
          const room = rooms[roomId];
          if (!room){
               console.log("no room available");
               socket.emit("status-info","no rooms available");
               return;
          }
          if (room.password != roomPass) {
               console.log("wrong password");
               socket.emit("status-info", "Wrong password !");
               return;
          }
          if (room.players.length >= 2) {
               console.log("room full");
               socket.emit("status-info", "Room is full !\ntry again later...");
               return;
          }
          console.log("into the room => ",socket.id);
          room.players.push(socket.id);
          socket.join(roomId);

          console.log("emitted");
          io.to(roomId).emit("player-connected", "Both players connected. Let's play!");
     });

     socket.on("room-player-choice", ({ roomId, choice }) => {
          if (!rooms[roomId]) {
               return;
          } 

          if (!rooms[roomId].choices) {
               rooms[roomId].choices = [];
          } 

          rooms[roomId].choices.push({ id: socket.id, choice });

          if (rooms[roomId].choices.length == 2) {
               const result = calculateResult(
                    rooms[roomId].choices[0].choice,
                    rooms[roomId].choices[1].choice
               );

               let resultP1, resultP2;
               if (result == "draw") {
                    resultP1 = "draw";
                    resultP2 = "draw";
               }
               else if (result == "player1") {
                    resultP1 = "win";
                    resultP2 = "lose";
               }
               else {
                    resultP1 = "lose";
                    resultP2 = "win";
               }

               io.to(rooms[roomId].choices[0].id).emit("sent-result", {
                    opponentChoice:rooms[roomId].choices[1].choice,
                    result: resultP1
               });

               io.to(rooms[roomId].choices[1].id).emit("sent-result", {
                    opponentChoice: rooms[roomId].choices[0].choice,
                    result: resultP2
               });

               rooms[roomId].choices = [];
          }
     });

     socket.on("quit", () => {
          io.emit("status", "waiting for player-2...");
          console.log(socket.id + "is quitting..");
          players.pop();
     })
})

console.log(rooms);

server.listen(2518, (err) => {
     if (err) {
          console.log(err);
     }
     else {
          console.log("server is running on http://localhost:2518");
     }
})

const rules = {
     Rock: ["Scissors", "Lizard"],
     Paper: ["Rock", "Spock"],
     Scissors: ["Paper", "Lizard"],
     Lizard: ["Paper", "Spock"],
     Spock: ["Scissors", "Rock"]
};


function calculateResult(p1Choice, p2Choice) {

     console.log(p1Choice, p2Choice);

     if (p1Choice == p2Choice) {
          return "draw";
     }

     if (rules[p1Choice].includes(p2Choice)) {
          return "player1";
     }

     return "player2";
}