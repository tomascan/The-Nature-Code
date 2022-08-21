let movers = [];
let form = "ellipse";

function setup() {
  createCanvas(640,360);
  background(127);


  for (var i = 0; i < 20; i++) {
     movers[i] = new Mover();
  }

  ellipseForm = createButton("Ellipse");
  ellipseForm.mousePressed(ellipse);


  triangleForm = createButton("Triangle");
  triangleForm.mousePressed(triangle);

}

function ellipse(){
  console.log("ok");
  form = "ellipse";
  console.log(form);
  swarm();
}

function triangle(){
  console.log("kk");
  form = "triangle";
  console.log(form);
  swarm();
}

function swarm() {
  t = setInterval(function () {
    background(51);
    for (let i = 0; i < movers.length; i++) {
      movers[i].update();
      movers[i].display();
    }
  }, 10);
}