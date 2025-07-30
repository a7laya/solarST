
export function calculateAngles2(a, b, r) {
    /**
     * @param {number} a - 椭圆的长轴(本天体轨道)
     * @param {number} b - 椭圆的短轴(本天体轨道)
     * @param {number} r - 目标天体的半径
     * @returns {number} 交点与原点连线和x轴的夹角（弧度）
     * */

    // 验证输入参数有效性
    if (r <= b) {
        throw new Error("半径 r 必须大于短轴 b 才能有交点");
    }

    // 原来的计算方法可能存在问题
    // 我们需要求解椭圆方程 (x/a)² + (y/b)² = 1 和圆方程 x² + y² = r² 的交点

    // 使用参数方程求解
    // 定义一个函数来计算给定角度t的椭圆上点到原点的距离
    function distanceFromOrigin(t) {
        // 椭圆上点 (a*cos(t), b*sin(t))
        const x = a * Math.cos(t);
        const y = b * Math.sin(t);
        return Math.sqrt(x*x + y*y);
    }

    // 用二分法找到椭圆与圆的交点对应的参数t
    // 我们从第一象限开始寻找
    let tMin = 0;  // 0度，x轴正方向
    let tMax = Math.PI/2;  // 90度，y轴正方向
    let t = (tMin + tMax) / 2;
    const epsilon = 1e-10;  // 精度

    // 二分查找
    while (tMax - tMin > epsilon) {
        t = (tMin + tMax) / 2;
        const dist = distanceFromOrigin(t);

        if (Math.abs(dist - r) < epsilon) {
            break;  // 找到交点
        } else if (dist < r) {
            tMin = t;  // 当前点在圆内，向外移动
        } else {
            tMax = t;  // 当前点在圆外，向内移动
        }
    }

    // 计算交点坐标
    const x = a * Math.cos(t);
    const y = b * Math.sin(t);

    // 计算夹角（使用atan2确保获得正确的象限）
    const theta = Math.atan2(y, x);

    return theta;
}

export function calculateAngles(a, b, r) {
    /**
     * @param {number} a - 椭圆的长轴(本天体轨道)
     * @param {number} b - 椭圆的短轴(本天体轨道)
     * @param {number} r - 目标天体的半径
     * */ 
    // console.log(a, b, r)
    
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


