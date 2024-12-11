const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Firework {
  constructor(x, y, color, particles = 100) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.particles = particles;
    this.explosions = [];

    for (let i = 0; i < this.particles; i++) {
      const angle = ((Math.PI * 2) / this.particles) * i;
      const speed = Math.random() * 3 + 2;
      this.explosions.push({
        x: this.x,
        y: this.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
      });
    }
  }

  update() {
    this.explosions.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.alpha -= 0.02;
    });
  }

  draw() {
    this.explosions.forEach((particle) => {
      if (particle.alpha > 0) {
        ctx.save();
        ctx.globalAlpha = particle.alpha;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
    });
  }
}

class Rocket {
  constructor(x, y, targetY, color) {
    this.x = x;
    this.y = y;
    this.targetY = targetY;
    this.color = color;
    this.speed = Math.random() * 2 + 4;
    this.alpha = 1;
  }

  update() {
    this.y -= this.speed;
    if (this.y <= this.targetY) {
      createFirework(this.x, this.y);
      this.alpha = 0;
    }
  }

  draw() {
    if (this.alpha > 0) {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }
  }
}

const fireworks = [];
const rockets = [];

function createFirework(x, y) {
  const colors = [
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];
  fireworks.push(new Firework(x, y, color));
}

function createRocket() {
  const x = Math.random() * canvas.width;
  const targetY = (Math.random() * canvas.height) / 2;
  const colors = [
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];
  rockets.push(new Rocket(x, canvas.height, targetY, color));
}

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  rockets.forEach((rocket, index) => {
    rocket.update();
    rocket.draw();
    if (rocket.alpha <= 0) {
      rockets.splice(index, 1);
    }
  });

  fireworks.forEach((firework, index) => {
    firework.update();
    firework.draw();
    if (firework.explosions.every((p) => p.alpha <= 0)) {
      fireworks.splice(index, 1);
    }
  });

  if (Math.random() < 0.05) {
    createRocket();
  }

  requestAnimationFrame(loop);
}

canvas.addEventListener("click", (e) => {
  createFirework(e.clientX, e.clientY);
});

loop();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
