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
mobile = false;
var again = false;
var gameTime = 10800;
var updateclock = 0;
var tryAgainScreen;
var levelScore = 0;
var levelStars = 0;
var totalScore = 0;
var levelScores = [0,0,0,0,0,0,0,0,0,0,0,0];
var targetScores = [995,1035,1080,1075,1120,1030,1030,960,1000,1000,1000,1000];
var backgroundSound;
var idleSound;
var engineSound;
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
var fons;
var box_original_size = 10;
var RATIO = 30;
var SCREEN_WIDTH = 640;
var truckHealthFull;
var truckHealth;
var engineSpeed = 0;
var boxObjects;
var dumuLayer;
var dumuPoint;
var dumuPause = 0;
var fPoint = 0;

// ------------------------------------------------------------------------------------
function updateButtons() {

exportRoot.gmenu.buttons.lButtons.x = 0 -(stage.x / stage.scaleX);
exportRoot.gmenu.buttons.lButtons.y = 275 + (stage.y / stage.scaleY);
exportRoot.gmenu.buttons.rButtons.x = 640 +(stage.x / stage.scaleX);
exportRoot.gmenu.buttons.rButtons.y = 156 + (stage.y / stage.scaleY);
exportRoot.gmenu.hWindow.x = 2 - (stage.x / stage.scaleX);
exportRoot.gmenu.hWindow.y = 2 - (stage.y / stage.scaleY);
exportRoot.pButton.poga.x = 592 + (stage.x / stage.scaleX);
exportRoot.pButton.poga.y = 37 - (stage.y / stage.scaleY);

exportRoot.scoreT.x = 564 + (stage.x / stage.scaleX);
exportRoot.scoreT.y = 0 - (stage.y / stage.scaleY);

exportRoot.menuB.x = 0 - (stage.x / stage.scaleX);
exportRoot.menuB.y = 230 + (stage.y / stage.scaleY);
exportRoot.ievads.y = 360 + (stage.y / stage.scaleY);

exportRoot.v.x = 0 - (stage.x / stage.scaleX);
exportRoot.v.y = 0 - (stage.y / stage.scaleY);
//exportRoot.w.x = 636 +(stage.x / stage.scaleX);
//exportRoot.w.y = 356 + (stage.y / stage.scaleY);
exportRoot.screen.y = 0 + (stage.y / stage.scaleY);
}



function startGame() {
	
updateButtons();	
exportRoot.pButton.poga.gotoAndStop(1);

if (backgroundSound) backgroundSound.stop();
if (idleSound) idleSound.stop();
if (engineSound) engineSound.stop();
	setTimeout(stopit,100);
	function stopit(){

backgroundSound = createjs.Sound.play("fonamuzons",{interrupt: createjs.Sound.INTERRUPT_EARLY, loop:-1});
idleSound = createjs.Sound.play("idle",{interrupt: createjs.Sound.INTERRUPT_EARLY, loop:-1});
engineSound = createjs.Sound.play("engine",{interrupt: createjs.Sound.INTERRUPT_EARLY, loop:-1});
	
engineSound.volume = 0;
backgroundSound.volume = 0.8;		
}

pause = true;

var fade = new lib.fadeout();
exportRoot.addChild(fade);

gameTime = 10800;
levelScore =  0;
truckHealthFull = 10;
truckHealth = 10;
engineSpeed = 0;

exportRoot.gmenu.hWindow.healthline.scaleX = truckHealth / truckHealthFull;
exportRoot.gmenu.hWindow.leveltxt.text = "Level: "+ Level;

failed = false;
finished = false;
isDriving = true;
up = false;
down = false;
right = false;
left = false;	

setupWorld();
createTruck();
setTimeout(topObjects,65);

var listener = new Box2D.Dynamics.b2ContactListener;

listener.BeginContact = function (contact) {
	
if(contact.GetFixtureA().m_isSensor || contact.GetFixtureB().m_isSensor) {
	if(contact.GetFixtureA().GetBody().GetUserData() != null && contact.GetFixtureB().GetBody().GetUserData() != null) {
	if((contact.GetFixtureA().GetBody().GetUserData().name == "Truck" && contact.GetFixtureB().GetBody().GetUserData().name == "Finish") || (contact.GetFixtureB().GetBody().GetUserData().name == "Truck" && contact.GetFixtureA().GetBody().GetUserData().name == "Finish")) {
if(!finished) {
	finished = true;
	levelComplete();
}
	} 	
}
} else {
	if(contact.GetFixtureA().m_userData == "truckSensor" || contact.GetFixtureB().m_userData == "truckSensor") {
	
	   var worldManifold = new Box2D.Collision.b2WorldManifold;
       contact.GetWorldManifold(worldManifold);
	   var bumX = worldManifold.m_points[0].x * RATIO;
	   var bumY = worldManifold.m_points[0].y * RATIO;
	   var dumi = new lib.dums2();
	   dumi.x = bumX;
	   dumi.y = bumY;
	   if (truckHealth > 0) { fons.addChild(dumi);
	createjs.Sound.play("bum2");
	   }
	}	
}	  
}

listener.PostSolve = function(contact, impulse) {
if(contact.GetFixtureA().m_userData == "truckSensor") {
damage(contact.GetFixtureA().GetBody().GetUserData().x, contact.GetFixtureA().GetBody().GetUserData().y);		
} else if (contact.GetFixtureB().m_userData == "truckSensor") {
damage(contact.GetFixtureB().GetBody().GetUserData().x, contact.GetFixtureB().GetBody().GetUserData().y);
}
}

world.SetContactListener(listener);
		
if(mobile) {
			
createjs.Touch.enable(stage, false, false);
exportRoot.gmenu.buttons.visible = true;	
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

createjs.Ticker.addEventListener("tick", handleTick);
}

// ----------------------------------------------------------------------------
function setupWorld() {
	
		 world = new b2World(new b2Vec2(0, 10),true);		
		
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
		} 
		
		exportRoot.screen.addChild(fons);	
		dumuLayer = new lib.dumuvieta();
		fons.addChild(dumuLayer);
		//exportRoot.screen.sky.x = fons.x * 0.85;
		
		if(debugPhysics) {
			 debugDraw = new b2DebugDraw();
			 debugDraw.SetSprite(document.getElementById("debugcanvas").getContext("2d"));
			 debugDraw.SetDrawScale(30.0);
			 debugDraw.SetFillAlpha(0.0);
			 debugDraw.SetLineThickness(0.0);
			 debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			 world.SetDebugDraw(debugDraw);
		 }
		
		setTimeout(readNextFrame,60);
		
		function readNextFrame() {
		
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
					else if (name == "kaste") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height, realRotation * 0.0174532925,new lib.Kaste());						
						visible = false;
						}
						else if (name == "deles") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height, realRotation * 0.0174532925,new lib.Deles());						
						visible = false;
						} else if (name == "deles2") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width + 1.5, nominalBounds.height + 1, realRotation * 0.0174532925,new lib.Deles2());	
						
						visible = false;
						} else if (name == "aplis") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_circle(x, y, nominalBounds.width, realRotation * 0.0174532925,new lib.aplis3());						
						visible = false;
						}
						else if (name == "kaste2") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height, realRotation * 0.0174532925,new lib.Kaste2());						
						visible = false;
						}
						else if (name == "stabs") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height - 4, realRotation * 0.0174532925,new lib.Stabs());						
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
		 fPoint = -1 * (x_origin - 600);
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
		
		function draw_custom_circle(x_origin,y_origin,box_width,angle,muviks) {
		
		 var boxDef = new b2FixtureDef;
		 boxDef.friction = 1.6;
         boxDef.density = 2; 
		 
		 var bodyDef = new b2BodyDef;
		 bodyDef.type = b2Body.b2_dynamicBody;		 
		 bodyDef.position.Set(x_origin / 30, y_origin / 30);
		 bodyDef.angle =  angle;
		 bodyDef.userData = muviks;
		 bodyDef.userData.y = -200;
		 fons.addChild(bodyDef.userData);		 
		 boxDef.shape = new b2CircleShape((box_width / 2 -1) / 30);		 
		 world.CreateBody(bodyDef).CreateFixture(boxDef);
		 
		}
		
function draw_custom_box(x_origin,y_origin,box_width,box_height,angle,muviks) {
		
		 var boxDef = new b2FixtureDef;
		 boxDef.friction = 1.6;
         boxDef.density = 2; 
		 
		 var bodyDef = new b2BodyDef;
		 bodyDef.type = b2Body.b2_dynamicBody;		 
		 bodyDef.position.Set(x_origin / 30, y_origin / 30);
		 bodyDef.angle =  angle;
		 bodyDef.userData = muviks;
		 bodyDef.userData.y = -200;
		 fons.addChild(bodyDef.userData);
		 
		 boxDef.shape = new b2PolygonShape;
         boxDef.shape.SetAsBox((box_width / 2 - 1) / 30, (box_height / 2 - 1) / 30);
		 
		 world.CreateBody(bodyDef).CreateFixture(boxDef);
		 
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
         bodyDef.position.Set(150 / RATIO, 254 / RATIO);
		 bodyDef.type = b2Body.b2_dynamicBody;		 
		 bodyDef.userData = new lib.truck();
		 dumuPoint = bodyDef.userData.skurstenis;
		 bodyDef.userData.y = -200;
		 fons.addChild(bodyDef.userData);
		//bodyDef.userData.gotoAndStop(truckFrame);		
 cart = world.CreateBody(bodyDef);
 //cart.SetUserData.name = "Truck";
 
         boxDef = new b2FixtureDef();
         boxDef.density = 0.1;
         boxDef.friction = 0.5;
         boxDef.restitution = 0.3;
         boxDef.filter.groupIndex = -1;
		boxDef.shape = new b2PolygonShape;        
		 
var vertices = []
vertices.push(new b2Vec2(-23/RATIO, -19/RATIO));
vertices.push(new b2Vec2(2/RATIO, -19/RATIO));
vertices.push(new b2Vec2(4/RATIO, 0/RATIO));
vertices.push(new b2Vec2(-25/RATIO, 0/RATIO));
boxDef.shape.SetAsVector(vertices, 4);
cart.CreateFixture(boxDef);		 		 
 
 boxDef.density = 1.9;
 
vertices = []
vertices.push(new b2Vec2(-29/RATIO, 0/RATIO));
vertices.push(new b2Vec2(5/RATIO, 0/RATIO));
vertices.push(new b2Vec2(8/RATIO, 15/RATIO));
vertices.push(new b2Vec2(-27/RATIO, 20/RATIO));
boxDef.shape.SetAsVector(vertices, 4);		 
cart.CreateFixture(boxDef);	
 
vertices = []
vertices.push(new b2Vec2(5/RATIO, 1/RATIO));
vertices.push(new b2Vec2(36/RATIO, 2/RATIO));
vertices.push(new b2Vec2(37/RATIO, 20/RATIO));
vertices.push(new b2Vec2(8/RATIO, 15/RATIO));
boxDef.shape.SetAsVector(vertices, 4);		 
cart.CreateFixture(boxDef);	
 
boxDef.shape.SetAsOrientedBox(8 / RATIO, 3 / RATIO, new b2Vec2(-15 / RATIO, 9 / RATIO), -60 * Math.PI / 180);
cart.CreateFixture(boxDef);

boxDef.shape.SetAsOrientedBox(8/ RATIO, 3 / RATIO, new b2Vec2(22 / RATIO, 9 / RATIO), 60 * Math.PI / 180);
cart.CreateFixture(boxDef);



boxDef.restitution = 0.5;
 
axle1 = world.CreateBody(bodyDef); 
boxDef.shape.SetAsOrientedBox(12 / RATIO, 2 / RATIO, new b2Vec2((-5 / RATIO) - 0.6*Math.cos(Math.PI/3), (-6 / RATIO) + 0.6*Math.sin(Math.PI/3)), -60 * Math.PI / 180);
axle1.CreateFixture(boxDef);

         prismaticJointDef = new Box2D.Dynamics.Joints.b2PrismaticJointDef();
         prismaticJointDef.Initialize(cart, axle1, axle1.GetWorldCenter(), new b2Vec2(Math.cos(Math.PI/3), Math.sin(-Math.PI/3)));
         prismaticJointDef.lowerTranslation = -0.3;
         prismaticJointDef.upperTranslation = 0.5;
         prismaticJointDef.enableLimit = true;
         prismaticJointDef.enableMotor = true;
         spring1 = world.CreateJoint(prismaticJointDef);
		 
         axle2 = world.CreateBody(bodyDef); 
         boxDef.shape.SetAsOrientedBox(12 / RATIO, 2 / RATIO, new b2Vec2((18 / RATIO) + 0.6*Math.cos(-Math.PI/3), (-2 / RATIO) + 0.6*Math.sin(Math.PI/3)), 60 * Math.PI / 180);
         axle2.CreateFixture(boxDef); 
         prismaticJointDef.Initialize(cart, axle2, axle2.GetWorldCenter(), new b2Vec2(Math.cos(Math.PI/3), Math.sin(Math.PI/3)));
         spring2 = world.CreateJoint(prismaticJointDef);
		 
		 circleDef = new b2FixtureDef();
		 
         circleDef.density = 1;
         //circleDef.friction = 1.1;
         circleDef.restitution = 0.4;
         circleDef.filter.groupIndex = -1;
		 
		          for (i = 0; i < 2; i++) {
 
            bodyDef = new b2BodyDef();
			bodyDef.type = b2Body.b2_dynamicBody;	
			
            if (i == 0) {
				circleDef.friction = 1.4;
				circleDef.shape = new b2CircleShape(16 / RATIO);
				bodyDef.userData = new lib.riepas();
				bodyDef.position.Set(axle1.GetWorldCenter().x - 0.3*Math.cos(Math.PI/3), axle1.GetWorldCenter().y + 0.3*Math.sin(Math.PI/3));
            } else {
				circleDef.friction = 2.5;
				circleDef.shape = new b2CircleShape(11 / RATIO);
				bodyDef.userData = new lib.riepas2();
				bodyDef.position.Set(axle2.GetWorldCenter().x + 0.3*Math.cos(-Math.PI/3), axle2.GetWorldCenter().y + 0.3*Math.sin(Math.PI/3));
			}
            bodyDef.allowSleep = false;
 
            if (i == 0) wheel1 = world.CreateBody(bodyDef);
            else wheel2 = world.CreateBody(bodyDef);
 
            (i == 0 ? wheel1 : wheel2).CreateFixture(circleDef);
			bodyDef.userData.y = -200;
			fons.addChild(bodyDef.userData);			
         }
		 
		          // add joints //
         revoluteJointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
         revoluteJointDef.enableMotor = true;
 
         revoluteJointDef.Initialize(axle1, wheel1, wheel1.GetWorldCenter());
         motor1 = world.CreateJoint(revoluteJointDef);
 
         revoluteJointDef.Initialize(axle2, wheel2, wheel2.GetWorldCenter());
         motor2 = world.CreateJoint(revoluteJointDef);
		 
		 		 // sensori
		 
		 boxDef.shape.SetAsOrientedBox(12 / RATIO, 1 / RATIO, new b2Vec2(-12 / RATIO, -21 / RATIO), 0 * Math.PI / 180);
		 boxDef.userData = "truckSensor";
		 cart.CreateFixture(boxDef);

		 boxDef.shape.SetAsOrientedBox(11 / RATIO, 1 / RATIO, new b2Vec2(-25 / RATIO, -10 / RATIO), 97 * Math.PI / 180);
		 boxDef.userData = "truckSensor";
		 cart.CreateFixture(boxDef);
		 
		 boxDef.shape.SetAsOrientedBox(15 / RATIO, 1 / RATIO, new b2Vec2(20 / RATIO, 1 / RATIO), 2 * Math.PI / 180);
		 boxDef.userData = "truckSensor";
		 cart.CreateFixture(boxDef);
		 
		 boxDef.shape.SetAsOrientedBox(9 / RATIO, 1 / RATIO, new b2Vec2(4 / RATIO, -10 / RATIO), 83 * Math.PI / 180);
		 boxDef.userData = "truckSensor";
		 cart.CreateFixture(boxDef);
		
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
		 event.preventDefault();
	up = false;
  } else if (event.keyCode == 40 || event.keyCode == 83){
	  event.preventDefault();
    down = false;
  }
    if (event.keyCode == 39 || event.keyCode == 68) {
		event.preventDefault();
	right = false;
  } else if (event.keyCode == 37 || event.keyCode == 65){
	  event.preventDefault();
    left = false;
  }
}
// ----------------------------------------------------------------------------
function keyIsDown(event) {
	
	  if (event.keyCode == 38 || event.keyCode == 87) { // up
	  event.preventDefault();
	up = true;	
  } else if (event.keyCode == 40 || event.keyCode == 83){ // down
  event.preventDefault();
    down = true;
  }
    if (event.keyCode == 39 || event.keyCode == 68) { // right
	event.preventDefault();
	right = true;
  } else if (event.keyCode == 37 || event.keyCode == 65){ // left
  event.preventDefault();
    left = true;
  }
}


function handleTick() {
	if(!pause && isDriving) {
		world.Step(1/60,10,10);
		world.ClearForces();
		gameTime --;
		//exportRoot.gmenu.frameratext.text = createjs.Ticker.getMeasuredFPS();
	}
}
// ----------------------------------------------------------------------------
function update() {
		
if(!pause) {
drive();

 if(debugPhysics) {
			  debugDraw.SetDrawScale(30.0 * stage.scaleX);
			  world.DrawDebugData();
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

		 motor1.SetMotorSpeed(12*Math.PI * (down ? -.3 : up ? .3 : 0));
         motor1.SetMaxMotorTorque(down || up ? 19.5 : 0.5);
		 
		 motor2.SetMotorSpeed(17*Math.PI * (down ? -.2 : up ? .2 : 0));
         motor2.SetMaxMotorTorque(down || up ? 8 : 0.5);
		 
	     spring1.SetMaxMotorForce(30+Math.abs(800*Math.pow(spring1.GetJointTranslation(), 2)));
         spring1.SetMotorSpeed((spring1.GetMotorSpeed() - 10*spring1.GetJointTranslation())*0.4);         
 
         spring2.SetMaxMotorForce(20+Math.abs(800*Math.pow(spring2.GetJointTranslation(), 2)));
         spring2.SetMotorSpeed(-4*Math.pow(spring2.GetJointTranslation(), 1));	
		 

		 cart.ApplyTorque(16 * (left ? -1: right ? 1 : 0));
		 
		 if (cart.GetAngularVelocity() < -2) cart.SetAngularVelocity( -2);
		 if (cart.GetAngularVelocity() > 2) cart.SetAngularVelocity( 2);
	
			  fons.x -= ((fons.x - (-RATIO*cart.GetWorldCenter().x + SCREEN_WIDTH/2  - cart.GetLinearVelocity().x*10))/3 + (1000 / RATIO)) * 0.1;
			  if(fons.x < fPoint) fons.x = fPoint;
			  if(fons.x > 0) fons.x = 0;

		 
	exportRoot.screen.aizmugure.x = fons.x * 0.3;
	enginevolume();	
	dumi();
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
	engineSound.volume = eSpeed;
	idleSound.volume = 1 - eSpeed;
}

function dumi() {
	
	dumuPause ++;
	
	if(dumuPause == 30) {		
	dums();
	dumuPause = 0;
	}
	
	if(up || down) {		
	if(dumuPause == 10 || dumuPause == 20) {
	dums();
	}				
	}
	
	function dums() {
		
	var dums = new lib.truckdumi();	
	var pt = dumuPoint.parent.localToGlobal(dumuPoint.x, dumuPoint.y);
	pt = fons.globalToLocal(pt.x, pt.y);		
	dums.x = pt.x;
	dums.y = pt.y;
	dumuLayer.addChild(dums);		
	}
	
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
	

	createjs.Sound.play("bum");
	exportRoot.gmenu.buttons.visible = false;
	tryAgainScreen = new lib.tryagain();
	exportRoot.addChild(tryAgainScreen);
	
if (idleSound) idleSound.stop();
if (engineSound) engineSound.stop();
	
}

// ------------------------------------------------------------------------------
function levelComplete() {
	
	if (idleSound) idleSound.stop();
if (engineSound) engineSound.stop();
	
	if(gameTime < 0) gameTime = 0;
	levelScore = Math.floor((Level * 60) + (gameTime / 10));
	if (levelScore > levelScores[Level - 1]) levelScores[Level - 1] = levelScore;

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
	if(Level == 8) {
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
		if(localStorage.getItem('levelscoretractor2' + i) == null) localStorage.setItem('levelscoretractor2' + i, 0);
    levelScores[i] = parseInt(localStorage.getItem('levelscoretractor2' + i));
	}
}
// ------------------------------------------------------------------------------
function writeMemory() {
		for (i = 0; i < levelScores.length; i++) {
    localStorage.setItem('levelscoretractor2' + i, levelScores[i]);
	}
}
// ------------------------------------------------------------------------------
function resetMemory() {
		for (i = 0; i < levelScores.length; i++) {
	levelScores[i] = 0;		
    localStorage.setItem('levelscoretractor2' + i, levelScores[i]);
	}
}