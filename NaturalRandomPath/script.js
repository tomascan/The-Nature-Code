let walker;

function setup() {
  createCanvas(640, 360);
  walker = new Walker();
  background(127);
}

function draw() {
  walker.step();
  walker.render();
}

class Walker {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
  }

  render() {
    stroke(0);
    point(this.x, this.y);
  }

  step() {
    var choice = floor(random(4));
    if (choice === 0) {
      this.x++;
    } else if (choice == 1) {
      this.x--;
    } else if (choice == 2) {
      this.y++;
    } else {
      this.y--;
    }
    this.x = constrain(this.x, 0, width - 1);
    this.y = constrain(this.y, 0, height - 1);
  }
}



//------------------ WHITE VANISH ELIPSE----------------------------------



/*
let xoff = 0;
let xincrement = 0.01;

function setup() {
  createCanvas(640, 360);
  background(0);
  noStroke();
}


function draw() {
  // Black transparent background
  fill(0, 10);
  rect(0, 0, width, height);

  // Try this to compare to noise
  // let n = random(0, width);

  // Get a noise value based on xoff and scale it according to the window's width
  let n = noise(xoff);
  let x = map(n, 0, 1, 0, width);

  // With each cycle, increment xoff
  xoff += xincrement;

  // Draw the ellipse at the value produced by perlin noise
  fill(200);
  ellipse(x, height / 2, 64, 64);
}
*/