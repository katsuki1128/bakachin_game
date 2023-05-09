


const canvas = document.getElementById("myCanvas");
// 引数を"2d"として2Dグラフィックの描画に
// 特化したメソッドやプロパティを持つオブジェクトを取得し、
// 定数ctxに格納する。
const ctx = canvas.getContext("2d");


// 描画された円の半径を保持し、計算に使用する変数「ballRadius」を定義
const ballRadius = 30;

// ボールの速度（フレームごとにxとyを変数dx、dyで更新）ランダムに生成
let randomSpeed = (Math.random() * 3) + 3; // 3から5の間のランダムな数を生成
randomSpeed *= Math.random() < 0.5 ? -1 : 1; // 50%の確率で正負を反転
let dx = randomSpeed;
let dy = (Math.random() + 1) * randomSpeed;
console.log(randomSpeed, dx, dy);


// パドルの変数を定義
let paddleHeight = 10;
let paddleWidth = 300;
let paddleX = (canvas.width - paddleWidth) / 2;

// ボールの初期位置を設定

// 無駄にパドルの上のどこから出るか、ランダムに発生させる。
// パドルの左端
const padleft = (canvas.width - paddleWidth) / 2 + 1;
// パドルの右端
const padright = (canvas.width - paddleWidth) / 2 + paddleWidth - 1;

// パドルの右端から左端までランダムに数を生成する
const padmin = padleft;
const padmax = padright;
const padRandomNunber = Math.floor(Math.random() * (padmax - padmin + 1) + padmin);

console.log(padleft, padright, padRandomNunber);

// ボールの初期値はランダムに発生させたパドルの上を設定
let x = padRandomNunber;
let y = canvas.height - paddleHeight - ballRadius;

// 右と左のボタンが押されている状態を論理値として定義する
let rightPressed = false;
let leftPressed = false;

// レンガの幅や高さ、行や列、ブロック間とキャンバスの端とのスキマなどの情報を定義
const brickRowCount = 12 //行の数
const brickColumnCount = 16;//列の数
const brickWidth = 26;
const brickHeight = 19;
const brickPadding = 0;
const brickOffsetTop = 232;//234
const brickOffsetLeft = 27;//26がジャストの位置

// //ブロックの幅や高さ、行や列、ブロック間とキャンバスの端とのスキマなどの情報を定義
// const blockRowCount = 12 //行の数
// const blockColumnCount = 16;//列の数
// const blockWidth = 26;
// const blockHeight = 19;
// const blockPadding = 0;
// const blockOffsetTop = 232;//234
// const blockOffsetLeft = 27;//26がジャストの位置


// スコアを表示
let score = 0;

// 最初のブロックのヒットカウント
const iniHitCount = 10;

const exp_count = 20;

//爆発を表示
function click_gu() {
    const image = new Image();
    image.src = "img/e1668.gif";
    image.style.position = "absolute";
    image.style.left = "20px";
    image.style.top = "80px";
    image.width = 500;
    document.body.appendChild(image);

    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                bricks[c][r].hitCount -= exp_count;
            }
        }
    }
}

let isBakachinVisible = false;//フラグ変数

//バカチンガーロゴを表示、hitocountを減らす
function click_cho() {

    // hitCountを減らす処理
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                bricks[c][r].hitCount -= exp_count / 2;
            }
        }
    }
    // 画像を表示する処理
    const image2 = new Image();
    image2.src = "img/bakachin02.png";
    document.body.appendChild(image2);
    isBakachinVisible = true;


    //5秒後に画像を消す処理
    setTimeout(() => {
        document.body.removeChild(image02);
        isBakachinVisible = false;
    }, 5000);
}


// １つの二次元配列で全てのブロックを記録。行と列を通してループし、新しいブロックを作る。
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1, hitCount: iniHitCount };
    }
}

// ボタンが押されたのを検知するため、 ２つのイベントリスナーを設定
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// keydown イベントが発生したとき keyDownHandler() 関数が実行される。 keyup イベントも同様
function keyDownHandler(e) {
    if (e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

// 一つ一つのボールの座標と比較する
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];

            // ブロックがアクティブなら衝突が起きる、画面上に描画されないようにブロックの状態を０にする
            if (b.status === 1) {

                // 衝突している＝ボールの外側がブロックの1つの座標の内部である
                if
                    // ボールの x 座標+半径がブロックの x 座標より大きい
                    (x + ballRadius + 1 > b.x &&
                    // ボールの x 座標がブロックの x 座標とその幅の和より小さい
                    x - ballRadius - 1 < b.x + brickWidth &&
                    // ボールの y 座標がブロックの y 座標より大きい
                    y + ballRadius + 1 > b.y &&
                    // ボールの y 座標がブロックの y 座標とその高さの和より小さい
                    y - ballRadius - 1 < b.y + brickHeight) {
                    dx = -dx;
                    dy = -dy;
                    score++;

                    // hitCountがある場合、hitCountを1減らし、0になったらブロックを消去する
                    if (b.hitCount > 0) {
                        b.hitCount--;
                        if (b.hitCount === 0) {
                            b.status = 0;

                            if (score === brickRowCount * brickColumnCount) {
                                alert("無事、放送事故はまぬがれました！");
                                document.location.reload();
                            }
                        }
                    } else {
                        b.status = 0;
                        if (score === brickRowCount * brickColumnCount) {
                            alert("無事、放送事故はまぬがれました！");
                            document.location.reload();
                        }
                    }


                    // b.status = 0;
                    // score++;//ブロックに当たると点数が加算
                    // if (score === brickColumnCount * brickRowCount) {
                    //     alert("無事、放送事故はまぬがれました！");
                    //     document.location.reload();
                    // }
                }

            }
        }

    }
}



// スコア表示を作成して更新する。
function drawScore() {
    ctx.font = "50px Arial";//フォント
    ctx.fillStyle = "#000000";//色
    //スコアと座標の引数
    const hp = brickColumnCount * brickRowCount * iniHitCount;//ブロックHP合計
    // const attack = (score + brickColumnCount * brickRowCount * exp_count);
    console.log(score);
    ctx.fillText(`放送事故を救え！あと${Math.floor((hp - score) * 100 / (hp))}%`, 50, 200)
}

// draw()関数のsetInterval 内で 10 ミリ秒ごとに実行
// ボールの代わりにバカチンガーを表示
function drawBall() {
    // ctx.beginPath();
    let ballImg = new Image();
    ballImg.src = "img/bakaface.png";
    // ballImg.classList.add("bakaface"); // bakafaceクラスを追加
    // document.body.appendChild(ballImg); // canvas要素の後に追加
    ctx.drawImage(ballImg, x - ballRadius, y - ballRadius, ballRadius * 2, ballRadius * 2);

    if (isBakachinVisible) {
        ctx.drawImage(image2, x - ballRadius, y - ballRadius, ballRadius * 2, ballRadius * 2);
    }

    // ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    // ctx.fillStyle = "#0095DD";
    // ctx.fill();
    // ctx.closePath();
    // ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
}

// パドルを画面上に表示する変数
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// ブロックの描画パート
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];

            // ブロックを描画するかどうか、statusプロパティの値をdrawBricks関数で確認
            if (bricks[c][r].status == 1) {

                // ブロックの描画コード
                const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                // ctx.strokeStyle = "#797999";//枠の色
                // ctx.stroke();//枠を描画
                ctx.fillStyle = "#000000";//塗りつぶしの色
                ctx.fill();//塗りつぶしを実行
                ctx.closePath();

                // ブロックの残りhitCountを描画する
                if (b.hitCount > 0) {
                    ctx.font = "12px Arial";
                    ctx.fillStyle = "#595959";
                    ctx.fillText(b.hitCount, brickX + brickWidth * 0.1, brickY + brickHeight * 0.75);
                }
            }

        }
    }
}



// 軌跡を消すためにカンバスの内容を消去するメソッドclearRectを記載
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore()
    collisionDetection();

    // ボールの位置のxの値が未満だったらx軸方向の向きを変える
    // または、x座標がキャンバスの高さより高かったらx軸方向の向きを変える
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    // ボールの位置のyの値がボールの半径未満だったらy軸方向の向きを変える
    if (y + dy < ballRadius) {
        dy = -dy;
    }
    // または、y座標がキャンバスの高さより高かったら
    else if (y + dy > canvas.height - ballRadius) {

        // ボールのx座標がパドルの座標内に入っていたらy軸方向の向きを変える
        if (x > paddleX && x < paddleX + paddleWidth) {
            if (y = y - paddleHeight) {
                dy = -dy;
                // 右ボタンを押すと、Ｘ軸の速さの絶対値分だけプラスされる
                if (rightPressed) {
                    dx = dx + Math.abs(dx) * 0.7 + 1;
                } else if (leftPressed) {
                    // 左ボタンを押すと、Ｘ軸の速さの絶対値分だけマイナスされる
                    dx = dx - Math.abs(dx) * 0.7 - 1;
                    console.log(Math.abs(dx));
                }
            }
        }
        // パドルを外していたらゲームオーバー
        else {
            alert("GAME OVER")
            document.location.reload();
            clearInterval(interval);
        }
    }

    if (rightPressed) {
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    }

    else if (leftPressed) {
        paddleX -= 7;
        if (paddleX < 0) {
            paddleX = 0;
        }
    }
    x += dx;
    y += dy;

    if (isBakachinVisible) {
        ctx.drawImage(image2, x, y, ballRadius * 2, ballRadius * 2);
    }

}

const interval = setInterval(draw, 10);