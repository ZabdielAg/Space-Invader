const ammoText = document.querySelector("#ammo");
      let ammoCount = 15;
const gameOverText = document.querySelector('#game-over-text');
score=0

      
var nextLevel="http://127.0.0.1:5501/nvl3.html"
var fail="http://127.0.0.1:5501/perdio/perdio.html"


const shoot = () => {
  if (ammoCount <= 0) {
    location.href = fail;
    return;
    
  }
    
  const bullet = document.createElement("a-sphere");
    let pos = mira.getAttribute("position");
    bullet.setAttribute("position", pos);
    bullet.setAttribute("velocity", getDirection(mira, 30));
    bullet.setAttribute("dynamic-body", true);
    bullet.setAttribute("radius", 0.5);
    bullet.setAttribute("src", "https://thumbs.dreamstime.com/b/vivid-pop-art-abstract-background-bits-retro-gaming-computer-data-noise-simple-bits-colors-glitch-paint-vivid-pop-art-abstract-189472070.jpg");
    myScene.appendChild(bullet);
    bullet.addEventListener('collide', shootCollided);
    
  ammoCount--;
  ammoText.setAttribute("value", `Balas: ${ammoCount}`);
  
}
  const teleport = () => {
  
    
    const bullet = document.createElement("a-torus");
    let pos = mira.getAttribute("position");
    bullet.setAttribute("position", pos);
    bullet.setAttribute("velocity", getDirection(mira, 30));
    bullet.setAttribute("dynamic-body", true);
    bullet.setAttribute("radius", 0.5);
    bullet.setAttribute("arc", 360);
    bullet.setAttribute("radius-tubular", 0.1);
    bullet.setAttribute("rotation", { x: 90, y: 0, z: 0 });
    bullet.setAttribute("src", "https://thumbs.dreamstime.com/b/vivid-pop-art-abstract-background-bits-retro-gaming-computer-data-noise-simple-bits-colors-glitch-paint-vivid-pop-art-abstract-189472070.jpg");
    myScene.appendChild(bullet);
  
  };
  
  
  const shootCollided = event => {
    if (event.detail.body.el.id === 'floor') {
      console.log('Hit the floor');
      event.detail.target.el.removeEventListener('collide', shootCollided);
      myScene.removeChild(event.detail.target.el);
    } else if (event.detail.body.el.className === 'target') {
      console.log('Hit the target!');
      score += 100;
      text.setAttribute("value", score);
      
  
      event.detail.target.el.removeEventListener('collide', shootCollided);
      myScene.removeChild(event.detail.target.el);
      myScene.removeChild(event.detail.body.el);
    }
    if (document.querySelectorAll('.target').length === 0) {
      console.log('Ganaste');
      location.href = nextLevel;
    
    }
  };
  
  const teleportCollided = event => {
    if (event.detail.body.el.id === 'floor') {
      console.log('Hit the floor');
      event.detail.target.el.removeEventListener('collide', teleportCollided);
      let pos = event.detail.target.el.getAttribute('position');
      myScene.removeChild(event.detail.target.el);
      mira.setAttribute('position', { x: pos.x, y: 2, z: pos.z });
    }
  };
  
  document.onkeydown = event => {
    if (event.which == 32) {
      shoot();
    } else if (event.which == 67) {
      teleport();
    }
  };

  