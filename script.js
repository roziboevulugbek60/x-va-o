const cells = document.querySelectorAll(".cell");

const statusText = document.getElementById("status");

const restartBtn = document.getElementById("restart");

const modeSelect = document.getElementById("mode");
const levelSelect = document.getElementById("level");


const playerScoreText = document.getElementById("playerScore");
const botScoreText = document.getElementById("botScore");
const drawScoreText = document.getElementById("drawScore");


let board = ["","","","","","","","",""];


let currentPlayer = "X";

let gameActive = true;



let scores = {

    player:0,
    bot:0,
    draw:0

};



const winPatterns=[

[0,1,2],
[3,4,5],
[6,7,8],

[0,3,6],
[1,4,7],
[2,5,8],

[0,4,8],
[2,4,6]

];




// Katak bosish

cells.forEach((cell,index)=>{


    cell.addEventListener("click",()=>{


        if(!gameActive || board[index]!="")
            return;



        makeMove(index,currentPlayer);



        if(checkGame())
            return;



        if(modeSelect.value==="bot" && currentPlayer==="O"===false){

            currentPlayer="O";

            statusText.textContent="🤖 Bot o'ylayapti...";


            setTimeout(botMove,500);


        }
        else{

            changeTurn();

        }



    });


});





function makeMove(index,player){


    board[index]=player;

    cells[index].textContent=player;

    cells[index].classList.add(player);


}





function changeTurn(){


    currentPlayer =
    currentPlayer==="X" ? "O" : "X";


    statusText.textContent =
    currentPlayer+" navbati";


}






function botMove(){


    let move;


    let level=levelSelect.value;



    if(level==="easy"){


        move=randomMove();


    }

    else if(level==="medium"){


        if(Math.random()<0.5)

            move=bestMove();

        else

            move=randomMove();


    }

    else{


        move=bestMove();


    }



    makeMove(move,"O");



    if(checkGame())

        return;



    currentPlayer="X";


    statusText.textContent="Sizning navbatingiz (X)";


}







function randomMove(){


    let empty=[];


    board.forEach((v,i)=>{


        if(v==="")

            empty.push(i);


    });


    return empty[
        Math.floor(Math.random()*empty.length)
    ];

}





// Aqlli yurish

function bestMove(){


    let bestScore=-Infinity;

    let move;



    for(let i=0;i<9;i++){


        if(board[i]===""){


            board[i]="O";


            let score=minimax(board,0,false);


            board[i]="";



            if(score>bestScore){


                bestScore=score;

                move=i;


            }


        }

    }


    return move;


}







function minimax(newBoard,depth,isMax){



    let result=getWinner(newBoard);



    if(result==="O")

        return 10-depth;


    if(result==="X")

        return depth-10;


    if(!newBoard.includes(""))

        return 0;



    if(isMax){


        let best=-Infinity;


        for(let i=0;i<9;i++){


            if(newBoard[i]===""){


                newBoard[i]="O";


                best=Math.max(
                    best,
                    minimax(newBoard,depth+1,false)
                );


                newBoard[i]="";

            }


        }


        return best;


    }

    else{


        let best=Infinity;


        for(let i=0;i<9;i++){


            if(newBoard[i]===""){


                newBoard[i]="X";


                best=Math.min(
                    best,
                    minimax(newBoard,depth+1,true)
                );


                newBoard[i]="";


            }


        }


        return best;

    }


}








function checkGame(){


    let winner=getWinner(board);



    if(winner){


        gameActive=false;



        if(winner==="X"){


            statusText.textContent="🎉 Siz yutdingiz!";

            scores.player++;


        }
        else{


            statusText.textContent="🤖 Bot yutdi!";

            scores.bot++;


        }



        updateScore();

        return true;


    }



    if(!board.includes("")){


        statusText.textContent="🤝 Durrang!";


        scores.draw++;


        updateScore();


        gameActive=false;


        return true;


    }



    return false;


}






function getWinner(arr){


    for(let pattern of winPatterns){


        let a=arr[pattern[0]];

        let b=arr[pattern[1]];

        let c=arr[pattern[2]];



        if(a && a===b && a===c)

            return a;


    }


    return null;

}







function updateScore(){


    playerScoreText.textContent=scores.player;

    botScoreText.textContent=scores.bot;

    drawScoreText.textContent=scores.draw;


}







restartBtn.addEventListener("click",()=>{


    board=["","","","","","","","",""];


    currentPlayer="X";


    gameActive=true;



    cells.forEach(cell=>{


        cell.textContent="";

        cell.classList.remove("X");

        cell.classList.remove("O");


    });



    statusText.textContent=
    "Siz boshlaysiz (X)";


});