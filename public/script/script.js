let p1,p2,score=0,border,winner;
let images={'Rock':'images/icon-rock.svg','Paper':'images/icon-paper.svg','Scissors':'images/icon-scissors.svg','Lizard':'images/icon-lizard.svg','Spock':'images/icon-spock.svg'};

let previouslySelected="";
const clientSocket=io();

function bot_mode(p1_choice){
    if(previouslySelected){
        previouslySelected.style.borderColor="white";
    }
    border=p1_choice.parentElement;
    previouslySelected=border;
    border.style.borderColor="red";
    p1=p1_choice.alt;

    computer_choices=['Rock','Paper','Scissors','Lizard','Spock'];
    
    choice=Math.floor(Math.random()*computer_choices.length);

    p2=computer_choices[choice];

    let bot_path=document.querySelector(".computer .image img");
    let result=document.querySelector(".computer p")
    let path=images[p2];
    bot_path.src=path;
    bot_path.style.display="block";
    result.innerText=p2;
    result.style.color="white";
    document.querySelector(".score #score").innerText=score;
    console.log(`p1 = ${p1}, p2 = ${p2}`);
    
    if(p1==p2){
        console.log("Match Draw");
        document.querySelector(".result p").innerText=`Match Draw`;
        document.querySelector(".result p").style.color="yellow";

    }
    else{
        check(p1,p2);
        document.querySelector(".result p").innerText=`${winner} Won ...!`;
        if(winner=='Bot'){
            document.querySelector(".result p").style.color="red";
        }
        else{
            document.querySelector(".result p").style.color="green";
        }
        
    }
   
}

rock=['Scissors','Lizard'];
paper=['Rock','Spock'];
Scissors=['Paper','Lizard'];
Lizard=['Paper','Spock'];
Spock=['Scissors','Rock'];

function check(p1,p2){

if(p1=='Rock'){
    if(rock.includes(p2)){
        console.log(`${p1} wins`);
        winner=p1;
        score+=1;
    }
    else{
        console.log(`${p2} wins`);
        winner='Bot';
    }
}

else if(p1=='Paper'){
    if(paper.includes(p2)){
        console.log(`${p1} wins`);
        winner=p1;
        score+=1;
    }
    else{
        console.log(`${p2} wins`);
        winner='Bot';
    }
}

else if(p1=='Scissors'){
    if(Scissors.includes(p2)){
        console.log(`${p1} wins`);
        winner=p1;
        score+=1;
    }
    else{
        console.log(`${p2} wins`);
        winner='Bot';
    }
}

else if(p1=='Lizard'){
    if(Lizard.includes(p2)){
        console.log(`${p1} wins`);
        winner=p1;
        score+=1;
    }
    else{
        console.log(`${p2} wins`);
        winner='Bot';
    }
}

else if(p1=='Spock')
{
    if(Spock.includes(p2)){
        console.log(`${p1} wins`);
        winner=p1;
        score+=1;
    }
    else{
        console.log(`${p2} wins`);
        winner='Bot';
    }
}
}

const playBtn=document.querySelector("#play");
const copyBtn=document.querySelector("#copy");
const roomName=document.querySelector("#room-name");
const roomPass=document.querySelector("#room-pass");
const roomContainer=document.querySelector("#create-room");
const createRoomBtn=document.querySelector("#create-room-btn");
const joinRoomBtn=document.querySelector("#join-room-btn");
const modeDiv=document.querySelector(".mode-page");
const statusShower=document.querySelector("#status");
const joinRoomContainer = document.querySelector("#join-room");
const roomListUL = document.querySelector("#room-list");

joinRoomBtn.addEventListener("click", () => {
    modeDiv.style.display = "none";
    roomContainer.style.display = "none";
    joinRoomContainer.style.display = "block";
    clientSocket.emit("get-rooms");
});

clientSocket.on("player-connected", (msg) => {
    alert(msg);
    window.location.href = `/p2p-mode?room=${currentRoom}`;
});

clientSocket.on("room-list", (rooms) => {
   roomListUL.innerHTML = "";
    if (rooms.length==0) {
        roomListUL.innerHTML = "<li>No rooms available</li>";
        return;
    }

    rooms.forEach(roomName => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${roomName}</span>
            <input type="text" placeholder="Enter Room Password" id="pass-${roomName}"/>
            <button onclick="joinRoom('${roomName}')">Join</button>
        `;
        roomListUL.appendChild(li);
    });
});


createRoomBtn.addEventListener("click",()=>{
    modeDiv.style.display="none";
    roomContainer.style.display="block";
})

let currentRoom = null; 

playBtn.addEventListener("click", () => {
    if (!validator()) {
        statusShower.innerText = "Fill the fields to play";
        return;
    }

    const roomId = roomName.value.trim();
    const roomPassword = roomPass.value.trim();

    currentRoom = roomId;

    clientSocket.emit("create-room", { roomName: roomId, roomPass: roomPassword });

    clientSocket.on("status-info", (msg) => {
        console.log(msg);
        console.log("working");
        statusShower.innerText = msg;
        alert(msg);
        if (msg.includes("created")) {
            window.location.href = `/p2p-mode?room=${roomId}&pass=${roomPassword}`;
        }
    });
});



copyBtn.addEventListener("click",()=>{
    if(validator()){
        let roomInfo="";
        roomInfo+="Room Name : "+roomName.value+"\n"+"Password : "+roomPass.value;
        navigator.clipboard.writeText(roomInfo).then(()=>{
            statusShower.innerText="room info copied successfully";
        }).catch((err)=>{
            statusShower.innerText="problem in copying room info"
        })
    }
    statusShower.innerText="fill the fields to play";
});

function validator(){
    return roomName.value.trim()!=""&&roomPass.value.trim()!="";
}


function joinRoom(roomName) {
    console.log("working on ",roomName);
    const passInput = document.querySelector(`#pass-${roomName}`);
    const password = passInput.value;

    if (!password) {
        alert("Enter room password");
        return;
    }

    currentRoom = roomName;
    clientSocket.emit("join-room", { roomId:roomName, roomPass: password });
}
