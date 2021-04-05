//canvasを描画するために必要
let c = document.getElementById("canvas");
let ctx = c.getContext("2d");
c.width = window.innerWidth;
c.height = 600;

const size = 15;

document.body.appendChild(c);

var perm = [];

//255のランダムな数を格納
while (perm.length < 255) {
    while (perm.includes(val = Math.floor(Math.random() * 255)));
    perm.push(val);
}

//地面の凸凹を計算する
let lerp = function (a, b, t) {
    return Math.abs(a + (b - a) * (1 - Math.cos(t * Math.PI)) / 2);
}

//地面の凸凹具合を調整する関数
let noise = function(x) {
    x = x * 0.01 % 255;
    return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
}

let player = new function () {
    this.x = c.width / 2;
    this.y = 0;
    this.rot = 0;
    this.ySpeed = 0;
    this.rSpeed = 0;

    this.img = new Image();
    this.img.src = "moto.png"; //playerのロゴ

    this.draw = function () {
        var p1 = c.height - noise(t + this.x) * 0.25;
        var p2 = c.height - noise(t + 5 + this.x) * 0.25;

        var grounded = false;

        if (p1 - size > this.y) {
            this.ySpeed += 0.1;
        } else {
            this.ySpeed -= this.y - (p1 - size);
            this.y = p1 - size;

            grounded = true;
        }


        //地面についておらず90度傾いていた時（ラジアン表記）
        if (!playing || grounded && Math.abs(this.rot) > Math.PI * 0.5) {
            playing = false;        //ゲームオーバー
            this.rSpeed = 5;        //回転スピード爆速
            k.ArrowUp = 1;
            this.x -= speed * 5;    //バイク男の位置が画面外へ
            this.y -= speed**10;
        }

        //バイク男の地面との角度を計算
        var angle = Math.atan2((p2 - size) - this.y, (this.x + 5) - this.x);

        this.y += this.ySpeed;

        if (grounded && playing) {
            this.rot -= (this.rot - angle) * 0.5;
            this.rSpeed = this.rSpeed - (angle - this.rot);
        }

        //回転速度と回転角度を調整
        this.rSpeed += (k.ArrowLeft - k.ArrowRight) * 0.05;
        this.rot -= this.rSpeed * 0.05;

        if (this.rot > Math.PI) {
            this.rot = -Math.PI;
        }
        if (this.rot < -Math.PI) {
            this.rot = Math.PI;
        }


        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.drawImage(this.img, -size, -size, 30, 30); //(x,y,大きさ,大きさ)

        ctx.restore();
    }
}



let t = 0;
let speed = 0;
// let playing = true;
let k = { ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0 };
let cnt = 0;

function loop() {

    speed -= (speed - (k.ArrowUp)) * 0.1;
    t += 10 * speed;
    ctx.fillStyle = "#19f";
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = "black";

    ctx.beginPath();
    ctx.moveTo(0, c.height);//線の第一始点

    for (var i = 0; i < c.width; i++) {
        ctx.lineTo(i, c.height - noise(t + i) * 0.25);  //moveToとつないで直線となる
    }

    ctx.lineTo(c.width, c.height);  //moveToとlineToとつないで三角形となる

    ctx.fill();     //三角形を塗りつぶし

    player.draw();

    requestAnimationFrame(loop);
}

onkeydown = d => k[d.key] = 1;
onkeyup = d => k[d.key] = 0;

loop();