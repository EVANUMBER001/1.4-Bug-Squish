let bugs = [];
let squishedCount = 0;
let timer = 30;
let bugSpriteSheet;
let squishedImage;
let gameActive = true;

function preload() {
    // Load the sprite sheet and squished image
    bugSpriteSheet = loadImage('assets/bugwalkingmane.png', () => {
        console.log('bugwalkingmane loaded'); // Confirm that the bug walking animation is loaded
    });
    squishedImage = loadImage('assets/squashedbuggie.png', () => {
        console.log('squashedbuggie loaded'); // Confirm that the squished image is loaded
    });
}

function setup() {
    createCanvas(600, 400);
    
    // Create initial bugs
    for (let i = 0; i < 5; i++) {
        bugs.push(new Bug(random(width), random(height)));
    }
    
    // Countdown timer
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
    
    // Move and display each bug
    for (let bug of bugs) {
        bug.move();
        bug.display();
    }
    
    // Display timer and squished count
    fill(0);
    textSize(20);
    text(`Time: ${timer}`, 10, 20);
    text(`Squished: ${squishedCount}`, 10, 40);
}

function mousePressed() {
    // Check if the user clicked a bug
    for (let i = bugs.length - 1; i >= 0; i--) {
        if (bugs[i].isClicked(mouseX, mouseY)) {
            bugs.splice(i, 1); // Remove the squished bug
            squishedCount++; // Increment score
            for (let bug of bugs) {
                bug.speedUp(); // Speed up remaining bugs
            }
            bugs.push(new Bug(random(width), random(height))); // Add a new bug to replace the squished one
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
        
        // Reverse direction if hitting the edges of the canvas
        if (this.x < 0 || this.x > width) this.direction.x *= -1;
        if (this.y < 0 || this.y > height) this.direction.y *= -1;
        
        // Animate through 3 frames
        this.spriteFrame = (this.spriteFrame + 0.1) % 3; 
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
        // Check if the mouse click is within the bug's area
        return dist(mx, my, this.x, this.y) < this.size / 2;
    }
    
    speedUp() {
        // Speed up the bug after each squish
        this.speed *= 1.1;
    }
}
