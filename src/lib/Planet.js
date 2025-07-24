/**
 * @function 构建一个行星类
 * @param {number} x 行星围绕的中心点x坐标
 * @param {number} y 行星围绕的中心点y坐标
 * @param {number} r 行星的半径
 * @param {string} color 行星的颜色
 * @param {number} orbitalR 行星到中心点的距离 轨道半径
 * @param {number} speed 行星绕中心点的速度
 * @param {number} angle 行星绕中心点的初始角度
 * @param {boolean} showOrbit 是否显示轨道
 * @returns {object} 行星对象
*/

class Planet {
    constructor(x,y,r,color,orbitalR,speed,showOrbit) {
        this.x = x || 0;
        this.y = y || 0;
        this.r = r || 10;
        this.color = color || 'white';
        this.orbitalR = orbitalR || 0;
        this.speed = speed || 0;
        this.showOrbit = showOrbit || false;
        this.sx = this.x + this.orbitalR; // 行星的x坐标
        this.sy = this.y + 0; // 行星的y坐标
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.speed * performance.now() * Math.PI / 180000);

        // 绘制轨道
        if(this.showOrbit){
            // console.log(this.showOrbit);
            if(this.orbitalR > 0) {
                ctx.save();
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                ctx.arc(0, 0, this.orbitalR, 0, Math.PI * 2);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
        }

        // 绘制行星
        // 如果传进来的是个color的话，就使用color绘制一个圆
        if(typeof this.color === 'string') {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.orbitalR, 0, this.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        } else {
            // 如果传进来的是个图片的话，就使用图片绘制一个圆
            // 土星因为有土星环所以图片是一个矩形
            if(this.color.width > this.color.height) {
                // 用这个会变形 ctx.drawImage(this.color, this.orbitalR - this.r, 0, this.r * 2, this.r * 2); 
                // 用this.color.height的一半作为半径
                this.r1  = this.color.width/this.color.height*this.r;
                this.r2  = this.r;
                ctx.drawImage(this.color, this.orbitalR - this.r1, 0,  this.r1 * 2, this.r2 * 2);
            } else {
                // console.log(this.color.width,this.color.height);
                ctx.drawImage(this.color, this.orbitalR - this.r, 0, this.r * 2, this.r * 2);
            }
            ctx.restore();
        }

        this.update();
    }
    update() {
        // 如果轨道半径为0，则不更新坐标
        // if(this.orbitalR === 0) return;
        // 更新行星的坐标
        this.sx = this.x + this.orbitalR * Math.cos(this.speed * performance.now() * Math.PI / 180000);
        this.sy = this.y + this.orbitalR * Math.sin(this.speed * performance.now() * Math.PI / 180000) + this.r;
        
    }
}

export default Planet;