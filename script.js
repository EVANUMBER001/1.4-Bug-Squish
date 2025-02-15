let bugs = [];
let squishedCount = 0;
let timer = 30;
let bugSpriteSheet;
let squishedImage;
let gameActive = true;

function preload() {
    bugSpriteSheet = loadImage('assets/bugwalkingmane.png'); // Load the sprite sheet with 3 frames
    squishedImage = loadImage('assets/squashedbuggie.png'); // You can use your squished image here
}

function setup() {
    createCanvas(600, 400);
    for (let i = 0; i < 5; i++) {
        bugs.push(new Bug(random(width), random(height)));
    }
    setInterval(() => { if (timer > 0) timer--; }, 1000);
}

function draw() {
    background(220);
    
    if (timer <= 0) {
        gameActive = false;
        textSize(32);
        fill(0);
        textAlign(CENTER, CENTER);
        text("Game Over!", width / 2, height / 2);
        text(`Score: ${squishedCount}`, width / 2, height / 2 + 40);
        return;
    }
    
    for (let bug of bugs) {
        bug.move();
        bug.display();
    }
    
    fill(0);
    textSize(20);
    text(`Time: ${timer}`, 10, 20);
    text(`Squished: ${squishedCount}`, 10, 40);
}

function mousePressed() {
    for (let i = bugs.length - 1; i >= 0; i--) {
        if (bugs[i].isClicked(mouseX, mouseY)) {
            bugs.splice(i, 1);
            squishedCount++;
            for (let bug of bugs) {
                bug.speedUp();
            }
            bugs.push(new Bug(random(width), random(height))); // Add a new bug to replace it
            break;
        }
    }
}

class Bug {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 40;
        this.speed = 1;
        this.direction = p5.Vector.random2D();
        this.spriteFrame = 0; // Start with the first frame
    }
    
    move() {
        this.x += this.direction.x * this.speed;
        this.y += this.direction.y * this.speed;
        
        if (this.x < 0 || this.x > width) this.direction.x *= -1;
        if (this.y < 0 || this.y > height) this.direction.y *= -1;
        
        this.spriteFrame = (this.spriteFrame + 0.1) % 3; // Loop through 3 frames (0, 1, 2)
    }
    
    display() {
        push();
        translate(this.x, this.y);
        rotate(this.direction.heading());
        // Draw the current frame from the sprite sheet
        image(bugSpriteSheet, -this.size / 2, -this.size / 2, this.size, this.size, floor(this.spriteFrame) * 40, 0, 40, 40);
        pop();
    }
    
    isClicked(mx, my) {
        return dist(mx, my, this.x, this.y) < this.size / 2;
    }
    
    speedUp() {
        this.speed *= 1.1;
    }
}
