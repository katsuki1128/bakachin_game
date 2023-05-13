# テレビの黒味を消すブロック崩しゲーム
地上波NGキャラクターのバカチンガー！
ついに地上波デビューのはずが、社長が黒味にして妨害してきた！
放送事故を避けるべく、パンチやキックを駆使してブロックを崩せ！

## DEMO
https://katsuki1128.github.io/bakachin_game/

## 紹介と使い方

  - ブロック崩しゲームです。
  - 左ボタン、右ボタンでパドルを操作します。
  - パンチボタン、キックボタン、爆発ボタンで特殊効果が使えます。

## 工夫した点

  - 最初のボールの射出角度と発射位置がランダムになるように設定した
  - ボールが当たる瞬間にパドルをうまく動かすと、ボールの反射スピードと角度を調整できるように設定した点
  - ブロックが１回で消えずに複数回で消えるように設定

  - 残数が気持ちよく表示されるように、サイズ調整をした

  

## 苦戦した点
  
  - 点数表示がバカチンガーの上に来る理由に行きつくまでが大変だった。function draw内の上下表示ひとつで解決した。
 
  - 爆発のエフェクトが一度押すと、消えず残り続けるので、一度消して、また押したら表示されるようにremoveを設定したらうまくいった。と思ったらうまくいかず、結局gifアニメーションを無限ループに設定したらうまくいった。

  - 爆発の数値を正確に計測するのがむずかしかった。爆発の前と後の数字をletで定義し、マイナスの値は三項演算子（num = num < 0 ? 0 : num; ）を使って０にした。

  - 爆発のエフェクトで黒味表示がうまく減らない ⇒爆発の数値を正確に計測することで解決した。
  


## 改良したいが実装できていない点
  
  - 放送事故を免れたアラートをだすと、再読み込みしても始まらない。
  - スマホでも遊べるように、パドルをタッチパネルでも動かせるようにしたい。- ボタンを２回目以降押したときに背景が変わらない  

## 参考にした web サイトなど

  - ブロック崩しのベース
  https://developer.mozilla.org/ja/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript
