
let board=Array(9).fill("");
let current='X',gameOver=false,moves=[];
let p1='Player 1',p2='AI';

const boardDiv=document.getElementById('board');

document.getElementById('historyBtn').onclick=()=>{
document.getElementById('historyPanel').classList.toggle('open');
}

function toggleInputs(){
const mode=document.getElementById('mode').value;
document.getElementById('aiInputs').style.display=mode==='ai'?'block':'none';
document.getElementById('pvpInputs').style.display=mode==='pvp'?'block':'none';
}

function startGame(){
if(document.getElementById('mode').value==='ai'){
p1=document.getElementById('player1').value||'Player';
p2='AI';
}else{
p1=document.getElementById('player1pvp').value||'Player 1';
p2=document.getElementById('player2pvp').value||'Player 2';
}
restartGame();
}

function render(){
boardDiv.innerHTML='';
board.forEach((v,i)=>{
let c=document.createElement('div');
c.className='cell';
c.innerText=v;
c.onclick=()=>move(i);
boardDiv.appendChild(c);
});
document.getElementById('turn').innerText='Current Turn: '+(current==='X'?p1:p2)+' ('+current+')';
}

function move(i){
if(board[i]||gameOver)return;
moves.push({board:[...board],current});
board[i]=current;

let win=checkWinner();
if(win){
gameOver=true;
win.forEach(x=>boardDiv.children[x]?.classList.add('win'));
let winner=current==='X'?p1:p2;
document.getElementById('result').innerText=winner+' Wins!';
saveHistory(winner);
render();
return;
}

if(board.every(x=>x)){
gameOver=true;
document.getElementById('result').innerText='Draw!';
saveHistory('Draw');
render();
return;
}

current=current==='X'?'O':'X';
render();

if(document.getElementById('mode').value==='ai' && current==='O'){
setTimeout(aiMove,400);
}
}

function aiMove(){
let empty=board.map((v,i)=>v===''?i:null).filter(x=>x!==null);
let d=document.getElementById('difficulty').value;
let moveIndex;

if(d==='Easy'){
moveIndex=empty[Math.floor(Math.random()*empty.length)];
}else if(d==='Medium'){
moveIndex=Math.random()<0.5?empty[0]:empty[Math.floor(Math.random()*empty.length)];
}else{
moveIndex=empty[0];
}
move(moveIndex);
}

function checkWinner(){
const w=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
for(let c of w){
if(board[c[0]]&&board[c[0]]===board[c[1]]&&board[c[1]]===board[c[2]]) return c;
}
return null;
}

function undoMove(){
if(!moves.length)return;
let last=moves.pop();
board=last.board;
current=last.current;
gameOver=false;
document.getElementById('result').innerText='Game Continued';
render();
}

function restartGame(){
board=Array(9).fill('');
current='X';
gameOver=false;
moves=[];
document.getElementById('result').innerText='Game Started';
render();
}

function saveHistory(winner){
let h=JSON.parse(localStorage.getItem('ttt_history')||'[]');
h.unshift({
players:p1+' vs '+p2,
winner:winner,
date:new Date().toLocaleString()
});
localStorage.setItem('ttt_history',JSON.stringify(h));
loadHistory();
}

function loadHistory(){
let h=JSON.parse(localStorage.getItem('ttt_history')||'[]');
document.getElementById('historyList').innerHTML=h.map(x=>
`<div class="historyCard"><b>${x.players}</b><br>Winner: ${x.winner}<br>${x.date}</div>`
).join('');
}

function clearHistory(){
localStorage.removeItem('ttt_history');
loadHistory();
}

loadHistory();
render();
