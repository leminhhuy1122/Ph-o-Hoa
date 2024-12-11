const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const launchSound = document.getElementById("launchSound");
const explosionSound = document.getElementById("explosionSound");

// Lớp đối tượng pháo hoa
class Firework {
  constructor(x, y, colors) {
    this.x = x; // Tọa độ x của pháo hoa
    this.y = y; // Tọa độ y của pháo hoa
    this.colors = colors; // Mảng màu sắc của pháo hoa
    this.particles = []; // Các hạt sau khi pháo hoa nổ
    this.exploded = false; // Trạng thái nổ của pháo hoa
    this.launchSpeed = Math.random() * 3 + 3; // Tốc độ bay lên của pháo hoa
  }

  // Hàm xử lý pháo hoa bay lên
  launch() {
    this.y -= this.launchSpeed;
    if (this.y < canvas.height / 2 + Math.random() * 1 - 10) {
      this.explode(); // Nổ khi đạt độ cao nhất định
    }
  }

  // Hàm xử lý pháo hoa nổ
  explode() {
    if (!this.exploded) {
      explosionSound.currentTime = 0;
      explosionSound.play(); // Âm thanh nổ pháo hoa
      for (let layer = 0; layer < 3; layer++) {
        // Nổ nhiều lớp
        for (let i = 0; i < 50; i++) {
          const angle = (Math.PI * 2 * i) / 50; // Góc phát nổ
          const speed = (Math.random() * 0.5 + 0.5) * 2; // Tốc độ các hạt
          const radius = 100; // Bán kính phạm vi nổ tối đa là 60px
          this.particles.push({
            x: this.x,
            y: this.y,
            dx: Math.cos(angle) * speed, // Hướng di chuyển x của hạt
            dy: Math.sin(angle) * speed, // Hướng di chuyển y của hạt
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            life: Math.random() * 100 + 100, // Thời gian sống của hạt
            size: Math.random() * 2.5 + 1, // Kích thước của hạt
            maxRadius: radius,
          });
        }
      }
      this.exploded = true;
    }
  }

  // Vẽ pháo hoa và các hạt
  draw() {
    if (!this.exploded) {
      ctx.fillStyle = "white"; // Màu trắng cho pháo hoa khi bay lên
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      this.particles.forEach((p, i) => {
        p.x += p.dx;
        p.y += p.dy;
        p.life -= 1;
        ctx.fillStyle = p.color; // Màu sắc của các hạt
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        if (p.life <= 0 || Math.sqrt(p.dx ** 2 + p.dy ** 2) > p.maxRadius) {
          this.particles.splice(i, 1); // Xóa hạt khi hết thời gian sống hoặc vượt bán kính
        }
      });
    }
  }

  // Kiểm tra pháo hoa đã kết thúc hay chưa
  isDone() {
    return this.exploded && this.particles.length === 0;
  }
}

const fireworks = []; // Mảng chứa các pháo hoa
const colors = ["#FBDA61", "#FF2525", "#FFE53B"]; // Các màu sắc cho pháo hoa

// Hàm tạo pháo hoa mới
function spawnFirework() {
  const x = Math.random() * canvas.width; // Tọa độ x ngẫu nhiên
  const y = canvas.height; // Tọa độ y tại đáy màn hình
  launchSound.currentTime = 0;
  launchSound.play(); // Âm thanh bắn pháo hoa
  fireworks.push(new Firework(x, y, colors));
}

// Hàm xử lý hoạt hình và vẽ liên tục
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas
  fireworks.forEach((fw, i) => {
    if (!fw.isDone()) {
      if (!fw.exploded) fw.launch(); // Nếu chưa nổ thì tiếp tục bay lên
      fw.draw(); // Vẽ pháo hoa hoặc hạt nổ
    } else {
      fireworks.splice(i, 1); // Xóa pháo hoa khi đã kết thúc
    }
  });

  while (fireworks.length < 7) {
    // Số lượng pháo hoa duy trì ở mức 7-8
    spawnFirework();
  }

  requestAnimationFrame(animate); // Lặp lại hoạt hình
}

// Thay đổi kích thước canvas khi thay đổi kích thước cửa sổ
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

animate(); // Bắt đầu hoạt hình
