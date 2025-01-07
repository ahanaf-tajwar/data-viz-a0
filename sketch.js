let hourStars = [];
let secondStars = [];
let lastMinute = -1;

function setup() {
  createCanvas(800, 600);
  
  // Initialize hour stars in a circular pattern
  for (let i = 0; i < 12; i++) {
    let angle = map(i, 0, 12, 0, TWO_PI) - PI/2; // Start from top (12 o'clock)
    hourStars.push({
      x: width/2 + cos(angle) * 150,
      y: height/2 + sin(angle) * 150,
      size: 8  // Larger size for hour stars
    });
  }
  
  // Initialize twinkling stars for seconds
  for (let i = 0; i < 60; i++) {
    secondStars.push({
      x: random(width),
      y: random(height),
      brightness: random(100, 200),
      twinkleSpeed: random(0.02, 0.08),
      size: random(1.5, 2.5)
    });
  }
}

function draw() {
  background(10, 5, 30); // Dark night sky
  
  let h = hour() % 12;
  let m = minute();
  let s = second();
  
  // Log minutes to console
  if (m !== lastMinute) {
    console.log("Current minute:", m);
    lastMinute = m;
  }
  
  // Draw seconds as twinkling stars
  drawSecondStars(s);
  
  // Draw minute comet
  drawMinuteComet(m);
  
  // Draw hour constellation
  drawHourConstellation(h);
}

function drawHourConstellation(h) {
  // Draw stars and connect them up to current hour
  for (let i = 0; i < 12; i++) {
    let star = hourStars[i];
    
    // Draw connecting lines up to current hour
    if (i < h && i + 1 < 12) {
      stroke(255, 215, 0, 100); // Golden connections, semi-transparent
      line(star.x, star.y, hourStars[i + 1].x, hourStars[i + 1].y);
    }
    
    // Draw radiating lines for each star
    if (i <= h) {
      drawStarRays(star.x, star.y, star.size * 1.5, i <= h ? 255 : 100);
    }
    
    // Draw the star
    noStroke();
    // Active hours are bright gold, inactive are dimmer
    let starColor = i <= h ? color(255, 215, 0) : color(255, 215, 0, 100);
    fill(starColor);
    circle(star.x, star.y, star.size);
    
    // Add glow effect for active hours
    if (i <= h) {
      drawGlow(star.x, star.y, star.size * 2, color(255, 215, 0, 50));
    }
  }
}

function drawStarRays(x, y, size, alpha) {
  // Draw 8 radiating lines from the star center
  stroke(255, 215, 0, alpha);
  for (let angle = 0; angle < TWO_PI; angle += TWO_PI/8) {
    let rayLength = size * (1 + sin(frameCount * 0.05) * 0.2); // Subtle pulsing
    let x2 = x + cos(angle) * rayLength;
    let y2 = y + sin(angle) * rayLength;
    line(x, y, x2, y2);
  }
}

function drawMinuteComet(m) {
  // Calculate comet position
  let angle = map(m, 0, 60, 0, TWO_PI) - PI/2; // Start from top
  let cometX = width/2 + cos(angle) * 250;
  let cometY = height/2 + sin(angle) * 200;
  
  // Draw comet tail
  noFill();
  let trailLength = 5; // Fixed trail length
  
  for (let i = 0; i < trailLength; i++) {
    let tailAngle = angle - 0.1 * i;
    let tailX = width/2 + cos(tailAngle) * 250;
    let tailY = height/2 + sin(tailAngle) * 200;
    stroke(255, 255, 200, 150 - (i * 10));
    line(tailX, tailY, cometX, cometY);
  }
  
  // Draw comet head with glow
  noStroke();
  drawGlow(cometX, cometY, 16, color(255, 255, 200, 80));
  fill(255, 255, 200);
  circle(cometX, cometY, 8);
}

function drawSecondStars(s) {
  // Update and draw all background stars
  for (let i = 0; i < secondStars.length; i++) {
    let star = secondStars[i];
    
    // Make stars twinkle
    star.brightness = 100 + sin(frameCount * star.twinkleSpeed) * 50;
    
    // Stars up to current second are brighter
    let finalBrightness = i <= s ? star.brightness : star.brightness * 0.3;
    
    // Draw star
    noStroke();
    fill(finalBrightness);
    circle(star.x, star.y, star.size);
  }
}

function drawGlow(x, y, size, glowColor) {
  // Draw multiple circles with decreasing opacity for glow effect
  for (let i = 3; i >= 0; i--) {
    fill(red(glowColor), green(glowColor), blue(glowColor), alpha(glowColor) / (i + 1));
    circle(x, y, size + i * 4);
  }
}