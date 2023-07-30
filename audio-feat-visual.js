(function () {
/**
 * 再生中か否かを表す
 * @type {Boolean}
 */
let isPlaying = false;

/** 
 * 音声コンテンツ要素
 * @type {HTMLAudioElement}
 */
const audio = document.getElementById('ori_audio');

/**
 * スペクトログラム描画キャンバス
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('spec-canvas');

// ---------- 描画準備 ----------

// 描画コンテキストの取得
const renderingContext = canvas.getContext('2d');

// 周波数強度と色のマッピングを作成
const colorMap = generateColorMap({ r: 255, g: 0, b: 0 }, { r: 255, g: 255, b: 0 });

// スペクトログラム描画キャンバスの塗りつぶし
renderingContext.fillStyle = colorMap[0];
renderingContext.fillRect(0, 0, canvas.width, canvas.height);

// ---------- オーディオ準備 ----------

// 音声コンテキストの作成
const audioContext = new AudioContext();

// ノード作成
const mediaElementSourceNode = audioContext.createMediaElementSource(audio);
const analyserNode = audioContext.createAnalyser();

// スムージングの無効
analyserNode.smoothingTimeConstant = 0;

// ノード接続
mediaElementSourceNode.connect(analyserNode);
analyserNode.connect(audioContext.destination);

// ---------- イベント ----------
audio.onplay = function () {
    // スペクトログラムの更新開始
    start();
};

audio.onpause = function () {
    // スペクトログラムの更新停止
    stop();
};

audio.onended = function () {
    // スペクトログラムの更新停止
    stop();
};

// FFTサイズの変更
document.getElementById('fft-size').onchange = function (event) {
    analyserNode.fftSize = event.target.value;
};

// スペクトログラムに表示可能な周波数強度下限の指定
document.getElementById('min-decibels').onchange = function (event) {
    analyserNode.minDecibels = event.target.value;
    document.getElementById('min-decibels-span').textContent = event.target.value;
};

// スペクトログラムに表示可能な周波数強度上限の指定
document.getElementById('max-decibels').onchange = function (event) {
    analyserNode.maxDecibels = event.target.value;
    document.getElementById('max-decibels-span').textContent = event.target.value;
};






// ---------- スペクトログラム系 ----------

/**
 * スペクトログラムの更新開始
 */
function start() {
    if (!isPlaying) {
        isPlaying = true;
        requestAnimationFrame(function mainLoop() {
            // 音声を再生している間、スペクトログラムを更新
            if (isPlaying) {
                // スペクトログラム更新処理
                feedSpectrogram();
                requestAnimationFrame(mainLoop);
            }
        });
    }
}

/**
 * スペクトログラムの更新停止
 */
function stop() {
    isPlaying = false;
}

/**
 * 周波数強度と色のマッピングの作成
 * @param {{r: Number, g: Number, b: Number}[]} dark - スペクトログラムの暗部色
 * @param {{r: Number, g: Number, b: Number}[]} light - スペクトログラムの明部色
 * @returns {String[]} - スタイルシート色設定文字列の配列
 */
function generateColorMap(dark, light) {
    const result = [];

    for (let i = 0; i < 256; i++) {
        let rate = i / (256 - 1);
        rate = rate * rate;

        let r, g, b;
        if (rate < 0.33) {
            const coef = (rate - 0) / (0.33 - 0);
            r = 0 + dark.r * coef;
            g = 0 + dark.g * coef;
            b = 0 + dark.b * coef;
        } else if (rate < 0.66) {
            const coef = (rate - 0.33) / (0.66 - 0.33);
            r = dark.r * (1 - coef) + light.r * coef;
            g = dark.g * (1 - coef) + light.g * coef;
            b = dark.b * (1 - coef) + light.b * coef;
        } else {
            const coef = (rate - 0.66) / (1 - 0.66);
            r = light.r * (1 - coef) + 255 * coef;
            g = light.g * (1 - coef) + 255 * coef;
            b = light.b * (1 - coef) + 255 * coef;
        }

        // 計算したRGB値をCSSの<color>データ型に変換
        result[i] = 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }

    return result;
}

/**
 * スペクトログラムの更新
 */
function feedSpectrogram() {
    // スペクトログラム画像を1ピクセル左にずらす
    renderingContext.drawImage(canvas, -1, 0);

    // if (document.getElementsByTagName('body')[0].style.backgroundColor == "rgb(0, 0, 0)"){
    //     return;
    // }

    // 0から255の間に正規化された周波数強度データを取得
    const frequencyData = new Uint8Array(analyserNode.frequencyBinCount);
    analyserNode.getByteFrequencyData(frequencyData);

    // 右端の幅1ピクセルの領域に、周波数強度を色に変換して描画
    for (let i = 0; i < canvas.height; i++) {
        // 描画色指定
        if ((i < frequencyData.length) && (document.getElementsByTagName('body')[0].style.backgroundColor == "rgb(255, 0, 0)")) {
            renderingContext.fillStyle = colorMap[frequencyData[i]];
        } else {
            renderingContext.fillStyle = colorMap[0];
        }

        // 周波数強度を1ピクセル描画
        renderingContext.fillRect(canvas.width - 1, canvas.height - 1 - i, 1, 1);
    }
}
})();