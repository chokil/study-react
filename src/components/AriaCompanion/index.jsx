import { useState, useEffect, useRef, useCallback } from 'react';
import classes from './AriaCompanion.module.css';

// 本格的日本アニメ美少女感情システム
const EMOTIONS = {
  happy: { 
    face: 'happy',
    eyes: 'crescent', 
    mouth: 'smile', 
    blush: 0.8, 
    color: '#FFB6C1', 
    sparkles: true,
    bounce: false,
    rotation: false
  },
  excited: { 
    face: 'excited',
    eyes: 'star', 
    mouth: 'open_excited', 
    blush: 0.9, 
    color: '#FF69B4', 
    sparkles: true, 
    bounce: true,
    rotation: false
  },
  thinking: { 
    face: 'thinking',
    eyes: 'half', 
    mouth: 'neutral', 
    blush: 0.4, 
    color: '#87CEEB', 
    sparkles: false,
    bounce: false,
    rotation: true
  },
  surprised: { 
    face: 'surprised',
    eyes: 'wide', 
    mouth: 'open_round', 
    blush: 0.6, 
    color: '#FFD700', 
    sparkles: true,
    bounce: false,
    rotation: false,
    scale: true
  },
  calm: { 
    face: 'calm',
    eyes: 'gentle', 
    mouth: 'soft_smile', 
    blush: 0.5, 
    color: '#98FB98', 
    sparkles: false,
    bounce: false,
    rotation: false,
    float: true
  },
  playful: { 
    face: 'playful',
    eyes: 'wink', 
    mouth: 'playful_grin', 
    blush: 0.7, 
    color: '#FF6347', 
    sparkles: true,
    bounce: false,
    rotation: false,
    wiggle: true
  },
  shy: { 
    face: 'shy',
    eyes: 'closed', 
    mouth: 'small_smile', 
    blush: 1.0, 
    color: '#F0E68C', 
    sparkles: false,
    bounce: false,
    rotation: false,
    shrink: true
  },
  curious: { 
    face: 'curious',
    eyes: 'sparkle', 
    mouth: 'curious_open', 
    blush: 0.6, 
    color: '#DDA0DD', 
    sparkles: true,
    bounce: false,
    rotation: false,
    tilt: true
  },
  loving: { 
    face: 'loving',
    eyes: 'heart', 
    mouth: 'loving_smile', 
    blush: 0.9, 
    color: '#FF1493', 
    sparkles: true,
    bounce: false,
    rotation: false,
    pulse: true
  }
};

// プレースホルダー美少女画像データ（Data URL形式）
// SSR対応のため、画像生成はクライアントサイドでのみ実行
const generateCharacterImages = () => {
  // SSR時は空のオブジェクトを返す
  if (typeof window === 'undefined') return null;
  
  return {
    // ベース顔画像（感情別）
    faces: {
      happy: generateAnimeCharacterImage('happy'),
      excited: generateAnimeCharacterImage('excited'),
      thinking: generateAnimeCharacterImage('thinking'),
      surprised: generateAnimeCharacterImage('surprised'),
      calm: generateAnimeCharacterImage('calm'),
      playful: generateAnimeCharacterImage('playful'),
      shy: generateAnimeCharacterImage('shy'),
      curious: generateAnimeCharacterImage('curious'),
      loving: generateAnimeCharacterImage('loving')
    },
    // レイヤー画像
    hair: generateHairImage(),
    accessories: generateAccessoriesImage(),
    background: generateBackgroundImage()
  };
};

// 日本アニメ美少女キャラクター画像生成関数
function generateAnimeCharacterImage(emotion) {
  // SSR対応チェック - クライアントサイドでのみ実行
  if (typeof window === 'undefined') return '';
  
  // Canvas を使用してプレースホルダー美少女キャラクター画像を生成
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  
  // 透明背景
  ctx.clearRect(0, 0, 400, 400);
  
  const centerX = 200;
  const centerY = 200;
  
  // 顔の基本形状（アニメスタイル）
  const faceGradient = ctx.createRadialGradient(centerX-20, centerY-40, 0, centerX, centerY-20, 80);
  faceGradient.addColorStop(0, '#FDBCB4'); // アニメ肌色
  faceGradient.addColorStop(0.7, '#F8A5A0');
  faceGradient.addColorStop(1, '#F2948C');
  ctx.fillStyle = faceGradient;
  
  // 顔の輪郭（アニメスタイル - 逆三角形）
  ctx.beginPath();
  ctx.ellipse(centerX, centerY-20, 60, 70, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 顔のハイライト
  const highlightGrad = ctx.createRadialGradient(centerX-25, centerY-45, 0, centerX-15, centerY-35, 30);
  highlightGrad.addColorStop(0, 'rgba(255,255,255,0.6)');
  highlightGrad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = highlightGrad;
  ctx.beginPath();
  ctx.ellipse(centerX-15, centerY-35, 25, 20, -0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // 大きなアニメ瞳（感情別）
  drawAnimeEyes(ctx, centerX, centerY, emotion);
  
  // 眉毛
  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  
  // 左眉
  ctx.beginPath();
  ctx.moveTo(centerX-45, centerY-65);
  ctx.quadraticCurveTo(centerX-25, centerY-70, centerX-5, centerY-65);
  ctx.stroke();
  
  // 右眉
  ctx.beginPath();
  ctx.moveTo(centerX+5, centerY-65);
  ctx.quadraticCurveTo(centerX+25, centerY-70, centerX+45, centerY-65);
  ctx.stroke();
  
  // 鼻（小さなアニメ鼻）
  ctx.fillStyle = '#F8A5A0';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY-10, 3, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 口（感情別）
  drawAnimeMouth(ctx, centerX, centerY, emotion);
  
  // ブラッシュ（感情別強度）
  const emotion_data = EMOTIONS[emotion];
  if (emotion_data && emotion_data.blush > 0) {
    const blushAlpha = emotion_data.blush * 0.4;
    ctx.fillStyle = `rgba(255, 105, 180, ${blushAlpha})`;
    
    // 左ブラッシュ
    ctx.beginPath();
    ctx.ellipse(centerX-40, centerY+5, 15, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 右ブラッシュ
    ctx.beginPath();
    ctx.ellipse(centerX+40, centerY+5, 15, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  
  return canvas.toDataURL();
}

// アニメ瞳描画（感情別）
function drawAnimeEyes(ctx, centerX, centerY, emotion) {
  const eyeY = centerY - 30;
  const eyeWidth = 45; // さらに大きなアニメ瞳
  const eyeHeight = 40;
  
  // 左目
  drawSingleAnimeEye(ctx, centerX-30, eyeY, eyeWidth, eyeHeight, emotion, 'left');
  
  // 右目（ウィンク考慮）
  if (emotion === 'playful') {
    // ウィンク
    ctx.strokeStyle = '#2C2C2C';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(centerX+15, eyeY);
    ctx.quadraticCurveTo(centerX+30, eyeY+8, centerX+45, eyeY);
    ctx.stroke();
  } else {
    drawSingleAnimeEye(ctx, centerX+30, eyeY, eyeWidth, eyeHeight, emotion, 'right');
  }
}

// 単一アニメ瞳描画
function drawSingleAnimeEye(ctx, x, y, width, height, emotion, side) {
  // 感情別瞳処理
  if (emotion === 'shy' || emotion === 'happy') {
    // 閉じた目/三日月目
    ctx.strokeStyle = '#2C2C2C';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(x, y+10, width*0.7, 0, Math.PI);
    ctx.stroke();
    return;
  }
  
  // 外枠
  ctx.strokeStyle = '#2C2C2C';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(x, y, width/2, height/2, 0, 0, Math.PI * 2);
  ctx.stroke();
  
  // 白目
  const whiteGrad = ctx.createRadialGradient(x, y-height/4, 0, x, y, width/2);
  whiteGrad.addColorStop(0, '#FFFFFF');
  whiteGrad.addColorStop(0.8, '#F8F8FF');
  whiteGrad.addColorStop(1, '#F0F0F8');
  ctx.fillStyle = whiteGrad;
  ctx.beginPath();
  ctx.ellipse(x, y, width/2-2, height/2-2, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 虹彩（感情別色）
  let irisColor1, irisColor2;
  switch(emotion) {
    case 'loving':
      irisColor1 = '#FF1493';
      irisColor2 = '#FFB6C1';
      break;
    case 'excited':
      irisColor1 = '#4169E1';
      irisColor2 = '#FFD700';
      break;
    case 'curious':
      irisColor1 = '#9370DB';
      irisColor2 = '#DDA0DD';
      break;
    default:
      irisColor1 = '#4169E1';
      irisColor2 = '#87CEEB';
  }
  
  const irisSize = width * 0.3;
  const irisGrad = ctx.createRadialGradient(x, y, 0, x, y, irisSize);
  irisGrad.addColorStop(0, irisColor1);
  irisGrad.addColorStop(0.6, irisColor2);
  irisGrad.addColorStop(1, '#2C5F9C');
  
  ctx.fillStyle = irisGrad;
  ctx.beginPath();
  ctx.ellipse(x, y+height/8, irisSize, irisSize, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // 瞳孔（感情別形状）
  const pupilSize = irisSize * 0.4;
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  
  if (emotion === 'loving') {
    // ハート形瞳孔
    drawHeart(ctx, x, y+height/8, pupilSize);
  } else if (emotion === 'excited') {
    // 星形瞳孔
    drawStar(ctx, x, y+height/8, 5, pupilSize, pupilSize*0.6);
  } else {
    // 通常瞳孔
    ctx.ellipse(x, y+height/8, pupilSize, pupilSize, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // ハイライト
  const highlight = ctx.createRadialGradient(x-width/6, y-height/4, 0, x-width/6, y-height/4, width/4);
  highlight.addColorStop(0, '#FFFFFF');
  highlight.addColorStop(0.3, 'rgba(255,255,255,0.8)');
  highlight.addColorStop(1, 'rgba(255,255,255,0)');
  
  ctx.fillStyle = highlight;
  ctx.beginPath();
  ctx.ellipse(x-width/6, y-height/4, width/6, height/5, 0, 0, Math.PI * 2);
  ctx.fill();

  // サブハイライトでキラキラ感を追加
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.beginPath();
  ctx.ellipse(x+width/6, y-height/8, width/8, height/8, 0, 0, Math.PI * 2);
  ctx.fill();

  // 下部反射
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath();
  ctx.ellipse(x, y+height/3, width/3, height/10, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // まつ毛
  ctx.strokeStyle = '#2C2C2C';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  
  // 上まつ毛
  for (let i = 0; i < 6; i++) {
    const lashX = x - width/2 + (i * width/5);
    ctx.beginPath();
    ctx.moveTo(lashX, y - height/2);
    ctx.lineTo(lashX + 1, y - height/2 - 6);
    ctx.stroke();
  }
}

// アニメ口描画（感情別）
function drawAnimeMouth(ctx, centerX, centerY, emotion) {
  const mouthY = centerY + 20;
  
  ctx.strokeStyle = '#FF1493';
  ctx.fillStyle = '#FF1493';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  
  switch(emotion) {
    case 'happy':
    case 'loving':
      // スマイル
      ctx.beginPath();
      ctx.arc(centerX, mouthY, 15, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.stroke();
      break;
      
    case 'excited':
      // 大きく開いた口
      const exciteGrad = ctx.createRadialGradient(centerX, mouthY, 0, centerX, mouthY, 12);
      exciteGrad.addColorStop(0, '#FF69B4');
      exciteGrad.addColorStop(1, '#FF1493');
      ctx.fillStyle = exciteGrad;
      ctx.beginPath();
      ctx.ellipse(centerX, mouthY, 8, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // 歯
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(centerX-6, mouthY-6, 12, 3);
      break;
      
    case 'surprised':
      // 驚き口
      ctx.fillStyle = '#FF1493';
      ctx.beginPath();
      ctx.ellipse(centerX, mouthY, 6, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
      
    case 'shy':
    case 'calm':
      // 小さなスマイル
      ctx.beginPath();
      ctx.arc(centerX, mouthY, 8, 0.25 * Math.PI, 0.75 * Math.PI);
      ctx.stroke();
      break;
      
    case 'playful':
      // いたずらな笑み
      ctx.beginPath();
      ctx.arc(centerX-2, mouthY, 12, 0.1 * Math.PI, 0.7 * Math.PI);
      ctx.stroke();
      break;
      
    case 'curious':
      // 好奇心口
      ctx.beginPath();
      ctx.ellipse(centerX, mouthY, 5, 7, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;
      
    default: // thinking, neutral
      // 真一文字
      ctx.beginPath();
      ctx.moveTo(centerX-8, mouthY);
      ctx.lineTo(centerX+8, mouthY);
      ctx.stroke();
  }
  
  // 口の光沢
  if (emotion === 'happy' || emotion === 'loving' || emotion === 'calm') {
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, mouthY-2, 10, 0.3 * Math.PI, 0.7 * Math.PI);
    ctx.stroke();
  }
}

// ヘルパー関数：ハート描画
function drawHeart(ctx, x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y + size/4);
  ctx.bezierCurveTo(x, y, x - size/2, y - size/2, x - size/2, y + size/8);
  ctx.bezierCurveTo(x - size/2, y + size/4, x, y + size/2, x, y + size);
  ctx.bezierCurveTo(x, y + size/2, x + size/2, y + size/4, x + size/2, y + size/8);
  ctx.bezierCurveTo(x + size/2, y - size/2, x, y, x, y + size/4);
  ctx.closePath();
  ctx.fill();
}

// ヘルパー関数：星描画
function drawStar(ctx, x, y, spikes, outerRadius, innerRadius) {
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
}

// 髪の画像生成
function generateHairImage() {
  // SSR対応チェック - クライアントサイドでのみ実行
  if (typeof window === 'undefined') return '';
  
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  
  ctx.clearRect(0, 0, 400, 400);
  
  const centerX = 200;
  const centerY = 200;
  
  // ツインテール髪色
  const hairGrad = ctx.createLinearGradient(0, 100, 0, 300);
  hairGrad.addColorStop(0, '#FFC0CB'); // ライトピンク
  hairGrad.addColorStop(0.5, '#FF69B4'); // ビビッドピンク
  hairGrad.addColorStop(1, '#FF1493'); // ディープピンク
  
  // 前髪
  ctx.fillStyle = hairGrad;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY-40, 65, 45, 0, 0, Math.PI);
  ctx.fill();
  
  // 前髪ストランド
  for (let i = 0; i < 7; i++) {
    const x = centerX - 35 + i * 10;
    ctx.beginPath();
    ctx.moveTo(x, centerY-70);
    ctx.quadraticCurveTo(x - 2, centerY-55, x + 3, centerY-40);
    ctx.quadraticCurveTo(x + 6, centerY-45, x + 4, centerY-50);
    ctx.lineWidth = 5;
    ctx.strokeStyle = hairGrad;
    ctx.stroke();
  }
  
  // 左ツインテール
  ctx.save();
  ctx.translate(centerX-50, centerY-20);
  for (let i = 0; i < 3; i++) {
    const offset = i * 10 - 10;
    ctx.fillStyle = hairGrad;
    ctx.beginPath();
    ctx.ellipse(offset, 20, 10, 35, Math.sin(i) * 0.1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  
  // 右ツインテール
  ctx.save();
  ctx.translate(centerX+50, centerY-20);
  for (let i = 0; i < 3; i++) {
    const offset = i * 10 - 10;
    ctx.fillStyle = hairGrad;
    ctx.beginPath();
    ctx.ellipse(offset, 20, 10, 35, Math.sin(i + Math.PI) * 0.1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  
  // 髪のハイライト
  const hairHighlight = ctx.createLinearGradient(centerX-30, centerY-70, centerX-15, centerY-40);
  hairHighlight.addColorStop(0, 'rgba(255,255,255,0.4)');
  hairHighlight.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = hairHighlight;
  ctx.beginPath();
  ctx.ellipse(centerX-20, centerY-55, 12, 25, -0.3, 0, Math.PI * 2);
  ctx.fill();
  
  return canvas.toDataURL();
}

// アクセサリー画像生成
function generateAccessoriesImage() {
  // SSR対応チェック - クライアントサイドでのみ実行
  if (typeof window === 'undefined') return '';
  
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  
  ctx.clearRect(0, 0, 400, 400);
  
  const centerX = 200;
  const centerY = 200;
  
  // リボン（左）
  const ribbonGrad = ctx.createLinearGradient(centerX-50, centerY-30, centerX-50, centerY-15);
  ribbonGrad.addColorStop(0, '#FFD700');
  ribbonGrad.addColorStop(0.5, '#FFA500');
  ribbonGrad.addColorStop(1, '#FF8C00');
  
  ctx.fillStyle = ribbonGrad;
  ctx.fillRect(centerX-58, centerY-28, 16, 12);
  
  // リボンの結び
  ctx.beginPath();
  ctx.moveTo(centerX-54, centerY-16);
  ctx.lineTo(centerX-58, centerY-12);
  ctx.lineTo(centerX-50, centerY-14);
  ctx.lineTo(centerX-42, centerY-12);
  ctx.lineTo(centerX-46, centerY-16);
  ctx.fill();
  
  // リボン（右）
  ctx.fillRect(centerX+42, centerY-28, 16, 12);
  ctx.beginPath();
  ctx.moveTo(centerX+46, centerY-16);
  ctx.lineTo(centerX+42, centerY-12);
  ctx.lineTo(centerX+50, centerY-14);
  ctx.lineTo(centerX+58, centerY-12);
  ctx.lineTo(centerX+54, centerY-16);
  ctx.fill();
  
  // ドレスのリボン
  ctx.fillRect(centerX-45, centerY+65, 90, 10);
  ctx.fillStyle = '#CC8400';
  ctx.fillRect(centerX-45, centerY+73, 90, 2);
  
  return canvas.toDataURL();
}

// 背景画像生成
function generateBackgroundImage() {
  // SSR対応チェック - クライアントサイドでのみ実行
  if (typeof window === 'undefined') return '';
  
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  
  // 美しいドレス
  const dressGrad = ctx.createLinearGradient(200, 250, 200, 350);
  dressGrad.addColorStop(0, '#FFE4E6');
  dressGrad.addColorStop(0.3, '#FFB6C1');
  dressGrad.addColorStop(0.7, '#FF91A4');
  dressGrad.addColorStop(1, '#FF69B4');
  
  ctx.fillStyle = dressGrad;
  ctx.beginPath();
  ctx.ellipse(200, 280, 70, 60, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // ドレスパターン
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  for (let i = 0; i < 5; i++) {
    const x = 160 + i * 20;
    const y = 270;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // 小さな星
    ctx.fillStyle = '#FFD700';
    drawStar(ctx, x, y-15, 4, 4, 2);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
  }
  
  // 首
  const neckGrad = ctx.createLinearGradient(200, 235, 200, 260);
  neckGrad.addColorStop(0, '#FDBCB4');
  neckGrad.addColorStop(1, '#F8A5A0');
  ctx.fillStyle = neckGrad;
  ctx.fillRect(190, 235, 20, 30);
  
  return canvas.toDataURL();
}

// パフォーマンス設定
const PERFORMANCE_CONFIG = {
  MAX_PARTICLES: 30, // 最大パーティクル数
  PARTICLE_INTERVAL: {
    HIGH_PERFORMANCE: 200,
    NORMAL: 300, 
    LOW_PERFORMANCE: 500
  },
  FPS_THRESHOLD: 45 // パフォーマンス判定闾値
};

const SAMPLE_RESPONSES = [
  "やっほー！今日も一緒にがんばろうねっ☆",
  "わぁ、それすごく楽しそうだね〜♪",
  "えへへ、もっとお話ししてほしいな💕",
  "にゃんて素敵なアイデアなの〜！",
  "ドキドキしちゃうね！",
  "お話できて幸せだよ〜！",
  "それ、とってもカッコいいと思うよ！",
  "がんばってる姿、ちゃんと見てるからねっ✨",
  "もっともっと仲良くなりたいな〜",
  "キラキラ笑顔でいこうねっ☆"
];

const SUGGESTED_MESSAGES = [
  "今日も元気にいこうねっ！",
  "キラキラ笑顔見せて〜☆",
  "アリアのツインテールかわいい！",
  "一緒にアニメ語ろ？",
  "もっと仲良くなろうよ〜",
  "好きなことはなぁに？",
  "かわいい声で挨拶して！",
  "ドキドキするねっ♪",
];

export const AriaCompanion = () => {
  const [isActive, setIsActive] = useState(false);
  const [emotion, setEmotion] = useState('happy');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [particles, setParticles] = useState([]);
  const [time, setTime] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [isClient, setIsClient] = useState(false);
  
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const particleId = useRef(0);
  const imageLoadAbortController = useRef(null);

  // クライアントサイドチェック
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 画像プリロード（クライアントサイドのみ）
  useEffect(() => {
    if (!isClient) return;
    
    const abortController = new AbortController();
    imageLoadAbortController.current = abortController;
    
    const loadImages = async () => {
      const CHARACTER_IMAGES = generateCharacterImages();
      if (!CHARACTER_IMAGES) return;
      
      const images = {};
      const fallbackDataUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGRkI2QzEiLz4KPHN2Zz4K';
      
      try {
        // 顔画像をロード
        for (const [emotion, imageData] of Object.entries(CHARACTER_IMAGES.faces)) {
          if (abortController.signal.aborted) return;
          
          const img = new Image();
          img.src = imageData || fallbackDataUrl;
          
          await new Promise((resolve) => {
            const timeoutId = setTimeout(() => {
              console.warn(`Timeout loading face image for emotion: ${emotion}`);
              img.src = fallbackDataUrl;
              resolve();
            }, 5000);
            
            img.onload = () => {
              clearTimeout(timeoutId);
              resolve();
            };
            
            img.onerror = () => {
              clearTimeout(timeoutId);
              console.warn(`Failed to load face image for emotion: ${emotion}`);
              img.src = fallbackDataUrl;
              resolve();
            };
            
            abortController.signal.addEventListener('abort', () => {
              clearTimeout(timeoutId);
              resolve();
            });
          });
          
          images[`face_${emotion}`] = img;
        }
        
        // その他の画像をロード
        for (const [type, imageData] of Object.entries(CHARACTER_IMAGES)) {
          if (type !== 'faces' && !abortController.signal.aborted) {
            const img = new Image();
            img.src = imageData || fallbackDataUrl;
            
            await new Promise((resolve) => {
              const timeoutId = setTimeout(() => {
                console.warn(`Timeout loading ${type} image`);
                img.src = fallbackDataUrl;
                resolve();
              }, 5000);
              
              img.onload = () => {
                clearTimeout(timeoutId);
                resolve();
              };
              
              img.onerror = () => {
                clearTimeout(timeoutId);
                console.warn(`Failed to load ${type} image`);
                img.src = fallbackDataUrl;
                resolve();
              };
              
              abortController.signal.addEventListener('abort', () => {
                clearTimeout(timeoutId);
                resolve();
              });
            });
            
            images[type] = img;
          }
        }
        
        if (!abortController.signal.aborted) {
          setLoadedImages(images);
        }
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };
    
    loadImages();
    
    // クリーンアップ関数
    return () => {
      abortController.abort();
    };
  }, [isClient]);

  // パフォーマンスモニタリング
  const [performanceLevel, setPerformanceLevel] = useState('NORMAL');
  const fpsCounter = useRef({ frames: 0, lastTime: 0, fps: 60 });
  
  // 3Dパーティクルシステム（パフォーマンス最適化版）
  const createParticle = useCallback(() => {
    if (!EMOTIONS[emotion].sparkles || !isClient) return;
    
    const particleTypes = ['heart', 'star', 'sparkle', 'bubble', 'diamond'];
    
    const particle = {
      id: particleId.current++,
      x: 150 + Math.random() * 100,
      y: 150 + Math.random() * 100,
      z: Math.random() * 100,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2 - 1,
      vz: (Math.random() - 0.5) * 1,
      life: 1,
      decay: 0.003 + Math.random() * 0.007,
      size: 4 + Math.random() * 8,
      color: EMOTIONS[emotion].color,
      type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1
    };
    
    // パフォーマンスレベルに応じたパーティクル数制限
    const maxParticles = PERFORMANCE_CONFIG.MAX_PARTICLES;
    setParticles(prev => [...prev.slice(-maxParticles + 1), particle]);
  }, [emotion, isClient]);

  // パフォーマンスモニタリングとアニメーションループ
  useEffect(() => {
    if (!isActive || !isClient) return;

    const animate = (currentTime) => {
      // FPS計算
      fpsCounter.current.frames++;
      if (currentTime - fpsCounter.current.lastTime >= 1000) {
        fpsCounter.current.fps = fpsCounter.current.frames;
        fpsCounter.current.frames = 0;
        fpsCounter.current.lastTime = currentTime;
        
        // パフォーマンスレベル調整
        if (fpsCounter.current.fps < PERFORMANCE_CONFIG.FPS_THRESHOLD) {
          setPerformanceLevel('LOW_PERFORMANCE');
        } else if (fpsCounter.current.fps > 55) {
          setPerformanceLevel('HIGH_PERFORMANCE');
        } else {
          setPerformanceLevel('NORMAL');
        }
      }
      
      setTime(currentTime);
      
      // パーティクル更新（パフォーマンス最適化）
      setParticles(prev => {
        const updated = prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          z: particle.z + particle.vz,
          vx: particle.vx * 0.995,
          vy: particle.vy + 0.02, // 重力
          vz: particle.vz * 0.998,
          life: particle.life - particle.decay,
          rotation: particle.rotation + particle.rotationSpeed
        })).filter(particle => particle.life > 0 && particle.y < 500);
        
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
  }, [isActive, isClient]);

  // パーティクル生成（パフォーマンスアダプティブ）
  useEffect(() => {
    if (!isActive || !EMOTIONS[emotion].sparkles || !isClient) return;

    const intervalTime = PERFORMANCE_CONFIG.PARTICLE_INTERVAL[performanceLevel];
    const interval = setInterval(createParticle, intervalTime);
    return () => clearInterval(interval);
  }, [isActive, emotion, createParticle, performanceLevel, isClient]);

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
      text: "やっほー！未来から来た美少女AIコンパニオンのAriaだよっ☆ 本物の3D画像でキラキラな表情を見せちゃうんだから！感情ごとに違うお顔も楽しんでね〜💕",
      sender: 'aria',
      timestamp: Date.now()
    }]);
  };

  // キーボードイベントハンドラー
  const handleKeyDown = useCallback((event) => {
    // 感情切り替えショートカット（Ctrl + 1-9）
    if (event.ctrlKey && event.key >= '1' && event.key <= '9') {
      event.preventDefault();
      const emotions = Object.keys(EMOTIONS);
      const index = parseInt(event.key) - 1;
      if (index < emotions.length) {
        setEmotion(emotions[index]);
      }
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isActive, handleKeyDown]);

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

    // Emotion analysis
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
    <div 
      className={classes.container} 
      ref={containerRef}
      role="application"
      aria-label="Aria Companion - アニメスタイル美少女AIコンパニオン"
    >
      <div className={classes.stage}>
        {/* 3Dキャラクターレンダリング */}
        <div 
          className={`${classes.characterContainer} ${classes[emotion]}`}
          role="img"
          aria-label={`Ariaの現在の感情: ${emotion}`}
          aria-live="polite"
        >
          {/* 背景レイヤー（ドレス・体） */}
          <div className={classes.layer}>
            {loadedImages.background && (
              <img 
                src={loadedImages.background.src} 
                alt="Background"
                className={classes.backgroundLayer}
              />
            )}
          </div>
          
          {/* 顔レイヤー（感情別） */}
          <div className={classes.layer}>
            {loadedImages[`face_${emotion}`] && (
              <img 
                src={loadedImages[`face_${emotion}`].src} 
                alt={`Face ${emotion}`}
                className={classes.faceLayer}
                style={{ filter: `drop-shadow(0 0 20px ${currentEmotion.color}80)` }}
              />
            )}
          </div>
          
          {/* 髪レイヤー */}
          <div className={classes.layer}>
            {loadedImages.hair && (
              <img 
                src={loadedImages.hair.src} 
                alt="Hair"
                className={`${classes.hairLayer} ${classes.swaying}`}
              />
            )}
          </div>
          
          {/* アクセサリーレイヤー */}
          <div className={classes.layer}>
            {loadedImages.accessories && (
              <img 
                src={loadedImages.accessories.src} 
                alt="Accessories"
                className={classes.accessoryLayer}
              />
            )}
          </div>
        </div>

        {/* 3Dパーティクル */}
        <div className={classes.particleContainer}>
          {particles.map(particle => (
            <div
              key={particle.id}
              className={`${classes.particle} ${classes[particle.type]}`}
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                transform: `translateZ(${particle.z}px) rotate(${particle.rotation}rad) scale(${particle.life})`,
                backgroundColor: particle.color,
                opacity: particle.life,
                width: `${particle.size}px`,
                height: `${particle.size}px`
              }}
            />
          ))}
        </div>
        
        {!isActive ? (
          <div className={classes.startScreen}>
            <div className={classes.logo}>
              <span className={classes.logoText}>✨ 3D画像ベース Aria ✨</span>
              <div className={classes.subtitle}>本格的3D画像レンダリング美少女AIコンパニオン</div>
              <div className={classes.subtitle3d}>レイヤー分離システム・リアルタイム画像切り替え</div>
              <div className={classes.subtitle3d}>SVG卒業・本物の美少女画像・CSS3D</div>
            </div>
            <button
              onClick={handleActivate}
              className={classes.activateButton}
              aria-label="Ariaコンパニオンを起動してチャットを始める"
              type="button"
            >
              ✨ 3D画像ベースAriaを起動する ✨
            </button>
          </div>
        ) : (
          <div 
            className={classes.emotionIndicator}
            role="status"
            aria-live="polite"
            aria-label="感情コントロール"
          >
            現在の感情: <span style={{ color: currentEmotion.color }}>{emotion}</span>
            <div className={classes.subtitle3d} style={{ fontSize: '0.8rem', marginTop: '5px' }}>3D画像レンダリング・レイヤー分離システム</div>
            <div 
              className={classes.emotionControls}
              role="group"
              aria-label="感情切り替えボタングループ"
            >
              {Object.keys(EMOTIONS).map(emotionType => (
                <button
                  key={emotionType}
                  onClick={() => setEmotion(emotionType)}
                  className={`${classes.emotionButton} ${emotion === emotionType ? classes.active : ''}`}
                  style={{ backgroundColor: EMOTIONS[emotionType].color }}
                  title={`${emotionType} - 3D image rendering`}
                  aria-label={`感情を${emotionType}に変更`}
                  aria-pressed={emotion === emotionType}
                  type="button"
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
        <div 
          className={classes.chatInterface}
          role="complementary"
          aria-label="チャットインターフェース"
        >
          <div 
            className={classes.messageContainer}
            role="log"
            aria-label="チャットメッセージ履歴"
            aria-live="polite"
          >
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
                placeholder="3D画像ベース美少女Ariaにメッセージを送る..."
                className={classes.messageInput}
                aria-label="メッセージ入力フィールド"
                aria-describedby="input-help"
              />
              <button
                onClick={() => handleSendMessage()}
                className={classes.sendButton}
                disabled={!inputValue.trim()}
                aria-label="メッセージを送信"
                type="submit"
              >
                送信
              </button>
              <div id="input-help" className="sr-only">
                Enterキーで送信、Ctrl+1-9で感情切り替え
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};