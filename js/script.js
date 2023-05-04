const canvas = document.getElementById("myCanvas");

// 引数を"2d"として2Dグラフィックの描画に
// 特化したメソッドやプロパティを持つオブジェクトを取得し、
// 定数ctxに格納する。
const ctx = canvas.getContext("2d");

// 描画された円の半径を保持し、計算に使用する変数「ballRadius」を定義
const ballRadius = 10;

// ボールの初期位置を設定
let x = canvas.width / 2;
let y = canvas.height - 50;

// ボールの速度（フレームごとにxとyを変数dx、dyで更新）
let dx = 5;
let dy = -5;

// パドルの変数を定義
let paddleHeight = 10;
let paddleWidth = 500;
let paddleX = (canvas.width - paddleWidth) / 2;

// 右と左のボタンが押されている状態を論理値として定義する
let rightPressed = false;
let leftPressed = false;

// レンガの幅や高さ、行や列、ブロック間とキャンバスの端とのスキマなどの情報を定義
const brickRowCount = 12; //行の数
const brickColumnCount = 10;//列の数
const brickWidth = 46;
const brickHeight = 15;
const brickPadding = 1;
const brickOffsetTop = 30;
const brickOffsetLeft = 5;

// スコアを表示
let score = 0;

//ライフを定義
let lives = 3;

// １つの二次元配列で全てのブロックを記録。行と列を通してループし、新しいブロックを作る。
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}


// ボタンが押されたのを検知するため、 ２つのイベントリスナーを設定
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// keydown イベントが発生したとき keyDownHandler() 関数が実行される。 keyup イベントも同様
function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

// // マウスの動作を監視する
// document.addEventListener("mousemove", mouseMoveHandler, false);

// // パドルの動きをマウスの動きと紐づける
// function mouseMoveHandler(e) {
//     const relativeX = e.clientX - canvas.offsetLeft;
//     if (relativeX > 0 && relativeX, canvas.width) {
//         paddleX = relativeX - paddleWidth / 2;
//     }
// }

// 衝突検出関数
// 毎フレーム描画されるたびに全てのブロックを通してループして、
// 一つ一つのボールの座標と比較する
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            // ブロックがアクティブなら衝突が起きる、画面上に描画されないようにブロックの状態を０にする
            if (b.status === 1) {

                // 衝突している＝ボールの中央がブロックの1つの座標の内部である
                if
                    // ボールの x 座標がブロックの x 座標より大きい
                    (x > b.x &&
                    // ボールの x 座標がブロックの x 座標とその幅の和より小さい
                    x < b.x + brickWidth &&
                    // ボールの y 座標がブロックの y 座標より大きい
                    y > b.y &&
                    // ボールの y 座標がブロックの y 座標とその高さの和より小さい
                    y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;//ブロックに当たると点数が加算
                    if (score === brickColumnCount * brickRowCount) {
                        alert("無事、放送事故はまぬがれました！");
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }

        }
    }
}

// スコア表示を作成して更新する。
function draScore() {
    ctx.font = "16px Arial";//フォント
    ctx.fillStyle = "#0095DD";//色
    ctx.fillText(`Score:${score}`, 8, 20)//スコアと座標の引数
}

// draw()関数のsetInterval 内で 10 ミリ秒ごとに実行
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
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

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            // ブロックを描画するかどうか、statusプロパティの値をdrawBricks関数で確認

            if (bricks[c][r].status == 1) {
                // ブロックの描画コード
                const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();

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
    draScore()
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


}
// ４辺全てでボールを弾ませるのではなく、 底を打ったときゲームは終わりにする    // setInterval(draw, 10);
const interval = setInterval(draw, 10);

