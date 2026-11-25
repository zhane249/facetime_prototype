//streaming video reference from https://github.com/vanevery/p5LiveMedia/tree/master

let myVideo = null;
let otherVideo;
let paintLayer;

new p5(sketch);

function sketch(p) {
  p.setup = function() {
    p.createCanvas(400, 400);
    paintLayer = p.createGraphics(400, 400);
    let constraints = { audio: true, video: true };

    myVideo = p.createCapture(p.VIDEO, function (stream) {
      let p5lm = new p5LiveMedia(p, "CAPTURE", stream, "testing101");
      p5lm.on("stream", gotStream);
    });
    myVideo.elt.muted = true;
    p.frameRate(120);
  }

  function gotStream(stream, id) {
    otherVideo = stream;
  }

  p.draw=function() {
    if (myVideo != null) {
      p.image(myVideo, 0, 0, p.width / 2, p.height);
      p.text("My Video", 10, 10);
    }

    if (otherVideo != null) {
      p.image(otherVideo, p.width / 2, 0, p.width / 2, p.height);
      p.text("Their Video", p.width / 2 + 10, 10);
    }

    //painting
    if (p.mouseIsPressed) {
      paintLayer.stroke(64, 224, 208);
      paintLayer.strokeWeight(5);
      //previous positions reference https://p5js.org/reference/p5/pmouseX/
      paintLayer.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
    }
    //layer OVERLAYimage
    p.image(paintLayer, 0, 0);
  }

  p.keyPressed = function() {
    if (p.key === " ") {
      paintLayer.clear();
    }
  }
}
