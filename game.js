const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// === Enemy ===
class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.speed = 1;
    this.hp = 3;
  }

  update() {
    this.x += this.speed;
  }

  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.size, this.size);

    // 체력 표시
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.fillText(this.hp, this.x + 5, this.y + 15);
  }
}

// === Tower ===
class Tower {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.range = 150;
    this.cooldown = 0;
  }

  update(enemies) {
    if (this.cooldown > 0) {
      this.cooldown--;
      return;
    }

    // 범위 안에 있는 첫 번째 적 찾아서 쏘기
    for (let enemy of enemies) {
      const dx = enemy.x - this.x;
      const dy = enemy.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.range) {
        bullets.push(new Bullet(this.x, this.y, dx, dy, enemy));
        this.cooldown = 30; // 쿨타임
        break;
      }
    }
  }

  draw() {
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 20, 0, Math.PI * 2);
    ctx.fill();
  }
}

// === Bullet ===
class Bullet {
  constructor(x, y, dx, dy, target) {
    const angle = Math.atan2(dy, dx);
    const speed = 5;
    this.x = x;
    this.y = y;
    this.dx = Math.cos(angle) * speed;
    this.dy = Math.sin(angle) * speed;
    this.size = 5;
    this.target = target;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    // 타겟 적과 충돌 체크
    const dist = Math.hypot(this.x - this.target.x, this.y - this.target.y);
    if (dist < this.target.size / 2) {
      this.target.hp--;
      this.destroy = true;
    }
  }

  draw() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// === 전역 변수들 ===
const enemies = [];
const bullets = [];
const tower = new Tower(400, 300);

// === 주기적으로 적 생성 ===
setInterval(() => {
  enemies.push(new Enemy(0, 300));
}, 2000); // 2초마다 한 마리

// === Game Loop ===
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 적 업데이트 & 그리기
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    e.update();
    e.draw();

    if (e.hp <= 0) {
      enemies.splice(i, 1); // 죽은 적 제거
    }
  }

  // 타워 업데이트 & 그리기
  tower.update(enemies);
  tower.draw();

  // 총알들 업데이트 & 그리기
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.update();
    b.draw();

    if (b.destroy) {
      bullets.splice(i, 1);
    }
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
