export default class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = (Math.random() - 0.5) * 200;
        this.velocityY = -Math.random() * 150 - 50;
        this.life = 1.0;
        this.decay = Math.random() * 2 + 2;
        this.size = Math.random() * 3 + 2;

        this.color = Math.random() < 0.5 ? "crimson" : "yellow";
    }

    update(dt) {
        this.x += this.velocityX * dt;
        this.y += this.velocityY * dt;
        this.velocityY += 400 * dt;
        this.life -= this.decay * dt;
    }

    render(context) {
        context.save();
        context.globalAlpha = this.life;
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.size, this.size);
        context.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}
