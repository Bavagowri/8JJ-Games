Level=1;
failed = false;
finished = false;
pause = false;
isDriving = false;
skana = true;
firstPlay = true;

up = false;
down = false;
right = false;
left = false;

var speed = 0;
var maxSpeed = 0.37;
var minSpeed = -0.28;
var turnSpeed = 0; // samazina atrumu pagrieziena
var acceleration = 0.003;
var brakedelay = 0;
var maxWRotation = 0.45;
var wRotationSpeed = 0.03;

mobile = false;

var gameTime = 10800;
var updateclock = 0;
var again = false;

var tryAgainScreen;
var levelScore = 0;
var totalScore = 0;
var levelStars = 0;
var levelScores = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var targetScores = [798,832,830,918,920,981,957,1005,1082,1126,1140,1211,1062,1190,1092,1093,1240,1335,1342,1314];
var achievement = [0,0,0,0,0,0,0,0,0,0,0,0];
var unlockedAchievement = -1;

var mDown = false;

var backgroundSound;
var idleSound;
var engineSound;

if(createjs.Touch.isSupported()) mobile = true;
var fade;
//3D
var engine;
var scene;
var camera;
var camera2;
var cType = 1;//1-aizmugure, 2- prieks, 3-briva
var canvas3d;

var car;
var carTarget;
var brakeLight;
var tireFL;
var tireFR;
var tireRL;
var tireRR;
var tireRRL;
var tireRRR;

var pointFL;
var pointFR;
var pointRL;
var pointRR;

var carCollider;

var colliders = [];
var kadrs = 1;

var advancedTexture;
var fadeImg;

var shadowGenerator;
var rollingAverage;
var pDown = false;

// ------------------------------------------------------------------------------------
function updateButtons() {
	
exportRoot.gmenu.tWindow.x = 2 - (stage.x / stage.scaleX);
exportRoot.gmenu.tWindow.y = 2 - (stage.y / stage.scaleY);
var yOff = stage.y / stage.scaleY;
if (yOff > 52) { yOff = -52 + (stage.y / stage.scaleY);} else { yOff = 0;}
exportRoot.ievads.y = 360 + yOff;

exportRoot.scoreT.x = 565 + (stage.x / stage.scaleX);
exportRoot.scoreT.y = 0 - (stage.y / stage.scaleY);

exportRoot.pButton.poga.x = 592 + (stage.x / stage.scaleX);
exportRoot.pButton.poga.y = 37 - (stage.y / stage.scaleY);

exportRoot.menuB.x = 0 - (stage.x / stage.scaleX);
exportRoot.menuB.y = 236 + (stage.y / stage.scaleY);

exportRoot.tsc.x = 0 - (stage.x / stage.scaleX);
exportRoot.tsc.y = 0 - (stage.y / stage.scaleY);

}
	
// ------------------------------------------------------------------------------------
function startGame() {
//window.focus();
updateButtons();

if (backgroundSound) backgroundSound.stop();
if (idleSound) idleSound.stop();
if (engineSound) engineSound.stop();
	setTimeout(stopit,100);
	function stopit(){

backgroundSound = createjs.Sound.play("fonamuzons",{interrupt: createjs.Sound.INTERRUPT_EARLY, loop:-1});
idleSound = createjs.Sound.play("idle",{interrupt: createjs.Sound.INTERRUPT_EARLY, loop:-1});
engineSound = createjs.Sound.play("engine",{interrupt: createjs.Sound.INTERRUPT_EARLY, loop:-1});	
engineSound.volume = 0;
backgroundSound.volume = 0.7;		
}


pause = true;

fade = new lib.fadeout();
exportRoot.addChild(fade);
gameTime = 10800;
levelScore =  0;
//exportRoot.gmenu.tWindow.leveltxt.text = "Level: "+ Level;
exportRoot.gmenu.tWindow.timetext.text = "3 : 00";

failed = false;
finished = false;
isDriving = true;
up = false;
down = false;
right = false;
left = false;
cType = 1

speed = 0;
increment = 0;
	
if(mobile) {
			
createjs.Touch.enable(stage, false, false);
	
} else {
		 
document.addEventListener('keydown', keyIsDown);
document.addEventListener('keyup', keyIsUp);

}

canvas.style.pointerEvents = "none";
exportRoot.pButton.poga.visible = false;

setupWorld();
}

// -------------------------------------------
function createGUI() {
	
advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
advancedTexture.idealHeight = 360;
advancedTexture.idealWidth = 640;

    var pausebutton = BABYLON.GUI.Button.CreateImageOnlyButton("but", "images/pause.png");   
    pausebutton.width = "37px";
    pausebutton.height = "37px";  
    pausebutton.thickness = 0; 
	pausebutton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	pausebutton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	pausebutton.top = 22;
    advancedTexture.addControl(pausebutton); 
	
	 pausebutton.onPointerUpObservable.add(function() {
		 pause = true;
		 canvas.style.pointerEvents = "auto";
        exportRoot.pButton.gotoAndStop(1);
	if(tryAgainScreen) tryAgainScreen.visible = false;
    });
	
	var cameraButton = BABYLON.GUI.Button.CreateImageOnlyButton("camerabut", "images/camera.png");
	cameraButton.width = "72px";
    cameraButton.height = "44px";
    cameraButton.thickness = 0;
	cameraButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP; 
	cameraButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
	cameraButton.top = 30;
    advancedTexture.addControl(cameraButton); 	
	cameraButton.onPointerUpObservable.add(function() {
	
	if (cType == 1) {

camera2.heightOffset = 14;	
camera2.radius = 18;
var xPont =	carTarget.getAbsolutePosition().x += camera2.radius*parseFloat(Math.sin(carTarget.rotation.y));
var zPoint = carTarget.getAbsolutePosition().z += camera2.radius*parseFloat(Math.cos(carTarget.rotation.y));	
camera2._position = new BABYLON.Vector3(xPont, carTarget.getAbsolutePosition().y + camera2.heightOffset, zPoint);	
		
cType = 2;	
camera2.rotationOffset = 360;
event.preventDefault();		
} else if (cType == 2) {
camera2.heightOffset = 12;	
camera2.radius = 20;
var xPont2 =	carTarget.getAbsolutePosition().x -= camera2.radius*parseFloat(Math.sin(carTarget.rotation.y));
var zPoint2 = carTarget.getAbsolutePosition().z -= camera2.radius*parseFloat(Math.cos(carTarget.rotation.y));	
camera2._position = new BABYLON.Vector3(xPont2, carTarget.getAbsolutePosition().y + camera2.heightOffset, zPoint2);	
	
cType = 1;	
camera2.rotationOffset = 180;
event.preventDefault();	
} else if (cType == 3) {
camera2.heightOffset = 12;
camera2.radius = 20;	
cType = 1;	
camera2._position = new BABYLON.Vector3(camera.position.x, camera.position.y, camera.position.z);
camera2.rotationOffset = 180;
scene.activeCamera = camera2;
event.preventDefault();	
}
	
	
    });

	
	if (mobile) {
		
	var rpanel = new BABYLON.GUI.StackPanel();    
    advancedTexture.addControl(rpanel); 
    rpanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
	rpanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    rpanel.height = "145px";
	rpanel.isVertical = false;	
		
		var brakeButton = BABYLON.GUI.Button.CreateImageOnlyButton("brakebut", "images/brakePedal.png");
	brakeButton.width = "115px";
    brakeButton.height = "77px";
    brakeButton.thickness = 0;
	brakeButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;   
    rpanel.addControl(brakeButton); 	
	brakeButton.onPointerUpObservable.add(function() {
	down = false;
    });
	brakeButton.onPointerDownObservable.add(function() {
    down = true;
    });		
		
	var accButton = BABYLON.GUI.Button.CreateImageOnlyButton("accbut", "images/acceleratePedal.png");
	accButton.width = "107px";
    accButton.height = "145px";
    accButton.thickness = 0;    
    rpanel.addControl(accButton); 	
	accButton.onPointerUpObservable.add(function() {
	up = false;
    });
	accButton.onPointerDownObservable.add(function() {
    up = true;
    });	
	

	
	var panel = new BABYLON.GUI.StackPanel();    
    advancedTexture.addControl(panel); 
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    panel.height = "82px";
	panel.isVertical = false;
	
	var leftButton = BABYLON.GUI.Button.CreateImageOnlyButton("leftbut", "images/pedalPaKreisi.png");
    leftButton.width = "106px";
    leftButton.height = "82px";
    leftButton.thickness = 0;	
    panel.addControl(leftButton); 	
	leftButton.onPointerUpObservable.add(function() {
	left = false;
	right = false;
    });
	leftButton.onPointerDownObservable.add(function() {
    left = true;
    });	
	
	var separator = new BABYLON.GUI.Rectangle();
    separator.width = "12px";
	separator.thickness = 0;
    panel.addControl(separator);

	
	var rightButton = BABYLON.GUI.Button.CreateImageOnlyButton("rightbut", "images/pedalPaLabi.png");
    rightButton.width = "106px";
    rightButton.height = "82px";
    rightButton.thickness = 0;   
    panel.addControl(rightButton); 	
	rightButton.onPointerUpObservable.add(function() {
	left = false;
	right = false;
    });
	rightButton.onPointerDownObservable.add(function() {
    right = true;
    });	
		
	}

}
// ----------------

function setupWorld() {
	
rollingAverage = new BABYLON.RollingAverage(60);	
	
colliders = [];
	
canvas3d = document.getElementById("renderCanvas");
		
var createScene = function () {
    scene = new BABYLON.Scene(engine);

        
    var light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0.5, -1, 0.5), scene);
	var light2 = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0.5, -1, 1), scene);
	light2.diffuse = new BABYLON.Color3(1, 1, 1);
	light2.specular = new BABYLON.Color3(1, 1,1);
	light2.groundColor = new BABYLON.Color3(1, 1, 1);
	light.intensity = 1;
	light2.intensity = 0.75;	//0.7
	
	light.position = new BABYLON.Vector3(-115, 60, -135);//-115,53,-135
	shadowGenerator = new BABYLON.ShadowGenerator(4096, light);//4096


shadowGenerator.getShadowMap().refreshRate = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
light.autoUpdateExtends = false;

var levelFile;
if(Level == 1) levelFile = "level1.js";
if(Level == 2) levelFile = "level2.js";
if(Level == 3) levelFile = "level3.js";
if(Level == 4) levelFile = "level4.js";
if(Level == 5) levelFile = "level5.js";
if(Level == 6) levelFile = "level6.js";
if(Level == 7) levelFile = "level7.js";
if(Level == 8) levelFile = "level8.js";
if(Level == 9) levelFile = "level9.js";
if(Level == 10) levelFile = "level10.js";
if(Level == 11) levelFile = "level11.js";
if(Level == 12) levelFile = "level12.js";
if(Level == 13) levelFile = "level13.js";
if(Level == 14) levelFile = "level14.js";
if(Level == 15) levelFile = "level15.js";
if(Level == 16) levelFile = "level16.js";
if(Level == 17) levelFile = "level17.js";
if(Level == 18) levelFile = "level18.js";
if(Level == 19) levelFile = "level19.js";
if(Level == 20) levelFile = "level20.js";

BABYLON.SceneLoader.ImportMesh("", "images/3d/", "fons.js", scene, function (newMeshes) {	
BABYLON.SceneLoader.ImportMesh("", "images/3d/", levelFile, scene, function (newMeshes) {

	for (var i = 0; i < scene.meshes.length; i++) {
		
		if(scene.meshes[i].name == "car" || scene.meshes[i].name == "riepa1" || scene.meshes[i].name == "riepa2" || scene.meshes[i].name == "riepa3" || scene.meshes[i].name == "riepa4" || scene.meshes[i].name == "riepa5" || scene.meshes[i].name == "riepa6"
		|| scene.meshes[i].name == "brake" || scene.meshes[i].name == "carcollider" || scene.meshes[i].name == "target") {
		scene.meshes[i].receiveShadows = false;	
		} else {
		if(scene.meshes[i].checkCollisions) {
			colliders.push(scene.meshes[i]);
			scene.meshes[i].setEnabled(false);
		}
        scene.meshes[i].freezeWorldMatrix();
		scene.meshes[i].doNotSyncBoundingInfo = true;
		
		if(scene.meshes[i].name != "mezi" && scene.meshes[i].name != "zogs1" && scene.meshes[i].name != "parking") {
		shadowGenerator.getShadowMap().renderList.push(scene.meshes[i]);
		}
		
		}

	

	if(scene.meshes[i].name == "angar" || scene.meshes[i].name == "angar2" || scene.meshes[i].name == "riepas1" || scene.meshes[i].name == "riepas2" || scene.meshes[i].name == "riepas3" || scene.meshes[i].name == "riepas4" || scene.meshes[i].name == "riepas5"
	 || scene.meshes[i].name == "shadow" || scene.meshes[i].name == "zogs" || scene.meshes[i].name == "mezi" || scene.meshes[i].name == "koks1" || scene.meshes[i].name == "koks2" || scene.meshes[i].name == "koks3" || scene.meshes[i].name == "koks4"
	  || scene.meshes[i].name == "koks5" || scene.meshes[i].name == "lampa1" || scene.meshes[i].name == "lampa2" || scene.meshes[i].name == "lampa3" || scene.meshes[i].name == "lampa4" || scene.meshes[i].name == "lampa5" || scene.meshes[i].name == "lampa6"
	  ) {
		scene.meshes[i].receiveShadows = false;		
	}
    }
	
	scene.blockMaterialDirtyMechanism = true;
	scene.clearColor = new BABYLON.Color3(108 / 255, 153 / 255, 209 / 255);
			

	//scene.debugLayer.show();
	
	var cPosition = scene.getMeshesByTags("carPoint")[0];
	cPosition.setParent(null);
	cPosition.setEnabled(false);
	var euler = cPosition.rotationQuaternion.toEulerAngles();	
	car = scene.getMeshesByTags("car")[0];		
	car.rotation= new BABYLON.Vector3(euler.x, euler.y, euler.z);
	car.position= new BABYLON.Vector3(cPosition._absolutePosition.x, cPosition._absolutePosition.y, cPosition._absolutePosition.z);
	
	carTarget = scene.getMeshesByTags("cTarget")[0];
	carTarget.rotation= new BABYLON.Vector3(euler.x, euler.y, euler.z);
	carTarget.visibility = 0;
	
	brakeLight = scene.getMeshesByTags("brake")[0];
	brakeLight.visibility = 0;
	
		
	
	tireFL = scene.getMeshesByTags("tireFL")[0];
	tireFL.rotation= new BABYLON.Vector3(0, 0, 0);// rotacijai jabut 0 lai pareizi griestos, ja riteni nav riktigi jarote modelim pivots
	
	tireFR = scene.getMeshesByTags("tireFR")[0];
	tireFR.rotation= new BABYLON.Vector3(0, 0, 3.14);
	
	tireRL = scene.getMeshesByTags("tireRL")[0];
	tireRL.rotation= new BABYLON.Vector3(0, 0, 0);
	
	tireRR = scene.getMeshesByTags("tireRR")[0];
	tireRR.rotation= new BABYLON.Vector3(0,0, 3.14);
	
	tireRRL = scene.getMeshesByTags("tireRRL")[0];
	tireRRL.rotation= new BABYLON.Vector3(0, 0, 0);
	
	tireRRR = scene.getMeshesByTags("tireRRR")[0];
	tireRRR.rotation= new BABYLON.Vector3(0,0, 3.14);
	
	pointFL = scene.getMeshesByTags("pointFL")[0];
	pointFR = scene.getMeshesByTags("pointFR")[0];
	pointRL = scene.getMeshesByTags("pointRL")[0];
	pointRR = scene.getMeshesByTags("pointRR")[0];
	
	pointFL.setEnabled(false);
	pointFR.setEnabled(false);
	pointRL.setEnabled(false);
	pointRR.setEnabled(false);	
	
	carCollider = scene.getMeshesByTags("carCollider")[0];
	carCollider.visibility = 0;
	
	startPosition = scene.getMeshesByTags("startposition");
	startPosition[0].setEnabled(false);
	startPosition[0].isPickable = false;
	
	
    camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
	camera.setPosition(new BABYLON.Vector3(startPosition[0]._absolutePosition.x, startPosition[0]._absolutePosition.y + 5, startPosition[0]._absolutePosition.z));
	camera.attachControl(canvas3d, true);
	camera.inputs.remove(camera.inputs.attached.keyboard);
	camera.target = carTarget;
	camera.upperBetaLimit = 1.13;
	camera.lowerRadiusLimit = 22;
	camera.upperRadiusLimit = 43.2;
	if (!mobile) {
	camera.angularSensibilityX = 1400;
	camera.angularSensibilityY = 1400;
	}
	let pointers = camera.inputs.attached["pointers"];
    if (pointers) pointers.buttons = [0,1]; // laba peles poga izslegta
	camera.inertia = 0.8;
	
	camera2 = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(startPosition[0]._absolutePosition.x, startPosition[0]._absolutePosition.y + 5, startPosition[0]._absolutePosition.z), scene);
	camera2.radius = 20;
	camera2.lowerRotationOffsetLimit = 10;
	camera2.heightOffset = 12;
	camera2.rotationOffset = 180;
	camera2.cameraAcceleration = 0.012;//0.015
	camera2.maxCameraSpeed = 5;
	camera2.lockedTarget = carTarget;

	scene.activeCamera = camera2;

    });
	 });
        
scene.registerBeforeRender(function () {

});
			
scene.executeWhenReady(function () {			
	
	createGUI();
	fade.gotoAndPlay(1);

	requestAnimationFrame(update);
	
});


    scene.onPointerObservable.add((pointerInfo) => {
		switch (pointerInfo.type) {
			case BABYLON.PointerEventTypes.POINTERDOWN:
				pDown = true;
				break;
			case BABYLON.PointerEventTypes.POINTERUP:
				pDown = false;
				break;
			case BABYLON.PointerEventTypes.POINTERMOVE:
				if (pDown && cType != 3) {
					cType = 3;
					camera.setPosition(new BABYLON.Vector3(camera2.position.x, camera2.position.y, camera2.position.z));
					scene.activeCamera = camera;
				}
				break;
        }
    });
		        
    return scene;
}
        
engine = new BABYLON.Engine(canvas3d, true,null,true); //pedejais true savadak uz telefona miglains 3d

scene = createScene();
//GUIfade();

engine.runRenderLoop(function () {
    if (scene && camera) {
	
		if(!pause && isDriving) scene.render();
				
		//var fpsLabel = document.getElementById("fpsLabel");
		//fpsLabel.innerHTML = engine.getFps().toFixed() + " fps";
    }
});

window.addEventListener("resize", function () {
	//canvas3d.style.height = '100vh';
    engine.resize();
});
		
canvas3d.focus();
firstPlay = false;
//	
}



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
function update(timestamp) {
if (!failed && !finished && isDriving) requestAnimationFrame(update);	

rollingAverage.add(scene.getAnimationRatio());

if(!pause) {
drive(rollingAverage.average);
showTime(rollingAverage.average);
}

}
// ----------------------------------------------------------------------------
function drive(frameTime) {
	
	camera2.cameraAcceleration = 0.012 * frameTime;
	camera2.maxCameraSpeed = 5 * frameTime;
	
	if(cType == 2) {
	camera2.radius = 18;
	if(speed <0) camera2.radius = 18 + (30 * speed);
	if(speed >0) camera2.radius = 18 + (33 * speed);
	} else {
	
	camera2.radius = 20;
	if(speed <0) camera2.radius = 20 + (-40 * speed);
	if(speed >0) camera2.radius = 20 + (-25 * speed);
	
	}

	var engineLoudness = Math.abs(speed) * 4;	
	if (engineLoudness > 1) engineLoudness = 1;
	engineSound.volume = engineLoudness;
	idleSound.volume = 1 - engineLoudness;
	
	wRotationSpeed = 0.03 * frameTime;
	acceleration = 0.003 * frameTime;
	
	if(brakedelay > 0) {
		brakedelay -= frameTime;
		brakeLight.visibility = 1;
	} else {
		brakeLight.visibility = 0;
	}
	
	
	if (left) {		
		if(tireFL.rotation.y > -1 * maxWRotation) tireFL.rotation.y -= wRotationSpeed;	
		turnSpeed = 0.1;
		
	} else if (right) {
		if(tireFL.rotation.y < maxWRotation) tireFL.rotation.y += wRotationSpeed;
		turnSpeed = 0.1;
	} else {
		turnSpeed = 0;
	}
	
	if(speed > maxSpeed - turnSpeed) speed -= acceleration;
	if(speed < minSpeed + turnSpeed) speed += acceleration;
	
	if(up) {
    if (speed < (maxSpeed - turnSpeed)  && brakedelay < 1) speed += acceleration;
	if(speed < 0) {
		speed += 3* acceleration;
		if(speed > 0) speed = 0;
		brakedelay = 25;
		}
	
	} else if(down) {
    if (speed > (minSpeed - turnSpeed)  && brakedelay < 1) speed -= acceleration;
	if(speed > 0) {
		speed -= 3 * acceleration;
		if(speed < 0) speed = 0;
		brakedelay = 25;
		}
	}
	
	
	if (!up && !down) {	
		if(speed < acceleration && speed > -1 * acceleration) speed = 0;
	if (speed > 0) {
		speed -= acceleration;
	} else if (speed < 0) {
		speed += acceleration;
	 }
	}
	
	if(!left && !right) {
		if(tireFL.rotation.y < wRotationSpeed && tireFL.rotation.y > -1 * wRotationSpeed) tireFL.rotation.y = 0;
		
		if(tireFL.rotation.y > 0) {
			tireFL.rotation.y -= wRotationSpeed;
		} else if (tireFL.rotation.y < 0) {
			tireFL.rotation.y += wRotationSpeed;
		}		
	}
	

	car.position.x += (speed * frameTime)*parseFloat(Math.sin(car.rotation.y));
	car.position.z += (speed * frameTime)*parseFloat(Math.cos(car.rotation.y));

	tireFL.rotation.x += 0.45 * speed * frameTime;//0.55
	tireFR.rotation.x = tireRR.rotation.x = tireRL.rotation.x = tireRRR.rotation.x = tireRRL.rotation.x = tireFL.rotation.x
	tireFR.rotation.y = tireFL.rotation.y;
	
	car.rotation.y += (tireFL.rotation.y * 0.13) * speed * frameTime;//*0.18
	carTarget.rotation.y = car.rotation.y;

	colliders.forEach(checkCollision);

	if(kadrs == 1) checkParking();

}

// ----------------------------------------------------------------------------
function checkCollision(collider) {
  
  if(collider.isInFrustum(scene._frustumPlanes)) { // ja collider ir kameras redzamibaa
  	 
  if (carCollider.intersectsMesh(collider, true)) {
	if(!failed) levelFailed();
	}

  }
} 

function checkParking() {

	if(pointFL.intersectsPoint(tireFL.getAbsolutePosition())){
		if(pointFR.intersectsPoint(tireFR.getAbsolutePosition())){
			if(pointRL.intersectsPoint(tireRRL.getAbsolutePosition())){
				if(pointRR.intersectsPoint(tireRRR.getAbsolutePosition())){
				finished = true;
				levelComplete();
				}
			}
		}
	}

}
// -----------------------------------------------------------------------------
function levelFailed() {
	failed = true;
	isDriving = false;
	createjs.Sound.play("bum");
	advancedTexture.dispose();
	exportRoot.gmenu.visible = false;
	tryAgainScreen = new lib.tryagain();
	exportRoot.addChild(tryAgainScreen);
	
if (idleSound) idleSound.stop();
if (engineSound) engineSound.stop();
	canvas.style.pointerEvents = "auto";
	
}
// -----------------------------------------------------------------------------
function timeOver() {
	failed = true;
	isDriving = false;
	exportRoot.gmenu.visible = false;
	tryAgainScreen = new lib.timeover();
	exportRoot.addChild(tryAgainScreen);
	
if (idleSound) idleSound.stop();
if (engineSound) engineSound.stop();
	canvas.style.pointerEvents = "auto";
	advancedTexture.dispose();
}
// ------------------------------------------------------------------------------
function levelComplete() {
	
	isDriving = false;
	var betterscore = false;
	unlockedAchievement = -1;
	
	
	if (idleSound) idleSound.stop();
if (engineSound) engineSound.stop();
	
	createjs.Sound.play("bi");
	
	
	levelScore = Math.floor((Level * 50) + (gameTime / 14));
	
	if (levelScore > levelScores[Level - 1]) {		
		levelScores[Level - 1] = levelScore;
		betterscore = true;
	}
	
		totalScore = 0;
	for (i = 0; i < levelScores.length; i++) {
    totalScore += levelScores[i];
	}
	
	levelStars = 0;
	if(levelScore > 100) levelStars = 1;
	if(levelScore >= targetScores[Level-1] - (targetScores[Level-1] / 15)) levelStars = 2;
	if(levelScore >= targetScores[Level-1]) levelStars = 3;
	
	
	if(betterscore) writeMemory();
	
	finished = true;
	exportRoot.gmenu.visible = false;
	if(Level == 20) {
	tryAgainScreen = new lib.levelcompletefinal();
	} else {
		tryAgainScreen = new lib.levelcomplete();
	}
	exportRoot.addChild(tryAgainScreen);
	canvas.style.pointerEvents = "auto";
	advancedTexture.dispose();
}
// ------------------------------------------------------------------------------
function showTime(frameTime) {
	gameTime -= frameTime;
	if(gameTime < 0) gameTime = 0;
	updateclock ++;
	if(updateclock >= 10) {
		updateclock = 0;
		
		var seconds = Math.floor(gameTime/60);
		var minutes = Math.floor(seconds/60);
		seconds -= minutes*60;
		exportRoot.gmenu.tWindow.timetext.text = minutes+" : "+String(seconds+100).substr(1,2);
		if(gameTime <= 0) timeOver();
	}
	kadrs ++;
	if (kadrs == 3) kadrs = 1;
	
}
// ------------------------------------------------------------------------------
function resetgame() {

if(mobile) {

} else {
	document.removeEventListener('keydown', keyIsDown);
	document.removeEventListener('keyup', keyIsUp);
}
	isDriving = false;
	scene.dispose();
	
	engine.dispose();
	advancedTexture.dispose();
	
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
	
	for (i = 0; i < levelScores.length; i++) {
		if(localStorage.getItem('levelscoret' + i) == null) localStorage.setItem('levelscoret' + i, 0);
    levelScores[i] = parseInt(localStorage.getItem('levelscoret' + i));
	}
	updateAchievements();
}
// ------------------------------------------------------------------------------
function writeMemory() {
		for (i = 0; i < levelScores.length; i++) {
    localStorage.setItem('levelscoret' + i, levelScores[i]);
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
	if(levelsfinished >= 5) {
		if(achievement[1] == 0) unlockedAchievement = 1;
		achievement[1] = 1;
	}
	if(levelsfinished >= 10) {
		if(achievement[2] == 0) unlockedAchievement = 2;
		achievement[2] = 1;
	}
	if(levelsfinished >= 15) {
		if(achievement[3] == 0) unlockedAchievement = 3;
		achievement[3] = 1;
	}
	if(levelsfinished >= 20) {
		if(achievement[4] == 0) unlockedAchievement = 4;
		achievement[4] = 1;
	}
	if(threestars >= 1) {
		if(achievement[5] == 0) unlockedAchievement = 5;
		achievement[5] = 1;
	}
	if(threestars >= 10) {
		if(achievement[6] == 0) unlockedAchievement = 6;
		achievement[6] = 1;
	}
	if(threestars >= 20) {
		if(achievement[7] == 0) unlockedAchievement = 7;
		achievement[7] = 1;
	}
	if(totalScore >= 1000) {
		if(achievement[8] == 0) unlockedAchievement = 8;
		achievement[8] = 1;
	}
	if(totalScore >= 5000) {
		if(achievement[9] == 0) unlockedAchievement = 9;
		achievement[9] = 1;
	}
	if(totalScore >= 10000) {
		if(achievement[10] == 0) unlockedAchievement = 10;
		achievement[10] = 1;
	}
	if(totalScore >= 20000) {
		if(achievement[11] == 0) unlockedAchievement = 11;
		achievement[11] = 1;
	}
	
}


$(window).focus(function() { 
    // Unpause when window gains focus 
    if(skana) createjs.Sound.muted = false;
	setTimeout(function(){ if(rollingAverage) rollingAverage.reset();}, 6);
}).blur(function() { 
    // Pause when window loses focus 
    createjs.Sound.muted = true; 
}); 

function handleVisibilityChange() {
  if (document.visibilityState === "hidden") {
    createjs.Sound.muted = true;

  } else  {
    if(skana) createjs.Sound.muted = false;

  }
}
document.addEventListener("visibilitychange", handleVisibilityChange, false);