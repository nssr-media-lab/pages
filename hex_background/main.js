const color = '#222';
const DEBUG = false;
const MAX_DIST = 10;
const MAX_OPACITY = 0.8;
var elem = document.getElementById('background'),
    width = window.innerWidth,
    height = window.innerHeight,
    hexHeight = 80,
    hexWidth = Math.sqrt(3)/2 * hexHeight;

var lines = [];

var two = new Two({
  width: width,
  height: height,
  type: Two.Types.canvas
}).appendTo(elem);

var radius = 2;

function makePoint(x, y) {
  var circle = two.makeCircle(x, y, radius);
  circle.fill = color;
  circle.noStroke();
  return circle;
}

var nRows = height/(hexHeight/4);
var nCols = width/(hexWidth/2);

function makePt(c, r) {
  return {
    x: c*(hexWidth/2),
    y: r*(hexHeight/4)
  };
}

function even(i) {
  return i % 2 == 0;
}

for (var r=0; r<nRows; r++){
  var r_i = r % 6;
  for (var c=0; c<nCols; c++) {
    var pt = makePt(c, r);
    if (DEBUG) {
      if ((r_i == 0 || r_i == 4 || r_i == 6) && !even(c)) {
        makePoint(pt.x, pt.y);
      } else if ((r_i == 1 || r_i == 3) && even(c)) {
        makePoint(pt.x, pt.y);
      }
    }
    var toPts = [];
    if (r_i == 0 && !even(c)) {
      toPts.push(makePt(c-1, r+1));
      toPts.push(makePt(c+1, r+1));
    } else if (r_i == 1 && even(c)) {
      toPts.push(makePt(c, r+2));
    } else if (r_i == 4 && !even(c)) {
      toPts.push(makePt(c, r+2));
    } else if (r_i == 3 && even(c)) {
      toPts.push(makePt(c-1, r+1));
      toPts.push(makePt(c+1, r+1));
    }
    lines = lines.concat(toPts.map(pt_ => {
      var line = two.makeLine(pt_.x, pt_.y, pt.x, pt.y);
      line.opacity = 0;
      return {
        line: line,
        pt: pt
      }
    }));
  }
}

function dist(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

document.addEventListener('mousemove', ev => {
  var pt = {
    x: ev.clientX,
    y: ev.clientY
  };

  lines.map(l => {
    var distProp = dist(pt, l.pt)/MAX_DIST
    distProp = Math.max(distProp, 5); // set a min val to smooth out opacity
    l.line.opacity = Math.min(1, 1/distProp) * MAX_OPACITY;
  });
});

two.play();
