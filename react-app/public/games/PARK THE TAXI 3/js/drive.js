Level=1;
failed = false;
finished = false;
pause = false;
isDriving = false;
skana = true;

up = false;
down = false;
right = false;
left = false;

var speed = 0;
var increment = 0;
var maxSpeed = 14;
var minSpeed = -14;
var acceleration = 0.03;
var brakedelay = 5;

mobile = false;

var bitmap;
var bitmap2;
var point1;
var point2;
var point3;
var point4;
var point5;
var point6;
var enemyBitmap;
var enemy2Bitmap;

var colisiondelay = 0;
var gameTime = 10800;
var updateclock = 0;
var night = false;

var tryAgainScreen;
var levelScore = 0;
var totalScore = 0;
var levelStars = 0;
var levelScores = [0,0,0,0,0,0,0,0,0,0];
var targetScores = [801,833,859,922,930,1002,1027,1027,1000,1055];
var achievement = [0,0,0,0,0,0,0,0,0,0,0,0];
var unlockedAchievement = -1;

var enemy;
var enemyx = 0;
var enemyy = 0;
var enemySpeed = 2;

var enemy2;
var enemy2x = 0;
var enemy2y = 0;
var enemy2Speed = 2;

var labaPuse = 853;
var apaksPuse = 480;

var again = false;

var backgroundSound;
var idleSound;
var engineSound;
var smallcanvas;

var lastTime;
var delta = 0;

if(createjs.Touch.isSupported()) mobile = true;


function updateButtons() {

exportRoot.gmenu.buttons.lButtons.x = 0 -(stage.x / stage.scaleX);
exportRoot.gmenu.buttons.lButtons.y = 278 + (stage.y / stage.scaleY);
exportRoot.gmenu.buttons.rButtons.x = 639 +(stage.x / stage.scaleX);	
exportRoot.gmenu.buttons.rButtons.y = 157 + (stage.y / stage.scaleY);

exportRoot.gmenu.hWindow.x = 2 - (stage.x / stage.scaleX);
exportRoot.gmenu.hWindow.y = 2 - (stage.y / stage.scaleY);

exportRoot.pButton.poga.x = 592 + (stage.x / stage.scaleX);
exportRoot.pButton.poga.y = 37 - (stage.y / stage.scaleY);

exportRoot.scoreT.x = 565 + (stage.x / stage.scaleX);
exportRoot.scoreT.y = 0 - (stage.y / stage.scaleY);

exportRoot.menuB.x = 0 - (stage.x / stage.scaleX);
exportRoot.menuB.y = 240 + (stage.y / stage.scaleY);

exportRoot.vir.y = 0 - (stage.y / stage.scaleY);
exportRoot.vir.x = 0 -(stage.x / stage.scaleX);
exportRoot.ievads.y = 47 + (stage.y / stage.scaleY);
exportRoot.w.x = 636 +(stage.x / stage.scaleX);
exportRoot.w.y = 356 + (stage.y / stage.scaleY);
}

	
// ------------------------------------------------------------------------------------
function startGame() {
	
updateButtons();	
//window.focus();
	var canvasLayer = document.getElementById("canvas");
	canvasLayer.focus();

pause = true;
night = false;

var fade = new lib.fadeout();
exportRoot.addChild(fade);
gameTime = 10800;
levelScore =  0;
exportRoot.gmenu.hWindow.leveltxt.text = "Level: "+ Level;

failed = false;
finished = false;
isDriving = true;
up = false;
down = false;
right = false;
left = false;

speed = 0;
increment = 0;

exportRoot.pButton.poga.gotoAndStop(1);

	if(Level == 1) {bitmap = new createjs.Bitmap("images/collider1.png");exportRoot.level = exportRoot.level1;}
	if(Level == 2) {bitmap = new createjs.Bitmap("images/collider2.png");exportRoot.level = exportRoot.level2;}
	if(Level == 3) {bitmap = new createjs.Bitmap("images/collider3.png");exportRoot.level = exportRoot.level3;}
	if(Level == 4) {bitmap = new createjs.Bitmap("images/collider4.png");exportRoot.level = exportRoot.level4;}
	if(Level == 5) {bitmap = new createjs.Bitmap("images/collider5.png");exportRoot.level = exportRoot.level5;}
	if(Level == 6) {bitmap = new createjs.Bitmap("images/collider6.png");exportRoot.level = exportRoot.level6;}
	if(Level == 7) {bitmap = new createjs.Bitmap("images/collider7.png");exportRoot.level = exportRoot.level7;}
	if(Level == 8) {bitmap = new createjs.Bitmap("images/collider8.png");exportRoot.level = exportRoot.level8;}
	if(Level == 9) {bitmap = new createjs.Bitmap("images/collider9.png");exportRoot.level = exportRoot.level9;}
	if(Level == 10) {bitmap = new createjs.Bitmap("images/collider10.png");exportRoot.level = exportRoot.level10;}

smallcanvas = exportRoot.level.clone();
//smallcanvas.visible = false;

//smallcanvas.scaleX = 1;
//smallcanvas.scaleY = 1;
//exportRoot.addChild(smallcanvas);

	exportRoot.level.turn.visible = false;
	smallcanvas.collider.addChild(bitmap);
	
	bitmap2 = new createjs.Bitmap("images/truck.png");
	bitmap2.x = -27; // car bildes atrasanas vieta ieks moviclip
	bitmap2.y = -87;
	bitmap2.scaleX = 55 / 118; //bitmap2.image.naturalWidth;
	bitmap2.scaleY = bitmap2.scaleX;// taka pivot punkts ir nobidits nevar pareizi nolasit car augstumu
	bitmap2.visible = false;
		
	smallcanvas.car.addChild(bitmap2);
	
	//smallcanvas.scaleX = 0.5;
	//smallcanvas.scaleY = 0.5;
	
	point1 = new createjs.Bitmap("images/parkingpoint.png");	
	point1.x = exportRoot.level.parking.p1.x;
	point1.y = exportRoot.level.parking.p1.y;
	smallcanvas.parking.addChild(point1);
	point1.visible = false;
	
	point2 = new createjs.Bitmap("images/parkingpoint.png");	
	point2.x = exportRoot.level.parking.p2.x;
	point2.y = exportRoot.level.parking.p2.y;
	smallcanvas.parking.addChild(point2);
	point2.visible = false;
	
	point3 = new createjs.Bitmap("images/parkingpoint.png");	
	point3.x = exportRoot.level.parking.p3.x;
	point3.y = exportRoot.level.parking.p3.y;
	smallcanvas.parking.addChild(point3);
	point3.visible = false;
	
	point4 = new createjs.Bitmap("images/parkingpoint.png");	
	point4.x = exportRoot.level.parking.p4.x;
	point4.y = exportRoot.level.parking.p4.y;
	smallcanvas.parking.addChild(point4);
	point4.visible = false;
	
	point5 = new createjs.Bitmap("images/parkingpoint.png");	
	point5.x = exportRoot.level.parking.p5.x;
	point5.y = exportRoot.level.parking.p5.y;
	smallcanvas.parking.addChild(point5);
	point5.visible = false;
	
	point6 = new createjs.Bitmap("images/parkingpoint.png");	
	point6.x = exportRoot.level.car.p6.x;
	point6.y = exportRoot.level.car.p6.y;
	point6.scaleX = 5;
	point6.scaleY = 5;
	smallcanvas.car.addChild(point6);
	point6.visible = false;
	
	if(exportRoot.level.enemy) {
	enemyBitmap = new createjs.Bitmap("images/enemy.png");
	enemyBitmap.scaleX = exportRoot.level.enemy.nominalBounds.width / enemyBitmap.image.naturalWidth;
	enemyBitmap.scaleY = enemyBitmap.scaleX;// taka pivot punkts ir nobidits nevar pareizi nolasit car augstumu
	enemyBitmap.visible = false;
	smallcanvas.enemy.addChild(enemyBitmap);
	
	enemy = exportRoot.level.enemy;

	enemyx = enemy.x;
	enemyy = enemy.y;
	exportRoot.level.enemyshadow.rotation = enemy.rotation;
	
	if(Level == 6) {enemySpeed = 1.2;}
	if(Level == 7) {enemySpeed = 2;}
	if(Level == 8) {enemySpeed = 1.2;}
	if(Level == 9) {enemySpeed = 1.6;}
	if(Level == 10) {enemySpeed = 2.3;}
	
	setTimeout(stopit,10);
	function stopit() {
	var randomenemy = Math.floor(Math.random()*8);
	enemy.gotoAndStop(randomenemy);
	exportRoot.level.enemyshadow.gotoAndStop(randomenemy);
	}
	
	}
	
		if(exportRoot.level.enemy2) {
	enemy2Bitmap = new createjs.Bitmap("images/enemy.png");
	enemy2Bitmap.scaleX = exportRoot.level.enemy2.nominalBounds.width / enemy2Bitmap.image.naturalWidth;
	enemy2Bitmap.scaleY = enemy2Bitmap.scaleX;// taka pivot punkts ir nobidits nevar pareizi nolasit car augstumu
	enemy2Bitmap.visible = false;
	smallcanvas.enemy2.addChild(enemy2Bitmap);
	
	enemy2 = exportRoot.level.enemy2;

	enemy2x = enemy2.x;
	enemy2y = enemy2.y;
	exportRoot.level.enemyshadow2.rotation = enemy2.rotation;

	if(Level == 8) {enemy2Speed = 1.4;}
	if(Level == 9) {enemy2Speed = 2.2;}
	if(Level == 10) {enemy2Speed = 1.6;}
	
	setTimeout(stopit2,10);
	function stopit2() {
	var randomenemy2 = Math.floor(Math.random()*8);
	enemy2.gotoAndStop(randomenemy2);
	exportRoot.level.enemyshadow2.gotoAndStop(randomenemy2);
	}
	}

	
	
		
if(mobile) {
			
createjs.Touch.enable(stage, false, false);
	
exportRoot.gmenu.buttons.lButtons.left.addEventListener( 'mousedown', leftDown);
exportRoot.gmenu.buttons.lButtons.left.addEventListener( 'pressup', leftUp);
exportRoot.gmenu.buttons.lButtons.right.addEventListener( 'mousedown', rightDown);
exportRoot.gmenu.buttons.lButtons.right.addEventListener( 'pressup', rightUp);
exportRoot.gmenu.buttons.rButtons.accelerate.addEventListener( 'mousedown', accDown);
exportRoot.gmenu.buttons.rButtons.accelerate.addEventListener( 'pressup', accUp);
exportRoot.gmenu.buttons.rButtons.brake.addEventListener( 'mousedown', brakeDown);
exportRoot.gmenu.buttons.rButtons.brake.addEventListener( 'pressup', brakeUp);

} else {
	
exportRoot.gmenu.buttons.visible = false;	 
document.addEventListener('keydown', keyIsDown);
document.addEventListener('keyup', keyIsUp);
}

exportRoot.level.shadow.x = exportRoot.level.car.x + 3;
	exportRoot.level.shadow.y = exportRoot.level.car.y + 5;
	exportRoot.level.shadow.rotation = exportRoot.level.car.rotation;
update();

}
// ----------------------------------------------------------------------------
function leftDown(event) {event.nativeEvent.preventDefault();left = true;}
function leftUp(event) {event.nativeEvent.preventDefault();left = false;right = false;}
function rightDown(event) {event.nativeEvent.preventDefault();right = true;}
function rightUp(event) {event.nativeEvent.preventDefault();right = false;left = false;}
function accDown(event) {event.nativeEvent.preventDefault();up = true;}
function accUp(event) {event.nativeEvent.preventDefault();up = false;}
function brakeDown(event) {event.nativeEvent.preventDefault();down = true;}
function brakeUp(event) {event.nativeEvent.preventDefault();down = false;}
// ----------------------------------------------------------------------------
function keyIsUp(event) {
	
	 if (event.keyCode == 38 || event.keyCode == 87) {
	up = false;
	event.preventDefault();
  } else if (event.keyCode == 40 || event.keyCode == 83){
    down = false;
	event.preventDefault();
  }
    if (event.keyCode == 39 || event.keyCode == 68) {
	right = false;
	event.preventDefault();
  } else if (event.keyCode == 37 || event.keyCode == 65){
    left = false;
	event.preventDefault();
  }
}
// ----------------------------------------------------------------------------
function keyIsDown(event) {
	
	  if (event.keyCode == 38 || event.keyCode == 87) { // up
	up = true;
	event.preventDefault();
  } else if (event.keyCode == 40 || event.keyCode == 83){ // down
    down = true;
	event.preventDefault();
  }
    if (event.keyCode == 39 || event.keyCode == 68) { // right
	right = true;
	event.preventDefault();
  } else if (event.keyCode == 37 || event.keyCode == 65){ // left
    left = true;
	event.preventDefault();
  }
}
// ----------------------------------------------------------------------------
function update(time) {
	
  if (lastTime != null) {
    delta = time - lastTime;    
  }	
lastTime = time;
	
if(!pause) {
//exportRoot.gmenu.frameratext.text = Math.round(createjs.Ticker.getMeasuredFPS());	
drive();
hittest();
showTime();
if(exportRoot.level.enemy) enemydrive();
}
if (!failed && !finished && isDriving) requestAnimationFrame(update);
}
// ----------------------------------------------------------------------------
function drive() {
	
			if(brakedelay > 0) {
				brakedelay --;
				exportRoot.level.car.brake.visible = true;
			} else {
				exportRoot.level.car.brake.visible = false;
			}
	
			speed = Math.round((increment)*5);

			if (right) {
				
				if (exportRoot.level.car.tireL.rotation < 20){
				exportRoot.level.car.tireL.rotation+=2;				
				}
			}

			if (left) {
					
				if (exportRoot.level.car.tireL.rotation > -20){
				exportRoot.level.car.tireL.rotation-=2;
				
				}
			}

			if (!left && !right) {
				
				if (exportRoot.level.car.tireL.rotation > 0) {
					exportRoot.level.car.tireL.rotation-=2;
				}
				if (exportRoot.level.car.tireL.rotation < 0) {
					exportRoot.level.car.tireL.rotation+=2;
				}
			}

		exportRoot.level.car.tireR.rotation = exportRoot.level.car.tireL.rotation;
		exportRoot.level.car.rotation+= (((.5 * exportRoot.level.car.tireL.rotation)/20) * increment)  * (delta / (1000 / 60));
			
		if (up) {
				if (speed < maxSpeed && brakedelay < 1) {
			increment += acceleration;
		}
		
			if (increment < 0){
			increment += (acceleration * 2);
			if(increment > 0) increment = 0;
			brakedelay = 20;
		}
		}
	
		else if (down) {
		if (speed > minSpeed && brakedelay < 1) {
			increment -= acceleration;
		}
		
		if (increment > 0){
			increment -= (acceleration * 2);
			if(increment < 0) increment = 0;
			brakedelay = 20;
		} else {
			if(night) exportRoot.level.car.lukturi.gotoAndPlay(1);
		}


		
	}	
   
		else if (increment > 0) {

			if (!up && !down) increment -= 1.5*acceleration;
			if (increment < .1){
				increment = 0;
			}

		}
		
	 else if (increment < 0) {

			if (!up && !down) increment += 1.5*acceleration;
				if (increment > -.1){
				increment = 0;
			}
		}		
		
		else {
			increment = 0;
	}		
	
	exportRoot.level.car.x += (increment * Math.sin(exportRoot.level.car.rotation * Math.PI / 180)) * (delta / (1000 / 60));
    exportRoot.level.car.y -= (increment * Math.cos(exportRoot.level.car.rotation * Math.PI / 180)) * (delta / (1000 / 60));
	

	var engineLoudness = Math.abs(increment) / 2.72;	
	engineSound.volume = engineLoudness;
	idleSound.volume = 1 - engineLoudness;
	
	if(night) {
		
	} else {
	exportRoot.level.shadow.x = exportRoot.level.car.x + 3;
	exportRoot.level.shadow.y = exportRoot.level.car.y + 5;
	exportRoot.level.shadow.rotation = exportRoot.level.car.rotation;
	}
	smallcanvas.car.x = exportRoot.level.car.x;
	smallcanvas.car.y = exportRoot.level.car.y;
	smallcanvas.car.rotation = exportRoot.level.car.rotation;
	
}
// ----------------------------------------------------------------------------
function enemydrive() {	
			
		enemy.x += (enemySpeed * Math.sin(enemy.rotation * Math.PI / 180)) * (delta / (1000 / 60));
		enemy.y -= (enemySpeed * Math.cos(enemy.rotation * Math.PI / 180)) * (delta / (1000 / 60));
			
			
			if ((enemyx < 0 && enemy.x > labaPuse + 150) || (enemyx > labaPuse && enemy.x < -150) || (enemyy < 0 && enemy.y > apaksPuse + 150) || (enemyy > apaksPuse && enemy.y < -150)) {
				var enemyframe = Math.floor(Math.random()*8);
				enemy.gotoAndStop(enemyframe);
				exportRoot.level.enemyshadow.gotoAndStop(enemyframe);
				enemy.x = enemyx;
				enemy.y = enemyy;
			}
			exportRoot.level.enemyshadow.x = enemy.x + 3;
			exportRoot.level.enemyshadow.y = enemy.y + 5;
			
			smallcanvas.enemy.x = enemy.x;
			smallcanvas.enemy.y = enemy.y;
			
			
	if(exportRoot.level.enemy2) {
			
			enemy2.x += enemy2Speed * Math.sin(enemy2.rotation * Math.PI / 180);
			enemy2.y -= enemy2Speed * Math.cos(enemy2.rotation * Math.PI / 180);
			
			if ((enemy2x < 0 && enemy2.x > labaPuse + 150) || (enemy2x > labaPuse && enemy2.x < -150) || (enemy2y < 0 && enemy2.y > apaksPuse + 150) || (enemy2y > apaksPuse && enemy2.y < -150)) {
				var enemy2frame = Math.floor(Math.random()*8);
				enemy2.gotoAndStop(enemy2frame);
				exportRoot.level.enemyshadow2.gotoAndStop(enemy2frame);
				enemy2.x = enemy2x;
				enemy2.y = enemy2y;
				
			}
			exportRoot.level.enemyshadow2.x = enemy2.x + 3;
			exportRoot.level.enemyshadow2.y = enemy2.y + 5;	

			smallcanvas.enemy2.x = enemy2.x;
			smallcanvas.enemy2.y = enemy2.y;
	}
}
// ----------------------------------------------------------------------------
function hittest() {


colisiondelay ++;

if(colisiondelay == 1) {
var collision = ndgmr.checkPixelCollision(bitmap2,bitmap,1);
if(collision) {
	var dumi = new lib.dums();
	var points = smallcanvas.globalToLocal(collision.x, collision.y);
	dumi.x = points.x;
	dumi.y = points.y;
	exportRoot.level.addChild(dumi);
	if(isDriving) levelFailed(); // isDriving obligati savadak parladejot var izmest failed logu
	
}
} else if(colisiondelay == 2 && exportRoot.level.enemy) {
var collision2 = ndgmr.checkPixelCollision(bitmap2,enemyBitmap,1);
if(collision2) {
	var dumi = new lib.dums();
	var points = smallcanvas.globalToLocal(collision2.x, collision2.y);
	dumi.x = points.x;
	dumi.y = points.y;
	exportRoot.level.addChild(dumi);
	if(isDriving) levelFailed(); // isDriving obligati savadak parladejot var izmest failed logu
	
}
} else if (colisiondelay == 3) {
	
	if(exportRoot.level.turn.visible) exportRoot.level.turn.visible = false;
	if (ndgmr.checkPixelCollision(bitmap2,point1,1)) {
		if (ndgmr.checkPixelCollision(bitmap2,point2,1)) {
			if (ndgmr.checkPixelCollision(bitmap2,point3,1)) {
				if (ndgmr.checkPixelCollision(bitmap2,point4,1)) {
					
				if (ndgmr.checkPixelCollision(point5,point6,1)) {	
					if (isDriving) levelComplete();	
				} else {
					exportRoot.level.turn.visible = true;
				}					
				}
			}
		}
	}		
} else if(colisiondelay == 4 && exportRoot.level.enemy2) {
var collision3 = ndgmr.checkPixelCollision(bitmap2,enemy2Bitmap,1);
if(collision3) {
	var dumi = new lib.dums();
	var points = smallcanvas.globalToLocal(collision3.x, collision3.y);
	dumi.x = points.x;
	dumi.y = points.y;
	exportRoot.level.addChild(dumi);
	if(isDriving) levelFailed(); // isDriving obligati savadak parladejot var izmest failed logu
	
}
}

if (colisiondelay >= 4) colisiondelay = 0;
}
// -----------------------------------------------------------------------------
function levelFailed() {
	failed = true;
	
createjs.Sound.play("bum");
	exportRoot.gmenu.buttons.visible = false;
	tryAgainScreen = new lib.tryagain();
	exportRoot.addChild(tryAgainScreen);
	if (idleSound) idleSound.stop();
if (engineSound) engineSound.stop();
}
// -----------------------------------------------------------------------------
function timeOver() {
	failed = true;
	exportRoot.gmenu.buttons.visible = false;
	tryAgainScreen = new lib.timeover();
	exportRoot.addChild(tryAgainScreen);
	if (idleSound) idleSound.stop();
if (engineSound) engineSound.stop();
}
// ------------------------------------------------------------------------------
function levelComplete() {
	
	if (idleSound) idleSound.stop();
if (engineSound) engineSound.stop();

	var betterscore = false;
	unlockedAchievement = -1;
	
	createjs.Sound.play("bi");
	
	var parkinglights = new lib.parkinglight();
	exportRoot.level.car.addChild(parkinglights);
	
	levelScore = Math.floor((Level * 50) + (gameTime / 14));
	if (levelScore > levelScores[Level - 1]) {
		levelScores[Level - 1] = levelScore;
		betterscore = true;
	}
	
	levelStars = 0;
	if(levelScore > 100) levelStars = 1;
	if(levelScore >= targetScores[Level-1] - (targetScores[Level-1] / 15)) levelStars = 2;
	if(levelScore >= targetScores[Level-1]) levelStars = 3;
	
	totalScore = 0;
	for (i = 0; i < levelScores.length; i++) {
    totalScore += levelScores[i];
	}
	if(betterscore) writeMemory();
	
	finished = true;
	exportRoot.gmenu.buttons.visible = false;
	if(Level == 10) {
	tryAgainScreen = new lib.levelcompletefinal();
	} else {
		tryAgainScreen = new lib.levelcomplete();
	}
	exportRoot.addChild(tryAgainScreen);
}
// ------------------------------------------------------------------------------
function showTime() {
	gameTime -=  delta / (1000 / 60);
	if(gameTime < 0) gameTime = 0;
	updateclock ++;
	if(updateclock >= 60) {
		updateclock = 0;
		
		var seconds = Math.floor(gameTime/60);
		var minutes = Math.floor(seconds/60);
		seconds -= minutes*60;
		exportRoot.gmenu.hWindow.timetext.text = minutes+" : "+String(seconds+100).substr(1,2);
		if(gameTime <= 0) timeOver();
	}
}
// ------------------------------------------------------------------------------
function resetgame() {

if(mobile) {
	exportRoot.gmenu.buttons.lButtons.left.removeEventListener( 'mousedown', leftDown);
	exportRoot.gmenu.buttons.lButtons.left.removeEventListener( 'pressup', leftUp);
	exportRoot.gmenu.buttons.lButtons.right.removeEventListener( 'mousedown', rightDown);
	exportRoot.gmenu.buttons.lButtons.right.removeEventListener( 'pressup', rightUp);
	exportRoot.gmenu.buttons.rButtons.accelerate.removeEventListener( 'mousedown', accDown);
	exportRoot.gmenu.buttons.rButtons.accelerate.removeEventListener( 'pressup', accUp);
	exportRoot.gmenu.buttons.rButtons.brake.removeEventListener( 'mousedown', brakeDown);
	exportRoot.gmenu.buttons.rButtons.brake.removeEventListener( 'pressup', brakeUp);
} else {
	document.removeEventListener('keydown', keyIsDown);
	document.removeEventListener('keyup', keyIsUp);
}
	isDriving = false;
	
	stage.removeChild(exportRoot);
	exportRoot = new lib.html5(); // parlade visu lai restartejot masina butu sakuma punkta
	stage.addChild(exportRoot);
	updateButtons();
}
// ------------------------------------------------------------------------------
function readMemory() {
	
	for (i = 0; i < levelScores.length; i++) {
		if(localStorage.getItem('scoreparktaxi3' + i) == null) localStorage.setItem('scoreparktaxi3' + i, 0);
    levelScores[i] = parseInt(localStorage.getItem('scoreparktaxi3' + i));
	}
	updateAchievements();
}
// ------------------------------------------------------------------------------
function writeMemory() {
		for (i = 0; i < levelScores.length; i++) {
    localStorage.setItem('scoreparktaxi3' + i, levelScores[i]);
	}
	updateAchievements();
}

function updateAchievements() {
	
	totalScore = 0;
	for (i = 0; i < levelScores.length; i++) {
    totalScore += levelScores[i];
	}
	
	var levelsfinished = 0;
	var threestars = 0;
	unlockedAchievement = -1;
	
	for (i = 0; i < levelScores.length; i++) {
		if (levelScores[i] > 0) levelsfinished ++;
		if(levelScores[i] >= targetScores[i]) threestars ++;
	}
	
	if(levelsfinished >= 1) {
		if(achievement[0] == 0) unlockedAchievement = 0;
		achievement[0] = 1;
	}
	if(levelsfinished >= 3) {
		if(achievement[1] == 0) unlockedAchievement = 1;
		achievement[1] = 1;
	}
	if(levelsfinished >= 5) {
		if(achievement[2] == 0) unlockedAchievement = 2;
		achievement[2] = 1;
	}
	if(levelsfinished >= 10) {
		if(achievement[3] == 0) unlockedAchievement = 3;
		achievement[3] = 1;
	}
	if(threestars >= 1) {
		if(achievement[4] == 0) unlockedAchievement = 4;
		achievement[4] = 1;
	}
	if(threestars >= 3) {
		if(achievement[5] == 0) unlockedAchievement = 5;
		achievement[5] = 1;
	}
	if(threestars >= 5) {
		if(achievement[6] == 0) unlockedAchievement = 6;
		achievement[6] = 1;
	}
	if(threestars >= 10) {
		if(achievement[7] == 0) unlockedAchievement = 7;
		achievement[7] = 1;
	}
	if(totalScore >= 1000) {
		if(achievement[8] == 0) unlockedAchievement = 8;
		achievement[8] = 1;
	}
	if(totalScore >= 3000) {
		if(achievement[9] == 0) unlockedAchievement = 9;
		achievement[9] = 1;
	}
	if(totalScore >= 6000) {
		if(achievement[10] == 0) unlockedAchievement = 10;
		achievement[10] = 1;
	}
	if(totalScore >= 9000) {
		if(achievement[11] == 0) unlockedAchievement = 11;
		achievement[11] = 1;
	}
	
}

$(window).focus(function() { 
    // Unpause when window gains focus 
    if(skana) createjs.Sound.muted = false;
}).blur(function() { 
    // Pause when window loses focus 
    createjs.Sound.muted = true; 
}); 
