import { useState, useEffect, useRef, useCallback } from 'react';
import classes from './AriaCompanion.module.css';

// 本格的日本アニメ美少女感情システム
const EMOTIONS = {
  happy: { 
    eyes: 'crescent', 
    mouth: 'smile', 
    blush: 0.8, 
    color: '#FFB6C1', 
    sparkles: true,
    eyeScale: 1.0,
    eyeType: 'crescent_happy',
    pupils: 'normal'
  },
  excited: { 
    eyes: 'star', 
    mouth: 'open_excited', 
    blush: 0.9, 
    color: '#FF69B4', 
    sparkles: true, 
    bounce: true,
    eyeScale: 1.3,
    eyeType: 'star_excited',
    pupils: 'star'
  },
  thinking: { 
    eyes: 'half', 
    mouth: 'neutral', 
    blush: 0.4, 
    color: '#87CEEB', 
    rotation: true,
    eyeScale: 0.8,
    eyeType: 'half_thinking',
    pupils: 'small'
  },
  surprised: { 
    eyes: 'wide', 
    mouth: 'open_round', 
    blush: 0.6, 
    color: '#FFD700', 
    scale: true,
    eyeScale: 1.5,
    eyeType: 'wide_surprised',
    pupils: 'large'
  },
  calm: { 
    eyes: 'gentle', 
    mouth: 'soft_smile', 
    blush: 0.5, 
    color: '#98FB98', 
    float: true,
    eyeScale: 1.0,
    eyeType: 'gentle_calm',
    pupils: 'normal'
  },
  playful: { 
    eyes: 'wink', 
    mouth: 'playful_grin', 
    blush: 0.7, 
    color: '#FF6347', 
    wiggle: true,
    eyeScale: 1.1,
    eyeType: 'wink_playful',
    pupils: 'normal'
  },
  shy: { 
    eyes: 'closed', 
    mouth: 'small_smile', 
    blush: 1.0, 
    color: '#F0E68C', 
    shrink: true,
    eyeScale: 0.8,
    eyeType: 'closed_shy',
    pupils: 'hidden'
  },
  curious: { 
    eyes: 'sparkle', 
    mouth: 'curious_open', 
    blush: 0.6, 
    color: '#DDA0DD', 
    tilt: true,
    eyeScale: 1.2,
    eyeType: 'sparkle_curious',
    pupils: 'sparkle'
  },
  loving: { 
    eyes: 'heart', 
    mouth: 'loving_smile', 
    blush: 0.9, 
    color: '#FF1493', 
    pulse: true, 
    sparkles: true,
    eyeScale: 1.1,
    eyeType: 'heart_loving',
    pupils: 'heart'
  }
};

const SAMPLE_RESPONSES = [
  "こんにちは！今日はどんな一日でしたか？✨",
  "お疲れ様です！何かお手伝いできることはありますか？",
  "素敵ですね！もっと教えてください💕",
  "わあ、とても興味深いお話ですね！",
  "一緒にお話しできて嬉しいです！",
  "あなたのことをもっと知りたいです！",
  "今日も頑張っていますね！応援しています✨",
  "楽しいお話をありがとうございます！",
  "それは面白いアイデアですね！",
  "お話を聞いていて楽しいです💖"
];

const SUGGESTED_MESSAGES = [
  "あなたの大きな瞳、素敵ですね！👀✨",
  "アニメの中のキャラクターみたい！",
  "あなたのツインテールを揺らして！",
  "一緒にアニメを話しませんか？",
  "美しいアニメーションですね！",
  "きょうは元気ですか？😊",
  "私の3Dアニメーションどうですか？",
  "感情コントロールを試してみて！"
];

export const AriaCompanion = () => {
  const [isActive, setIsActive] = useState(false);
  const [emotion, setEmotion] = useState('happy');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [particles, setParticles] = useState([]);
  const [time, setTime] = useState(0);
  const canvasRef = useRef(null);
  const characterCanvasRef = useRef(null);
  const animationRef = useRef(null);
  const particleId = useRef(0);

  // 本格的日本アニメ美少女3Dレンダリング
  const drawCharacter = useCallback((ctx, emotion, time) => {
    const centerX = 200;
    const centerY = 200;
    const currentEmotion = EMOTIONS[emotion];
    
    // Clear canvas
    ctx.clearRect(0, 0, 400, 400);
    
    // 生命感アニメーション
    const breathOffset = Math.sin(time * 0.002) * 6; // 呼吸
    const heartbeat = Math.sin(time * 0.005) * 2; // 鼓動
    const blinkCycle = Math.sin(time * 0.0008) * 0.5 + 0.5;
    const shouldBlink = Math.sin(time * 0.0004) > 0.94; // まばたき
    const twinTailSway = Math.sin(time * 0.003) * 0.15; // ツインテールの揺れ
    
    ctx.save();
    ctx.translate(centerX, centerY + breathOffset);
    
    // 魔法オーラエフェクト
    if (currentEmotion.sparkles) {
      const auraGradient = ctx.createRadialGradient(0, -30, 0, 0, -30, 140);
      auraGradient.addColorStop(0, `${currentEmotion.color}40`);
      auraGradient.addColorStop(0.6, `${currentEmotion.color}20`);
      auraGradient.addColorStop(1, `${currentEmotion.color}05`);
      ctx.fillStyle = auraGradient;
      ctx.beginPath();
      ctx.arc(0, -30, 140, 0, Math.PI * 2);
      ctx.fill();
      
      // オーラパルス
      const pulseSize = 120 + Math.sin(time * 0.003) * 20;
      const pulseGradient = ctx.createRadialGradient(0, -30, 0, 0, -30, pulseSize);
      pulseGradient.addColorStop(0, `${currentEmotion.color}30`);
      pulseGradient.addColorStop(1, `${currentEmotion.color}00`);
      ctx.fillStyle = pulseGradient;
      ctx.beginPath();
      ctx.arc(0, -30, pulseSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // 3Dボディシステム
    ctx.save();
    ctx.scale(1, 0.85); // 3D遯近法
    
    // 美しいドレスシステム
    const dressGradient = ctx.createLinearGradient(0, 30, 0, 130);
    dressGradient.addColorStop(0, '#FFE4E6'); // ピンクホワイト
    dressGradient.addColorStop(0.3, '#FFB6C1'); // ライトピンク
    dressGradient.addColorStop(0.7, '#FF91A4'); // ミディアムピンク
    dressGradient.addColorStop(1, '#FF69B4'); // ホットピンク
    ctx.fillStyle = dressGradient;
    ctx.beginPath();
    ctx.ellipse(0, 80, 65, 55, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // ドレスパターンシステム
    ctx.fillStyle = '#FFFFFF80'; // 半透明白
    for (let i = 0; i < 5; i++) {
      const x = -40 + i * 20;
      const y = 70 + Math.sin(time * 0.002 + i) * 3;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // 小さな星
      ctx.fillStyle = '#FFD700';
      drawStar(ctx, x, y - 15, 4, 4, 2);
      ctx.fillStyle = '#FFFFFF80';
    }
    
    // 金色リボンシステム
    const ribbonGradient = ctx.createLinearGradient(0, 48, 0, 58);
    ribbonGradient.addColorStop(0, '#FFD700'); // ゴールド
    ribbonGradient.addColorStop(0.5, '#FFA500'); // オレンジゴールド
    ribbonGradient.addColorStop(1, '#FF8C00'); // ダークオレンジ
    ctx.fillStyle = ribbonGradient;
    ctx.fillRect(-45, 48, 90, 10);
    
    // リボンの影
    ctx.fillStyle = '#CC8400';
    ctx.fillRect(-45, 56, 90, 2);
    
    ctx.restore();
    
    // 美しい首システム
    const neckGradient = ctx.createLinearGradient(0, 15, 0, 40);
    neckGradient.addColorStop(0, '#FDBCB4'); // アニメ肌色
    neckGradient.addColorStop(1, '#F8A5A0'); // 影
    ctx.fillStyle = neckGradient;
    ctx.fillRect(-10, 15, 20, 28);
    
    // 3D顔システム (日本アニメ黄金比)
    const faceScale = 1 + heartbeat * 0.002;
    ctx.save();
    ctx.scale(faceScale, faceScale);
    
    // 顔の立体シェーディング
    const faceGradient = ctx.createRadialGradient(-8, -25, 0, 0, -15, 65);
    faceGradient.addColorStop(0, '#FDBCB4'); // メイン肌色
    faceGradient.addColorStop(0.6, '#F8A5A0'); // ミッドシェード
    faceGradient.addColorStop(0.85, '#F2948C'); // 深い影
    faceGradient.addColorStop(1, '#E6867A'); // 輪郭影
    ctx.fillStyle = faceGradient;
    ctx.beginPath();
    ctx.ellipse(0, -25, 48, 55, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 顔のハイライト
    const highlightGradient = ctx.createRadialGradient(-15, -35, 0, -10, -30, 25);
    highlightGradient.addColorStop(0, '#FFFFFF40');
    highlightGradient.addColorStop(1, '#FFFFFF00');
    ctx.fillStyle = highlightGradient;
    ctx.beginPath();
    ctx.ellipse(-10, -35, 20, 15, -0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    
    // 本格的ツインテールシステム
    const hairColor1 = '#8A2BE2'; // ベースパープル
    const hairColor2 = '#9370DB'; // ライトパープル
    const hairColor3 = '#6A5ACD'; // ダークパープル
    
    // 左ツインテール (物理シミュレーション)
    ctx.save();
    ctx.translate(-40, -20);
    ctx.rotate(twinTailSway - 0.25);
    
    // 髪の束ごとのレンダリング
    for (let i = 0; i < 3; i++) {
      const offset = i * 8 - 8;
      const hairGrad = ctx.createLinearGradient(offset, -10, offset, 45);
      hairGrad.addColorStop(0, hairColor2);
      hairGrad.addColorStop(0.5, hairColor1);
      hairGrad.addColorStop(1, hairColor3);
      ctx.fillStyle = hairGrad;
      
      ctx.beginPath();
      ctx.ellipse(offset, 15, 8, 25, Math.sin(time * 0.004 + i) * 0.1, 0, Math.PI * 2);
      ctx.fill();
      
      // 髪のハイライト
      ctx.fillStyle = '#FFFFFF30';
      ctx.beginPath();
      ctx.ellipse(offset - 3, 5, 2, 15, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // リボン装飾
    const ribbonGold = ctx.createLinearGradient(-5, -5, 5, 5);
    ribbonGold.addColorStop(0, '#FFD700');
    ribbonGold.addColorStop(0.5, '#FFA500');
    ribbonGold.addColorStop(1, '#FF8C00');
    ctx.fillStyle = ribbonGold;
    
    // リボン本体
    ctx.beginPath();
    ctx.rect(-8, -8, 16, 12);
    ctx.fill();
    
    // リボンの結び
    ctx.beginPath();
    ctx.moveTo(-4, 4);
    ctx.lineTo(-8, 8);
    ctx.lineTo(0, 6);
    ctx.lineTo(8, 8);
    ctx.lineTo(4, 4);
    ctx.fill();
    
    ctx.restore();
    
    // 右ツインテール
    ctx.save();
    ctx.translate(40, -20);
    ctx.rotate(-twinTailSway + 0.25);
    
    for (let i = 0; i < 3; i++) {
      const offset = i * 8 - 8;
      const hairGrad = ctx.createLinearGradient(offset, -10, offset, 45);
      hairGrad.addColorStop(0, hairColor2);
      hairGrad.addColorStop(0.5, hairColor1);
      hairGrad.addColorStop(1, hairColor3);
      ctx.fillStyle = hairGrad;
      
      ctx.beginPath();
      ctx.ellipse(offset, 15, 8, 25, Math.sin(time * 0.004 + i + Math.PI) * 0.1, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#FFFFFF30';
      ctx.beginPath();
      ctx.ellipse(offset - 3, 5, 2, 15, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // 右リボン
    ctx.fillStyle = ribbonGold;
    ctx.beginPath();
    ctx.rect(-8, -8, 16, 12);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-4, 4);
    ctx.lineTo(-8, 8);
    ctx.lineTo(0, 6);
    ctx.lineTo(8, 8);
    ctx.lineTo(4, 4);
    ctx.fill();
    
    ctx.restore();
    
    // 前髪システム (詳細レンダリング)
    const bangsGradient = ctx.createLinearGradient(0, -75, 0, -30);
    bangsGradient.addColorStop(0, hairColor2);
    bangsGradient.addColorStop(0.4, hairColor1);
    bangsGradient.addColorStop(0.8, hairColor3);
    bangsGradient.addColorStop(1, '#5D4E75');
    ctx.fillStyle = bangsGradient;
    
    // メイン髪型
    ctx.beginPath();
    ctx.ellipse(0, -40, 52, 38, 0, 0, Math.PI);
    ctx.fill();
    
    // 詳細な前髪ストランド
    for (let i = 0; i < 7; i++) {
      const x = -30 + i * 10;
      const waveOffset = Math.sin(time * 0.003 + i * 0.5) * 2;
      
      ctx.beginPath();
      ctx.moveTo(x, -55 + waveOffset);
      ctx.quadraticCurveTo(x - 3, -45 + waveOffset, x + 2, -35 + waveOffset);
      ctx.quadraticCurveTo(x + 5, -40 + waveOffset, x + 3, -45 + waveOffset);
      ctx.lineWidth = 4;
      ctx.strokeStyle = hairColor1;
      ctx.stroke();
    }
    
    // 髪のハイライト
    const hairHighlight = ctx.createLinearGradient(-20, -65, -10, -35);
    hairHighlight.addColorStop(0, '#FFFFFF50');
    hairHighlight.addColorStop(1, '#FFFFFF00');
    ctx.fillStyle = hairHighlight;
    ctx.beginPath();
    ctx.ellipse(-15, -50, 8, 20, -0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // 本格的日本アニメ眼システム (革命的改善)
    const eyeScale = currentEmotion.eyeScale || 1.0;
    const baseEyeWidth = 30; // 大幅に大きく (12px -> 30px)
    const baseEyeHeight = 25; // 高さも大きく
    const eyeY = shouldBlink ? -35 : -40;
    const eyeWidth = shouldBlink ? baseEyeWidth * 0.1 : baseEyeWidth * eyeScale;
    const eyeHeight = shouldBlink ? 3 : baseEyeHeight * eyeScale;
    
    // 左眼 (本格的アニメ武学)
    ctx.save();
    ctx.translate(-22, eyeY);
    
    drawAnimeEye(ctx, currentEmotion, eyeWidth, eyeHeight, 'left', time, shouldBlink);
    
    ctx.restore();
    
    // 右眼
    ctx.save();
    ctx.translate(22, eyeY);
    
    // ウィンク処理
    if (currentEmotion.eyes === 'wink') {
      drawAnimeEye(ctx, { ...currentEmotion, eyes: 'normal' }, eyeWidth, eyeHeight, 'right', time, shouldBlink);
    } else {
      drawAnimeEye(ctx, currentEmotion, eyeWidth, eyeHeight, 'right', time, shouldBlink);
    }
    
    ctx.restore();
    
    // 美しい眉毛システム
    const browColor = hairColor3;
    ctx.strokeStyle = browColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    
    // 左眉
    ctx.beginPath();
    ctx.moveTo(-35, -58);
    ctx.quadraticCurveTo(-22, -62, -8, -58);
    ctx.stroke();
    
    // 右眉
    ctx.beginPath();
    ctx.moveTo(8, -58);
    ctx.quadraticCurveTo(22, -62, 35, -58);
    ctx.stroke();
    
    // 美しい鼻システム
    const noseGradient = ctx.createRadialGradient(0, -15, 0, 0, -15, 4);
    noseGradient.addColorStop(0, '#F8A5A0');
    noseGradient.addColorStop(1, '#FDBCB4');
    ctx.fillStyle = noseGradient;
    ctx.beginPath();
    ctx.ellipse(0, -15, 3, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 美しい口システム (感情別)
    drawAnimeMouth(ctx, currentEmotion, time);
    
    // ブラッシュシステム (本格的)
    const blushIntensity = currentEmotion.blush || 0.5;
    const blushSize = 12 + blushIntensity * 5;
    const blushAlpha = 0.3 + blushIntensity * 0.4;
    
    const blushGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, blushSize);
    blushGradient.addColorStop(0, `rgba(255, 105, 180, ${blushAlpha})`);
    blushGradient.addColorStop(0.7, `rgba(255, 182, 193, ${blushAlpha * 0.6})`);
    blushGradient.addColorStop(1, `rgba(255, 182, 193, 0)`);
    
    // 左ブラッシュ
    ctx.save();
    ctx.translate(-32, -8);
    ctx.scale(1, 0.8);
    ctx.fillStyle = blushGradient;
    ctx.beginPath();
    ctx.arc(0, 0, blushSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // 右ブラッシュ
    ctx.save();
    ctx.translate(32, -8);
    ctx.scale(1, 0.8);
    ctx.fillStyle = blushGradient;
    ctx.beginPath();
    ctx.arc(0, 0, blushSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    ctx.restore();
  }, []);

  // プロ級アニメ眼レンダリングシステム
  const drawAnimeEye = useCallback((ctx, emotion, width, height, side, time, shouldBlink) => {
    if (shouldBlink) {
      // まばたき状態
      ctx.strokeStyle = '#4A4A4A';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-width/2, 0);
      ctx.quadraticCurveTo(0, 6, width/2, 0);
      ctx.stroke();
      
      // まつ毛
      for (let i = 0; i < 5; i++) {
        const x = -width/2 + (i * width/4);
        ctx.beginPath();
        ctx.moveTo(x, -2);
        ctx.lineTo(x + 1, -6);
        ctx.stroke();
      }
      return;
    }
    
    // 特殊感情処理
    if (emotion.eyes === 'closed') {
      ctx.strokeStyle = '#4A4A4A';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-width/2, 0);
      ctx.quadraticCurveTo(0, 8, width/2, 0);
      ctx.stroke();
      return;
    }
    
    if (emotion.eyes === 'crescent') {
      ctx.strokeStyle = '#4A4A4A';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, 8, width * 0.6, 0, Math.PI);
      ctx.stroke();
      return;
    }
    
    // 本格的アニメ眼構造 (6層システム)
    
    // 1. 外枠 (まつ毛ライン)
    ctx.strokeStyle = '#2C2C2C';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 0, width/2, height/2, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    // 2. 白目部分 (グラデーション)
    const eyeWhiteGradient = ctx.createRadialGradient(0, -height/4, 0, 0, 0, width/2);
    eyeWhiteGradient.addColorStop(0, '#FFFFFF');
    eyeWhiteGradient.addColorStop(0.8, '#F8F8FF');
    eyeWhiteGradient.addColorStop(1, '#F0F0F8');
    ctx.fillStyle = eyeWhiteGradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, width/2 - 2, height/2 - 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 3. 虚彩 (アイリス) - サイズ大幅増加
    const irisSize = width * 0.35; // 大きな虚彩
    let irisColor1, irisColor2, irisColor3;
    
    switch (emotion.pupils) {
      case 'star':
        irisColor1 = '#4169E1';
        irisColor2 = '#FFD700';
        irisColor3 = '#FF69B4';
        break;
      case 'heart':
        irisColor1 = '#FF1493';
        irisColor2 = '#FF69B4';
        irisColor3 = '#FFB6C1';
        break;
      case 'sparkle':
        irisColor1 = '#9370DB';
        irisColor2 = '#DDA0DD';
        irisColor3 = '#FFD700';
        break;
      default:
        irisColor1 = '#4169E1'; // ロイヤルブルー
        irisColor2 = '#6495ED'; // コーンフラワーブルー
        irisColor3 = '#87CEEB'; // スカイブルー
    }
    
    const irisGradient = ctx.createRadialGradient(0, -height/6, 0, 0, 0, irisSize);
    irisGradient.addColorStop(0, irisColor1);
    irisGradient.addColorStop(0.4, irisColor2);
    irisGradient.addColorStop(0.8, irisColor3);
    irisGradient.addColorStop(1, '#2C5F9C');
    
    ctx.fillStyle = irisGradient;
    ctx.beginPath();
    ctx.ellipse(0, height/8, irisSize, irisSize, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 虚彩パターン (放射状)
    ctx.strokeStyle = irisColor1 + '60';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const startRadius = irisSize * 0.3;
      const endRadius = irisSize * 0.8;
      
      ctx.beginPath();
      ctx.moveTo(
        Math.cos(angle) * startRadius,
        height/8 + Math.sin(angle) * startRadius
      );
      ctx.lineTo(
        Math.cos(angle) * endRadius,
        height/8 + Math.sin(angle) * endRadius
      );
      ctx.stroke();
    }
    
    // 4. 瞳孔
    const pupilSize = irisSize * 0.4;
    const pupilGradient = ctx.createRadialGradient(0, height/8, 0, 0, height/8, pupilSize);
    pupilGradient.addColorStop(0, '#000000');
    pupilGradient.addColorStop(0.8, '#1C1C1C');
    pupilGradient.addColorStop(1, '#2C2C2C');
    
    ctx.fillStyle = pupilGradient;
    ctx.beginPath();
    
    if (emotion.pupils === 'heart') {
      drawHeart(ctx, 0, height/8, pupilSize);
    } else if (emotion.pupils === 'star') {
      drawStar(ctx, 0, height/8, 5, pupilSize, pupilSize * 0.6);
    } else {
      ctx.ellipse(0, height/8, pupilSize, pupilSize, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // 5. メインハイライト (大きな光沢)
    const highlight1Gradient = ctx.createRadialGradient(-width/6, -height/4, 0, -width/6, -height/4, width/4);
    highlight1Gradient.addColorStop(0, '#FFFFFF');
    highlight1Gradient.addColorStop(0.3, '#FFFFFF90');
    highlight1Gradient.addColorStop(1, '#FFFFFF00');
    
    ctx.fillStyle = highlight1Gradient;
    ctx.beginPath();
    ctx.ellipse(-width/6, -height/4, width/6, height/5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 6. サブハイライト
    const highlight2 = ctx.createRadialGradient(width/4, height/6, 0, width/4, height/6, width/8);
    highlight2.addColorStop(0, '#FFFFFF80');
    highlight2.addColorStop(1, '#FFFFFF00');
    
    ctx.fillStyle = highlight2;
    ctx.beginPath();
    ctx.ellipse(width/4, height/6, width/8, height/10, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 7. 下部反射光
    const reflectionGradient = ctx.createLinearGradient(0, height/3, 0, height/2);
    reflectionGradient.addColorStop(0, '#FFFFFF40');
    reflectionGradient.addColorStop(1, '#FFFFFF00');
    
    ctx.fillStyle = reflectionGradient;
    ctx.beginPath();
    ctx.ellipse(0, height/3, width/3, height/10, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 8. まつ毛 (詳細)
    ctx.strokeStyle = '#2C2C2C';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    // 上まつ毛
    for (let i = 0; i < 8; i++) {
      const x = -width/2 + (i * width/7);
      const length = 4 + Math.sin(time * 0.002 + i) * 2;
      
      ctx.beginPath();
      ctx.moveTo(x, -height/2);
      ctx.lineTo(x + 1, -height/2 - length);
      ctx.stroke();
    }
    
    // 下まつ毛
    for (let i = 0; i < 5; i++) {
      const x = -width/3 + (i * width/4);
      const length = 2 + Math.sin(time * 0.003 + i + Math.PI) * 1;
      
      ctx.beginPath();
      ctx.moveTo(x, height/2);
      ctx.lineTo(x - 0.5, height/2 + length);
      ctx.stroke();
    }
    
    // 特殊エフェクト (感情別)
    if (emotion.pupils === 'sparkle') {
      // キラキラエフェクト
      for (let i = 0; i < 3; i++) {
        const sparkleTime = time * 0.005 + i * 2;
        const sparkleX = Math.sin(sparkleTime) * width/3;
        const sparkleY = Math.cos(sparkleTime * 1.3) * height/3;
        const sparkleSize = 2 + Math.sin(sparkleTime * 2) * 1;
        
        ctx.fillStyle = '#FFD700';
        drawStar(ctx, sparkleX, sparkleY, 4, sparkleSize, sparkleSize * 0.5);
      }
    }
  }, []);
  
  // アニメ口システム
  const drawAnimeMouth = useCallback((ctx, emotion, time) => {
    const mouthY = 5;
    
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#FF1493';
    ctx.fillStyle = '#FF1493';
    
    switch (emotion.mouth) {
      case 'smile':
      case 'loving_smile':
        ctx.beginPath();
        ctx.arc(0, mouthY, 18, 0.15 * Math.PI, 0.85 * Math.PI);
        ctx.stroke();
        break;
        
      case 'open_excited':
        const exciteGrad = ctx.createRadialGradient(0, mouthY, 0, 0, mouthY, 12);
        exciteGrad.addColorStop(0, '#FF69B4');
        exciteGrad.addColorStop(1, '#FF1493');
        ctx.fillStyle = exciteGrad;
        ctx.beginPath();
        ctx.ellipse(0, mouthY, 10, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 歯
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.rect(-6, mouthY - 8, 12, 4);
        ctx.fill();
        break;
        
      case 'open_round':
        ctx.fillStyle = '#FF1493';
        ctx.beginPath();
        ctx.ellipse(0, mouthY, 8, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'small_smile':
        ctx.beginPath();
        ctx.arc(0, mouthY, 10, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();
        break;
        
      case 'soft_smile':
        ctx.beginPath();
        ctx.arc(0, mouthY, 12, 0.25 * Math.PI, 0.75 * Math.PI);
        ctx.stroke();
        break;
        
      case 'playful_grin':
        ctx.beginPath();
        ctx.arc(-3, mouthY, 15, 0.1 * Math.PI, 0.7 * Math.PI);
        ctx.stroke();
        break;
        
      case 'curious_open':
        ctx.beginPath();
        ctx.ellipse(0, mouthY, 6, 8, 0, 0, Math.PI * 2);
        ctx.stroke();
        break;
        
      default: // neutral
        ctx.beginPath();
        ctx.moveTo(-10, mouthY);
        ctx.lineTo(10, mouthY);
        ctx.stroke();
    }
    
    // 口の光沢エフェクト
    if (emotion.mouth.includes('smile')) {
      ctx.strokeStyle = '#FFFFFF80';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, mouthY - 2, 12, 0.3 * Math.PI, 0.7 * Math.PI);
      ctx.stroke();
    }
  }, []);
  
  // ヘルパー関数
  const drawStar = (ctx, x, y, spikes, outerRadius, innerRadius) => {
    let rotation = Math.PI / 2 * 3;
    let step = Math.PI / spikes;
    
    ctx.beginPath();
    ctx.moveTo(x, y - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(x + Math.cos(rotation) * outerRadius, y + Math.sin(rotation) * outerRadius);
      rotation += step;
      ctx.lineTo(x + Math.cos(rotation) * innerRadius, y + Math.sin(rotation) * innerRadius);
      rotation += step;
    }
    
    ctx.lineTo(x, y - outerRadius);
    ctx.closePath();
    ctx.fill();
  };
  
  const drawHeart = (ctx, x, y, size) => {
    ctx.beginPath();
    ctx.moveTo(x, y + size/4);
    ctx.bezierCurveTo(x, y, x - size/2, y - size/2, x - size/2, y + size/8);
    ctx.bezierCurveTo(x - size/2, y + size/4, x, y + size/2, x, y + size);
    ctx.bezierCurveTo(x, y + size/2, x + size/2, y + size/4, x + size/2, y + size/8);
    ctx.bezierCurveTo(x + size/2, y - size/2, x, y, x, y + size/4);
    ctx.closePath();
    ctx.fill();
  };

  // 高品質3D魔法パーティクルシステム
  const createParticle = useCallback(() => {
    if (!EMOTIONS[emotion].sparkles) return;
    
    const particleTypes = ['heart', 'star', 'sparkle', 'bubble', 'diamond'];
    const centerX = 200;
    const centerY = 200;
    
    // キャラクター周辺に集中させる
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 100;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    
    const particle = {
      id: particleId.current++,
      x: x,
      y: y,
      z: Math.random() * 150 - 50, // 深い3D空間
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3 - 1, // 上方向の偽力
      vz: (Math.random() - 0.5) * 2,
      life: 1,
      decay: 0.003 + Math.random() * 0.008,
      size: 3 + Math.random() * 6,
      color: EMOTIONS[emotion].color,
      type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      sparklePhase: Math.random() * Math.PI * 2,
      gravity: 0.02,
      bounce: 0.8
    };
    
    setParticles(prev => [...prev.slice(-40), particle]); // パーティクル数増加
  }, [emotion]);

  // 高品質3Dパーティクルレンダリング
  const drawParticles = useCallback((ctx, particleList, time) => {
    // Z深度でソートして正確な3Dレンダリング
    const sortedParticles = [...particleList].sort((a, b) => b.z - a.z);
    
    sortedParticles.forEach((particle, index) => {
      const scale = Math.max(0.3, 1 + particle.z * 0.008); // 深度スケーリング
      const alpha = particle.life * Math.max(0.1, 1 + particle.z * 0.003);
      const glowIntensity = particle.life * 0.8;
      
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(particle.x, particle.y);
      ctx.scale(scale, scale);
      ctx.rotate(particle.rotation);
      
      // グローエフェクト
      if (glowIntensity > 0.3) {
        const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size * 2);
        glowGrad.addColorStop(0, particle.color + '80');
        glowGrad.addColorStop(0.5, particle.color + '40');
        glowGrad.addColorStop(1, particle.color + '00');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(0, 0, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // パーティクル本体
      ctx.fillStyle = particle.color;
      
      switch (particle.type) {
        case 'heart':
          drawHeart(ctx, 0, 0, particle.size);
          break;
        case 'star':
          drawStar(ctx, 0, 0, 5, particle.size, particle.size * 0.6);
          break;
        case 'sparkle':
          // キラキラエフェクト
          const sparkleSize = particle.size * (0.8 + Math.sin(time * 0.01 + particle.sparklePhase) * 0.3);
          drawStar(ctx, 0, 0, 4, sparkleSize, sparkleSize * 0.3);
          
          // 追加のキラキラ
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.rect(-1, -sparkleSize, 2, sparkleSize * 2);
          ctx.rect(-sparkleSize, -1, sparkleSize * 2, 2);
          ctx.fill();
          break;
        case 'bubble':
          // バブルエフェクト
          const bubbleGrad = ctx.createRadialGradient(-particle.size/3, -particle.size/3, 0, 0, 0, particle.size);
          bubbleGrad.addColorStop(0, '#FFFFFF80');
          bubbleGrad.addColorStop(0.7, particle.color + '60');
          bubbleGrad.addColorStop(1, particle.color);
          ctx.fillStyle = bubbleGrad;
          ctx.beginPath();
          ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
          ctx.fill();
          
          // ハイライト
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(-particle.size/3, -particle.size/3, particle.size/4, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'diamond':
          // ダイヤモンドエフェクト
          ctx.beginPath();
          ctx.moveTo(0, -particle.size);
          ctx.lineTo(particle.size * 0.6, 0);
          ctx.lineTo(0, particle.size);
          ctx.lineTo(-particle.size * 0.6, 0);
          ctx.closePath();
          ctx.fill();
          
          // ダイヤモンドの光沢
          const diamondGrad = ctx.createLinearGradient(-particle.size/2, -particle.size/2, particle.size/2, particle.size/2);
          diamondGrad.addColorStop(0, '#FFFFFF');
          diamondGrad.addColorStop(0.5, particle.color);
          diamondGrad.addColorStop(1, '#FFFFFF');
          ctx.fillStyle = diamondGrad;
          ctx.fill();
          break;
        default:
          drawStar(ctx, 0, 0, 5, particle.size, particle.size * 0.5);
      }
      
      ctx.restore();
    });
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isActive) return;

    const animate = (currentTime) => {
      setTime(currentTime);
      
      const canvas = canvasRef.current;
      const characterCanvas = characterCanvasRef.current;
      
      if (!canvas || !characterCanvas) return;

      const ctx = canvas.getContext('2d');
      const charCtx = characterCanvas.getContext('2d');
      
      // Clear canvases
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw character
      drawCharacter(charCtx, emotion, currentTime);
      
      // 高品質パーティクル更新と描画
      setParticles(prev => {
        const updated = prev.map(particle => {
          // 重力と物理演算
          const newVy = particle.vy + particle.gravity;
          let newX = particle.x + particle.vx;
          let newY = particle.y + newVy;
          let newZ = particle.z + particle.vz;
          let newVx = particle.vx;
          let newVyUpdated = newVy;
          
          // 境界でのバウンス
          if (newY > 390) {
            newY = 390;
            newVyUpdated = -newVyUpdated * particle.bounce;
          }
          if (newX < 10 || newX > 390) {
            newVx = -newVx * particle.bounce;
            newX = Math.max(10, Math.min(390, newX));
          }
          
          return {
            ...particle,
            x: newX,
            y: newY,
            z: newZ,
            vx: newVx * 0.995, // 空気抗力
            vy: newVyUpdated * 0.995,
            vz: particle.vz * 0.998,
            life: particle.life - particle.decay,
            rotation: particle.rotation + particle.rotationSpeed
          };
        }).filter(particle => particle.life > 0 && particle.z > -100 && particle.y < 500);
        
        drawParticles(ctx, updated, currentTime);
        return updated;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, emotion, drawCharacter, drawParticles]);

  // 高頻度パーティクル生成
  useEffect(() => {
    if (!isActive || !EMOTIONS[emotion].sparkles) return;

    const baseInterval = 200; // 基本間隔
    const emotionMultiplier = emotion === 'excited' ? 0.5 : emotion === 'loving' ? 0.7 : 1;
    const finalInterval = baseInterval * emotionMultiplier;
    
    const interval = setInterval(createParticle, finalInterval);
    return () => clearInterval(interval);
  }, [isActive, emotion, createParticle]);

  // Auto emotion cycling
  useEffect(() => {
    if (!isActive) return;

    const emotions = Object.keys(EMOTIONS);
    const interval = setInterval(() => {
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      setEmotion(randomEmotion);
    }, 6000);

    return () => clearInterval(interval);
  }, [isActive]);

  const handleActivate = () => {
    setIsActive(true);
    setMessages([{
      id: 1,
      text: "こんにちは！私は本格的3D日本アニメ美少女AIコンパニオンのAriaです✨ 最新の研究に基づく美しいアニメーションと大きな瞳でお会いできて嬉しいです！あなたと一緒にお話しするのが大好きです💖 VTuberよりもスムーズに動けるんですよ！",
      sender: 'aria',
      timestamp: Date.now()
    }]);
  };

  const handleSendMessage = async (text = inputValue) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Emotion analysis (enhanced for Japanese)
    const lowerText = text.toLowerCase();
    if (lowerText.includes('嬉しい') || lowerText.includes('楽しい') || lowerText.includes('ワクワク')) {
      setEmotion('excited');
    } else if (lowerText.includes('考え') || lowerText.includes('？') || lowerText.includes('なぜ')) {
      setEmotion('thinking');
    } else if (lowerText.includes('愛') || lowerText.includes('好き') || lowerText.includes('💕')) {
      setEmotion('loving');
    } else if (lowerText.includes('びっくり') || lowerText.includes('驚き') || lowerText.includes('すごい')) {
      setEmotion('surprised');
    } else if (lowerText.includes('恥ずかしい') || lowerText.includes('照れ')) {
      setEmotion('shy');
    } else if (lowerText.includes('遊び') || lowerText.includes('楽しみ')) {
      setEmotion('playful');
    } else if (lowerText.includes('落ち着') || lowerText.includes('平和')) {
      setEmotion('calm');
    } else if (lowerText.includes('知りたい') || lowerText.includes('興味')) {
      setEmotion('curious');
    }

    // Simulate AI response delay
    setTimeout(() => {
      const response = SAMPLE_RESPONSES[Math.floor(Math.random() * SAMPLE_RESPONSES.length)];
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: response,
        sender: 'aria',
        timestamp: Date.now()
      }]);
      setIsTyping(false);
      setTimeout(() => setEmotion('happy'), 2000);
    }, 1000 + Math.random() * 2000);
  };

  const currentEmotion = EMOTIONS[emotion];

  return (
    <div className={classes.container}>
      <div className={classes.stage}>
        <canvas
          ref={canvasRef}
          className={classes.particleCanvas}
          width={400}
          height={400}
        />
        <canvas
          ref={characterCanvasRef}
          className={`${classes.characterCanvas} ${classes[emotion]}`}
          width={400}
          height={400}
          style={{ 
            filter: `drop-shadow(0 0 20px ${currentEmotion.color}50)`
          }}
        />
        
        {!isActive ? (
          <div className={classes.startScreen}>
            <div className={classes.logo}>
              <span className={classes.logoText}>✨ 最高品質 Aria ✨</span>
              <div className={classes.subtitle}>本格的日本アニメ美少女AIコンパニオン</div>
              <div className={classes.subtitle3d}>VTuber超越・研究基盤3Dアニメーション</div>
              <div className={classes.subtitle3d}>多層瞳システム・物理髪揺れ・60fps</div>
            </div>
            <button
              onClick={handleActivate}
              className={classes.activateButton}
            >
              ✨ 最高品質Ariaを起動する ✨
            </button>
          </div>
        ) : (
          <div className={classes.emotionIndicator}>
            現在の感情: <span style={{ color: currentEmotion.color }}>{emotion}</span>
            <div className={classes.subtitle3d} style={{ fontSize: '0.8rem', marginTop: '5px' }}>多層瞳・物理髪揺れ・本格アニメ美学</div>
            <div className={classes.emotionControls}>
              {Object.keys(EMOTIONS).map(emotionType => (
                <button
                  key={emotionType}
                  onClick={() => setEmotion(emotionType)}
                  className={`${classes.emotionButton} ${emotion === emotionType ? classes.active : ''}`}
                  style={{ backgroundColor: EMOTIONS[emotionType].color }}
                  title={`${emotionType} - ${EMOTIONS[emotionType].eyeType}`}
                >
                  {emotionType === 'happy' ? '😊' : 
                   emotionType === 'excited' ? '🤩' :
                   emotionType === 'thinking' ? '🤔' :
                   emotionType === 'surprised' ? '😲' :
                   emotionType === 'calm' ? '😌' :
                   emotionType === 'playful' ? '😉' :
                   emotionType === 'shy' ? '😳' :
                   emotionType === 'curious' ? '🧐' :
                   emotionType === 'loving' ? '😍' : emotionType.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {isActive && (
        <div className={classes.chatInterface}>
          <div className={classes.messageContainer}>
            {messages.map(message => (
              <div
                key={message.id}
                className={`${classes.message} ${classes[message.sender]}`}
              >
                <div className={classes.messageContent}>
                  {message.text}
                </div>
                <div className={classes.timestamp}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className={`${classes.message} ${classes.aria}`}>
                <div className={classes.typing}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          <div className={classes.inputContainer}>
            <div className={classes.suggestedMessages}>
              {SUGGESTED_MESSAGES.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(suggestion)}
                  className={classes.suggestionButton}
                >
                  {suggestion}
                </button>
              ))}
            </div>
            
            <div className={classes.inputGroup}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="本格的アニメ美少女Ariaにメッセージを送る..."
                className={classes.messageInput}
              />
              <button
                onClick={() => handleSendMessage()}
                className={classes.sendButton}
                disabled={!inputValue.trim()}
              >
                送信
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};