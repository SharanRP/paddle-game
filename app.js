const canvasEl = document.querySelector("canvas");
const canvasContext = canvasEl.getContext("2d");

canvasEl.width = window.innerHeight*1.9;
canvasEl.height = window.innerHeight*0.9;
// --------------------------------------------------------------------

let AIScore = new Audio()
let HIScore = new Audio()
let hit = new Audio()
let wall = new Audio()

AIScore.src = "sounds/AIScore.mp3";
HIScore.src = "sounds/RIScore.mp3";
wall.src = "sounds/wall.mp3";
hit.src = "sounds/hit.mp3";

const playerpaddleHI =
{
    xP : 0 ,
    yP : canvasEl.height/2 -50 ,
    color : "#FFE194",
    width : 9,
    height : 100 ,
    score : 0
}

const playerpaddleAI =
{
    xP : canvasEl.width -10 ,
    yP : canvasEl.height/2 -50 ,
    color : "#1B9C85",
    width : 9,
    height : 100 ,
    score : 0
}

const ball = 
{
    xP : canvasEl.width/2,
    yP : canvasEl.height/2,
    radius : 10 ,
    speed : 7 ,
    xV : 5 ,
    yV : 5 ,
    color :"#E8F6EF"
}

const net =
{
    xP : canvasEl.width/2 -1 ,
    yP : 0 ,
    width : 2 ,
    height : 15 ,
    color : "white"
}

canvasEl.addEventListener("mousemove" , paddlecontrol)

function paddlecontrol(e)
{
    let canvasRect = canvasEl.getBoundingClientRect();
    playerpaddleHI.yP = e.clientY -canvasRect.top - playerpaddleHI.height/2 ;
}

function drawRect(xP , yP , color , width , height )
{
    canvasContext.fillStyle = color ;
    canvasContext.fillRect(xP ,yP ,width , height)
}

function drawCircle(xP , yP , radius , color){
    canvasContext.fillStyle = color ;
    canvasContext.beginPath();
    canvasContext.arc(xP , yP , radius , 0 , Math.PI*2);
    canvasContext.fill()
}

function drawText(color , content , xP ,yP)
{
    canvasContext.fillStyle = color ;
    canvasContext.font = "35px sans-serif";
    canvasContext.fillText(content , xP , yP);
}

function resetBall()
{
    ball.xP = canvasEl.width/2;
    ball.yP = canvasEl.height/2;
    speed = 15;
}

function drawNet()
{
    for(let i = 0 ; i < canvasEl.height ; i+=25)
    {
        drawRect(net.xP , net.yP+i ,net.color , net.width , net.height )
    }
}

function paddleCollision(Ball , paddle)
{
    Ball.top = Ball.yP - Ball.radius ;
    Ball.bottom = Ball.yP + Ball.radius ;
    Ball.left = Ball.xP - Ball.radius ;
    Ball.right = Ball.xP + Ball.radius ;

    paddle.top = paddle.yP;
    paddle.bottom = paddle.yP + paddle.height ;
    paddle.left = paddle.xP ;
    paddle.right = paddle.xP + paddle.width ;


    return (Ball.right>paddle.left && Ball.bottom > paddle.top && Ball.top < paddle.bottom && Ball.left < paddle.right);
    
}

function main()
{
    ball.xP += ball.xV;
    ball.yP += ball.yV;

    let intelligenceLevel = Math.random() ;
    playerpaddleAI.yP += (ball.yP - (playerpaddleAI.yP + playerpaddleAI.height/2 ))*intelligenceLevel ;

    if(ball.yP > canvasEl.height-ball.radius || ball.yP < ball.radius)
    {
       ball. yV = -ball.yV;
       wall.play();
    }

    let player = ball.xP + ball.radius < canvasEl.width /2 ? playerpaddleHI : playerpaddleAI ;

    if(paddleCollision(ball , player ))
    {
        hit.play()

        let collisionPoint = ball.yP -(player.yP + player.height/2); 

        collisionPoint = collisionPoint/(player.height/2);

        let bounceAngle = (collisionPoint*Math.PI)/4 ;
        
        let direction = ball.xP + ball.radius < canvasEl.width/2 ? 1: -1 ;

        ball.xV = direction*ball.speed * Math.cos(bounceAngle);

        ball.yV = ball.speed * Math.sin(bounceAngle);

        ball.speed += 0.1 ;
    };

    if(ball.xP + ball.radius < 0)
    {
        playerpaddleAI.score++;
        AIScore.play();
        resetBall();
    }
    else if (ball.xP - ball.radius > canvasEl.width)
    {
        playerpaddleHI.score++;
        HIScore.play();
        resetBall();
    }

}

function runGame()
{
    drawRect(0 , 0 ,"#4C4C6D" , canvasEl.width , canvasEl.height);
    drawNet();
    drawText("white" , playerpaddleHI.score , (canvasEl.width/4), (canvasEl.height/10));
    drawText("white" , playerpaddleAI.score , (3*canvasEl.width/4), (canvasEl.height/10));
    drawRect(playerpaddleAI.xP , playerpaddleAI.yP , playerpaddleAI.color , playerpaddleAI.width , playerpaddleAI.height )
    drawRect(playerpaddleHI.xP , playerpaddleHI.yP , playerpaddleHI.color , playerpaddleHI.width , playerpaddleHI.height );
    drawCircle(ball.xP,ball.yP,ball.radius ,ball.color);
}

function gameInit(){
    runGame();
    main()
}

const fps = 60;
setInterval(gameInit , 1000/fps);