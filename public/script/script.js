let p1,p2,score=0,border,winner;
let images={'Rock':'images/icon-rock.svg','Paper':'images/icon-paper.svg','Scissors':'images/icon-scissors.svg','Lizard':'images/icon-lizard.svg','Spock':'images/icon-spock.svg'};

let previouslySelected="";

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

// else{
//     console.log("Match Draw");
// }
}