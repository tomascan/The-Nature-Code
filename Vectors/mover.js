class Mover{
    constructor() {
      this.position = createVector(random(width),random(height));
      this.velocity = createVector();
      this.acceleration = createVector();
      this.topspeed = 5;
      this.r = 6;
    }
  
    update() {
      // Compute a vector that points from position to mouse
      var mouse = createVector(mouseX,mouseY);
      this.acceleration = p5.Vector.sub(mouse,this.position);
      // Set magnitude of acceleration
      this.acceleration.setMag(0.2);
  
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.topspeed);
      this.position.add(this.velocity);
    }
  
    display() {
      if(form === "ellipse"){
        stroke(200);
        strokeWeight(1);
        fill(127);
        ellipse(this.position.x, this.position.y, 48, 48);  
      }
      if(form === "triangle"){
      // Draw a triangle rotated in the direction of velocity
      let theta = this.velocity.heading() + PI / 2;
      fill(127);
      stroke(200); // Color del borde del vehiculo
      strokeWeight(1); //Dimension del borde
      push();
      translate(this.position.x, this.position.y);
      rotate(theta);
      beginShape();
      vertex(0, -this.r * 2);
      vertex(-this.r, this.r * 2);
      vertex(this.r, this.r * 2);
      endShape(CLOSE);
      pop();
      }
    }
    
  }