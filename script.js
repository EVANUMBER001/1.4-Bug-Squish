let bugs = [];
let squishedCount = 0;
let timer = 30;
let bugSpriteSheet;
let squishedImage;
let gameActive = true;

function preload() {
    bugSpriteSheet = loadImage('assets/thewalkingbug.png'); // Load the single frame image for walking
    squishedImage = loadImage('assets/squashedbuggie.png'); // Load the squished bug image
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
            bugs[i].squash(); // Squash the bug when clicked
            squishedCount++;
            for (let bug of bugs) {
                bug.speedUp(); // Speed up the remaining bugs
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
        this.size = 40; // Bug size (scaled to 40px)
        this.speed = 1;
        this.direction = p5.Vector.random2D(); // Random direction
        this.isSquashed = false; // Track if the bug is squashed
    }

    move() {
        // Move the bug in its current direction
        if (!this.isSquashed) {
            this.x += this.direction.x * this.speed;
            this.y += this.direction.y * this.speed;

            // Check for boundary collisions
            if (this.x < 0 || this.x > width) this.direction.x *= -1;
            if (this.y < 0 || this.y > height) this.direction.y *= -1;
        }
    }

    display() {
        push();
        translate(this.x, this.y);
        rotate(this.direction.heading());

        if (this.isSquashed) {
            // Display the squished bug image
            let squishedWidth = squishedImage.width;
            let squishedHeight = squishedImage.height;
            let scaleFactor = 40 / squishedWidth; // Resize to 40px

            image(squishedImage, -squishedWidth * scaleFactor / 2, -squishedHeight * scaleFactor / 2, squishedWidth * scaleFactor, squishedHeight * scaleFactor);
        } else {
            // Display the walking bug image
            let bugWidth = bugSpriteSheet.width;
            let bugHeight = bugSpriteSheet.height;
            let scaleFactor = 40 / bugWidth; // Resize to 40px

            image(bugSpriteSheet, -bugWidth * scaleFactor / 2, -bugHeight * scaleFactor / 2, bugWidth * scaleFactor, bugHeight * scaleFactor);
        }
        pop();
    }

    isClicked(mx, my) {
        return dist(mx, my, this.x, this.y) < this.size / 2; // Check if clicked on the bug
    }

    speedUp() {
        this.speed *= 1.1; // Speed up after each squish
    }

    squash() {
        this.isSquashed = true; // Change the state to "squashed"
    }
}
