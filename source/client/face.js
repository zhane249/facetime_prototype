//streaming video reference from https://github.com/vanevery/p5LiveMedia/tree/master

let myVideo = null;
let otherVideo;
let paintLayer;
let p5lm;
let otherPaintLayer;


export function sketch(p, roomCode) {
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    paintLayer = p.createGraphics(p.windowWidth, p.windowHeight);;
    otherPaintLayer = p.createGraphics(p.windowWidth, p.windowHeight);;
    let constraints = { audio: true, video: true };

    myVideo = p.createCapture(p.VIDEO, function (stream) {
      p5lm = new p5LiveMedia(p, "CAPTURE", stream, roomCode);
      p5lm.on("stream", gotStream);
      p5lm.on("data", gotData);
    });
    myVideo.elt.muted = true;
    p.frameRate(120);
  };

  function gotStream(stream, id) {
    otherVideo = stream;
  }

  function gotData(rawData, id) {
    let data = JSON.parse(rawData);
    if (data.action == "clear") {
      otherPaintLayer.clear();
    } else if (data.action == "draw") {
      otherPaintLayer.stroke(64, 224, 208);
      otherPaintLayer.strokeWeight(5);
      //previous positions reference https://p5js.org/reference/p5/pmouseX/
      otherPaintLayer.line(
        data.pmouseX,
        data.pmouseY,
        data.mouseX,
        data.mouseY,
      );
    }
  }
  p.draw = function () {
    if (myVideo != null) {
      p.image(myVideo, 0, 0, p.width, p.height);
      p.text("My Video", 10, 10);
    }

    if (otherVideo != null) {
      p.image(otherVideo, 0, 0, 100, 100);
      p.text("Their Video", p.width / 2 + 10, 10);
    }

    //painting
    if (p.mouseIsPressed && p5lm) {
      paintLayer.stroke(64, 224, 208);
      paintLayer.strokeWeight(5);
      //previous positions reference https://p5js.org/reference/p5/pmouseX/
      paintLayer.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);

      let data = {
        action: "draw",
        pmouseX: p.pmouseX,
        pmouseY: p.pmouseY,
        mouseX: p.mouseX,
        mouseY: p.mouseY,
      };
      p5lm.send(JSON.stringify(data));
    }
    //layer OVERLAYimage
    p.image(otherPaintLayer, -p.width / 2, 0);
    p.image(paintLayer, 0, 0);
  };

  p.keyPressed = function () {
    if (p.key === " " && p5lm) {
      paintLayer.clear();
      p5lm.send(JSON.stringify({ action: "clear" }));
    }
  };
}
