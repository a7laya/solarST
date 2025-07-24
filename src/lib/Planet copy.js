/**
 * @function 构建一个行星类
 * @param {number} x 行星围绕的中心点x坐标
 * @param {number} y 行星围绕的中心点y坐标
 * @param {number} r 行星的半径
 * @param {string} color 行星的颜色
 * @param {number} distance 行星到中心点的距离
 * @param {number} speed 行星绕中心点的速度
 * @returns {object} 行星对象
*/

class Planet {
    constructor(x,y,r,color,distance,speed) {
        this.x = x || 0;
        this.y = y || 0;
        this.r = r || 10;
        this.color = color || 'white';
        this.distance = distance || 0;
        this.angle = 0; // 行星绕中心点的初始角度
        this.speed = speed || 0;
        this.sx = this.x + this.distance; // 行星的x坐标
        this.sy = this.y + 0; // 行星的y坐标
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.distance, 0, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        this.update();
    }
    update() {
        this.sx = this.x + this.distance * Math.cos(this.speed);
        this.sy = this.y + this.distance * Math.sin(this.speed);
        this.angle += this.speed;
    }
}

export default Planet;