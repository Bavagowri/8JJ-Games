miris = false;
finished = false;
var isPlaying = false;
pause = false;
skana = true;
up = false;
down = false;
right = false;
left = false;
mobile = false;//false
var gameTime = 10800;
var updateclock = 0;
var tryAgainScreen;
var againScreen = false;
var fade;

var levelScore = 0;
var bestScore = 0;
var scoreBonus = 0;
var killInRow = 0;
var killInRowMax = 0;
var levelStars = 0;
var usedMedkit = 0;

var backgroundSound;
if(createjs.Touch.isSupported()) mobile = true;//true

var bullets;
var enemies = 0;
var totalEnemies = 0;
var maxBullets = 30;
var startHealth = 15;
var miris = false;
var health = 15;
var isShooting = false;
var mobileShootDelay = 0;

var engine;
var scene;
var camera;
var firstplay = true;
var gun;
var scene;
var canvas3d;
var spriteManagerDumi;
var spriteManagerAsinis;
var spriteManagerEnemy;

var mX;
var mouseOffSet;
var leftTouchID = -1;
var leftTouchStartPos = new createjs.Point(0, 0);
var leftTouchDrag = new createjs.Point(0, 0);
var leftTouchMAxSpeed = 55;

var shootTouchID = -1;
var rightTouchID = -1;
var rightTouchOldPos = new createjs.Point(0, 0);
var pauseTouchID = -1;
var reloadTouchID = -1;

var portals;
var zones;
var currentPortal = -1;
var portalId = 5;//lai sakuma skane kur atrodas

var z0,z1,z2,z3,z4,z5,z6,z7,z8,z9,z10,z11,z12,z13,z14,z15,z16,z17,z18,z19,z20,z21,z22,z23,z24,z25,z26,z27,z28,z29,z30;

var enemy1;
var enemy2;
var aptiecina1;
var difficulty = 0;

var cameraHitbox;
var startPosition;
var startRotation = 102 * Math.PI / 180;//108

var achievement = [0,0,0,0,0,0,0,0,0,0,0,0];
var unlockedAchievement = -1;

var joistickP;
var joistickR;
var joistickT;

var lockSpeed = 3400; // 1800 mazaks ir atrak
var mobileRotSpeed = 0.001; // 0.001 mazaks ir lenak

var pLocked = false;

var dt2=1000/60;
var timeTarget2=0;

function updateButtons() {

//exportRoot.pausebutton.poga.pausepoga.x = 7  + (stage.x / stage.scaleX);
//exportRoot.pausebutton.poga.pausepoga.y = 0  - (stage.y / stage.scaleY);
exportRoot.onScreen.center.y = 0 - (stage.y / stage.scaleY);

exportRoot.onScreen.bulletScreen.x = 563 + (stage.x / stage.scaleX);
exportRoot.onScreen.bulletScreen.y = 3 - (stage.y / stage.scaleY);

exportRoot.onScreen.healthScreen.x = 0 - (stage.x / stage.scaleX);
exportRoot.onScreen.healthScreen.y = 0 - (stage.y / stage.scaleY);

exportRoot.onScreen.fireButton.x = 540 + (stage.x / stage.scaleX);
exportRoot.onScreen.fireButton.y = 245 + (stage.y / stage.scaleY);

exportRoot.onScreen.reloadButton.x = 610 + (stage.x / stage.scaleX);
exportRoot.onScreen.reloadButton.y = 155 + (stage.y / stage.scaleY);

exportRoot.onScreen.joistickLeft.x = 67 - (stage.x / stage.scaleX);
exportRoot.onScreen.joistickLeft.y = 290 + (stage.y / stage.scaleY);

exportRoot.onScreen.lockTxt.y = 347 + (stage.y / stage.scaleY);

var yOff = stage.y / stage.scaleY;
if (yOff > 110) { yOff = -110 + (stage.y / stage.scaleY);} else { yOff = 0;}
exportRoot.ievads.y = 360 + yOff;

exportRoot.ievadfons.y = 0 + yOff;

exportRoot.mainmenu.x = 0 - (stage.x / stage.scaleX);

if(stage.y / stage.scaleY > 45) {
exportRoot.mainmenu.y = 325 + yOff;
exportRoot.mainmenu.diff.y = -250;
} else {
exportRoot.mainmenu.y = 230 + yOff;	
exportRoot.mainmenu.diff.y = -155;
}

exportRoot.mainmenu.diff.x = 195 + (stage.x / stage.scaleX);
//exportRoot.mainmenu.diff.y = -155 - yOff;

exportRoot.scoreT.x = 565 + (stage.x / stage.scaleX);
exportRoot.scoreT.y = 0 - (stage.y / stage.scaleY);

exportRoot.pausebutton.poga.x = 590 + (stage.x / stage.scaleX);
exportRoot.pausebutton.poga.y = 32 - (stage.y / stage.scaleY);

exportRoot.title.x = 0 - (stage.x / stage.scaleX);
exportRoot.title.y = 10 - (stage.y / stage.scaleY);


joistickP = stage.localToGlobal(exportRoot.onScreen.joistickLeft.x, exportRoot.onScreen.joistickLeft.y);
joistickR = 112 * 0.7  * stage.scaleX + joistickP.x;
joistickT = joistickP.y - (112 * 0.7  * stage.scaleY);

if(mobile) {
			var yOffset = stage.y / stage.scaleY;
		if (yOffset < 100) {
			yOffset = 0;
		} else {
			yOffset = (stage.y / stage.scaleY) - 100;
		}		
		exportRoot.onScreen.gun.y = 0  + yOffset;
}

}


// ------------------------------------------------------------------------------------
function startGame() {
updateButtons();	
if (backgroundSound) backgroundSound.stop();
	setTimeout(stopit,100);
	function stopit(){
backgroundSound = createjs.Sound.play("fonamuzons",{interrupt: createjs.Sound.INTERRUPT_EARLY, loop:-1});
backgroundSound.volume = 1;		
}

pause = true;

fade = new lib.fadeout();
exportRoot.addChild(fade);

if(mobile) {
if (difficulty == 0) startHealth = 15;
if (difficulty == 1) startHealth = 12;
if (difficulty == 2) startHealth = 10;		
} else {
if (difficulty == 0) startHealth = 15;//180
if (difficulty == 1) startHealth = 12;
if (difficulty == 2) startHealth = 10;
}

gameTime = 40000;//10 min 36800
levelScore =  0;
scoreBonus = 0;
killInRow = 0;
killInRowMax = 0;
var usedMedkit = 0;
health = startHealth;
bullets = maxBullets;
currentPortal = -1;
portalId = 5;

enemies = totalEnemies;
exportRoot.onScreen.center.enemyText.text = "Enemies: " + enemies;
exportRoot.onScreen.center.enemyTextTotal.text = "/ " + totalEnemies;
exportRoot.onScreen.healthScreen.healthline.gotoAndStop(health);
//exportRoot.onScreen.healthScreen.healthttxt.text = health;
//exportRoot.onScreen.healthScreen.fullhealthtxt.text = "/ " + startHealth;
exportRoot.onScreen.bulletScreen.bullettxt.text = bullets;

miris = false;
finished = false;
isPlaying = true;

up = false;
down = false;
right = false;
left = false;	

exportRoot.pausebutton.poga.gotoAndStop(1);
if(!mobile) anim_container.style.cursor = "none";

if (firstplay) {
	setupWorld();
} else {
	if(mobile) resumeMobileGame();
	fade.gotoAndPlay(1);
}
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function setupWorld() {
	
firstplay = false;	
canvas3d = document.getElementById("renderCanvas");
		
var createScene = function () {
    scene = new BABYLON.Scene(engine);
	scene.gravity = new BABYLON.Vector3(0, -0.2, 0);
	scene.collisionsEnabled = true;
        
    var light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0.5, -1, 0.5), scene);	
	var light2 = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0.5, -1, 1), scene);
	light2.diffuse = new BABYLON.Color3(1, 1, 1);
	light2.specular = new BABYLON.Color3(1, 1,1);
	light2.groundColor = new BABYLON.Color3(1, 1, 1);
	light2.intensity = 0.8;	
	

	
BABYLON.SceneLoader.ImportMesh("", "images/3d/", "physics.js", scene, function (newMeshes) {

	for (var i = 0; i < scene.meshes.length; i++) {
        scene.meshes[i].freezeWorldMatrix();
    }
				
	//scene.freezeActiveMeshes();	
	scene.blockMaterialDirtyMechanism = true;
	scene.clearColor = new BABYLON.Color3(168 / 255, 164 / 255, 158 / 255);
			
			//scene.debugLayer.show();
			//mobile = true;
		
	var collider = scene.getMeshesByTags("collider");	
	for (var c = 0; c < collider.length; c++) {
	collider[c].visibility = 0;
	}
	
	portals = scene.getMeshesByTags("portal");	
	for (var p = 0; p < portals.length; p++) {
	portals[p].setEnabled(false);
	}
	
	zones = scene.getMeshesByTags("zone");
	for (var z = 0; z < zones.length; z++) {
	if(zones[z].name == "z0") z0 = zones[z];
	if(zones[z].name == "z1") z1 = zones[z];
	if(zones[z].name == "z2") z2 = zones[z];
	if(zones[z].name == "z3") z3 = zones[z];
	if(zones[z].name == "z4") z4 = zones[z];
	if(zones[z].name == "z5") z5 = zones[z];
	if(zones[z].name == "z6") z6 = zones[z];
	if(zones[z].name == "z7") z7 = zones[z];
	if(zones[z].name == "z8") z8 = zones[z];
	if(zones[z].name == "z9") z9 = zones[z];
	if(zones[z].name == "z10") z10 = zones[z];
	if(zones[z].name == "z11") z11 = zones[z];
	if(zones[z].name == "z12") z12 = zones[z];
	if(zones[z].name == "z13") z13 = zones[z];
	if(zones[z].name == "z14") z14 = zones[z];
	if(zones[z].name == "z15") z15 = zones[z];
	if(zones[z].name == "z16") z16 = zones[z];
	if(zones[z].name == "z17") z17 = zones[z];
	if(zones[z].name == "z18") z18 = zones[z];
	if(zones[z].name == "z19") z19 = zones[z];
	if(zones[z].name == "z20") z20 = zones[z];
	if(zones[z].name == "z21") z21 = zones[z];
	if(zones[z].name == "z22") z22 = zones[z];
	if(zones[z].name == "z23") z23 = zones[z];
	if(zones[z].name == "z24") z24 = zones[z];
	if(zones[z].name == "z25") z25 = zones[z];
	if(zones[z].name == "z26") z26 = zones[z];
	if(zones[z].name == "z27") z27 = zones[z];
	if(zones[z].name == "z28") z28 = zones[z];
	if(zones[z].name == "z29") z29 = zones[z];
	if(zones[z].name == "z30") z30 = zones[z];
	}
	
	startPosition = scene.getMeshesByTags("startposition");
	camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(startPosition[0]._absolutePosition.x, startPosition[0]._absolutePosition.y + 5, startPosition[0]._absolutePosition.z), scene);					
		
	camera.attachControl(canvas, true);
	//camera.inputs.remove(camera.inputs.attached.mouse);			
	camera.rotation.y = startRotation;
	//camera.maxZ = 120;//120
	camera.inertia = 0.5;//0.5
	camera.angularSensibility = 1100;//1100
	camera.checkCollisions = true;
	camera.applyGravity = true;
	camera.ellipsoid = new BABYLON.Vector3(2, 3, 2);
	camera.speed = 4;
	camera.ellipsoidOffset = new BABYLON.Vector3(0, 1, 0);	
	
	cameraHitbox = BABYLON.MeshBuilder.CreateBox("box", {height: 1, width: 1, depth: 1}, scene);
	cameraHitbox.name = "player";
	cameraHitbox._visibility = 0;
	cameraHitbox.parent = camera;
	
	startPosition[0].setEnabled(false);
	startPosition[0].isPickable = false;
	
	enemy1 = scene.getMeshesByTags("enemy1");	
	for (var e = 0; e < enemy1.length; e++) {
	enemy1[e].unfreezeWorldMatrix();
	enemy1[e].createEnemy = function () {enemy(enemy1[e],1,e);}	
	enemy1[e].mirst = 0;
	enemy1[e].beigts = false;
	enemy1[e].restart = false;
	enemy1[e].createEnemy();
	}
	
	enemy2 = scene.getMeshesByTags("enemy2");	
	for (var e = 0; e < enemy2.length; e++) {
	enemy2[e].unfreezeWorldMatrix();
	enemy2[e].createEnemy = function () {enemy(enemy2[e],2,e);}	
	enemy2[e].mirst = 0;
	enemy2[e].beigts = false;
	enemy2[e].restart = false;
	enemy2[e].createEnemy();
	}
	
	aptiecina1 = scene.getMeshesByTags("aptiecina");	
	for (var e = 0; e < aptiecina1.length; e++) {
	aptiecina1[e].unfreezeWorldMatrix();
	aptiecina1[e].createAptiecina = function () {aptiecina(aptiecina1[e]);}	
	aptiecina1[e].restart = false;
	aptiecina1[e].createAptiecina();
	}
		
	enemies = totalEnemies;
	exportRoot.onScreen.center.enemyText.text = "Enemies: " + enemies;
	exportRoot.onScreen.center.enemyTextTotal.text = "/ " + totalEnemies;
	
    });
        
scene.registerBeforeRender(function () {
	if (!portals[portalId].intersectsPoint(new BABYLON.Vector3(camera.position.x, camera.position.y, camera.position.z))) {//lai samazinatu loop ja atrodas taja pasa portala
	for (var i = 0; i < portals.length; i++) {	
	if (portals[i].intersectsPoint(new BABYLON.Vector3(camera.position.x, camera.position.y, camera.position.z))) {
	if (currentPortal != parseInt(portals[i].name)) {
		portalId = i;
		enterOtherPortal(parseInt(portals[i].name));
	}
	break; 
		}
	}
	}	
});
			
scene.executeWhenReady(function () {
			
	if(mobile) {
	mobileInputs();
	} else {
	desktopInputs(); 
	}
	
	fade.gotoAndPlay(1);
	updateAnim();			 
});
		        
    return scene;
}
        
engine = new BABYLON.Engine(canvas3d, true,null,true); //pedejais true savadak uz telefona miglains 3d
if(!mobile) {
canvas3d.width = canvas.width;
canvas3d.height = canvas.height;
}
scene = createScene();
spriteManagerEnemy = new BABYLON.SpriteManager("enemyManager", "images/3d/esprite.png", 165, 550, scene);
spriteManagerEnemy.cellWidth = 550;
spriteManagerEnemy.cellHeight = 514;//373/420
spriteManagerDumi = new BABYLON.SpriteManager("dumiManager", "images/3d/dumi.png", 20, 30, scene);
spriteManagerAsinis = new BABYLON.SpriteManager("asinisManager", "images/3d/blood.png", 10, 25, scene);

engine.runRenderLoop(function () {
    if (scene && camera) {

		if(!pause && isPlaying) scene.render();

		exportRoot.onScreen.healthScreen.fpsText.text = "FPS: " + engine.getFps().toFixed();
		//exportRoot.onScreen.healthScreen.fpsText2.text = "FPS: " + createjs.Ticker.getMeasuredFPS();
    }
});

window.addEventListener("resize", function () {
    engine.resize();
	
	if(!mobile) {
	canvas3d.width = canvas.width;
	canvas3d.height = canvas.height;
	
	}
});
		
canvas3d.focus();

//	
}
// ----------------------------------------------------------------------------------------
function mobileInputs() {
	
	exportRoot.pausebutton.poga.removeAllEventListeners();
	
	camera.inputs.remove(camera.inputs.attached.keyboard);
	exportRoot.onScreen.gun.x = 0;
	//exportRoot.onScreen.gun.y = 0;
		
	canvas.addEventListener( 'touchstart', onTouchStart, false );
	canvas.addEventListener( 'touchend', onTouchEnd, false );
	canvas.addEventListener( 'touchmove', onTouchMove, false );
	canvas.addEventListener("touchcancel", onTouchEnd, false);
}
// ---------------------------------------------------------------------------------------
	function desktopInputs() {
	
	exportRoot.onScreen.joistickLeft.visible = false;
	exportRoot.onScreen.fireButton.visible = false;
	exportRoot.onScreen.reloadButton.visible = false;
	
	camera.keysUp.push(87);    //W
    camera.keysDown.push(83)   //D
    camera.keysLeft.push(65);  //A
    camera.keysRight.push(68); //S
			
	anim_container.style.cursor = "none";

window.addEventListener("keydown", function (evt) {
canvas3d.focus();
	if (evt.keyCode === 76) {

		if(engine.isPointerLock) {
		document.exitPointerLock = document.exitPointerLock ||
		document.mozExitPointerLock ||
		document.webkitExitPointerLock;
		if(document.exitPointerLock) {
			document.exitPointerLock();
			//camera.inputs.remove(camera.inputs.attached.mouse);
			camera.rotation.x = 0;
			engine.isPointerLock = false;
			pLocked = false;
		}

	} else {
		
		canvas3d.requestPointerLock = canvas3d.requestPointerLock ||
		canvas3d.mozRequestPointerLock ||
		canvas3d.webkitRequestPointerLock;
		if(canvas3d.requestPointerLock) {
		canvas3d.requestPointerLock();
		//camera.inputs.addMouse();
		canvas3d.addEventListener("pointerdown", onPointerDown, false); 
		engine.isPointerLock = true;
		exportRoot.onScreen.temeklis.x = ((canvas3d.width / 2) / stage.scaleX) - (stage.x / stage.scaleX);
		exportRoot.onScreen.temeklis.y = ((canvas3d.height / 2) / stage.scaleY) - (stage.y / stage.scaleY);
		camera.inputs.attached.mouse.angularSensibility = lockSpeed;
		
		exportRoot.onScreen.gun.x = 0;
		
		var yOffset = stage.y / stage.scaleY;
		if (yOffset < 100) {
			yOffset = 0;
		} else {
			yOffset = (stage.y / stage.scaleY) - 100;
		}
		
		exportRoot.onScreen.gun.y = 0  + yOffset;
		}
			
	pLocked = true;
	}
	} else if (evt.keyCode === 82) {
		exportRoot.onScreen.gun.gotoAndPlay(14);
		exportRoot.onScreen.temeklis.gotoAndPlay(10);
	} else if (evt.keyCode === 80) { // pause

	if (!pause) {
	pause = true;
	exportRoot.pausebutton.gotoAndStop(1);
	if(againScreen) exportRoot.tryAgainScreen.visible = false;
	exitPointer();
	} else {
		
		//pause = false;
		//if (pLocked) lockPoint();
	}
	} else if (evt.keyCode == 37 || evt.keyCode == 38 || evt.keyCode == 39 || evt.keyCode == 40) {
		evt.preventDefault();
	}
	
	
});

		
var onPointerDown = function (event) {
	if(engine.isPointerLock) {
var pickInfo = scene.pick((canvas3d.width / scaling) / 2, (canvas3d.height / scaling) / 2,function (mesh) { return mesh.isPickable; });
	} else {
  var pickInfo = scene.pick(stage.mouseX / scaling, stage.mouseY / scaling,function (mesh) { return mesh.isPickable; });	
	}		    
    if (pickInfo.hit) {
		canvas3d.focus();	
		shoot(pickInfo);
    }
}				
document.addEventListener("mousedown", onPointerDown, false);  
		
}


	
// ---------------------------------------------------------------------------------------

function enterOtherPortal(portal) {
	currentPortal = portal;

	for (var i = 0; i < zones.length; i++) { zones[i].setEnabled(false); }
	
	if(portal == 0) {z0.setEnabled(true);z1.setEnabled(true);z20.setEnabled(true);camera.maxZ = 100;}
	if(portal == 1) {z0.setEnabled(true);z1.setEnabled(true);camera.maxZ = 105;}	
	if(portal == 2) {z0.setEnabled(true);z1.setEnabled(true);z2.setEnabled(true);camera.maxZ = 102;}	
	if(portal == 3) {z1.setEnabled(true);z2.setEnabled(true);z3.setEnabled(true);camera.maxZ = 107;}	
	if(portal == 4) {z1.setEnabled(true);z2.setEnabled(true);z3.setEnabled(true);z4.setEnabled(true);z5.setEnabled(true);camera.maxZ = 106;}	
	if(portal == 5) {z2.setEnabled(true);z3.setEnabled(true);z4.setEnabled(true);z5.setEnabled(true);camera.maxZ = 123;}		
	if(portal == 6) {z3.setEnabled(true);z2.setEnabled(true);z1.setEnabled(true);z4.setEnabled(true);camera.maxZ = 118;}	
	if(portal == 7) {z2.setEnabled(true);z3.setEnabled(true);z4.setEnabled(true);camera.maxZ = 124;}		
	if(portal == 8) {z2.setEnabled(true);z5.setEnabled(true);z6.setEnabled(true);camera.maxZ = 104;}		
	if(portal == 9) {z6.setEnabled(true);z5.setEnabled(true);z7.setEnabled(true);z11.setEnabled(true);camera.maxZ = 113;}	
	if(portal == 10) {z6.setEnabled(true);z5.setEnabled(true);z7.setEnabled(true);z11.setEnabled(true);camera.maxZ = 104;}	
	if(portal == 11) {z6.setEnabled(true);z7.setEnabled(true);z8.setEnabled(true);z9.setEnabled(true);camera.maxZ = 86;}		
	if(portal == 12) {z7.setEnabled(true);z8.setEnabled(true);z9.setEnabled(true);z10.setEnabled(true);camera.maxZ = 80;}	
	if(portal == 13) {z8.setEnabled(true);z9.setEnabled(true);z10.setEnabled(true);camera.maxZ = 82;}	
	if(portal == 14) {z6.setEnabled(true);z11.setEnabled(true);z12.setEnabled(true);camera.maxZ = 114;}	
	if(portal == 15) {z11.setEnabled(true);z12.setEnabled(true);z13.setEnabled(true);camera.maxZ = 105;}	
	if(portal == 16) {z12.setEnabled(true);z13.setEnabled(true);z14.setEnabled(true);camera.maxZ = 104;}
	if(portal == 17) {z12.setEnabled(true);z13.setEnabled(true);z14.setEnabled(true);z16.setEnabled(true);z17.setEnabled(true);camera.maxZ = 110;}	
	if(portal == 18) {z12.setEnabled(true);z13.setEnabled(true);z14.setEnabled(true);z16.setEnabled(true);z17.setEnabled(true);z15.setEnabled(true);camera.maxZ = 100;}	
	if(portal == 19) {z14.setEnabled(true);z15.setEnabled(true);camera.maxZ = 100;}	
	if(portal == 20) {z13.setEnabled(true);z14.setEnabled(true);z16.setEnabled(true);camera.maxZ = 98;}	
	if(portal == 21) {z13.setEnabled(true);z17.setEnabled(true);z18.setEnabled(true);camera.maxZ = 113;}	
	if(portal == 22) {z17.setEnabled(true);z18.setEnabled(true);z19.setEnabled(true);camera.maxZ = 114;}	
	if(portal == 23) {z18.setEnabled(true);z19.setEnabled(true);camera.maxZ = 112;}	
	if(portal == 24) {z0.setEnabled(true);z20.setEnabled(true);z21.setEnabled(true);z22.setEnabled(true);camera.maxZ = 98;}	
	if(portal == 25) {z20.setEnabled(true);z21.setEnabled(true);z22.setEnabled(true);camera.maxZ = 79;}	
	if(portal == 26) {z20.setEnabled(true);z21.setEnabled(true);z22.setEnabled(true);z23.setEnabled(true);z24.setEnabled(true);camera.maxZ = 97;}	
	if(portal == 27) {z22.setEnabled(true);z23.setEnabled(true);z24.setEnabled(true);z25.setEnabled(true);camera.maxZ = 115;}	
	if(portal == 28) {z23.setEnabled(true);z24.setEnabled(true);camera.maxZ = 80;}	
	if(portal == 29) {z23.setEnabled(true);z25.setEnabled(true);z26.setEnabled(true);camera.maxZ = 113;}	
	if(portal == 30) {z25.setEnabled(true);z26.setEnabled(true);z27.setEnabled(true);camera.maxZ = 102;}	
	if(portal == 31) {z26.setEnabled(true);z27.setEnabled(true);z28.setEnabled(true);camera.maxZ = 90;}	
	if(portal == 32) {z27.setEnabled(true);z28.setEnabled(true);z29.setEnabled(true);camera.maxZ = 110;}	
	if(portal == 33) {z27.setEnabled(true);z28.setEnabled(true);z29.setEnabled(true);z30.setEnabled(true);camera.maxZ = 106;}	
	if(portal == 34) {z29.setEnabled(true);z30.setEnabled(true);camera.maxZ = 76;}
	
}
// ---------------------------------------------------------------------------------------
function mobileShoot() {

	if (mobileShootDelay == 0) {
	mobileShootDelay ++;
	setTimeout(function(){(mobileShootDelay = 0)}, 230);
	
	var pickInfo = scene.pick((canvas.width / window.devicePixelRatio) / 2, (canvas.height / window.devicePixelRatio) / 2,function (mesh) { return mesh.isPickable; });
	    if (pickInfo.hit) {
		canvas3d.focus();	
		shoot(pickInfo);
    }
	}
}

function shoot(trapijums) {

	if(!pause && isPlaying && exportRoot.onScreen.gun.currentFrame == 0) {
		
	if(bullets <= 0) {
		exportRoot.onScreen.gun.gotoAndPlay(14);
		exportRoot.onScreen.temeklis.gotoAndPlay(10);
	} else {
		
	createjs.Sound.play("gun1hero");	
		
	exportRoot.onScreen.temeklis.gotoAndPlay(1);
	exportRoot.onScreen.gun.gotoAndPlay(1);
	
	if (trapijums.pickedMesh.beigts != undefined) { //enemy
		
	trapijums.pickedMesh.mirst = 1;
	createjs.Sound.play("au");
		
	var asinis = new BABYLON.Sprite("asinis", spriteManagerAsinis);
	asinis.position.x = trapijums.pickedPoint.x + trapijums.getNormal(true).x * 0.8;
	asinis.position.y = trapijums.pickedPoint.y + trapijums.getNormal(true).y * 0.8;
	asinis.position.z = trapijums.pickedPoint.z + trapijums.getNormal(true).z * 0.8;
	asinis.playAnimation(0, 15, false, 30);
	asinis.size = 1.5;
	asinis.disposeWhenFinishedAnimating = true;
	asinis.isPickable = false;	
	scoreBonus += 10;
	killInRow ++;
	if(killInRow == 10 || killInRow == 20 || killInRow == 30 || killInRow == 40 || killInRow == 50 || killInRow == 70) {
		scoreBonus += (20 * killInRow);
		if (killInRow > killInRowMax) killInRowMax = killInRow;
	}
	} else {
	
	var dumi = new BABYLON.Sprite("dumi", spriteManagerDumi);
	dumi.position.x = trapijums.pickedPoint.x + trapijums.getNormal(true).x * 0.8;
	dumi.position.y = trapijums.pickedPoint.y + trapijums.getNormal(true).y * 0.8;
	dumi.position.z = trapijums.pickedPoint.z + trapijums.getNormal(true).z * 0.8;
	dumi.playAnimation(0, 20, false, 38);
	dumi.size = 3;
	dumi.disposeWhenFinishedAnimating = true;
	dumi.isPickable = false;
	if (!mobile) scoreBonus -= 2;
	
	}
		
	bullets --;
	exportRoot.onScreen.bulletScreen.bullettxt.text = bullets;
	}		
	}	
}
// --------------------------------------------------------
function updateAnim() {
	
	if(Date.now()>=timeTarget2){
	
	if(!pause && isPlaying) {
	
	if(!mobile && !engine.isPointerLock) {
	mX = stage.mouseX;
	
	if (mX < 0) mX = 0;
	else if (mX > canvas3d.width) mX = canvas3d.width;
				
	if (mX > canvas3d.width - (canvas3d.width * 0.24)) {				
		mouseOffSet = mX - (canvas3d.width - (canvas3d.width * 0.24));
		camera.cameraRotation.y += (mouseOffSet * 0.00012) / stage.scaleX;// += atrak
				
	} else if (mX < canvas3d.width * 0.24) {
		mouseOffSet = (canvas3d.width * 0.24) - mX;
		camera.cameraRotation.y -= (mouseOffSet * 0.00012) / stage.scaleX;
	}
	camera.rotation.x = 0;
	
	exportRoot.onScreen.temeklis.x = (stage.mouseX  - stage.x)  / stage.scaleX;
	exportRoot.onScreen.temeklis.y = (stage.mouseY - stage.y)  / stage.scaleX;
				
	exportRoot.onScreen.gun.x = ((mX - (canvas3d.width / 2)) * 0.8) / stage.scaleX;
	
		var yOffset = stage.y / stage.scaleY;

	
	exportRoot.onScreen.gun.y = (((stage.mouseY - (canvas3d.height * 0.5)) * 0.57) / stage.scaleX) + (yOffset * 0.5);
	if(exportRoot.onScreen.gun.y < -100 + yOffset) {
		exportRoot.onScreen.gun.y = -100 + yOffset;
	}
	//if(exportRoot.onScreen.gun.y < -33) exportRoot.onScreen.gun.y = -33;	
			}
			
	if(mobile) {

		var translateTransform = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(-leftTouchDrag.x * 0.0045, 0, leftTouchDrag.y * 0.0045), BABYLON.Matrix.RotationY(camera.rotation.y));
        camera.cameraDirection.addInPlace(translateTransform);
		
		exportRoot.onScreen.joistickLeft.pointer.x = -leftTouchDrag.x;
		exportRoot.onScreen.joistickLeft.pointer.y = -leftTouchDrag.y;
		
		if(isShooting) mobileShoot();
	}
	gameTime --;
	}	
		    timeTarget2+=dt2;
    if(Date.now()>=timeTarget2){
      timeTarget2=Date.now();
    }
  }
	requestAnimationFrame(updateAnim);
}
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function trapija(damage) {
	
	if (!miris) {

	createjs.Sound.play("ah");
	
	health -= damage;
	killInRow = 0;	
	if (health < 0) health = 0;
	exportRoot.onScreen.healthScreen.healthline.gotoAndStop(health);
	//exportRoot.onScreen.healthScreen.healthttxt.text = health;
	
	camera.fov = 0.78;	
	setTimeout(function(){ camera.fov = 0.8; }, 35);
	exportRoot.onScreen.asinisScreen.gotoAndPlay(1);
	
	if(health == 0) {
	
	miris = true;
	setTimeout(function(){ pause = true; exportRoot.onScreen.visible = false;}, 70);
	
	againScreen = true;
	if(!mobile) {anim_container.style.cursor = "default";exitPointer();}
	
	writeMemory();	

	
	if(mobile) stopMobileGame();
	tryAgainScreen = new lib.tryagain();
	exportRoot.addChild(tryAgainScreen);
	}
	}
}

// ------------------------------------------------------------------------------
function levelComplete() {
	if(!miris) {
	pause = true;
	againScreen = true;
	if(!mobile) anim_container.style.cursor = "default";
		
	writeMemory();
	if(mobile) {stopMobileGame();} else {exitPointer();}
	
	exportRoot.onScreen.visible = false;
	tryAgainScreen = new lib.levelcomplete();
	exportRoot.addChild(tryAgainScreen);
	}
}
// ------------------------------------------------------------------------------
function resetgame() {


	miris = false;
	isPlaying = false;
	exportRoot.onScreen.visible = true;
	
	for (var e = 0; e < enemy1.length; e++) {
	enemy1[e].restart = true;
	}	
	for (var e = 0; e < enemy2.length; e++) {
	enemy2[e].restart = true;
	}	
		for (var e = 0; e < aptiecina1.length; e++) {
	aptiecina1[e].restart = true;
	}	
	camera._position = new BABYLON.Vector3(startPosition[0]._absolutePosition.x, startPosition[0]._absolutePosition.y + 5, startPosition[0]._absolutePosition.z);
	camera.rotation.y = startRotation;
	
	canvas3d = document.getElementById("renderCanvas");
var context = canvas3d.getContext('webgl2');
if(!context) context = canvas3d.getContext('webgl');
if(context) {
context.clearColor(0.169, 0.169, 0.169, 1.0);
context.clear(context.COLOR_BUFFER_BIT);
}
}
// ------------------------------------------------------------------------------
function readMemory() {

if(localStorage.getItem('warfare2score') == null) {localStorage.setItem('warfare2score', 0);}
  bestScore = parseInt(localStorage.getItem('warfare2score'));
  
  	for (i = 0; i < achievement.length; i++) {
		if(localStorage.getItem('achievementw2' + i) == null) localStorage.setItem('achievementw2' + i, 0);
    achievement[i] = parseInt(localStorage.getItem('achievementw2' + i));
	}
	
	if(localStorage.getItem('warfare2pLockSpeed') == null) {localStorage.setItem('warfare2pLockSpeed', lockSpeed);}
  lockSpeed = localStorage.getItem('warfare2pLockSpeed');
  
  	if(localStorage.getItem('warfare2mobileSpeed') == null) {localStorage.setItem('warfare2mobileSpeed', mobileRotSpeed);}
  mobileRotSpeed = localStorage.getItem('warfare2mobileSpeed');

}
// ------------------------------------------------------------------------------
function writeMemory() {

	
if(gameTime < 0) gameTime = 0;
if(scoreBonus < 0) scoreBonus = 0;

if(health == 0) {
levelScore = 500 + 	scoreBonus + (difficulty * 300);
} else {	
levelScore = Math.floor(1000 + (gameTime * 0.5) + (difficulty * 500) + (health * 50) + scoreBonus);
}
if(levelScore > bestScore) bestScore = levelScore;

	levelStars = 0;
	if(levelScore > 1000) levelStars = 1;
	if(levelScore > 7000) levelStars = 2;
	if(levelScore > 10000) levelStars = 3;
	
    localStorage.setItem('warfare2score', bestScore);

	updateAchievements();
	
}
// --------------------------------------------------------------------------------
function updateAchievements() {
	
unlockedAchievement = -1;

if (killInRowMax >= 10) {
	if(achievement[0] == 0) unlockedAchievement = 0;
	achievement[0] = 1;
}
if (killInRowMax >= 30) {
	if(achievement[1] == 0) unlockedAchievement = 1;
	achievement[1] = 1;
}
if (bestScore >= 1000) {
	if(achievement[2] == 0) unlockedAchievement = 2;
	achievement[2] = 1;
}
if (bestScore >= 5000) {
	if(achievement[3] == 0) unlockedAchievement = 3;
	achievement[3] = 1;
}
if (bestScore >= 10000) {
	if(achievement[4] == 0) unlockedAchievement = 4;
	achievement[4] = 1;
}
if (levelStars >= 2) {
	if(achievement[5] == 0) unlockedAchievement = 5;
	achievement[5] = 1;
}
if (levelStars >= 3) {
	if(achievement[6] == 0) unlockedAchievement = 6;
	achievement[6] = 1;
}
if(health > 0) {
	
if (difficulty == 0) {	
	if(achievement[7] == 0) unlockedAchievement = 7;
	achievement[7] = 1;
}	
if (difficulty == 1) {	
	if(achievement[8] == 0) unlockedAchievement = 8;
	achievement[8] = 1;
}	
if (difficulty == 2) {	
	if(achievement[9] == 0) unlockedAchievement = 9;
	achievement[9] = 1;
}	
if (health == startHealth) {	
	if(achievement[10] == 0) unlockedAchievement = 10;
	achievement[10] = 1;
}	
if (usedMedkit == 0) {	
	if(achievement[11] == 0) unlockedAchievement = 11;
	achievement[11] = 1;
}		
}

for (i = 0; i < achievement.length; i++) {
localStorage.setItem('achievementw2' + i, achievement[i]);
}	
	
}
function onTouchStart(e) {

	e.preventDefault();
	for(var i = 0; i<e.changedTouches.length; i++){
		var touch =e.changedTouches[i]; 
		var touchX = touch.clientX - canvas.offsetParent.offsetLeft;
		var touchY = touch.clientY - canvas.offsetParent.offsetTop;
		
		if(touchX  * window.devicePixelRatio < joistickR && touchY   * window.devicePixelRatio > joistickT) {
			
		if(leftTouchID < 0) {
			leftTouchID = touch.identifier; 
			leftTouchStartPos.setValues(touch.clientX, touch.clientY); 
			//continue; 		
		} 
		} else {
			if(shootTouchID == -1) {
		var shootButton = exportRoot.onScreen.fireButton.getTransformedBounds();
		var globalSButton = stage.localToGlobal(shootButton.x, shootButton.y);
		
		if(touchX * window.devicePixelRatio > globalSButton.x&& 
		touchX * window.devicePixelRatio < (globalSButton.x) + (shootButton.width  * stage.scaleX) && 
		touchY * window.devicePixelRatio > globalSButton.y&& 
		touchY * window.devicePixelRatio < (globalSButton.y) + (shootButton.height * stage.scaleX)) {
			shootTouchID = touch.identifier;  
			isShooting = true;
			}
		}
		
		if(rightTouchID == -1) {
		
		rightTouchID = touch.identifier;
		rightTouchOldPos.setValues(touch.clientX, touch.clientY);
		
		}
		
		if(pauseTouchID == -1) {
		var pauseButton = exportRoot.pausebutton.getTransformedBounds();		
		var globalPause = stage.localToGlobal(pauseButton.x, pauseButton.y);
				
		if(touchX * window.devicePixelRatio > globalPause.x&& 
		touchX * window.devicePixelRatio < (globalPause.x) + (pauseButton.width  * stage.scaleX) && 
		touchY * window.devicePixelRatio > globalPause.y&& 
		touchY * window.devicePixelRatio < (globalPause.y) + (pauseButton.height * stage.scaleX)) {
			pauseTouchID = touch.identifier;
			stopMobileGame();
			exportRoot.pausebutton.gotoAndStop(1);
			}
		}
		
			if(reloadTouchID == -1) {
		var reloadButton = exportRoot.onScreen.reloadButton.getTransformedBounds();		
		var globalrButton = stage.localToGlobal(reloadButton.x, reloadButton.y);
				
		if(touchX * window.devicePixelRatio > globalrButton.x&& 
		touchX * window.devicePixelRatio < (globalrButton.x) + (reloadButton.width  * stage.scaleX) && 
		touchY * window.devicePixelRatio > globalrButton.y&& 
		touchY * window.devicePixelRatio < (globalrButton.y) + (reloadButton.height * stage.scaleX)) {
			reloadTouchID = touch.identifier;
			exportRoot.onScreen.gun.gotoAndPlay(14);
			exportRoot.onScreen.temeklis.gotoAndPlay(10);
			
			}
		}
		
		
		} 
	}
	//touches = e.touches; 
}

function onTouchEnd(e) { 

   e.preventDefault();
   	//touches = e.touches; 

	for(var i = 0; i<e.changedTouches.length; i++){
		var touch =e.changedTouches[i]; 
		if(leftTouchID == touch.identifier){
			leftTouchID = -1; 
			leftTouchDrag.setValues(0, 0); 		
		}
		if(shootTouchID == touch.identifier) {
			shootTouchID = -1; 
			isShooting = false;		
		}
		if(rightTouchID == touch.identifier) {
			rightTouchID = -1; 		
		}
		if(pauseTouchID == touch.identifier) {
			pauseTouchID = -1; 		
		}
		if(reloadTouchID == touch.identifier) {
			reloadTouchID = -1; 		
		}
	
}
}

function onTouchMove(e) {
	 if(!pause) {
	e.preventDefault();
	
	for(var i = 0; i<e.changedTouches.length; i++){
		var touch =e.changedTouches[i]; 
		if(leftTouchID == touch.identifier)
		{ 
			var xDistance = leftTouchStartPos.x - touch.clientX;
			if(xDistance > leftTouchMAxSpeed) xDistance = leftTouchMAxSpeed;
			if(xDistance < -1 * leftTouchMAxSpeed) xDistance = -1 * leftTouchMAxSpeed;
			var yDistance = leftTouchStartPos.y - touch.clientY;
			if(yDistance > leftTouchMAxSpeed) yDistance = leftTouchMAxSpeed;
			if(yDistance < -1 * leftTouchMAxSpeed) yDistance = -1 * leftTouchMAxSpeed;
			
			leftTouchDrag.setValues(xDistance, yDistance); 		
		}

		if(rightTouchID == touch.identifier)
		{ 
		var xMove = rightTouchOldPos.x - touch.clientX;
		var yMove = rightTouchOldPos.y - touch.clientY;
		
		camera.cameraRotation.y += -xMove * mobileRotSpeed;
		camera.cameraRotation.x += -yMove * mobileRotSpeed;
				
		rightTouchOldPos.setValues(touch.clientX, touch.clientY);
		}
		
	}	
	 }
}

function stopMobileGame() {
	pause = true;
	canvas.removeEventListener( 'touchstart', onTouchStart, false );
	canvas.removeEventListener( 'touchend', onTouchEnd, false );
	canvas.removeEventListener( 'touchmove', onTouchMove, false );
	canvas.removeEventListener("touchcancel", onTouchEnd, false);
	leftTouchID = -1;
	rightTouchID = -1;
	pauseTouchID = -1;
	reloadTouchID = -1;
	shootTouchID = -1;
	leftTouchDrag.setValues(0, 0);
	isShooting = false;
	exportRoot.pausebutton.gotoAndPlay(4);
}
function resumeMobileGame() {
	pause = false;
	canvas.addEventListener( 'touchstart', onTouchStart, false );
	canvas.addEventListener( 'touchend', onTouchEnd, false );
	canvas.addEventListener( 'touchmove', onTouchMove, false );
	canvas.addEventListener("touchcancel", onTouchEnd, false);
	exportRoot.pausebutton.poga.removeAllEventListeners();
}
function exitPointer() {
	
		document.exitPointerLock = document.exitPointerLock ||
		document.mozExitPointerLock ||
		document.webkitExitPointerLock;
		if(document.exitPointerLock) {
			document.exitPointerLock();
		camera.rotation.x = 0;
		engine.isPointerLock = false;
		//camera.inputs.remove(camera.inputs.attached.mouse);
		}
}
// ---------------------------------------------------------------------------------------

function lockPoint() {
	
			canvas3d.requestPointerLock = canvas3d.requestPointerLock ||
		canvas3d.mozRequestPointerLock ||
		canvas3d.webkitRequestPointerLock;
		if(canvas3d.requestPointerLock) {
		canvas3d.requestPointerLock();
		//camera.inputs.addMouse();
		//canvas3d.addEventListener("pointerdown", onPointerDown, false); 
		engine.isPointerLock = true;
		exportRoot.onScreen.temeklis.x = ((canvas3d.width / 2) / stage.scaleX) - (stage.x / stage.scaleX);
		exportRoot.onScreen.temeklis.y = ((canvas3d.height / 2) / stage.scaleY) - (stage.y / stage.scaleY);
		camera.inputs.attached.mouse.angularSensibility = lockSpeed;
		
		exportRoot.onScreen.gun.x = 0;
		
		var yOffset = stage.y / stage.scaleY;
		if (yOffset < 100) {
			yOffset = 0;
		} else {
			yOffset = (stage.y / stage.scaleY) - 100;
		}
		
		exportRoot.onScreen.gun.y = 0  + yOffset;
		}
	
}

function handleVisibilityChange() {
  if (document.visibilityState === "hidden") {
    createjs.Sound.muted = true;
	leftTouchID = -1;
	rightTouchID = -1;
	pauseTouchID = -1;
	reloadTouchID = -1;
	shootTouchID = -1;
  } else  {
    if(skana) createjs.Sound.muted = false;
  }
}
document.addEventListener("visibilitychange", handleVisibilityChange, false);