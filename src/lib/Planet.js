import { calculateAngles } from '@/lib/tools.js';
class Planet {
    /**
     * @description 构建一个行星类
     * @param {object} planetDate 行星数据 
     * @param {object} targetDate 目标数据 
     * @param {object} config 配置参数
    */
    constructor(planetDate,targetDate,config) {
        
        // 配置参数
        this.config = config || {};
        this.ctx    = this.config.ctx   || null; 
        this.systemRate = this.config.systemRate || 1; // 行星系缩放比例
        this.rRate  = this.config.rRate || 1; // 行星半径缩放比例
        this.oRate  = this.config.oRate || 1; // 行星轨道半径缩放比例
        this.sRate  = this.config.sRate || 1; // 行星角速度缩放比例
        this.yRate  = this.config.yRate || 1; // 行星轨道y轴缩放比例  1-表示不缩放，轨道为正圆

        // 目标天体的数据
        this.targetDate = targetDate   || {};
        this.targetX    = targetDate.x || 0; // 行星围绕的中心点x坐标
        this.targetY    = targetDate.y || 0; // 行星围绕的中心点y坐标
        this.targetR    = targetDate.r || 0; // 目标天体的半径

        // 行星的数据
        this.planetDate = planetDate || {};
        this.name = planetDate.name || 'planet'; // 行星名称
        this.angle = this.speed * performance.now() * Math.PI / 18000;
        this.img = planetDate.img || 'white'; // 行星的图片或颜色 图片传进来的是一个数组 颜色传进来的是一个字符串
        this.r   = !planetDate.orbitalR ? planetDate.r * this.systemRate : planetDate.r * this.rRate * this.systemRate;  // 太阳系中心点为太阳，不受轨道半径比例影响，所以直接传半径
        
        this.orbitalR = planetDate.orbitalR * this.oRate * this.systemRate; // 行星到目标天体(targetDate.x,targetDate.y)的轨道半径
        if (this.orbitalR < this.targetR) { this.orbitalR = this.targetR + this.targetR * 0.1; }
        this.speed = planetDate.speed * this.sRate;
        this.x = this.targetX + this.orbitalR; // 行星初始x坐标
        this.y = this.targetY; // 行星初始y坐标
        this.update();
        this.draw(this.ctx);
    }
    update () {
        // 如果轨道半径为0，则不更新坐标
        if(this.orbitalR === 0) return;
        this.angle = this.speed * performance.now() * Math.PI / 18000;
        // 根据倾斜角度 写出近大远小的效果
        if(this.planetDate.orbitalR && this.yRate < 1) {
            if (this.targetDate.name === 'sun') {
                this.r = this.r * (1.5 + this.yRate +Math.sin(this.angle) * this.orbitalR / 1000);
                this.r = this.r < 1 ? 1 : this.r;
            } else if (this.targetDate.targetDate && this.targetDate.targetDate.name == 'sun') {
                this.orbitalR = this.orbitalR * (2+Math.sin(this.targetDate.angle));
            }
        }
        // 更新行星的坐标
        this.x = this.targetX + this.orbitalR * Math.cos(this.angle);
        this.y = this.targetY + this.orbitalR * Math.sin(this.angle) * this.yRate;
    }
    draw(ctx) {
        if(!ctx) return;
        // 绘制轨道
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        // ctx.strokeStyle = 'white';
        // ctx.lineWidth = 1;
        ctx.lineWidth = 0.3 * (this.systemRate>0.5 ? this.systemRate : 0.5);
        ctx.ellipse(this.targetX,this.targetY,this.orbitalR,this.orbitalR * this.yRate, 0 ,0,Math.PI * 2, false);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();


        // 绘制行星 - 图片
        if(this.img instanceof Array && this.img.length > 0) {

            let img = this.img[Math.floor(performance.now() / 100) % this.img.length]
            ctx.save();
            ctx.beginPath();
            // ctx.arc(this.x,this.y,this.r,0,Math.PI * 2);
            // ctx.clip();
            
            let dx = this.x - this.targetX;
            let dy = this.y - this.targetY;
            if(this.targetDate.targetR){
                // console.log('this.targetDate.targetDateR',this.targetDate.targetDateR)
                let dx2 = this.x - this.targetDate.targetX
                let dy2 = this.y - this.targetDate.targetY
                if(dx2*dx2 + dy2*dy2 < this.targetDate.targetR * this.targetDate.targetR) {
                    if(this.targetY < this.targetDate.targetY) {
                        return
                    } else { 
                        ctx.arc(this.x,this.y,this.r,0,Math.PI * 2);
                        ctx.fillStyle = 'black'; 
                        ctx.fill()
                        ctx.closePath();
                        ctx.restore();
                        return
                    }
                } 
            }
            if(dx*dx + dy*dy < this.targetR * this.targetR * 0.65) {
                if(this.y < this.targetY) {return} else { 
                    if(this.targetDate.name == 'sun'){
                        ctx.arc(this.x,this.y,this.r,0,Math.PI * 2);
                        ctx.fillStyle = 'black';
                        ctx.fill()
                        ctx.closePath();
                        ctx.restore();
                        return
                    }  

                }
            }
            if(img.width > img.height) {
                // 用这个会变形 ctx.drawImage(img, this.orbitalR - this.r, 0, this.r * 2, this.r * 2); 
                // 用img.height的一半作为半径
                this.r1  = img.width/img.height*this.r;
                this.r2  = this.r;
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.drawImage(img,  -this.r1, -this.r,  this.r1 * 2, this.r2 * 2);
            } else {
                // console.log(img.width,img.height);
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.drawImage(img,  -this.r, -this.r, this.r * 2, this.r * 2);
                // ctx.drawImage(img,  this.x-this.r, this.y-this.r, this.r * 2, this.r * 2);
            }

            // ctx.drawImage(img,this.x - this.r,this.y - this.r,this.r * 2,this.r * 2);
            ctx.closePath();
            ctx.restore();
            return
        }


        
    }
}
export default Planet;