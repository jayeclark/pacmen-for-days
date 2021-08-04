const speed = 6;
const ghosts = [];

let board = ['XXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
             'X-------X-----------X-------X',
             'XB------X-----------X-----B-X',
             'X--XXX--X--XXXXXXX--X--XXX--X',
             'X---------------------------X',
             'X---------------------------X',
             'XXX--X--XXXX--X--XXXX--X--XXX',
             'XXX--X--XXXX--X--XXXX--X--XXX',
             '-----X--------X--------X-----',
             '-----X--------X--------X-----',
             'XXX--XXXX--XXXXXXX--XXXX--XXX',
             'SSX------SSSSSSSSSSS------XSS',
             'SSX------SSSSSSSSSSS------XSS',
             'SSX--XXXXSSGGGGGGGSSXXXX--XSS',
             'SSX--X---SSGGGGGGGSS---X--XSS',
             'SSX--X---SSGGGGGGGSS---X--XSS',
             'XXX--X--XSSGGGGGGGSSX--X--XXX',
             '--------XSSSSSSSSSSSX--------',
             '--------XSSSSSSSSSSSX--------',
             'XXX--XXXXXXX--X--XXXXXXX--XXX',
             'SSX-----------X-----------XSS',
             'SSX-----------X-----------XSS',
             'XXX--XXXX--XXXXXXX--XXXX--XXX',
             'X-------------P-------------X',    
             'X---------------------------X',  
             'X--XXX--XXXX--X--XXXX--XXX--X',    
             'X--XXX--X-----X-----X--XXX--X',    
             'XB-XXX--X-----X-----X--XXXB-X',    
             'X--XXX--X--XXXXXXX--X--XXX--X',    
             'X---------------------------X',    
             'X---------------------------X',    
             'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX'];

let height = +window.innerHeight - 40;
let width = +window.innerWidth - 40;
let rowHeight = Math.floor(height / ((board.length + 2) * speed)) * speed;
let colHeight = Math.floor((+window.innerWidth - 40) / (board[0].length * speed)) * speed;
let cellW = Math.min(rowHeight,colHeight);

let pacWidth = cellW * 1.5;
let dotWidth = Math.floor(cellW / 9) * 2;

let pacPos = {'col' : 0, 'colM' : 1, 'row' : 0, 'rowM' : 1}; 

for (let i = 0; i < board.length; i++) {
  let thisRow = board[i];
  if (thisRow.includes('P')) {
    pacPos.col = thisRow.indexOf('P');
    pacPos.colM = thisRow.indexOf('P') + 1;
    pacPos.row = i;
    pacPos.rowM = i + 1;
    break;
  }
}

function checkCorners(pos) {

  let res = {'borderTopLeft' : 'none', 'borderTopRight' : 'none', 'borderBottomLeft' : 'none', 'borderBottomRight' : 'none'};
  let n = checkNeighbors(pos);
  if (n.top.search(/[\-SPB]/) > -1 && n.topRight.search(/[\-SPB]/) > -1 && n.right.search(/[\-SPB]/) > -1) {res.borderTopRight = 'hall';}
  if (n.right.search(/[\-SPB]/) > -1 && n.bottomRight.search(/[\-SPB]/) > -1 && n.bottom.search(/[\-SPB]/) > -1) {res.borderBottomRight = 'hall';}
  if (n.bottom .search(/[\-SPB]/) > -1 && n.bottomLeft.search(/[\-SPB]/) > -1 && n.left.search(/[\-SPB]/) > -1) {res.borderBottomLeft = 'hall';}
  if (n.left.search(/[\-SPB]/) > -1 && n.topLeft.search(/[\-SPB]/) > -1 && n.top.search(/[\-SPB]/) > -1) {res.borderTopLeft = 'hall';}
  if (n.top === 'X' && n.topRight === 'X' && n.right === 'X') {res.borderTopRight = 'wall';}
  if (n.right === 'X' && n.bottomRight === 'X' && n.bottom === 'X') {res.borderBottomRight = 'wall';}
  if (n.bottom === 'X' && n.bottomLeft === 'X' && n.left === 'X') {res.borderBottomLeft = 'wall';}
  if (n.left === 'X' && n.topLeft === 'X' && n.top === 'X') {res.borderTopLeft = 'wall';}

  return res;

}

function checkNeighbors(pos) {

  let col = pos.col;
  let row = pos.row;

  let res = {'top' : 'E', 'topRight' : 'E', 'right' : 'E', 'bottomRight' : 'E',
             'bottom' : 'E', 'bottomLeft' : 'E', 'left' : 'E', 'topLeft' : 'E'};

  if (row > 0) {res.top = board[row - 1].charAt(col)};
  if (row > 0 && col + 1 < board[0].length) {res.topRight = board[row - 1].charAt(col + 1);}
  if (col + 1 < board[0].length) {res.right = board[row].charAt(col + 1);}
  if (col + 1 < board[0].length && row < board.length - 1) {res.bottomRight = board[row + 1].charAt(col + 1);}
  if (row + 1 < board.length) {res.bottom = board[row + 1].charAt(col);}
  if (row + 1 < board.length && col > 0 ) {res.bottomLeft = board[row + 1].charAt(col - 1);}
  if (col > 0) {res.left= board[row].charAt(col - 1);}
  if (col > 0 && row > 0) {res.topLeft = board[row - 1].charAt(col - 1);}

  return res;

}

function drawBoard(board) {

  dotCount = 0;
  let game = document.getElementById('game');
  let scoreDiv = document.getElementById('score-board');
  let ghostStartRow = -1;
  let ghostStartCol = -1;
  scoreDiv.style.left = (board[0].length * cellW - parseInt(scoreDiv.style.width)) + "px";

  board.forEach((x,i)=>{

    if (x.includes('G') && ghostStartRow === -1) {ghostStartCol = x.indexOf('G');ghostStartRow = i;}

    for (let j = 0; j < x.length; j++) {

      if (x.charAt(j) === 'X') {

        let block = document.createElement('div');
        block.style.position = "absolute";
        block.style.zIndex = "50";
        block.style.backgroundColor = "#f4bb9c";
        //block.style.backgroundColor = "#ff9884";
        block.style.top = cellW * i;
        block.style.left = cellW * j;
        block.style.height = cellW;
        block.style.width = cellW;

        let corners = checkCorners({'col' : j,'row' : i});

        for (c in corners) {
          if (corners[c] === 'hall') {
            block['style'][c + 'Radius'] = cellW / 2 + "px";
          }
        }

        let neighbors = checkNeighbors({'col' : j,'row' : i});
        if (neighbors.left.search(/[\-SPB]/) > -1) { block.style.borderLeft = 'solid 3px #e33022'; }
        if (neighbors.right.search(/[\-SPB]/) > -1) { block.style.borderRight = 'solid 3px #e33022'; }
        if (neighbors.top.search(/[\-SPB]/) > -1) { block.style.borderTop = 'solid 3px #e33022'; }
        if (neighbors.bottom.search(/[\-SPB]/) > -1) { block.style.borderBottom = 'solid 3px #e33022'; }

        game.appendChild(block);

      } else {

        // Make the dots!

        let corners = checkCorners({'row':i,'col':j});

        if (corners.borderBottomRight === 'hall' 
            && board[i].charAt(j) !== 'P' 
            && board[i].charAt(j) !== 'G' 
            && board[i].charAt(j+1) !== 'P' 
            && board[i].charAt(j+1) !== 'S' 
            && board[i+1].charAt(j) !== 'S' 
            ) {
          let dot = document.createElement('div');
          dot.style.position = "absolute";
          dot.id = 'dot-'+dotCount; 
          dot.style.backgroundColor = "#e1e1fb";
          //dot.style.borderColor = "yellow";
          //dot.style.borderWidth = "1px";
          //dot.style.borderStyle = "solid";
          //dot.style.borderRadius = "50%";
          dot.style.zIndex = "102";
          dot.classList.add('pac-dot');
          dot.classList.add('pac-dot-'+j+'-'+i);
          dot.style.width = dotWidth;
          dot.style.height = dotWidth;

          dot.style.top = cellW * (i + 1) - dotWidth / 2;
          dot.style.left = cellW * (j + 1) - dotWidth / 2;

          if (board[i].charAt(j) === 'B') {
            dot.style.width = dotWidth * 4;
            dot.style.height = dotWidth * 4;
            dot.style.top = cellW * (i + 1) - dotWidth * 4 / 2;
            dot.style.left = cellW * (j + 1) - dotWidth * 4 / 2;
            dot.style.borderRadius = '50%';
            dot.classList.add('big');
  
          }

          game.appendChild(dot);   
          dotCount++;
        }

        function makeCorner(topBottom,rightLeft) {

          let cornerW = cellW / 2;
          let radial = 'radial-gradient(circle ' + cornerW + 'px at ' + rightLeft +' 100% ' + topBottom + ' 100%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) '+(cornerW - 3)+'px, #e33022 '+(cornerW - 3)+'px,  #e33022 100%, #f4bb9c 100%)';
          let block = document.createElement('div');
          block.style.position = "absolute";
          block.style.backgroundColor = "black";
          block.style.background = radial;
          block.style.zIndex = "100";
          block.style.width = cornerW;
          block.style.height = cornerW;
          block.style.top = topBottom === 'top' ? (cellW * i - 3) + 'px' : (cellW * (i + 1) - cornerW + 3) + 'px';
          block.style.left = rightLeft === 'left' ? (cellW * j - 3) + 'px' : (cellW * (j + 1) - cornerW + 3) + 'px';
          return block;
        }

        // Adds rounding to the corners as needed

        for (const c in corners) {

          if (corners[c] === 'wall') {
            let topBottom = c.substr(0,c.search(/[LR]/)).replace('border','').toLowerCase();
            let rightLeft = c.substr(c.search(/[LR]/)).toLowerCase();

            let thisCorner = makeCorner(topBottom,rightLeft);
            game.appendChild(thisCorner);

          }

        }

      } 

    }

  })

  // Make the 'ready' div

  let readyDiv = document.createElement('div');
  readyDiv.id = 'ready';
  readyDiv.style.position = 'absolute';
  readyDiv.style.zIndex = 50;
  readyDiv.style.backgroundColor = 'none';
  readyDiv.style.top = cellW * (ghostStartRow + 4);
  readyDiv.style.left = cellW * ghostStartCol;
  readyDiv.style.height = cellW * 2;
  readyDiv.style.width = cellW * 7;
  readyDiv.style.padding = cellW / 4;
  readyDiv.style.fontFamily = '\'Press Start 2P\',cursive';
  readyDiv.style.fontSize = '2rem';
  readyDiv.style.color = 'yellow';
  readyDiv.style.textAlign = 'center';
  readyDiv.style.alignContent = 'center';
  readyDiv.innerHTML = 'READY!';

  game.appendChild(readyDiv);

  // Make the ghost div

  let block = document.createElement('div');
  block.style.position = 'absolute';
  block.style.zIndex = 50;
  block.style.backgroundColor = '#f1bdae';
  block.style.top = cellW * ghostStartRow;
  block.style.left = cellW * ghostStartCol;
  block.style.height = cellW * 4;
  block.style.width = cellW * 7;
  block.style.border = "solid 3px #e33022"

  let innerDiv = document.createElement('div');
  innerDiv.style.position = "absolute";
  innerDiv.style.zIndex = 51;
  innerDiv.style.backgroundColor = "black";
  innerDiv.style.top = cellW / 3 - 3;
  innerDiv.style.left = cellW / 3 - 3;
  innerDiv.style.height = cellW * 4 - (cellW * 2/ 3);
  innerDiv.style.width = cellW * 7 - (cellW * 2 / 3);
  innerDiv.style.border = "solid 3px #e33022";

  let door = document.createElement('div');
  door.style.position = "absolute";
  door.style.zIndex = 52;
  door.style.backgroundColor = "#e1e1fb";
  door.style.top = -3;
  door.style.left = cellW * 2 + cellW / 4;
  door.style.height = cellW / 3 + 3;
  door.style.width = cellW * 2 + 3;
  door.style.borderLeft = "solid 3px #e33022";
  door.style.borderRight = "solid 3px #e33022";
  door.style.borderTop = "solid 3px black";
  door.style.borderBottom = "solid 3px black";

  block.appendChild(innerDiv);
  block.appendChild(door);

  game.appendChild(block);

  function makeGhost(pos,gColor,eyepos,id,free) {

    pos['rowM'] = pos.row + 1;
    pos['colM'] = pos.col + 1;

    const fringeW = Math.floor(cellW * 1.5 / 12);

    const ghostDiv = document.createElement('div');
    ghostDiv.id = id;
    ghostDiv.style.backgroundColor = gColor;
    ghostDiv.style.backgroundSize = '100%';
    ghostDiv.style.backgroundImage = 'none';
    ghostDiv.style.position = 'absolute';
    ghostDiv.style.zIndex = 900;
    ghostDiv.style.height = cellW * 1.5 - fringeW * 2;
    ghostDiv.style.width = cellW * 1.5;
    ghostDiv.style.borderTopLeftRadius = '50%';
    ghostDiv.style.borderTopRightRadius = '50%';
    ghostDiv.style.margin = (cellW / 4) + 'px'
    ghostDiv.style.top = cellW * (pos.row);
    ghostDiv.style.left = cellW * (pos.col) - cellW / 2;

    const createGhostDivChild = (height, width, margin, top, left, bgcolor, bgimage, borderCorners) => {
      const item = document.createElement('div');
      item.style.backgroundColor = bgcolor;
      item.style.backgroundImage = bgimage;
      item.style.position = 'absolute';
      item.style.height = height;
      item.style.width = width;
      item.style.borderTopRightRadius = borderCorners[0];
      item.style.borderBottomRightRadius = borderCorners[1];
      item.style.borderBottomLeftRadius = borderCorners[2];
      item.style.borderTopLeftRadius = borderCorners[3];
      item.style.margin = margin;
      item.style.top = top;
      item.style.left = left;
      return item;
    }

    let eyetop = '';
    let eyeleft = '';
    let pupiltop = '';
    let pupilleft = '';
    if (eyepos === 'L') {
      eyetop = ((cellW / 6) + fringeW) + 'px';
      eyeleft = (fringeW * 2) + 'px';
      pupiltop = ((cellW / 6) + fringeW * 2.5) + 'px';
      pupilleft = (fringeW * 2) + 'px';
    }
    else if (eyepos === 'U') {
      eyetop = ((cellW / 6) + fringeW) + 'px';
      eyeleft = (fringeW * 2.5) + 'px';
      pupiltop = ((cellW / 6) + fringeW * 0.5) + 'px';
      pupilleft = (fringeW * 3) + 'px';
    }
    else if (eyepos === 'D') {
      eyetop = ((cellW / 6) + fringeW) + 'px';
      eyeleft = (fringeW * 2.5) + 'px';
      pupiltop = ((cellW / 6) + fringeW * 2.5) + 'px';
      pupilleft = (fringeW * 3) + 'px';
    }

    let ghostDivArr = [];
    ghostDivArr.push({'height': fringeW * 2, 'width': fringeW, 
                      'margin' : '0px', 'top' : ((cellW / 4) + cellW * 1.5 - fringeW * 4) + 'px', 
                      'left': '0px', 'bgcolor' : gColor, 'bgimage' : 'none',
                      'borderCorners' : ['0%', '50%', '0%', '0%']});
    ghostDivArr.push({'height': fringeW * 2, 'width': fringeW * 2, 
                      'margin' : '0px', 'top' : ((cellW / 4) + cellW * 1.5 - fringeW * 4) + 'px', 
                      'left': fringeW + 'px', 
                      'bgcolor' : 'none', 
                      'bgimage' : 'radial-gradient(circle at top 50% left 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 70%, '+gColor+' 70%)',
                      'borderCorners' : ['0%', '50%', '50%', '0%']});
    ghostDivArr.push({'height': fringeW * 2, 'width': fringeW * 2, 
                      'margin' : '0px', 'top' : ((cellW / 4) + cellW * 1.5 - fringeW * 4) + 'px', 
                      'left': (fringeW * 3) + 'px', 
                      'bgcolor' : gColor, 
                      'bgimage' : 'none',
                      'borderCorners' : ['0%', '50%', '50%', '0%']});
    ghostDivArr.push({'height': fringeW * 2, 'width': cellW * 1.5 - fringeW * 10, 
                      'margin' : '0px', 'top' : ((cellW / 4) + cellW * 1.5 - fringeW * 4) + 'px', 
                      'left': (fringeW * 5) + 'px', 
                      'bgcolor' : 'none', 
                      'bgimage' : 'radial-gradient(ellipse at top 50% left 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 70%, '+gColor+' 70%)',
                      'borderCorners' : ['0%', '50%', '50%', '0%']});
    ghostDivArr.push({'height': fringeW * 2, 'width': fringeW * 2, 
                      'margin' : '0px', 'top' : ((cellW / 4) + cellW * 1.5 - fringeW * 4) + 'px', 
                      'left': (fringeW * 5 + cellW * 1.5 - fringeW * 10) + 'px', 
                      'bgcolor' : gColor, 
                      'bgimage' : 'none',
                      'borderCorners' : ['0%', '50%', '50%', '0%']});
    ghostDivArr.push({'height': fringeW * 2, 'width': fringeW * 2, 
                      'margin' : '0px', 'top' : ((cellW / 4) + cellW * 1.5 - fringeW * 4) + 'px', 
                      'left': (fringeW * 7 + cellW * 1.5 - fringeW * 10) + 'px', 
                      'bgcolor' : 'none', 
                      'bgimage' : 'radial-gradient(circle at top 50% left 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 70%, '+gColor+' 70%)',
                      'borderCorners' : ['0%', '50%', '50%', '0%']});
    ghostDivArr.push({'height': fringeW * 2, 'width': fringeW, 
                      'margin' : '0px', 'top' : ((cellW / 4) + cellW * 1.5 - fringeW * 4) + 'px', 
                      'left': ((cellW/4) + cellW * 1.5 - fringeW * 3) + 'px', 
                      'bgcolor' : gColor, 'bgimage' : 'none',
                      'borderCorners' : ['0%', '0%', '50%', '0%']});
    ghostDivArr.push({'height': fringeW * 4, 'width': fringeW * 3, 
                      'margin' : '0px', 'top' : eyetop, 
                      'left': eyeleft, 
                      'bgcolor' : 'white', 'bgimage' : 'none',
                      'borderCorners' : ['50%', '50%', '50%', '50%']});
    ghostDivArr.push({'height': fringeW * 4, 'width': fringeW * 3, 
                      'margin' : '0px', 'top' : eyetop, 
                      'left': (fringeW * 5 + parseInt(eyeleft)) + 'px', 
                      'bgcolor' : 'white', 'bgimage' : 'none',
                      'borderCorners' : ['50%', '50%', '50%', '50%']});
    ghostDivArr.push({'height': fringeW * 2, 'width': fringeW * 2, 
                      'margin' : '0px', 'top' : pupiltop, 
                      'left': pupilleft, 
                      'bgcolor' : 'blue', 'bgimage' : 'none',
                      'borderCorners' : ['50%', '50%', '50%', '50%']});
    ghostDivArr.push({'height': fringeW * 2, 'width': fringeW * 2, 
                      'margin' : '0px', 'top' : pupiltop, 
                      'left': (fringeW * 5 + parseInt(pupilleft)) + 'px', 
                      'bgcolor' : 'blue', 'bgimage' : 'none',
                      'borderCorners' : ['50%', '50%', '50%', '50%']});
                        

    ghostDivArr.forEach(x => {

      let tempDiv = createGhostDivChild(x.height, x.width, x.margin,x.top,x.left,x.bgcolor,x.bgimage,x.borderCorners);
      ghostDiv.appendChild(tempDiv);

    })

    let game = document.getElementById('game');
    game.appendChild(ghostDiv);
    return {'item': ghostDiv, 'cache':'', 'speed': -speed, 'direction' : 'left', 'free' : free, 'rcPos' : pos, 'position':{'x': (cellW * (pos.col) - cellW / 2),'y': cellW * (pos.row)}};

  }

  ghosts.push(makeGhost({'row':11,'col':14},'red','L','inky',true));
  ghosts.push(makeGhost({'row':14,'col':12},'aqua','U','blinky',false));
  ghosts.push(makeGhost({'row':14,'col':14},'plum','D','pinky',false));
  ghosts.push(makeGhost({'row':14,'col':16},'orange','U','clyde',false));

}

const findXY = rcPos => {

  let x = rcPos.col * cellW;
  let y = rcPos.row * cellW;

  return {x, y};

}

let msPacMan = {}; 
window.onload = (event) => {
  drawBoard(board);
  msPacMan = makePac();
}


// Make Ms PacMan 
function makePac() {
  
  let direction = 'right';
  let position = findXY(pacPos);

  // Add image to div id = game
  let game = document.getElementById('game');
  let newimg = document.createElement('img');
  newimg.style.position = 'absolute';
  newimg.style.zIndex = '200';
  newimg.src = './images/mspacman1.png';
  newimg.style.transform = 'rotate(0deg)';
  let topPad = Math.floor((cellW * 2 - pacWidth) / 2);
  let rightPad = Math.floor((cellW * 2 - pacWidth) / 2);
  newimg.style.margin = topPad + "px " + rightPad + "px " + topPad + "px " + rightPad + "px";
  newimg.width = pacWidth;

  // Set position
  newimg.style.left = position.x - cellW / 2;
  newimg.style.top = position.y;

  game.appendChild(newimg);

  // return details in an object
  return {
    position,
    speed,
    direction,
    newimg,
    'rcPos' : pacPos,
    'cache' : ''
  };
}

function nextPos(pos,dir) {

  if (dir === '') {return pos;}

  let next = {'col':pos.col,'colM': pos.col + 1,'row':pos.row, 'rowM':pos.row + 1};
  next.row += dir === 'down' ? 1 : dir === 'up' ? -1 : 0
  next.rowM += dir === 'down' ? 1 : dir === 'up' ? -1 : 0
  next.col += dir === 'right' ? 1 : dir === 'left' ? -1 : 0
  next.colM += dir === 'right' ? 1 : dir === 'left' ? -1 : 0
  
  return next;

}

function isWall(pos,dir) {

  let res1 = board[pos.row].charAt(pos.col);
  let res2 = board[pos.rowM].charAt(pos.colM);

  if (dir === 'right') {
    res1 = board[pos.row].charAt(pos.colM);
    res2 = board[pos.rowM].charAt(pos.colM);  
  }
  if (dir === 'down') {
    res1 = board[pos.rowM].charAt(pos.col);
    res2 = board[pos.rowM].charAt(pos.colM);  
  }
  if (dir === 'left') {
    res1 = board[pos.row].charAt(pos.col);
    res2 = board[pos.rowM].charAt(pos.col);  
  }
  if (dir === 'up') {
    res1 = board[pos.row].charAt(pos.col);
    res2 = board[pos.row].charAt(pos.colM);  
  }

  if (res1.search(/[XG]/) >= 0 || res2.search(/[XG]/) >= 0) {return true;} else {return false;}

}