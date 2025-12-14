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
spacebar = false;
mobile = false;
var again = false;
var gameTime = 11800;
var updateclock = 0;
var tryAgainScreen;
var driveSrc;
var levelScore = 0;
var levelStars = 0;
var totalScore = 0;
var levelScores = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var targetScores = [500,550,590,800,850,900,1000,1050,1100,1170,1200,1300,1280,1450,1350,1500,1510,1510,1700,1605];//20
var achievement = [0,0,0,0,0,0,0,0,0,0,0,0];
var unlockedAchievement = -1;
var backgroundSound;
var idleSound;
var engineSound;
var craneSound;
if(createjs.Touch.isSupported()) mobile = true;

var world;
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2World = Box2D.Dynamics.b2World;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var debugDraw;
var bb = Box2D.Dynamics.b2Body;
var cart = Box2D.Dynamics.b2Body;
var axle1 = Box2D.Dynamics.b2Body;
var axle2 = Box2D.Dynamics.b2Body;
var motor1 = Box2D.Dynamics.b2RevoluteJoint;
var motor2  = Box2D.Dynamics.b2RevoluteJoint;
var spring1 = Box2D.Dynamics.b2PrismaticJoint;
var spring2 = Box2D.Dynamics.b2PrismaticJoint;
var debugPhysics = false;
var renderingContext;
var fons;
var box_original_size = 10;
var RATIO = 30;
var SCREEN_WIDTH = 640;
var truckHealthFull;
var truckHealth;
var engineSpeed = 0;
var boxObjects;
var truckUpgrade = [0,0,0]; // motors,riepas,kaste
var enginePower = 0;
var kkaste;
var cargoArray;

var hSliede = Box2D.Dynamics.b2PrismaticJoint;
var vSliede = Box2D.Dynamics.b2PrismaticJoint;
var magnets = Box2D.Dynamics.b2Body;
var magnetsP = Box2D.Dynamics.b2Body;
var hinge1 = Box2D.Dynamics.b2RevoluteJoint;
var hinge2 = Box2D.Dynamics.b2RevoluteJoint;
var cargoJoint = Box2D.Dynamics.b2RevoluteJoint;
var vPunkts;
var hPunkts;

var loading = false;
var uzkrauts = false;

var cargo = 0;
var totalCargo = 0;

var cargoNr = 0;
var totalCargoNr = 0;

var line;
var truckFix = Box2D.Dynamics.b2Body;
var fPoint = 0;
var minKrava = 0.7;
var fonsCargo;

var nauda = 0;
var levelMoney = 0;
var restoreGame = false;

var upgradePrice1 = [800,900,1000,1200,1500];
var upgradePrice2 = [700,800,900,1000,1200];
var upgradePrice3 = [1200,1500,2000];
var infoLogs = 0;
var returnFromMenu = false;
var lang = 1; // ru / eng

// --------------------------------

function updateButtons() {

exportRoot.gmenu.buttons.lButtons.x = 0 -(stage.x / stage.scaleX);
exportRoot.gmenu.buttons.lButtons.y = 275 + (stage.y / stage.scaleY);
exportRoot.gmenu.buttons.rButtons.x = 640 +(stage.x / stage.scaleX);
exportRoot.gmenu.buttons.rButtons.y = 156 + (stage.y / stage.scaleY);

exportRoot.gmenu.buttons.mButton.x = 540 +(stage.x / stage.scaleX);
exportRoot.gmenu.buttons.mButton.y = 265 + (stage.y / stage.scaleY);
	
exportRoot.gmenu.hWindow.x = 2 - (stage.x / stage.scaleX);
exportRoot.gmenu.hWindow.y = 2 - (stage.y / stage.scaleY);

exportRoot.pButton.poga.x = 592 + (stage.x / stage.scaleX);
exportRoot.pButton.poga.y = 37 - (stage.y / stage.scaleY);

exportRoot.scoreT.x = 480 + (stage.x / stage.scaleX);
exportRoot.scoreT.y = 0 - (stage.y / stage.scaleY);

exportRoot.titleT.x = 3 - (stage.x / stage.scaleX);
exportRoot.titleT.y = 5 - (stage.y / stage.scaleY);

exportRoot.menuB.x = 0 - (stage.x / stage.scaleX);
exportRoot.menuB.y = 193 + (stage.y / stage.scaleY);

exportRoot.ievads.y = 360 + (stage.y / stage.scaleY);

}

function changeLanguage() {

exportRoot.menuB.playButton.gotoAndStop(lang);
exportRoot.menuB.selectButton.gotoAndStop(lang);
exportRoot.menuB.garageButton.gotoAndStop(lang);
exportRoot.menuB.achButton.gotoAndStop(lang);
exportRoot.ievads.gotoAndStop(lang);
exportRoot.titleT.gotoAndStop(lang);

//exportRoot.pButton.title.gotoAndStop(lang);

}

function switchButtons(kadrs) {
	exportRoot.gmenu.buttons.lButtons.right.gotoAndStop(kadrs);	
	exportRoot.gmenu.buttons.lButtons.left.gotoAndStop(kadrs);	
	
	exportRoot.gmenu.buttons.rButtons.brake.gotoAndStop(kadrs);
	exportRoot.gmenu.buttons.rButtons.accelerate.gotoAndStop(kadrs);
	
	if (kadrs == 0) exportRoot.gmenu.buttons.mButton.visible = false;
	
}

function infoScreen() {
	
	if(infoLogs == 0) {
		infoLogs = 1;
		var iLogs = new lib.info1();
		exportRoot.addChild(iLogs);
	} else if(infoLogs == 1) {
		infoLogs = 2;
		var iLogs = new lib.info2();
		exportRoot.addChild(iLogs);
	}
}


// ------------------------------------------------------------------------------------
function startGame() {

//setTimeout(function() {switchButtons("1");}, 5);

updateButtons();	
exportRoot.pButton.poga.gotoAndStop(1);	

if (backgroundSound) backgroundSound.stop();
if (idleSound) idleSound.stop();
if (engineSound) engineSound.stop();
if (craneSound) craneSound.stop();
	setTimeout(stopit,100);
	function stopit(){	

switchButtons(1);
backgroundSound = createjs.Sound.play("fonamuzons",{interrupt: createjs.Sound.INTERRUPT_EARLY, loop:-1});
idleSound = createjs.Sound.play("idle",{interrupt: createjs.Sound.INTERRUPT_EARLY, loop:-1});
engineSound = createjs.Sound.play("engine",{interrupt: createjs.Sound.INTERRUPT_EARLY, loop:-1});	
craneSound = createjs.Sound.play("crane",{interrupt: createjs.Sound.INTERRUPT_EARLY, loop:-1});
	
engineSound.volume = 0;
idleSound.volume = 0;
craneSound.volume = 0;
backgroundSound.volume = 0.5;		
}

pause = true;
loading = true;
uzkrauts = false;

var fade = new lib.fadeout();
exportRoot.addChild(fade);

gameTime = 11800;
levelScore =  0;
truckHealthFull = 10;
truckHealth = 10;
engineSpeed = 0;
totalCargo = 0;
totalCargoNr = 0;
exportRoot.gmenu.hWindow.healthline.scaleX = 0 / 10;

if(lang == 0) {
exportRoot.gmenu.hWindow.leveltxt.text = "Уровень: "+ Level;
} else {
exportRoot.gmenu.hWindow.leveltxt.text = "Level: "+ Level;	
}
failed = false;
finished = false;
isDriving = true;
up = false;
down = false;
right = false;
left = false;
spacebar = false;

setupWorld();
//createTruck();
setTimeout(createTruck,65);
celamkrans();
//setTimeout(celamkrans,10);
setTimeout(topObjects,70);

var listener = new Box2D.Dynamics.b2ContactListener;

listener.BeginContact = function (contact) {

if(!loading) {
// masina brauc	
if(contact.GetFixtureA().m_isSensor || contact.GetFixtureB().m_isSensor) {
	if(contact.GetFixtureA().GetBody().GetUserData() != null && contact.GetFixtureB().GetBody().GetUserData() != null) {
	if((contact.GetFixtureA().GetBody().GetUserData().name == "Truck" && contact.GetFixtureB().GetBody().GetUserData().name == "Finish") || (contact.GetFixtureB().GetBody().GetUserData().name == "Truck" && contact.GetFixtureA().GetBody().GetUserData().name == "Finish")) {
if(!finished && !failed) {
	finished = true;
	levelComplete();
}
	} 	
}
} else {
	if(!finished) {
	if(contact.GetFixtureA().m_userData == "truckSensor" || contact.GetFixtureB().m_userData == "truckSensor") {
	
	   var worldManifold = new Box2D.Collision.b2WorldManifold;
       contact.GetWorldManifold(worldManifold);
	   var bumX = worldManifold.m_points[0].x * RATIO;
	   var bumY = worldManifold.m_points[0].y * RATIO;
	   var dumi = new lib.dums2();
	   dumi.x = bumX;
	   dumi.y = bumY;
	   if (truckHealth > 0) { fons.addChild(dumi);
	//createjs.Sound.play("bum2");
	   }
	}

	}
}

} else {
// kraujam kravu
if(contact.GetFixtureA().m_userData == "mSensor" || contact.GetFixtureB().m_userData == "mSensor") {
if(contact.GetFixtureA().m_userData == "mSensor") contact.GetFixtureB().GetBody().iekraut = "ja";
if(contact.GetFixtureB().m_userData == "mSensor") contact.GetFixtureA().GetBody().iekraut = "ja";	
		}
		
		
		
	}

// krava ir kravaskastee
if(contact.GetFixtureA().m_userData == "cargoSensor" || contact.GetFixtureB().m_userData == "cargoSensor") {
if(contact.GetFixtureA().m_userData == "cargoSensor") contact.GetFixtureB().GetBody().krava = "ja";
if(contact.GetFixtureB().m_userData == "cargoSensor") contact.GetFixtureA().GetBody().krava = "ja";	
showCargoLevel();
		}
	
}

listener.EndContact = function (contact) {
if(loading) {
if(contact.GetFixtureA().m_userData == "mSensor" || contact.GetFixtureB().m_userData == "mSensor") {
if(contact.GetFixtureA().m_userData == "mSensor") contact.GetFixtureB().GetBody().iekraut = "ne";
if(contact.GetFixtureB().m_userData == "mSensor") contact.GetFixtureA().GetBody().iekraut = "ne";	
		}
		
	}

if(contact.GetFixtureA().m_userData == "cargoSensor" || contact.GetFixtureB().m_userData == "cargoSensor") {
if(contact.GetFixtureA().m_userData == "cargoSensor") contact.GetFixtureB().GetBody().krava = "ne";
if(contact.GetFixtureB().m_userData == "cargoSensor") contact.GetFixtureA().GetBody().krava = "ne";	
showCargoLevel();
		}	
}

listener.PostSolve = function(contact, impulse) {
}

listener.PreSolve = function(contact, oldManifold) {
}

world.SetContactListener(listener);
		
if(mobile) {
			
createjs.Touch.enable(stage, false, false);
exportRoot.gmenu.buttons.visible = true;
exportRoot.gmenu.buttons.mButton.visible = true;
exportRoot.gmenu.buttons.lButtons.left.addEventListener( 'mousedown', leftDown);
exportRoot.gmenu.buttons.lButtons.left.addEventListener( 'pressup', leftUp);
exportRoot.gmenu.buttons.lButtons.right.addEventListener( 'mousedown', rightDown);
exportRoot.gmenu.buttons.lButtons.right.addEventListener( 'pressup', rightUp);
exportRoot.gmenu.buttons.rButtons.accelerate.addEventListener( 'mousedown', accDown);
exportRoot.gmenu.buttons.rButtons.accelerate.addEventListener( 'pressup', accUp);
exportRoot.gmenu.buttons.rButtons.brake.addEventListener( 'mousedown', brakeDown);
exportRoot.gmenu.buttons.rButtons.brake.addEventListener( 'pressup', brakeUp);
exportRoot.gmenu.buttons.mButton.addEventListener( 'mousedown', magnetDown);
exportRoot.gmenu.buttons.mButton.addEventListener( 'pressup', magnetUp);

} else {
	
exportRoot.gmenu.buttons.visible = false;	 
document.addEventListener('keydown', keyIsDown);
document.addEventListener('keyup', keyIsUp);
}

createjs.Ticker.addEventListener("tick", handleTick);
var canvasLayer = document.getElementById("canvas");
canvasLayer.focus();
}

// ----------------------------------------------------------------------------
function setupWorld() {
	
		 world = new b2World(new b2Vec2(0, 10),true);	
		 cargoArray = [];
		
		if(Level == 1) {
			fons = new lib.fons1();
		} else if(Level == 2) {
			fons = new lib.fons2();
		} else if(Level == 3) {
			fons = new lib.fons3();
		} else if(Level == 4) {
			fons = new lib.fons4();
		} else if(Level == 5) {
			fons = new lib.fons5();
		} else if(Level == 6) {
			fons = new lib.fons6();
		} else if(Level == 7) {
			fons = new lib.fons7();
		} else if(Level == 8) {
			fons = new lib.fons8();
		} else if(Level == 9) {
			fons = new lib.fons9();
		} else if(Level == 10) {
			fons = new lib.fons10();
		} else if(Level == 11) {
			fons = new lib.fons11();
		} else if(Level == 12) {
			fons = new lib.fons12();
		} else if(Level == 13) {
			fons = new lib.fons13();
		} else if(Level == 14) {
			fons = new lib.fons14();
		} else if(Level == 15) {
			fons = new lib.fons15();
		} else if(Level == 16) {
			fons = new lib.fons16();
		} else if(Level == 17) {
			fons = new lib.fons17();
		} else if(Level == 18) {
			fons = new lib.fons18();
		} else if(Level == 19) {
			fons = new lib.fons19();
		} else if(Level == 20) {
			fons = new lib.fons20();
		}
		exportRoot.screen.addChild(fons);	
		exportRoot.screen.sky.x = fons.x * 0.85;
		
		 if(debugPhysics) {
			 debugDraw = new b2DebugDraw();
			 renderingContext = document.getElementById("debugcanvas").getContext("2d");
			 debugDraw.SetSprite(renderingContext);
			 debugDraw.SetDrawScale(30.0);
			 debugDraw.SetFillAlpha(0.0);
			 debugDraw.SetLineThickness(0.0);
			 debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			 world.SetDebugDraw(debugDraw);
		 }
		
		setTimeout(readNextFrame,60);
		
		function readNextFrame() {
			
			fonsCargo = new createjs.Container();
			fons.addChild(fonsCargo);
		
			for (i=0;i<fons.numChildren;i++) {
				with (fons.getChildAt(i)) {
					
					if (name == "b") {
						draw_box(x, y, box_original_size * scaleX, box_original_size * scaleY, rotation * 0.0174532925);
						visible = false;
						}
					else if (name == "c") {
						draw_circle(x, y, box_original_size * scaleX);
						visible = false;
						}
					else if (name == "muca") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height, realRotation * 0.0174532925,new lib.mucas1());						
						visible = false;
						}
						else if (name == "muca2") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height, realRotation * 0.0174532925,new lib.mucas2());						
						visible = false;
						} else if (name == "muca3") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height, realRotation * 0.0174532925,new lib.mucas3());						
						visible = false;
						} else if (name == "muca4") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height, realRotation * 0.0174532925,new lib.mucas4());						
						visible = false;
						} else if (name == "muca5") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height, realRotation * 0.0174532925,new lib.mucas5());						
						visible = false;
						}
						else if (name == "Riepa") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height, realRotation * 0.0174532925,new lib.Riepa());						
						visible = false;
						} else if (name == "padons1") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height, realRotation * 0.0174532925,new lib.padons1());						
						visible = false;
						} else if (name == "kubs1") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height, realRotation * 0.0174532925,new lib.kubs1());						
						visible = false;
						} else if (name == "kaste0") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height, realRotation * 0.0174532925,new lib.kastes0());						
						visible = false;
						} else if (name == "kaste1") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height, realRotation * 0.0174532925,new lib.kastes1());						
						visible = false;
						} else if (name == "kaste2") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height, realRotation * 0.0174532925,new lib.kastes2());						
						visible = false;
						} else if (name == "kaste3") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height, realRotation * 0.0174532925,new lib.kastes3());						
						visible = false;
						} else if (name == "kaste4") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height, realRotation * 0.0174532925,new lib.kastes4());						
						visible = false;
						} else if (name == "kaste5") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height, realRotation * 0.0174532925,new lib.kastes5());						
						visible = false;
						} else if (name == "kaste6") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height, realRotation * 0.0174532925,new lib.kastes6());						
						visible = false;
						} else if (name == "kaste7") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height, realRotation * 0.0174532925,new lib.kastes7());						
						visible = false;
						} else if (name == "kaste8") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height, realRotation * 0.0174532925,new lib.kastes8());						
						visible = false;
						} else if (name == "kaste9") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height + 1, realRotation * 0.0174532925,new lib.kastes9());						
						visible = false;
						} else if (name == "kaste10") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height + 1, realRotation * 0.0174532925,new lib.kastes10());						
						visible = false;
						} else if (name == "kaste11") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height + 1, realRotation * 0.0174532925,new lib.kastes11());						
						visible = false;
						}
					else if (name == "Finish") {
						draw_finish(x, y, box_original_size * scaleX, box_original_size * scaleY, rotation * 0.0174532925, new lib.finish);
						visible = false;
						}
					}
				}
				
				boxObjects = [];
				for (bb = world.m_bodyList; bb; bb = bb.m_next) {
				if (bb.m_userData != null) {
					boxObjects.push(bb);					
				}
		 }
		 
		 showCargoLevel();
		 
		 update();
		}
}
// ----------------------------------------------------------------------------
function topObjects() {
	
	var fonstop;
	
	if(Level == 1) {
			fonstop = new lib.fons1top();
		} else if(Level == 2) {
			fonstop = new lib.fons2top();
		} else if(Level == 3) {
			fonstop = new lib.fons3top();
		} else if(Level == 4) {
			fonstop = new lib.fons4top();
		} else if(Level == 5) {
			fonstop = new lib.fons5top();
		} else if(Level == 6) {
			fonstop = new lib.fons6top();
		} else if(Level == 7) {
			fonstop = new lib.fons7top();
		} else if(Level == 8) {
			fonstop = new lib.fons8top();
		} else if(Level == 9) {
			fonstop = new lib.fons9top();
		} else if(Level == 10) {
			fonstop = new lib.fons10top();
		} else if(Level == 11) {
			fonstop = new lib.fons11top();
		} else if(Level == 12) {
			fonstop = new lib.fons12top();
		} else if(Level == 13) {
			fonstop = new lib.fons13top();
		} else if(Level == 14) {
			fonstop = new lib.fons14top();
		} else if(Level == 15) {
			fonstop = new lib.fons15top();
		} else if(Level == 16) {
			fonstop = new lib.fons16top();
		} else if(Level == 17) {
			fonstop = new lib.fons17top();
		} else if(Level == 18) {
			fonstop = new lib.fons18top();
		} else if(Level == 19) {
			fonstop = new lib.fons19top();
		} else if(Level == 20) {
			fonstop = new lib.fons20top();
		}
		fons.addChild(fonstop);
}
// ----------------------------------------------------------------------------
function draw_box(x_origin,y_origin,box_width,box_height,angle) {
		
		 var boxDef = new b2FixtureDef;
		 boxDef.friction = 1;
         boxDef.density = 0; 
		 boxDef.restitution = 0;
		 
		 var bodyDef = new b2BodyDef;
		 bodyDef.type = b2Body.b2_staticBody;		 
		 bodyDef.position.Set(x_origin / 30, y_origin / 30);
		 bodyDef.angle =  angle;
		
		 boxDef.shape = new b2PolygonShape;
         boxDef.shape.SetAsBox(box_width / 2 / 30, box_height / 2 / 30);
		 world.CreateBody(bodyDef).CreateFixture(boxDef);
		 
		}
		
function draw_finish(x_origin,y_origin,box_width,box_height,angle,muviks) {
		
		 var boxDef = new b2FixtureDef;
		 boxDef.friction = 1;
         boxDef.density = 0; 
		 boxDef.restitution = 0;
		 
		 var bodyDef = new b2BodyDef;
		 bodyDef.type = b2Body.b2_staticBody;		 
		 bodyDef.position.Set(x_origin / 30, y_origin / 30);
		 bodyDef.angle =  angle;
		 bodyDef.userData = muviks;
		 bodyDef.userData.y = -200;
		 bodyDef.userData.visible = false;
		 fons.addChild(bodyDef.userData);
		 
		 boxDef.shape = new b2PolygonShape;
         boxDef.shape.SetAsBox(box_width / 2 / 30, box_height / 2 / 30);
		 boxDef.isSensor = true;
		 world.CreateBody(bodyDef).CreateFixture(boxDef);
		 
		 fPoint = -1 * (x_origin - 500);
		}
		
function draw_circle(x_origin,y_origin,box_width) {
			
		 var boxDef = new b2FixtureDef;
		 boxDef.friction = 1;
         boxDef.density = 0; 
		 boxDef.restitution = 0;		 
		 var bodyDef = new b2BodyDef;
		 bodyDef.type = b2Body.b2_staticBody;		 
		 bodyDef.position.Set(x_origin / 30, y_origin / 30);		 
		 boxDef.shape = new b2CircleShape(box_width / 2 / 30);
		 world.CreateBody(bodyDef).CreateFixture(boxDef);			
		}
		
function draw_custom_box(x_origin,y_origin,box_width,box_height,angle,muviks) {
		
		 var boxDef = new b2FixtureDef;
		 boxDef.friction = 1;
         boxDef.density = 1; 
		 
		 var bodyDef = new b2BodyDef;
		 bodyDef.type = b2Body.b2_dynamicBody;		 
		 bodyDef.position.Set(x_origin / 30, y_origin / 30);
		 bodyDef.angle =  angle;
		 bodyDef.userData = muviks;
		 bodyDef.userData.y = -200;
		 fonsCargo.addChild(bodyDef.userData);
		 
		 boxDef.shape = new b2PolygonShape;
         boxDef.shape.SetAsBox((box_width / 2 - 1) / 30, (box_height / 2 - 1) / 30);
		 
		 var cBody = world.CreateBody(bodyDef);
		 cBody.CreateFixture(boxDef);
		 
		 
		 totalCargo += cBody.GetMass() * 250;
		 totalCargoNr ++;
		 cargoArray.push(cBody);
		}
		
// ----------------------------------------------------------------------------
function createTruck() {
		 var i;
		 var bodyDef
		 var boxDef;
         var circleDef;
         var revoluteJointDef;
         var prismaticJointDef;
		  
         bodyDef = new b2BodyDef();
         bodyDef.position.Set(400 / RATIO, 238 / RATIO);
		 bodyDef.angle = 2.2 * Math.PI / 180;
		 bodyDef.type = b2Body.b2_dynamicBody;		 
		 bodyDef.userData = new lib.truck();
		 kkaste = bodyDef.userData.kravaskastes;
		 setTimeout(function(){ kkaste.gotoAndStop(truckUpgrade[2]); }, 50);
		 bodyDef.userData.y = -200;
		 fons.addChild(bodyDef.userData);
		//bodyDef.userData.gotoAndStop(truckFrame);		
 cart = world.CreateBody(bodyDef);
 boxObjects.push(cart);
 //cart.SetUserData.name = "Truck";
 
         boxDef = new b2FixtureDef();
         boxDef.density = 1;
         boxDef.friction = 0.3;
         boxDef.restitution = 0.3;
         boxDef.filter.groupIndex = -1;
		boxDef.shape = new b2PolygonShape;        

var vertices = []
vertices.push(new b2Vec2(-36/RATIO, 9/RATIO));
vertices.push(new b2Vec2(98/RATIO, 9/RATIO));
vertices.push(new b2Vec2(98/RATIO, 21/RATIO));
vertices.push(new b2Vec2(-36/RATIO, 21/RATIO));
boxDef.shape.SetAsVector(vertices, 4);
cart.CreateFixture(boxDef);	

boxDef.density = 0.1;
		 
var vertices = []
vertices.push(new b2Vec2(-112/RATIO, 9/RATIO));
vertices.push(new b2Vec2(-36/RATIO, 9/RATIO));
vertices.push(new b2Vec2(-36/RATIO, 21/RATIO));
vertices.push(new b2Vec2(-96/RATIO, 19/RATIO));
boxDef.shape.SetAsVector(vertices, 4);
cart.CreateFixture(boxDef);		 		 
 
vertices = []
vertices.push(new b2Vec2(17/RATIO, -27/RATIO));
vertices.push(new b2Vec2(44/RATIO, -26/RATIO));
vertices.push(new b2Vec2(53/RATIO, -8/RATIO));
vertices.push(new b2Vec2(53/RATIO, 9/RATIO));
vertices.push(new b2Vec2(14/RATIO, 9/RATIO));
boxDef.shape.SetAsVector(vertices, 5);		 
cart.CreateFixture(boxDef);	

vertices = []
vertices.push(new b2Vec2(53/RATIO, -8/RATIO));
vertices.push(new b2Vec2(90/RATIO, -5/RATIO));
vertices.push(new b2Vec2(98/RATIO, 9/RATIO));
vertices.push(new b2Vec2(53/RATIO, 9/RATIO));
boxDef.shape.SetAsVector(vertices, 4);		 
cart.CreateFixture(boxDef);



// kravas kaste

if (truckUpgrade[2] == 0) {	
boxDef.shape.SetAsOrientedBox(0.8 / RATIO, 10 / RATIO, new b2Vec2(-112 / RATIO, -1.3 / RATIO), 0 * Math.PI / 180);	
cart.CreateFixture(boxDef);	
boxDef.shape.SetAsOrientedBox(0.8 / RATIO, 10 / RATIO, new b2Vec2(11 / RATIO, -1.3 / RATIO), 0 * Math.PI / 180);	
cart.CreateFixture(boxDef);
} else if (truckUpgrade[2] == 1) {	
boxDef.shape.SetAsOrientedBox(0.8 / RATIO, 12 / RATIO, new b2Vec2(-112 / RATIO, -3 / RATIO), 0 * Math.PI / 180);	
cart.CreateFixture(boxDef);	
boxDef.shape.SetAsOrientedBox(0.8 / RATIO, 12.7 / RATIO, new b2Vec2(11 / RATIO, -4 / RATIO), 0 * Math.PI / 180);	
cart.CreateFixture(boxDef);
} else if (truckUpgrade[2] == 2) {	
boxDef.shape.SetAsOrientedBox(0.8 / RATIO, 13.6 / RATIO, new b2Vec2(-112 / RATIO, -4.9 / RATIO), 0 * Math.PI / 180);	
cart.CreateFixture(boxDef);	
boxDef.shape.SetAsOrientedBox(0.8 / RATIO, 14.2 / RATIO, new b2Vec2(11 / RATIO, -5.1 / RATIO), 0 * Math.PI / 180);	
cart.CreateFixture(boxDef);
} else if (truckUpgrade[2] == 3) {	
boxDef.shape.SetAsOrientedBox(0.8 / RATIO, 15.8 / RATIO, new b2Vec2(-112/ RATIO, -6.9 / RATIO), 0 * Math.PI / 180);	
cart.CreateFixture(boxDef);	
boxDef.shape.SetAsOrientedBox(0.8 / RATIO, 16.9 / RATIO, new b2Vec2(11 / RATIO, -7.7 / RATIO), 0 * Math.PI / 180);	
cart.CreateFixture(boxDef);
}

 
boxDef.density = 1;

boxDef.restitution = 0.5;
 
axle1 = world.CreateBody(bodyDef); 
boxDef.shape.SetAsOrientedBox(12 / RATIO, 3 / RATIO, new b2Vec2(-56 / RATIO, 25 / RATIO), 90 * Math.PI / 180);
axle1.CreateFixture(boxDef);

         prismaticJointDef = new Box2D.Dynamics.Joints.b2PrismaticJointDef();
         prismaticJointDef.Initialize(cart, axle1, axle1.GetWorldCenter(), new b2Vec2(0, 1));
         prismaticJointDef.lowerTranslation = -0.2;
         prismaticJointDef.upperTranslation = 0.5;//0.3
         prismaticJointDef.enableLimit = true;
		 prismaticJointDef.enableMotor = true;         
		 
         spring1 = world.CreateJoint(prismaticJointDef);
		 
         axle2 = world.CreateBody(bodyDef); 
         boxDef.shape.SetAsOrientedBox(12 / RATIO, 3 / RATIO, new b2Vec2(76.2 / RATIO, 22 / RATIO), 90 * Math.PI / 180);
         axle2.CreateFixture(boxDef); 
         prismaticJointDef.Initialize(cart, axle2, axle2.GetWorldCenter(), new b2Vec2(0, 1));
         spring2 = world.CreateJoint(prismaticJointDef);

		 
		 circleDef = new b2FixtureDef();
		 circleDef.shape = new b2CircleShape(17 / RATIO);
         circleDef.density = 0.3;
         circleDef.friction = 0.2 + (truckUpgrade[1] * 0.1);//0.6
         circleDef.restitution = 0.4;
         circleDef.filter.groupIndex = -1;
		 
		          for (i = 0; i < 2; i++) {
 
            bodyDef = new b2BodyDef();
			bodyDef.type = b2Body.b2_dynamicBody;

			if (i == 0) {
				bodyDef.userData = new lib.riepas2();
			} else {
				bodyDef.userData = new lib.riepas();
			}
			

            if (i == 0) bodyDef.position.Set(axle1.GetWorldCenter().x - 0.3*Math.cos(Math.PI/2), axle1.GetWorldCenter().y + 0.3*Math.sin(Math.PI/2));
            else bodyDef.position.Set(axle2.GetWorldCenter().x + 0.3*Math.cos(-Math.PI/2), axle2.GetWorldCenter().y + 0.3*Math.sin(Math.PI/2));
            bodyDef.allowSleep = false;
 
            if (i == 0) wheel1 = world.CreateBody(bodyDef);
            else wheel2 = world.CreateBody(bodyDef);
 
            (i == 0 ? wheel1 : wheel2).CreateFixture(circleDef);
			bodyDef.userData.y = -200;
			fons.addChild(bodyDef.userData);			
         }
		  boxObjects.push(wheel1);
		  boxObjects.push(wheel2);
		 
		          // add joints //
         var revoluteJointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
         revoluteJointDef.enableMotor = true;
 
         revoluteJointDef.Initialize(axle1, wheel1, wheel1.GetWorldCenter());
         motor1 = world.CreateJoint(revoluteJointDef);
 
         revoluteJointDef.Initialize(axle2, wheel2, wheel2.GetWorldCenter());
         motor2 = world.CreateJoint(revoluteJointDef);
		 
		 // sensori
		 
		 boxDef.shape.SetAsOrientedBox(62 / RATIO, 40 / RATIO, new b2Vec2(-50 / RATIO, -30 / RATIO), 0);
		 boxDef.userData = "cargoSensor";
		 boxDef.isSensor = true;
		 boxDef.density = 0;
		 cart.CreateFixture(boxDef);

		 // fiksatori lai neripo
		 bodyDef = new b2BodyDef();
         bodyDef.position.Set(cart.GetWorldCenter().x,cart.GetWorldCenter().y);		 	
		 truckFix = world.CreateBody(bodyDef);
		 boxDef = new b2FixtureDef;
		 boxDef.shape = new b2PolygonShape;
		 boxDef.shape.SetAsOrientedBox(0.2 / RATIO, 25 / RATIO, new b2Vec2(-142 / RATIO, 10 / RATIO), 0 * Math.PI / 180);
		 truckFix.CreateFixture(boxDef);
		 boxDef.shape.SetAsOrientedBox(0.2 / RATIO, 17 / RATIO, new b2Vec2(72 / RATIO, 18 / RATIO), 0 * Math.PI / 180);
		 truckFix.CreateFixture(boxDef);
		
	  }	
	  
function celamkrans() {
	
		 var i;
		 var bodyDef
		 var boxDef;
         var prismaticJointDef2;
		 hPunkts = Box2D.Dynamics.b2Body;
		 vPunkts = Box2D.Dynamics.b2Body;
		 var cPunkts = Box2D.Dynamics.b2Body;
		 
		 line = new createjs.Shape();
		 fons.addChild(line);


		// horizontala sliede
		 bodyDef = new b2BodyDef;
		 boxDef = new b2FixtureDef;
		 bodyDef.userData = new lib.sliede();
		 bodyDef.userData.y = -200;
		 fons.addChild(bodyDef.userData);
		 boxDef.friction = 1;
		 boxDef.density = 500; 
		 boxDef.filter.groupIndex = -2;
		 bodyDef.type = b2Body.b2_dynamicBody;		 
		 bodyDef.position.Set(200 / RATIO, 75.5 / RATIO);		 
		 boxDef.shape = new b2PolygonShape;
         boxDef.shape.SetAsBox(15 / RATIO,1 / RATIO);
		 hPunkts = world.CreateBody(bodyDef);
		 hPunkts.CreateFixture(boxDef);	

         prismaticJointDef2 = new Box2D.Dynamics.Joints.b2PrismaticJointDef();
         prismaticJointDef2.Initialize(world.GetGroundBody(), hPunkts, hPunkts.GetWorldCenter() , new b2Vec2(1,0));
         prismaticJointDef2.lowerTranslation = -7;
         prismaticJointDef2.upperTranslation = 15;
         prismaticJointDef2.enableLimit = true;
		 prismaticJointDef2.enableMotor = true; 
		 prismaticJointDef2.maxMotorForce = 100;
         hSliede = world.CreateJoint(prismaticJointDef2);
		 
		 // punkts lai sliede supotos		 
		 var circleDef = new b2FixtureDef();
		 circleDef.shape = new b2CircleShape(15 / RATIO);
         circleDef.density = 5;
		 circleDef.friction = 0;
		 circleDef.filter.groupIndex = -2;
         bodyDef = new b2BodyDef();
		 bodyDef.type = b2Body.b2_dynamicBody;
		 bodyDef.position.Set(hPunkts.GetWorldCenter().x, hPunkts.GetWorldCenter().y);
		 cPunkts = world.CreateBody(bodyDef);
		 cPunkts.CreateFixture(circleDef);
		 
		 revoluteJointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
		revoluteJointDef.enableMotor = true; 
		 //revoluteJointDef.maxMotorForce = 1;         
		 revoluteJointDef.Initialize(hPunkts, cPunkts, hPunkts.GetWorldCenter());
         hinge1 = world.CreateJoint(revoluteJointDef);
		 
		 // -----
		 
		 bodyDef = new b2BodyDef;
		 boxDef = new b2FixtureDef;
		 bodyDef.userData = new lib.magnetsKaja();
		 bodyDef.userData.y = -200;
		 fons.addChild(bodyDef.userData);
		 boxDef.density = 5; //5
		 boxDef.filter.groupIndex = -2;
		 bodyDef.type = b2Body.b2_dynamicBody;		 
		 bodyDef.position.Set(200 / RATIO, 125 / RATIO);		 
		 boxDef.shape = new b2PolygonShape;
         boxDef.shape.SetAsBox(7 / RATIO,1 / RATIO);
		 vPunkts = world.CreateBody(bodyDef);
		 vPunkts.CreateFixture(boxDef);	

         prismaticJointDef2 = new Box2D.Dynamics.Joints.b2PrismaticJointDef();
         prismaticJointDef2.Initialize(cPunkts, vPunkts, vPunkts.GetWorldCenter() , new b2Vec2(0,1));
         prismaticJointDef2.lowerTranslation = -1;
         prismaticJointDef2.upperTranslation = 6;
         prismaticJointDef2.enableLimit = true;
		 prismaticJointDef2.enableMotor = true; 
		 prismaticJointDef2.maxMotorForce = 200;
         vSliede = world.CreateJoint(prismaticJointDef2);
		 
		 // -----
		 
		 bodyDef = new b2BodyDef;
		 boxDef = new b2FixtureDef;
		 bodyDef.userData = new lib.Magnets();
		 bodyDef.userData.y = -200;
		 setTimeout(function(){ fons.addChild(bodyDef.userData); }, 61);
		 //fons.addChild(bodyDef.userData);
		 boxDef.density = 1;
		 boxDef.friction = 5;
		 boxDef.restitution = 0;
		 boxDef.filter.groupIndex = -2;
		 bodyDef.type = b2Body.b2_dynamicBody;		 
		 bodyDef.position.Set(vPunkts.GetWorldCenter().x , vPunkts.GetWorldCenter().y - (0 / RATIO));		 
		 boxDef.shape = new b2PolygonShape;
		 magnets = world.CreateBody(bodyDef);
		 
		 var vertices = []
		vertices.push(new b2Vec2(-6/RATIO, 0/RATIO));
		vertices.push(new b2Vec2(6/RATIO, 0/RATIO));
		vertices.push(new b2Vec2(11/RATIO, 10/RATIO));
		vertices.push(new b2Vec2(-11/RATIO, 10/RATIO));
		boxDef.shape.SetAsVector(vertices, 4);
		magnets.CreateFixture(boxDef);
		
		 revoluteJointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
		 revoluteJointDef.enableMotor = true;
         revoluteJointDef.Initialize(vPunkts, magnets, vPunkts.GetWorldCenter());
         hinge2 = world.CreateJoint(revoluteJointDef);
	
		 boxDef.shape.SetAsOrientedBox(3 / RATIO, 0.4 / RATIO, new b2Vec2(0 / RATIO, 10 / RATIO), 0 * Math.PI / 180);
		 boxDef.userData = "mSensor";
		 boxDef.isSensor = true;
		 magnets.CreateFixture(boxDef);
		 
}

// -------------------------------

function panemtKravu() {
	
	if (cargoJoint) {
		
		world.DestroyJoint(cargoJoint);
		cargoJoint = null;
		createjs.Sound.play("magnet");
		if(!uzkrauts) setTimeout(kravaIekrauta,2000);
		
	} else {
	
	for (i = 0; i < cargoArray.length; i++) {
	if(cargoArray[i].iekraut == "ja") {
		
		 var prismJoint;
	     prismJoint = new Box2D.Dynamics.Joints.b2PrismaticJointDef();
         prismJoint.Initialize(magnets,cargoArray[i], new b2Vec2(magnets.GetWorldCenter().x,magnets.GetWorldCenter().y) , new b2Vec2(0,1));
		 prismJoint.enableMotor = true; 
		 prismJoint.maxMotorForce = 120;//120
		 prismJoint.collideConnected = true;
		 prismJoint.motorSpeed = 0;//-0.5
         cargoJoint = world.CreateJoint(prismJoint);
		 createjs.Sound.play("magnet2");
		 break;
	}
	}
	}

}

//----------------------------------

function kravaIekrauta() {
	
	if(cargo == totalCargo && !cargoJoint && !uzkrauts) {
		
		uzkrauts = true;
		vSliede.SetMotorSpeed(-1);
		hSliede.SetMotorSpeed(0);
		createjs.Sound.play("enginestart");
		
		setTimeout(function(){ 
		idleSound.volume = 1;
		}, 300);
		
		setTimeout(function(){ 
		driveSrc = new lib.driveLogs();
		exportRoot.addChild(driveSrc);
		}, 2000);
		
		setTimeout(function(){ 
		vSliede.SetMotorSpeed(0);
		world.DestroyBody(truckFix);
		truckFix = null;
		switchButtons(0);
		infoScreen();
		}, 3000);
	}
	
	
}

// --------------------------------------

function showCargoLevel() {
	
	cargo = 0;
	cargoNr = 0;
	
		for (i = 0; i < cargoArray.length; i++) {
	if(cargoArray[i].krava == "ja") {
		cargo += cargoArray[i].GetMass() * 250;
		cargoNr ++;
	}
	}
	
exportRoot.gmenu.hWindow.healthline.scaleX = cargo / totalCargo;

if(!loading) {

if(cargo < totalCargo * minKrava) setTimeout(function(){ if(cargo < totalCargo * minKrava) levelFailed(); }, 1300);

}	
	
}

// ----------------------------

function startDelivery() {
	
	loading = false;
	
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
function magnetDown(event) {event.nativeEvent.preventDefault();if(!spacebar && loading) {panemtKravu();spacebar = true;}}
function magnetUp(event) {event.nativeEvent.preventDefault();spacebar = false;}
// ----------------------------------------------------------------------------
function keyIsUp(event) {
	event.preventDefault();
	 if (event.keyCode == 38 || event.keyCode == 87) {
	up = false;
  } else if (event.keyCode == 40 || event.keyCode == 83){
    down = false;
  }
    if (event.keyCode == 39 || event.keyCode == 68) {
	right = false;
  } else if (event.keyCode == 37 || event.keyCode == 65){
    left = false;
  }
  if (event.keyCode == 32) spacebar = false;
  
}
// ----------------------------------------------------------------------------
function keyIsDown(event) {
	event.preventDefault();
	  if (event.keyCode == 38 || event.keyCode == 87) { // up
	up = true;	
  } else if (event.keyCode == 40 || event.keyCode == 83){ // down
    down = true;
  }
    if (event.keyCode == 39 || event.keyCode == 68) { // right
	right = true;
  } else if (event.keyCode == 37 || event.keyCode == 65){ // left
    left = true;
  }
  if (event.keyCode == 32) {
	  if(!spacebar && loading) {
	  panemtKravu();
	  spacebar = true;
	  }
  }
}


function handleTick() {
	if(!pause && !failed && !finished) {
		world.Step(1/60,10,10);
		world.ClearForces();
		gameTime --;
		//exportRoot.gmenu.frameratext.text = Math.round(createjs.Ticker.getMeasuredFPS());
	}
}
// ----------------------------------------------------------------------------
function update() {
		
if(!pause) {
drive();

if(debugPhysics) {
	debugDraw.SetDrawScale(30.0 * stage.scaleX);
	var dc = document.getElementById("debugcanvas");
	renderingContext.save();
	renderingContext.clearRect(0, 0, dc.width, dc.height);		
	renderingContext.translate((fons.x * stage.scaleX) + stage.x, (fons.y * stage.scaleY) + stage.y);			  
	world.DrawDebugData();
	renderingContext.restore();
	}        
}
if (!failed && !finished && isDriving) requestAnimationFrame(update);
}
// ----------------------------------------------------------------------------
function drive() {
	
			 		 for (i = 0; i < boxObjects.length; i++) {
				boxObjects[i].m_userData.x=boxObjects[i].GetPosition().x*30;
				boxObjects[i].m_userData.y=boxObjects[i].GetPosition().y*30;
				boxObjects[i].m_userData.rotation = boxObjects[i].GetAngle() * (180 / Math.PI);
		 }
	
		if (loading) {
			
			if(uzkrauts) {
				if(!truckFix) {
				//fons.x -= ((fons.x - (-RATIO*cart.GetWorldCenter().x + SCREEN_WIDTH/2  - cart.GetLinearVelocity().x*10))/3 + (1000 / RATIO)) * 0.05;
				//if(fons.x < - 3150) fons.x = -3150;
				//if(fons.x > 0) fons.x = 0;
				}
			} else {
			
		hSliede.SetMotorSpeed(left ? -1.4: right ? 1.4 : 0);
		hSliede.SetMaxMotorForce(left ? 70 : right ? 70: 100);
		vSliede.SetMotorSpeed(down ? 1.1: up ? -1.3 : 0);
		vSliede.SetMaxMotorForce(down ? 10 : up ? 30: 50);
			}
		hinge1.SetMotorSpeed(-4 * hinge1.GetJointAngle());
		hinge1.SetMaxMotorTorque(5);
		

				if(Math.abs(hinge2.GetJointAngle()) < 0.008) {
			hinge2.SetMotorSpeed(-0.05 * hinge2.GetJointAngle());
		} else {
		hinge2.SetMotorSpeed(-4 * hinge2.GetJointAngle());	
		}	

		hinge2.SetMaxMotorTorque(0.7);

		
		// bremze lai auto neripo prom
		 motor1.SetMotorSpeed(0);
         motor1.SetMaxMotorTorque(3);
		 motor2.SetMotorSpeed(0);
         motor2.SetMaxMotorTorque(3);
		 
		 var pt = vPunkts.m_userData.localToGlobal(-2.2, -3.2);
		 pt = fons.globalToLocal(pt.x, pt.y);
		 var pt2 = vPunkts.m_userData.localToGlobal(2.2, -3.2);
		 pt2 = fons.globalToLocal(pt2.x, pt2.y);
		 //var pt = vPunkts.m_userData.localToLocal(-2.3,-3.25);
		 
		  line.graphics.clear();
		  line.graphics.setStrokeStyle(0.35).beginStroke("rgba(0,0,0,1)");
		  line.graphics.moveTo((hPunkts.GetWorldCenter().x * 30) - 2.5, (hPunkts.GetWorldCenter().y * 30) + 5.5); // sakuma punkts 
		  line.graphics.lineTo(pt.x, pt.y); // beigu punkts
		  line.graphics.moveTo((hPunkts.GetWorldCenter().x * 30) + 2.5, (hPunkts.GetWorldCenter().y * 30) + 5.5); // sakuma punkts 
		  line.graphics.lineTo(pt2.x, pt2.y); // beigu punkts
		  line.graphics.endStroke();
		  
		 if (up || down || left || right) {
			 craneSound.volume = 0.7;
		 } else {
			craneSound.volume = 0; 
		 }
		  
			
			
		} else {
	
		
		if((up || down) && enginePower < 1) {
			enginePower += 0.02;
		} else {
			if(enginePower > 0) enginePower -= 0.02;
		}
		if(enginePower < 0) enginePower = 0;

		// aizmugure
		 motor1.SetMotorSpeed((18 + (truckUpgrade[0] * 0.6))*Math.PI * (down ? -.2 : up ? .3 : 0));
         motor1.SetMaxMotorTorque(down ? 6 + (truckUpgrade[0] * 0.7) : up ? 7 + (truckUpgrade[0] * 1.7): 1.5);
		 //prieksa
		 motor2.SetMotorSpeed((18 + (truckUpgrade[0] * 0.6))*Math.PI * (down ? -.2 : up ? .2 : 0));
         motor2.SetMaxMotorTorque(down || up ? 1 + (truckUpgrade[0] * 0.23) : 1.5);
		
		// bremzes
		if(motor2.GetJointSpeed() > 0 && down) {
			motor2.SetMotorSpeed(0);
         motor2.SetMaxMotorTorque(10);
		}
		if(motor2.GetJointSpeed() < 0 && up) {
			motor2.SetMotorSpeed(0);
         motor2.SetMaxMotorTorque(5);
		}
		

		 cart.ApplyTorque(15 * (left ? -1: right ? 1 : 0));
		 
		 if (cart.GetAngularVelocity() < -2) cart.SetAngularVelocity( -2);
		 if (cart.GetAngularVelocity() > 2) cart.SetAngularVelocity( 2);
		 
	    fons.x -= ((fons.x - (-RATIO*cart.GetWorldCenter().x + SCREEN_WIDTH/2  - cart.GetLinearVelocity().x*10))/3 + (1000 / RATIO)) * 0.1;
		//if(fons.x < - 3150) fons.x = -3150;
		if(fons.x < fPoint) fons.x = fPoint;
		if(fons.x > 0) fons.x = 0;
		
		if(RATIO*cart.GetWorldCenter().y < 180 || fons.y > 0) {	
			var targetY = 180 - (RATIO*cart.GetWorldCenter().y);
			fons.y -=  (fons.y - targetY) * 0.05;
		} 
		


		enginevolume();
		
		}

	     spring1.SetMaxMotorForce(45+Math.abs(800*Math.pow(spring1.GetJointTranslation(), 2)));
         spring1.SetMotorSpeed((spring1.GetMotorSpeed() - 10*spring1.GetJointTranslation())*0.4);         
 
         spring2.SetMaxMotorForce(20+Math.abs(800*Math.pow(spring2.GetJointTranslation(), 2)));
         spring2.SetMotorSpeed(-4*Math.pow(spring2.GetJointTranslation(), 1));
	 
	exportRoot.screen.sky.x = fons.x * 0.5;
	exportRoot.screen.sky.y = fons.y;

	if (loading) updateZ();
			 
}

function updateZ() {	
	fonsCargo.children.sort(function (a, b) {
    return b.y - a.y;
});
	
}
// -----------------------------------------------------------------------------
function enginevolume() {
	
if (up) {
	if(engineSpeed < 0.5) engineSpeed += 0.03;
} else if (down) {
	if(engineSpeed > -0.5)engineSpeed -= 0.03;
} else {
	if(engineSpeed > 0) engineSpeed -= 0.03;
	if(engineSpeed < 0) engineSpeed += 0.03;
}
	var eSpeed = Math.abs(engineSpeed)
	engineSound.volume = eSpeed * 1.3;
	idleSound.volume = 1 - eSpeed;
}
// -----------------------------------------------------------------------------
function damage(bum_x,bum_y) {

truckHealth --;
if(truckHealth < 0) truckHealth = 0;
exportRoot.gmenu.hWindow.healthline.scaleX = truckHealth / truckHealthFull;

if(truckHealth <= 0 && !failed && !finished) {
	failed = true;
	var explosion = new lib.truckexplosion();
	   explosion.x = bum_x;
	   explosion.y = bum_y;
	   fons.addChild(explosion);
	   levelFailed();
}

}
// -----------------------------------------------------------------------------
function levelFailed() {
		
	
if(!failed && !finished && cargo < totalCargo * minKrava) {
	failed = true;
	//createjs.Sound.play("bum");
	exportRoot.gmenu.buttons.visible = false;
	tryAgainScreen = new lib.tryagain();
	exportRoot.addChild(tryAgainScreen);
	
if (idleSound) idleSound.stop();
if (engineSound) engineSound.stop();
if (craneSound) craneSound.stop();
}
}

// ------------------------------------------------------------------------------
function levelComplete() {
	
	var betterscore = false;
	unlockedAchievement = -1;
	levelMoney = 0;
	var moneyBonus = 0;
	
	if (idleSound) idleSound.stop();
if (engineSound) engineSound.stop();
if (craneSound) craneSound.stop();
	
	if(gameTime < 0) gameTime = 0;
	levelScore = Math.floor(((Level * 70) + (gameTime / 12)) * (cargo / totalCargo));
	
	if(levelScores[Level -1] == 0) moneyBonus = 200 + (Level * 10);
	levelMoney = Math.floor((levelScore / 10) + moneyBonus);

	nauda += levelMoney;
	
	
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
	
	
	writeMemory();
	
	exportRoot.gmenu.buttons.visible = false;
	if(Level == 20) {
	tryAgainScreen = new lib.levelcompletefinal();
	} else {
		tryAgainScreen = new lib.levelcomplete();
	}
	
	exportRoot.addChild(tryAgainScreen);
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
	exportRoot.gmenu.buttons.mButton.removeEventListener( 'mousedown', magnetDown);
	exportRoot.gmenu.buttons.mButton.removeEventListener( 'pressup', magnetUp);
} else {
	document.removeEventListener('keydown', keyIsDown);
	document.removeEventListener('keyup', keyIsUp);
}
createjs.Ticker.removeEventListener("tick", handleTick);
	isDriving = false;

	exportRoot.screen.removeChild(fons);
	fons = null;
	world = null;
	cancelAnimationFrame(update);

}
// ------------------------------------------------------------------------------
function readMemory() {
	
	for (i = 0; i < levelScores.length; i++) {
		if(localStorage.getItem('levelscoretc2' + i) == null) localStorage.setItem('levelscoretc2' + i, 0);
    levelScores[i] = parseInt(localStorage.getItem('levelscoretc2' + i));	
	}
	if(localStorage.getItem('moneyd2') == null) localStorage.setItem('moneyd2', 0);
	nauda = parseInt(localStorage.getItem('moneyd2'));
	
		if(localStorage.getItem('umotor2') == null) localStorage.setItem('umotor2', 0);
	truckUpgrade[0] = parseInt(localStorage.getItem('umotor2'));
		if(localStorage.getItem('utires2') == null) localStorage.setItem('utires2', 0);
	truckUpgrade[1] = parseInt(localStorage.getItem('utires2'));
		if(localStorage.getItem('ukaste2') == null) localStorage.setItem('ukaste2', 0);
	truckUpgrade[2] = parseInt(localStorage.getItem('ukaste2'));
	
	
	var menuscore = 0;
		for (i = 0; i < levelScores.length; i++) {
    menuscore += levelScores[i];
	}
	if (menuscore > 0) infoLogs = 2;
	
		if(localStorage.getItem('langd') == null) localStorage.setItem('langd', 1);
	lang = parseInt(localStorage.getItem('langd'));
	
	
	updateAchievements();

}
// ------------------------------------------------------------------------------
function writeMemory() {
		for (i = 0; i < levelScores.length; i++) {
    localStorage.setItem('levelscoretc2' + i, levelScores[i]);
	}

	localStorage.setItem('moneyd2', nauda);
	localStorage.setItem('umotor2', truckUpgrade[0]);
	localStorage.setItem('utires2', truckUpgrade[1]);
	localStorage.setItem('ukaste2', truckUpgrade[2]);
	localStorage.setItem('langd2', lang);
	
	
	updateAchievements();
}
// ------------------------------------------------------------------------------
function resetMemory() {
		for (i = 0; i < levelScores.length; i++) {
	levelScores[i] = 0;		
    localStorage.setItem('levelscoretc2' + i, levelScores[i]);
	}
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
	if(levelsfinished >= 20) {
		if(achievement[3] == 0) unlockedAchievement = 3;
		achievement[3] = 1;
	}
	if(threestars >= 1) {
		if(achievement[4] == 0) unlockedAchievement = 4;
		achievement[4] = 1;
	}
	if(threestars >= 5) {
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
}).blur(function() { 
    // Pause when window loses focus 
    createjs.Sound.muted = true; 
});