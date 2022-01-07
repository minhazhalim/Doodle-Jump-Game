document.addEventListener('DOMContentLoaded',() => {
     const grid = document.querySelector('.grid');
     const div = document.createElement('div');
     let platforms = [];
     let platformCount = 10;
     let startPoint = 150;
     let doodlerLeftSpace = 50;
     let doodlerBottomSpace = startPoint;
     let score = 0;
     let isGameOver = false;
     let isGoingLeft = false;
     let isGoingRight = false;
     let isJumping = true;
     let upTimerID;
     let downTimerID;
     let leftTimerID;
     let rightTimerID;
     class Platform {
          constructor(newPlatBottom){
               this.left = Math.random() * 315;
               this.bottom = newPlatBottom;
               this.visual = document.createElement('div');
               const visual = this.visual;
               visual.classList.add('platform');
               visual.style.left = this.left + 'px';
               visual.style.bottom = this.bottom + 'px';
               grid.appendChild(visual);
          }
     }
     function createPlatforms(){
          for(let i = 0;i < platformCount;i++){
               let platGap = 600 / platformCount;
               let newPlatBottom = 100 + i * platGap;
               let newPlatform = new Platform(newPlatBottom);
               platforms.push(newPlatform);
          }
     }
     function movePlatforms(){
          if(doodlerBottomSpace > 200){
               platforms.forEach(platform => {
                    platform.bottom -= 4;
                    let visual = platform.visual;
                    visual.style.bottom = platform.bottom + 'px';
                    if(platform.bottom < 10){
                         let firstPlatform = platforms[0].visual;
                         firstPlatform.classList.remove('platform');
                         platforms.shift();
                         score++;
                         var newPlatform = new Platform(600);
                         platforms.push(newPlatform);
                    }
               });
          }
     }
     function createDoodler(){
          grid.appendChild(div);
          div.classList.add('doodler');
          doodlerLeftSpace = platforms[0].left;
          div.style.left = doodlerLeftSpace + 'px';
          div.style.bottom = doodlerBottomSpace + 'px';
     }
     function fall(){
          isJumping = false;
          clearInterval(upTimerID);
          downTimerID = setInterval(function(){
               doodlerBottomSpace -= 5;
               div.style.bottom = doodlerBottomSpace + 'px';
               if(doodlerBottomSpace <= 0) gameOver();
               platforms.forEach(platform => {
                    if((doodlerBottomSpace >= platform.bottom) && (doodlerBottomSpace <= (platform.bottom + 15)) && ((doodlerLeftSpace + 60) >= platform.left) && (doodlerLeftSpace <= (platform.left + 85)) && !isJumping){
                         startPoint = doodlerBottomSpace;
                         jump();
                         isJumping = true;
                    }
               });
          },20);
     }
     function jump(){
          clearInterval(downTimerID);
          isJumping = true;
          upTimerID = setInterval(function(){
               doodlerBottomSpace += 20;
               div.style.bottom = doodlerBottomSpace + 'px';
               if(doodlerBottomSpace > (startPoint + 300)){
                    fall();
                    isJumping = false;
               }
          },50);
     }
     function moveLeft(){
          if(isGoingRight){
               clearInterval(rightTimerID);
               isGoingRight = false;
          }
          isGoingLeft = true;
          leftTimerID = setInterval(function(){
               if(doodlerLeftSpace >= 0){
                    doodlerLeftSpace -= 1;
                    div.style.left = doodlerLeftSpace + 'px';
               }else moveRight();
          },20);
     }
     function moveRight(){
          if(isGoingLeft){
               clearInterval(leftTimerID);
               isGoingLeft = false;
          }
          isGoingRight = true;
          rightTimerID = setInterval(function(){
               if(doodlerLeftSpace <= 313){
                    doodlerLeftSpace += 1;
                    div.style.left = doodlerLeftSpace + 'px';
               }else moveLeft();
          },20);
     }
     function moveStraight(){
          isGoingLeft = false;
          isGoingRight = false;
          clearInterval(leftTimerID);
          clearInterval(rightTimerID);
     }
     function control(event){
          div.style.bottom = doodlerBottomSpace + 'px';
          if(event.key === 'ArrowLeft'){
               moveLeft();
          }else if(event.key === 'ArrowRight'){
               moveRight();
          }else if(event.key === 'ArrowUp'){
               moveStraight();
          }
     }
     function gameOver(){
          isGameOver = true;
          while(grid.firstChild){
               grid.removeChild(grid.firstChild);
          }
          grid.innerHTML = score;
          clearInterval(upTimerID);
          clearInterval(downTimerID);
          clearInterval(leftTimerID);
          clearInterval(rightTimerID);
     }
     function start(){
          if(!isGameOver){
               createPlatforms();
               createDoodler();
               setInterval(movePlatforms,30);
               jump(startPoint);
               document.addEventListener('keyup',control);
          }
     }
     start();
});