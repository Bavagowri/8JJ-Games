function enemy(enemyBox,tips,delayOffset) {
var attackDelay = -10;
if (tips == 1) {
	var delay = 0 - Math.floor(Math.random() * Math.floor(10));
} else {
	delay = 30 - Math.floor(Math.random() * Math.floor(30));
	attackDelay = 5;
}

//var attackDelay = -10;
var shootDelay = 0;
var hideTimer = 0;
var attacking = false;
var damage = 1;

var dt=1000/60;
var timeTarget=0;

var rayStart = new BABYLON.Vector3(enemyBox._absolutePosition.x,enemyBox._absolutePosition.y + 7,enemyBox._absolutePosition.z);

totalEnemies ++;

enemyBox.visibility = 0;	

enemyBox.billboardMode = 2;
	
var enemySprite = new BABYLON.Sprite("enemySprite", spriteManagerEnemy);
enemySprite.position.x = enemyBox._absolutePosition.x;
enemySprite.position.y = enemyBox._absolutePosition.y + 2.9;
enemySprite.position.z = enemyBox._absolutePosition.z;
enemySprite.size = 9.3;//9.3/7.43
if(tips == 2) {enemySprite.cellIndex = 21;enemyBox._scaling.z = 0.55;}
	update();
	
	function update() {
	if(Date.now()>=timeTarget){
	if(!pause && isPlaying) {
	//delay++;
	
	if(enemySprite.isVisible != enemyBox._isParentEnabled && !enemyBox.beigts) enemySprite.isVisible = enemyBox._isParentEnabled;
	
	if(enemyBox._isParentEnabled && !pause) {
		delay++;
		if(enemyBox.restart) restartEnemy();
		
	if(enemyBox.beigts) {
		
	} else if (enemyBox.mirst > 0) {

	if(enemyBox.mirst == 1) {enemySprite.playAnimation(6, 20, false, 76);enemyBox.mirst = 2;enemyBox.setEnabled(false);enemyBox.isPickable = false;}
	if(enemySprite.cellIndex == 20) enemySprite.color.a -= 0.03;	
	if(enemySprite.color.a <= 0) {enemyBox.beigts = true;enemySprite.isVisible = false;enemyBox.mirst = 0;enemies --;exportRoot.onScreen.center.enemyText.text = "Enemies: " + enemies;if(enemies <= 0) {levelComplete();}}
	
	} else {
		if(tips == 2 && enemySprite.cellIndex == 5 && delay == 2) enemySprite.cellIndex = 4;//
		if(attacking) {
		if((tips == 1 && delay >= 2) || (tips == 2 && delay >= 4)) {
		
		delay = 0;
		attack();
				}
		} else {		
			if((tips == 2 && delay >= 30) || (tips == 1 && delay >= 4)) {
		delay = 0;
			var hit = scene.pickWithRay(new BABYLON.Ray(rayStart, camera.globalPosition.subtract(rayStart).normalize(), 200));
			if (hit.pickedMesh){
				
			if(hit.pickedMesh.name == "player") {
				
				attacking = true;
				if (tips == 1 && enemySprite.cellIndex == 5) {
					enemySprite.cellIndex = 4;
					attackDelay = -10;
					}
				
				shootDelay = 0;
			} else {
				if(tips == 1) {
				enemySprite.cellIndex = 0;
				enemyBox._scaling.z = 1;
				} else {
				enemySprite.cellIndex = 21;
				enemyBox._scaling.z = 0.55;
				}
			} 
	    }
			}
		}		
	}
}
	}
	
	
	    timeTarget+=dt;
    if(Date.now()>=timeTarget){
      timeTarget=Date.now();
    }
  }
	requestAnimationFrame(update);
}
function restartEnemy() {
	enemySprite.stopAnimation();
	enemyBox.setEnabled(true);
	enemyBox.isPickable = true;
	enemyBox.restart = false;
	enemyBox.mirst = 0;
	enemyBox.beigts = false;
	enemySprite.color.a = 1;
	attacking = false;
	if(tips == 1) {
		enemySprite.cellIndex = 0;
		enemyBox._scaling.z = 1;
		attackDelay = -10;
		shootDelay = 0;
		delay = 0 - Math.floor(Math.random() * Math.floor(10));
	} else {
		enemySprite.cellIndex = 21;
		enemyBox._scaling.z = 0.55;
		attackDelay = 5;
		shootDelay = 0;
		hideTimer = 0;//1
		delay = 30 - Math.floor(Math.random() * Math.floor(30));
	}
	
}

function attack() {

if(tips == 1) {
	attackDelay ++;
	if ( attackDelay >= 5) {
	if (enemySprite.cellIndex < 4) enemySprite.cellIndex ++;
	if (enemySprite.cellIndex >= 4) {
	if(enemySprite.cellIndex == 4) enemyBox._scaling.z = 0.95;
	shootDelay ++;
	if (shootDelay >= 18 - (difficulty * 3)) {
	if (enemySprite.cellIndex < 6) {
	enemySprite.cellIndex ++;
	if (enemySprite.cellIndex == 5) shoot();
	} else {}
	}
	}
	}
		
} else {		
				if (hideTimer > 0) {
					
				hideTimer ++;
				if (hideTimer > 20) {
				if (enemySprite.cellIndex == 4) {
					enemySprite.cellIndex = 24;
				} else {
					if (enemySprite.cellIndex > 21) {
						enemySprite.cellIndex --;
						enemyBox._scaling.z -= 0.133;
					}
					if (enemySprite.cellIndex == 21) hideTimer = 0; attackDelay = -20; 
				}	
				}
			} else {
			
			attackDelay ++;
			if ( attackDelay >= 16) {
				if (enemySprite.cellIndex == 24) enemySprite.cellIndex = 4;
			if (enemySprite.cellIndex < 24 && enemySprite.cellIndex > 4) {
				enemySprite.cellIndex ++; 
				if (enemySprite.cellIndex !=5) {
				enemyBox._scaling.z += 0.133; 
				
				}
			}
			if (enemySprite.cellIndex >= 4 && enemySprite.cellIndex < 7) {
				shootDelay ++;
				if (shootDelay >= 13 - (difficulty * 3)) {
					if (enemySprite.cellIndex < 6) {
					enemySprite.cellIndex ++;
					if (enemySprite.cellIndex == 5) shoot();
					} else {}
					}
				}
			}
		}	
		
}
		
		
}

function shoot() {
	
	createjs.Sound.play("gun1");
	
	if(tips == 1) {
	
	attackDelay = -11;//-10
	shootDelay = 0;
	attacking = false;
	} else {
		attackDelay = 0;
		shootDelay = 0;
		//enemySprite.cellIndex = 4;
		attacking = false;
		hideTimer = 1;
	}
	
	var hit = scene.pickWithRay(new BABYLON.Ray(rayStart, camera.globalPosition.subtract(rayStart).normalize(), 200));
			if (hit.pickedMesh){	
			if(hit.pickedMesh.name == "player") {
				
				trapija(damage);
			} else {
				if(tips == 2) {
					
				hideTimer = 0;
				attackDelay = (-1 * (Math.floor(Math.random() * (0 + 30 - 0) + 1)) + 20);

				}
			}
	}	
}

}

// ------------------------------------------------------------------------------------------------------------------------

function aptiecina(aptiekaBox) {
	
	if(mobile) {
	var bonus = 5 - (difficulty);	
	} else {	
	var bonus = 5 - (difficulty);
	}
	var panemta = false;
	
	updateAptieka();
	
	function updateAptieka() {
		requestAnimationFrame(updateAptieka);
		if(aptiekaBox._isParentEnabled && !pause) {
		if(aptiekaBox.restart) {aptiekaBox.setEnabled(true);panemta = false;aptiekaBox.restart = false;}
		
		if(!panemta) {			
			aptiekaBox.rotate(new BABYLON.Vector3(0, 1, 0), 0.02, BABYLON.Space.WORLD);
			if (aptiekaBox.intersectsPoint(new BABYLON.Vector3(camera.position.x, camera.position.y - 3, camera.position.z))) {
				createjs.Sound.play("pick");
				panemta = true;
				aptiekaBox.setEnabled(false);
				health += bonus;
				scoreBonus -= bonus * 10;
				usedMedkit = 1;
				if(health > startHealth) health = startHealth;
				exportRoot.onScreen.healthScreen.healthline.gotoAndStop(health);
				//exportRoot.onScreen.healthScreen.healthttxt.text = health;
				camera.fov = 0.78;	
				setTimeout(function(){ camera.fov = 0.8; }, 35);
				exportRoot.onScreen.asinisScreen.gotoAndPlay(8);
			}
		}
		
		}
	}
}
