//streaming video reference from https://github.com/vanevery/p5LiveMedia/tree/master

let myVideo = null;
let otherVideo;
let paintLayer;

function setup() {
  createCanvas(400,400);
  paintLayer = createGraphics(400,400)
 let constraints = {audio: true, video: true};
  
  myVideo = createCapture(VIDEO, 
    function(stream) {
	let p5lm = new p5LiveMedia(this, "CAPTURE", stream, "testing101")
  	p5lm.on('stream', gotStream);
    }
  );
  myVideo.elt.muted = true;
  frameRate(120);
}

function gotStream(stream, id){
  otherVideo = stream;
}

function draw() {
  if (myVideo != null) {
    image(myVideo,0,0,width/2,height);
    text("My Video", 10, 10);
  }

  if (otherVideo != null) {
    image(otherVideo,width/2,0,width/2,height);
    text("Their Video", width/2+10, 10);
  }  

  //painting
  if (mouseIsPressed){
    paintLayer.stroke(64,224,208);
    paintLayer.strokeWeight(5);
  //previous positions reference https://p5js.org/reference/p5/pmouseX/
    paintLayer.line(pmouseX, pmouseY, mouseX, mouseY);
  }
  //layer OVERLAYimage
  image(paintLayer, 0,0)
}

function keyPressed(){
  if(key === " "){
    paintLayer.clear();
  }
}