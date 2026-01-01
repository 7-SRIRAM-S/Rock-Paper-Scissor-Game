const express=require("express");
const http=require("http");
const {Server}=require("socket.io");
const path=require("path");
const { calculateMac } = require("postman-request/lib/hawk");

const app=express();
const server=http.createServer(app);

app.use(express.static(path.join(__dirname,"public")));

const io=new Server(server);

app.get("/",(req,res)=>{
     res.sendFile("index.html");
})

app.get("/bot-mode",(req,res)=>{
     res.sendFile(path.join(__dirname,"public","botmode.html"));
})

app.get("/p2p-mode",(req,res)=>{
     res.sendFile(path.join(__dirname,'public','p2pmode.html'));
})

let players=[];
let choices=[];

io.on("connection",(socket)=>{
     socket.on("connect-player",()=>{
          players.push(socket.id);
          socket.join("play-area");
          console.log(socket.id+" connected");
          if(players.length>2){
               socket.emit("status","room is full\ntry again later");
          }  
          if(players.length==0){
               socket.emit("status","press connect to play...");
          }
          if(players.length==2){
               io.emit("player-connected","player connected\nlet's play");
          }   
     })

     socket.on("player-choice",(choice)=>{
          if(choices.length>2){
               choices=[];
               return;
          }
          choices.push({id:socket.id,choice});
          if(choices.length==2){
               const result=calculateResult(choices[0].choice,choices[1].choice);
               io.to(choices[0].id).emit("sent-result",{opponentChoice:choices[1].choice,result});
               io.to(choices[1].id).emit("sent-result",{opponentChoice:choices[0].choice,result});
               // socket.emit("opponent-choice",choice);
               choices=[];
          }
     })

     socket.on("quit",()=>{
          io.emit("status","waiting for player-2...");
          console.log(socket.id+"is quitting..");
          players=players.filter((ele)=> ele!=socket.id);
     })    
})

console.log(players);

server.listen(2518,(err)=>{
     if(err){
          console.log(err);
     }
     else{
          console.log("server is running on http://localhost:2518");
     }
})

const rules = {
     Rock:["Scissors","Lizard"],
     Paper:["Rock","Spock"],
     Scissors:["Paper","Lizard"],
     Lizard:["Paper","Spock"],
     Spock:["Scissors","Rock"]
 };

 
function calculateResult(p1Choice,p2Choice){

     console.log(p1Choice,p2Choice);

     if(p1Choice==p2Choice) {
          return "draw";
      }

      if(rules[p1Choice].includes(p2Choice)) {
          return "player1";
      }
  
      return "player2";
}