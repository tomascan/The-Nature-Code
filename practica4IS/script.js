let walker;
let rW = false;

let form = "ellipse";

let vehicles = [];
let sL = false;

let sF = false;

let flock;
let fl = false;

let d = 50;
let ds = 100;


let movers = [];
let sW = false;

function setup() {
    canvas = createCanvas(640, 360);
    canvas.position(100, 100);
    background(127);

    //Change the form of the vehicles
    ellipseForm = createButton(" Ellipse ");
    ellipseForm.position(40,70);
    ellipseForm.mousePressed(changeEllipse);
    
    triangleForm = createButton("Triangle");
    triangleForm.position(35,40);
    triangleForm.mousePressed(changeTriangle);


    // Function Random Walker
    buttonWalker = createButton("RandomWalker");
    buttonWalker.position(150, 55);
    buttonWalker.mousePressed(randomWalker);


    // Function Seek and Land
    buttonSeeker = createButton("Seek And Land");
    buttonSeeker.position(280,55);
    buttonSeeker.mousePressed(seekLand);

    // Function separation 

    buttonSeparation = createButton("Separation");
    buttonSeparation.position(410,55);
    buttonSeparation.mousePressed(separation);


    // Function chaotic swarm
    buttonSwarm = createButton("Chaotic Seek Swarm");
    buttonSwarm.position(510,55);
    buttonSwarm.mousePressed(swarm);


    // Function Complete flock (separation, cohesion, alignment )
    buttonFlock = createButton("Flock");
    buttonFlock.position(670,55);
    buttonFlock.mousePressed(completeFlock);

    buttonReset = createButton("Reset");
    buttonReset.position(750,40);
    buttonReset.mousePressed(reload);

}

function reload(){
    location.reload();
}

function resetCanvas() {
    createCanvas(640, 360);
    background(127);
}

function changeEllipse() {
    form = "ellipse";
    console.log(form);
}

function changeTriangle() {
    form = "triangle";
    console.log(form);
}



//  random walk
function randomWalker() {
    rW = !rW;
    walker = new Walker();
    if (rW === true) {
        randomWalk = setInterval(function () {
            walker.step();
            walker.render();
        }, 10);
    }
    if (rW === false) {
        clearInterval(randomWalk);
        resetCanvas();
    }
}

//  seek and land
function seekLand() {
    sL = !sL;
    for (let i = 0; i < 1; i++) { //Number of vehicles
        vehicles.push(new Vehicle(random(width), random(height)));
    }
    if (sL === true) {
        seekland = setInterval(function () {
            background(127); // Para no ver el camino del seeker
            let mouse = createVector(mouseX, mouseY);
            for (let v of vehicles) {
                v.arrive(mouse);
                v.borders();
                v.update();
                v.display();
            }
        }, 10);
    }
    if (sL === false) {
        clearInterval(seekland);
        resetCanvas();
    }
}

// separation and flock
function separation() {
    sF = !sF;
    for (let j = 0; j < 25; j++) {
        vehicles.push(new Vehicle(random(width), random(height)));
    }
    if (sF === true) {
        sepflock = setInterval(function () {
            background(127);
            for (let v of vehicles) {
                v.separate(vehicles);
                v.update();
                v.borders();
                v.display();
            }
        }, 10);
    }
    if (sF === false) {
        clearInterval(sepflock);
        resetCanvas();
    }
}

// swarm simulation
function swarm() {
    sW = !sW;
    for (var i = 0; i < 75; i++) {
        movers[i] = new Mover();
    }
    if (sW === true) {
        swarmSimulation = setInterval(function () {
            background(127);
            for (let i = 0; i < movers.length; i++) {
                movers[i].update();
                movers[i].display();
                movers[i].borders();
            }
        }, 10);
    }
    if (sW === false) {
        clearInterval(swarmSimulation);
        resetCanvas();
    }
}

// Complete flock (Separation, Cohesion, Alignment)
function completeFlock() {
    fl = !fl;
    flock = new Flock();
    for (let i = 0; i < 60; i++) {// Add an initial set of boids into the system
        let b = new Boid(width / 2, height / 2);
        flock.addBoid(b);
    }
    if (fl === true) {
        flockInterval = setInterval(function () {
            background(127);
            flock.run();
        }, 10);
    }
    if (fl === false) {
        clearInterval(flockInterval);
        resetCanvas();
    }
}

function mouseDragged() {
    if(sF === true){
        vehicles.push(new Vehicle(random(width), random(height)));
    }
    if(sW === true){
        movers.push(new Mover((random(width), random(height))));
    }
    if(fl === true){
        flock.addBoid(new Boid(mouseX, mouseY));
    }


}




// --------------------- RANDOM WALK -----------------

class Walker {
    constructor() { //Posicion inicial w & h del canvas
        this.x = width / 2;
        this.y = height / 2;
    }

    render() {
        stroke(0); // Dibuja una line de color (0) (negro)
        point(this.x, this.y); //Iniciar la posicion inicial
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



// ----------------------- SEEK AND LAND ---------------------

class Vehicle {
    constructor(x, y) {
        // All the usual stuff
        this.position = createVector(x, y);
        this.r = 10;
        this.maxspeed = 3; // Maximum speed
        this.maxforce = 1; // Maximum steering force //Cuanto mas alto mas se detiene la bola
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(0, 0);

    }


    applyForce(force) {
        // We could add mass here if we want A = F / M
        this.acceleration.add(force);
    }

    // A method that calculates a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
    arrive(target) {
        let desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
        let d = desired.mag();
        // Scale with arbitrary damping within 100 pixels
        if (d < 100) {
            var m = map(d, 0, 100, 0, this.maxspeed);
            desired.setMag(m);
        } else {
            desired.setMag(this.maxspeed);
        }

        // Steering = Desired minus Velocity
        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce);  // Limit to maximum steering force
        this.applyForce(steer);
    }


    //Separation method
    separate(vehicles) {
        let desiredseparation = this.r * 3;
        let sum = createVector();
        let count = 0;
        // For every boid in the system, check if it's too close
        for (let i = 0; i < vehicles.length; i++) {
            let d = p5.Vector.dist(this.position, vehicles[i].position);
            // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
            if ((d > 0) && (d < desiredseparation)) {
                // Calculate vector pointing away from neighbor
                let diff = p5.Vector.sub(this.position, vehicles[i].position);
                diff.normalize();
                diff.div(d); // Weight by distance
                sum.add(diff);
                count++; // Keep track of how many
            }
        }
        // Average -- divide by how many
        if (count > 0) {
            sum.div(count);
            // Our desired vector is the average scaled to maximum speed
            sum.normalize();
            sum.mult(this.maxspeed);
            // Implement Reynolds: Steering = Desired - Velocity
            let steer = p5.Vector.sub(sum, this.velocity);
            steer.limit(this.maxforce);
            this.applyForce(steer);
        }
    }

    // Method to update location
    update() {
        // Update velocity
        this.velocity.add(this.acceleration);
        // Limit speed
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        // Reset accelertion to 0 each cycle
        this.acceleration.mult(0);
    }

    display() {
        if (form === "ellipse") {
            fill(51);
            stroke(200);
            strokeWeight(1);
            push();
            translate(this.position.x, this.position.y);
            ellipse(0, 0, this.r * 2, this.r * 2);
            pop();
        }
        if (form === "triangle") {
            // Draw a triangle rotated in the direction of velocity
            let theta = this.velocity.heading() + PI / 2;
            fill(51);
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

    // Wraparound
    borders() {
        if (this.position.x < -this.r) this.position.x = width + this.r;
        if (this.position.y < -this.r) this.position.y = height + this.r;
        if (this.position.x > width + this.r) this.position.x = -this.r;
        if (this.position.y > height + this.r) this.position.y = -this.r;
    }

}


// -------------------------- SWARM SIMULATION ----------------------------------

class Mover {
    constructor() {
        this.position = createVector(random(width), random(height));
        this.velocity = createVector();
        this.acceleration = createVector();
        this.topspeed = 5;
        this.r = 10;
    }

    update() {
        // Compute a vector that points from position to mouse
        var mouse = createVector(mouseX, mouseY);
        this.acceleration = p5.Vector.sub(mouse, this.position);
        // Set magnitude of acceleration
        this.acceleration.setMag(0.2);

        this.velocity.add(this.acceleration);
        this.velocity.limit(this.topspeed);
        this.position.add(this.velocity);
    }

    display() {
        if (form === "ellipse") {
            stroke(200);
            strokeWeight(1);
            fill(51);
            ellipse(this.position.x, this.position.y, this.r * 2, this.r * 2);
        }
        if (form === "triangle") {
            // Draw a triangle rotated in the direction of velocity
            let theta = this.velocity.heading() + PI / 2;
            fill(51);
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

    borders() {
        if (this.position.x < -this.r) this.position.x = width + this.r;
        if (this.position.y < -this.r) this.position.y = height + this.r;
        if (this.position.x > width + this.r) this.position.x = -this.r;
        if (this.position.y > height + this.r) this.position.y = -this.r;
    }

}





// -------------- FLOCK SEPARATION, COHESION AND ALIGNMENT --------


class Flock {

    constructor() {
        // An array for all the boids
        this.boids = []; // Initialize the array
    }

    run() {
        for (let boid of this.boids) {
            boid.run(this.boids); // Passing the entire list of boids to each boid individually
        }
    }

    addBoid(b) {
        this.boids.push(b);
    }
}

// Boid class
// Methods for Separation, Cohesion, Alignment added
class Boid {
    constructor(x, y) {
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(random(-1, 1), random(-1, 1));
        this.position = createVector(x, y);
        this.r = 5.0;
        this.maxspeed = 3; // Maximum speed
        this.maxforce = 0.05; // Maximum steering force
    }

    run(boids) {
        this.flock(boids);
        this.update();
        this.borders();
        this.render();
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    // We accumulate a new acceleration each time based on three rules
    flock(boids) {
        let sep = this.separate(boids); // Separation
        let ali = this.align(boids); // Alignment
        let coh = this.cohesion(boids); // Cohesion
        // Arbitrarily weight these forces
        sep.mult(1.5);
        ali.mult(1.0);
        coh.mult(1.0);
        // Add the force vectors to acceleration
        this.applyForce(sep);
        this.applyForce(ali);
        this.applyForce(coh);
    }

    // Method to update location
    update() {
        // Update velocity
        this.velocity.add(this.acceleration);
        // Limit speed
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        // Reset accelertion to 0 each cycle
        this.acceleration.mult(0);
    }

    // A method that calculates and applies a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
    seek(target) {
        let desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
        // Normalize desired and scale to maximum speed
        desired.normalize();
        desired.mult(this.maxspeed);
        // Steering = Desired minus Velocity
        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce); // Limit to maximum steering force
        return steer;
    }

    render() {
        if (form === "ellipse") {
            stroke(200);
            strokeWeight(1);
            fill(51);
            ellipse(this.position.x, this.position.y, this.r * 2, this.r * 2);
        }
        if (form === "triangle") {
            // Draw a triangle rotated in the direction of velocity
            let theta = this.velocity.heading() + radians(90);
            fill(51);
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

    // Wraparound
    borders() {
        if (this.position.x < -this.r) this.position.x = width + this.r;
        if (this.position.y < -this.r) this.position.y = height + this.r;
        if (this.position.x > width + this.r) this.position.x = -this.r;
        if (this.position.y > height + this.r) this.position.y = -this.r;
    }

    // Separation
    // Method checks for nearby boids and steers away
    separate(boids) {
        let desiredseparation = 25.0;
        let steer = createVector(0, 0);
        let count = 0;
        // For every boid in the system, check if it's too close
        for (let i = 0; i < boids.length; i++) {
            let d = p5.Vector.dist(this.position, boids[i].position);
            // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
            if ((d > 0) && (d < desiredseparation)) {
                // Calculate vector pointing away from neighbor
                let diff = p5.Vector.sub(this.position, boids[i].position);
                diff.normalize();
                diff.div(d); // Weight by distance
                steer.add(diff);
                count++; // Keep track of how many
            }
        }
        // Average -- divide by how many
        if (count > 0) {
            steer.div(count);
        }

        // As long as the vector is greater than 0
        if (steer.mag() > 0) {
            // Implement Reynolds: Steering = Desired - Velocity
            steer.normalize();
            steer.mult(this.maxspeed);
            steer.sub(this.velocity);
            steer.limit(this.maxforce);
        }
        return steer;
    }

    // Alignment
    // For every nearby boid in the system, calculate the average velocity
    align(boids) {
        let neighbordist = 50;
        let sum = createVector(0, 0);
        let count = 0;
        for (let i = 0; i < boids.length; i++) {
            let d = p5.Vector.dist(this.position, boids[i].position);
            if ((d > 0) && (d < neighbordist)) {
                sum.add(boids[i].velocity);
                count++;
            }
        }
        if (count > 0) {
            sum.div(count);
            sum.normalize();
            sum.mult(this.maxspeed);
            let steer = p5.Vector.sub(sum, this.velocity);
            steer.limit(this.maxforce);
            return steer;
        } else {
            return createVector(0, 0);
        }
    }

    // Cohesion
    // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
    cohesion(boids) {
        let neighbordist = 50;
        let sum = createVector(0, 0); // Start with empty vector to accumulate all locations
        let count = 0;
        for (let i = 0; i < boids.length; i++) {
            let d = p5.Vector.dist(this.position, boids[i].position);
            if ((d > 0) && (d < neighbordist)) {
                sum.add(boids[i].position); // Add location
                count++;
            }
        }
        if (count > 0) {
            sum.div(count);
            return this.seek(sum); // Steer towards the location
        } else {
            return createVector(0, 0);
        }
    }
}