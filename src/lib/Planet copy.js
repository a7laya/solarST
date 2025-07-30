/**
 * @function 构建一个行星类
 * @param {object} config 配置参数
 * @param {number} x 行星围绕的中心点x坐标
 * @param {number} y 行星围绕的中心点y坐标
 * @param {number} r 行星的半径
 * @param {string | object} img 行星的图片或颜色
 * @param {number} orbitalR 行星到中心点的距离 轨道半径
 * @param {number} speed 行星绕中心点的速度
 * @param {number} angle 行星绕中心点的初始角度
 * @returns {object} 行星对象
*/

class Planet {
    constructor(config,x,y,r,img,orbitalR,speed) {
        this.config = config || {};
        this.orbitalRate = this.config.orbitalRate || 0.01;
        this.systemRate  = this.config.systemRate  || 1;
        this.speedRate  = this.config.speedRate    || 0;
        this.planetRate = this.config.planetRate   || 10;
        this.YRate      = this.config.YRate   || 1;
        this.showOrbit  = this.config.showOrbit     || 1;
        this.x = x || 0;
        this.y = y || 0;
        if(orbitalR>0){ // 设置太阳不受行星显示比例的影响
            this.r = r * this.systemRate * this.planetRate || 10;
        } else {
            this.r = r * this.systemRate || 10;
        }
        this.img    = img || 'white';
        this.orbitalR = orbitalR * this.systemRate * this.orbitalRate || 0;
        this.speed    = speed * this.speedRate || 0;
        this.sx = this.x + this.orbitalR; // 行星的x坐标
        this.sy = this.y + 0; // 行星的y坐标
    }
    draw(ctx) {
        ctx.save();
        // ctx.translate(this.x, this.y);
        // ctx.rotate(this.speed * performance.now() * Math.PI / 180000);
        // 绘制轨道 

        // 绘制轨道
        if(this.showOrbit){
            // console.log(this.orbitalR);
            if(this.orbitalR > 0) {
                drawOrbit(ctx, this.x, this.y, this.orbitalR, this.YRate, 30*this.systemRate, 'rgba(255, 255, 255, 0.1)');

                // ctx.save();
                // ctx.beginPath();
                // ctx.strokeStyle = 'rgba(255,255,255,0.3)';

                // // ctx.ellipse(this.x, this.y, this.orbitalR, this.orbitalR/2, 0, 0, Math.PI*2, true)
                // ctx.arc(this.x, this.y, this.orbitalR, 0, Math.PI * 2);
                // ctx.stroke();
                // ctx.closePath();
                // ctx.restore();
            }
        }

        // 绘制行星
        // 如果传进来的是个img的话，就使用img绘制一个圆
        if(typeof this.img === 'string') {
            ctx.beginPath();
            ctx.fillStyle = this.img;
            ctx.arc(this.orbitalR, 0, this.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        } else {
            // console.log(this.sx,this.sy);
            let angle = this.speed * performance.now() * Math.PI / 180000;
            // 如果传进来的是个图片的话，就使用图片绘制一个圆
            this.sx = this.x + this.orbitalR * Math.cos(angle);
            this.sy = this.y + this.orbitalR * this.YRate * Math.sin(angle); // 0.5是轨道的倾斜度
            if(this.orbitalR>0){ // 设置行星的视觉大小
                // this.r  = this.r * ( Math.cos(angle-Math.PI/2)*(1-this.YRate) + 1);
                this.r  = this.r * ( Math.cos(angle-Math.PI/2)*(1-this.YRate) + 1);
            }

            // 土星因为有土星环所以图片是一个矩形
            if(this.img.width > this.img.height) {
                // 用这个会变形 ctx.drawImage(this.img, this.orbitalR - this.r, 0, this.r * 2, this.r * 2); 
                // 用this.img.height的一半作为半径
                this.r1  = this.img.width/this.img.height*this.r;
                this.r2  = this.r;
                ctx.drawImage(this.img,  this.sx-this.r1, this.sy-this.r,  this.r1 * 2, this.r2 * 2);
            } else {
                // console.log(this.img.width,this.img.height);
                ctx.drawImage(this.img,  this.sx-this.r, this.sy-this.r, this.r * 2, this.r * 2);
            }
            ctx.restore();
        }
        return {r:this.r, sx: this.sx, sy: this.sy}
    }
    // update() {
    //     // 如果轨道半径为0，则不更新坐标
    //     // if(this.orbitalR === 0) return;
    //     // 更新行星的坐标
    //     this.sx = this.x + this.orbitalR * Math.cos(this.speed * performance.now() * Math.PI / 1800);
    //     this.sy = this.y + this.orbitalR * Math.sin(this.speed * performance.now() * Math.PI / 1800);
    // }
}

// 绘制轨道 YRate 轨道的倾斜度 targetR 轨道围绕的目标半径 color 轨道的颜色 
function drawOrbit(ctx, x, y, r, YRate = 0.5, targetR = 0, color = 'rgba(255,255,255,0.3)') {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.linewidth = 0.01;
    // 绘制轨道
    // ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise)
    // x, y: 圆心的坐标 r: 半径  YRate: y轴的倾斜度 targetR: 轨道围绕的目标半径 color: 轨道的颜色 
    // 如果目标半径大于当前轨道短轴且小于长轴，则会遮住轨道上半部

    if(targetR > r * YRate && targetR < r) {
        // console.log(r * YRate, targetR);

        let theta = calculateAngles(r, r * YRate, targetR);
        // console.log(theta);
        ctx.ellipse(x, y, r, r * YRate, 0, -theta*3, Math.PI+theta*3, false); // 绘制椭圆
    } else if(targetR < r * YRate) {
        ctx.ellipse(x, y, r, r * YRate, 0, 0, Math.PI * 2, true); // 绘制椭圆
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}


function calculateAngles(a, b, r) {
    if (r <= b || r >= a) {
        throw new Error("半径 r 必须满足 b < r < a");
    }

    // 第一象限的交点坐标
    const x = a * Math.sqrt((r * r - b * b) / (a * a - b * b));
    const y = b * Math.sqrt((a * a - r * r) / (a * a - b * b));

    // 计算第一象限的夹角（弧度）
    const theta = Math.atan2(y, x);

    // 四个对称夹角（弧度）
    // const anglesRadians = [
    //     theta,          // 第一象限
    //     -theta,         // 第四象限
    //     Math.PI - theta, // 第二象限
    //     Math.PI + theta  // 第三象限
    // ];

    // 转换为角度（可选）
    // const anglesDegrees = anglesRadians.map(rad => rad * (180 / Math.PI));

    // return { anglesRadians, anglesDegrees };
    return theta;
}


export default Planet;