let v;

let debug = true;

let d = 25;

function setup() {
  createCanvas(640, 360);
  v = new Vehicle(width / 2, height / 2);
}

function draw() {
  background(51);

    //Dibuja el marco limite centrado sin relleno
  if (debug) {
    stroke(175);
    noFill();
    rectMode(CENTER);
    rect(width / 2, height / 2, width - d * 2, height - d * 2); //dimensiones
  }

  // Call the appropriate steering behaviors for our agents
  v.boundaries();

  v.update();
  v.display();

}

function mousePressed() {
  debug = !debug;
}

//The Vehicle class

class Vehicle {
    constructor(x, y) {
      this.acceleration = createVector(0, 0);
      this.velocity = createVector(3, 4);
      this.position = createVector(x, y);
      this.r = 6;
      this.maxspeed = 3;
      this.maxforce = 0.15;
    }
  
    // Method to update location
    update() {
      // Update velocity
      this.velocity.add(this.acceleration);
      // Limit speed
      this.velocity.limit(this.maxspeed);
      this.position.add(this.velocity);
      // Reset accelerationelertion to 0 each cycle
      this.acceleration.mult(0);
    }
  
    applyForce(force) {
      // We could add mass here if we want A = F / M
      this.acceleration.add(force);
    }
  
    boundaries() {
  
      let desired = null;
        
      // Posicion X este entre los limites sino invierte maxspeed 
      if (this.position.x < d) {
        desired = createVector(this.maxspeed, this.velocity.y);
      } else if (this.position.x > width - d) {
        desired = createVector(-this.maxspeed, this.velocity.y);
      }
  
        // Posicion Y este entre los limites sino cambia el sentido de speed
      if (this.position.y < d) {
        desired = createVector(this.velocity.x, this.maxspeed);
      } else if (this.position.y > height - d) {
        desired = createVector(this.velocity.x, -this.maxspeed);
      }
  
      if (desired !== null) {
        desired.normalize(); //vector with same direction and sense but module = 1;
        desired.mult(this.maxspeed); //
        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce); // Suaviza los cambios de direccion
        this.applyForce(steer);
      }
    }
  
    display() {
      // Draw a triangle rotated in the direction of velocity
      let theta = this.velocity.heading() + PI / 2;
      fill(127);
      stroke(200);
      strokeWeight(1);
      push();
      translate(this.position.x, this.position.y); //
      rotate(theta); // Apunta en la direccion en la que va 
      beginShape();
      vertex(0, -this.r * 2);
      vertex(-this.r, this.r * 2);
      vertex(this.r, this.r * 2);
      endShape(CLOSE);
      pop();
    }
  }