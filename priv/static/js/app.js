var   socket = new Phoenix.Socket("/ws");
var   canvas = document.querySelector('canvas');
         ctx = canvas.getContext('2d');
   particles = [];
patriclesNum = 2;
           w = 1400;
           h = 900;
      colors = ['#f35d4f','#f36849','#c0d988','#6ddaf1','#f1e85b'];
capture_rate = 100;

   userColor = colors[ Math.round( Math.random() * 3) ];
var tempName = "User " + Math.floor(Math.random() * (0 - 10000000) + 10000000); 
 
    
canvas.width = w;
canvas.height = h;
canvas.style.left = (window.innerWidth - 500)/2+'px';

if(window.innerHeight>500)
canvas.style.top = (window.innerHeight - 500)/2+'px';

function getName() {
  name = document.getElementById("name").value;
  if (name == "") {
    return tempName;
  } else {
    return name;
  }
}
  
function MyFactory(x, y, rgba){  
  this.x = x;
  this.y = y;
  this.rad = Math.round( Math.random() * 1) + 1;
  this.rgba = rgba;
  this.vx = Math.round( Math.random() * 3) - 1.5;
  this.vy = Math.round( Math.random() * 3) - 1.5;
  this.name = getName();
  this.strength = 1000;
}
   
function draw(){
  ctx.clearRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'lighter';
  for(var i = 0;i < particles.length; i++){
    var temp = particles[i];
    var factor = temp.strength / 1000;
     
    for(var j = 0; j< particles.length; j++){
      
       var temp2 = particles[j];
       ctx.linewidth = 0.5;
      
       if(findDistance(temp, temp2)<50){
          ctx.strokeStyle = temp.rgba;
          ctx.beginPath();
          ctx.moveTo(temp.x, temp.y);
          ctx.lineTo(temp2.x, temp2.y);
          ctx.stroke();
          factor++;


          if (temp.strength > temp2.strength) {
            temp.strength += capture_rate;
            temp2.strength -= capture_rate;
          } else {
            temp.strength += capture_rate;
            temp2.strength -= capture_rate;
          }
       }
    }
    
    temp.strength -= 1;

    if(temp.strength > 0) {

      ctx.fillStyle = temp.rgba;
      ctx.strokeStyle = temp.rgba;
      
      ctx.beginPath();
      ctx.arc(temp.x, temp.y, temp.rad*factor, 0, Math.PI*2, true);
      ctx.fill();
      ctx.closePath();
      
      ctx.beginPath();
      ctx.arc(temp.x, temp.y, (temp.rad+5)*factor, 0, Math.PI*2, true);
      ctx.stroke();
      ctx.closePath();

      ctx.font = "bold 12px Helvetica";
      ctx.fillText(temp.name, temp.x - 30, temp.y - 20);

      ctx.font = "bold 12px Helvetica";
      ctx.fillText("Strength: " + temp.strength, temp.x - 30, temp.y + 30);
      

      temp.x += temp.vx;
      temp.y += temp.vy;

    } else {

      particles.splice(i,1);
      i -= 1;

    };
    
    if(temp.x > w)temp.x = 0;
    if(temp.x < 0)temp.x = w;
    if(temp.y > h)temp.y = 0;
    if(temp.y < 0)temp.y = h;
  }
}

function findDistance(p1,p2){  
  return Math.sqrt( Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) );
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

(function init(){
  socket.join("firework:events", {}, function(chan){

    canvas.addEventListener("click", function(event) {
      chan.send("new:firework", new MyFactory(event.pageX, event.pageY, userColor));
    });

    chan.on("new:firework", function(message){
      particles.push(message);
    });
  });
})();

(function loop(){
  draw();
  requestAnimFrame(loop);
})();

