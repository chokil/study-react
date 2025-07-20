import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classes from './AriaCompanion.module.css';

// Constants to replace magic numbers
const CANVAS_SIZE = 400;
const CHARACTER_CENTER_X = 200;
const CHARACTER_CENTER_Y = 200;
const MAX_PARTICLES = 30;
const MESSAGE_MAX_LENGTH = 500;
const EMOTION_CYCLE_INTERVAL = 6000;
const PARTICLE_GENERATION_INTERVAL = 300;

const EMOTIONS = {
  happy: { 
    eyes: 'crescent', 
    mouth: 'smile', 
    blush: 0.7, 
    color: '#FFB6C1', 
    sparkles: true,
    eyeScale: 0.9
  },
  excited: { 
    eyes: 'star', 
    mouth: 'open', 
    blush: 0.8, 
    color: '#FF69B4', 
    sparkles: true, 
    bounce: true,
    eyeScale: 1.2
  },
  thinking: { 
    eyes: 'half', 
    mouth: 'neutral', 
    blush: 0.4, 
    color: '#87CEEB', 
    rotation: true,
    eyeScale: 0.8
  },
  surprised: { 
    eyes: 'wide', 
    mouth: 'open', 
    blush: 0.6, 
    color: '#FFD700', 
    scale: true,
    eyeScale: 1.3
  },
  calm: { 
    eyes: 'gentle', 
    mouth: 'soft', 
    blush: 0.5, 
    color: '#98FB98', 
    float: true,
    eyeScale: 0.9
  },
  playful: { 
    eyes: 'wink', 
    mouth: 'playful', 
    blush: 0.7, 
    color: '#FF6347', 
    wiggle: true,
    eyeScale: 1.0
  },
  shy: { 
    eyes: 'closed', 
    mouth: 'small', 
    blush: 0.9, 
    color: '#F0E68C', 
    shrink: true,
    eyeScale: 0.7
  },
  curious: { 
    eyes: 'sparkle', 
    mouth: 'neutral', 
    blush: 0.6, 
    color: '#DDA0DD', 
    tilt: true,
    eyeScale: 1.1
  },
  loving: { 
    eyes: 'heart', 
    mouth: 'smile', 
    blush: 0.8, 
    color: '#FF1493', 
    pulse: true, 
    sparkles: true,
    eyeScale: 1.0
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
  "今日の気分はどう？",
  "おすすめのアニメは？",
  "好きなキャラクターは？",
  "リラックス方法を教えて",
  "元気が出る言葉をお願い！",
  "今日は何をしたの？"
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

  // 3D Character rendering with error handling
  const drawCharacter = useCallback((ctx, emotion, time) => {
    try {
      if (!ctx || !emotion || !EMOTIONS[emotion]) {
        console.warn('Invalid context or emotion provided to drawCharacter');
        return;
      }

      const centerX = CHARACTER_CENTER_X;
      const centerY = CHARACTER_CENTER_Y;
      const currentEmotion = EMOTIONS[emotion];
      
      // Clear canvas
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Breathing effect
    const breathOffset = Math.sin(time * 0.002) * 5;
    const blinkCycle = Math.sin(time * 0.001) * 0.5 + 0.5;
    const shouldBlink = Math.sin(time * 0.0003) > 0.95;
    
    ctx.save();
    ctx.translate(centerX, centerY + breathOffset);
    
    // Draw magical aura
    if (currentEmotion.sparkles) {
      const auraGradient = ctx.createRadialGradient(0, -20, 0, 0, -20, 120);
      auraGradient.addColorStop(0, `${currentEmotion.color}30`);
      auraGradient.addColorStop(1, `${currentEmotion.color}05`);
      ctx.fillStyle = auraGradient;
      ctx.beginPath();
      ctx.arc(0, -20, 120, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Body (3D perspective)
    ctx.save();
    ctx.scale(1, 0.8); // 3D perspective
    
    // Dress
    const dressGradient = ctx.createLinearGradient(0, 20, 0, 120);
    dressGradient.addColorStop(0, '#FFB6C1');
    dressGradient.addColorStop(0.5, '#FF91A4');
    dressGradient.addColorStop(1, '#FF69B4');
    ctx.fillStyle = dressGradient;
    ctx.beginPath();
    ctx.ellipse(0, 70, 60, 50, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Dress pattern
    ctx.fillStyle = '#FFE4E6';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(-30 + i * 30, 70, 8, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Dress ribbon
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(-40, 45, 80, 8);
    
    ctx.restore();
    
    // Neck
    ctx.fillStyle = '#FDBCB4';
    ctx.fillRect(-8, 15, 16, 25);
    
    // Head (3D shading)
    const headGradient = ctx.createRadialGradient(-10, -20, 0, 0, -10, 60);
    headGradient.addColorStop(0, '#FDBCB4');
    headGradient.addColorStop(0.7, '#F8A5A0');
    headGradient.addColorStop(1, '#F2948C');
    ctx.fillStyle = headGradient;
    ctx.beginPath();
    ctx.ellipse(0, -20, 45, 50, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Hair back (twin tails)
    ctx.fillStyle = '#6A5ACD';
    
    // Left twin tail
    ctx.save();
    ctx.translate(-35, -15);
    ctx.rotate(Math.sin(time * 0.003) * 0.1 - 0.2);
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Right twin tail
    ctx.save();
    ctx.translate(35, -15);
    ctx.rotate(Math.sin(time * 0.003 + Math.PI) * 0.1 + 0.2);
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Hair front
    const hairGradient = ctx.createLinearGradient(0, -70, 0, -20);
    hairGradient.addColorStop(0, '#9370DB');
    hairGradient.addColorStop(0.5, '#8A2BE2');
    hairGradient.addColorStop(1, '#6A5ACD');
    ctx.fillStyle = hairGradient;
    ctx.beginPath();
    ctx.ellipse(0, -35, 48, 35, 0, 0, Math.PI);
    ctx.fill();
    
    // Hair bangs
    ctx.fillStyle = '#8A2BE2';
    ctx.beginPath();
    ctx.moveTo(-30, -45);
    ctx.quadraticCurveTo(-15, -55, 0, -45);
    ctx.quadraticCurveTo(15, -55, 30, -45);
    ctx.quadraticCurveTo(15, -40, 0, -40);
    ctx.quadraticCurveTo(-15, -40, -30, -45);
    ctx.fill();
    
    // Hair ribbons
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(-38, -20, 8, 15);
    ctx.fillRect(30, -20, 8, 15);
    
    // Eyes
    const eyeScale = currentEmotion.eyeScale || 1.0;
    const eyeY = shouldBlink ? -25 : -30;
    const eyeHeight = shouldBlink ? 2 : 20 * eyeScale;
    const isWinking = currentEmotion.eyes === 'wink';
    
    // Left eye
    ctx.save();
    ctx.translate(-15, eyeY);
    drawSingleEye(ctx, currentEmotion.eyes, eyeHeight, true, isWinking);
    ctx.restore();
    
    // Right eye  
    ctx.save();
    ctx.translate(15, eyeY);
    drawSingleEye(ctx, currentEmotion.eyes, eyeHeight, false, isWinking);
    ctx.restore();
    
    // Eyebrows
    ctx.strokeStyle = '#6A5ACD';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    // Left eyebrow
    ctx.beginPath();
    ctx.moveTo(-25, -45);
    ctx.lineTo(-5, -50);
    ctx.stroke();
    
    // Right eyebrow
    ctx.beginPath();
    ctx.moveTo(5, -50);
    ctx.lineTo(25, -45);
    ctx.stroke();
    
    // Nose
    ctx.fillStyle = '#F8A5A0';
    ctx.beginPath();
    ctx.ellipse(0, -10, 2, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Mouth
    ctx.strokeStyle = '#FF1493';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    if (currentEmotion.mouth === 'smile') {
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.stroke();
    } else if (currentEmotion.mouth === 'open') {
      ctx.fillStyle = '#FF1493';
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, 12, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (currentEmotion.mouth === 'small') {
      ctx.beginPath();
      ctx.ellipse(0, 0, 5, 3, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(-8, 0);
      ctx.lineTo(8, 0);
      ctx.stroke();
    }
    
    // Blush
    const blushAlpha = currentEmotion.blush || 0.5;
    ctx.fillStyle = `rgba(255, 105, 180, ${blushAlpha})`;
    ctx.beginPath();
    ctx.ellipse(-25, -5, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(25, -5, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    } catch (error) {
      console.error('Error in drawCharacter:', error);
    }
  }, []);

  // Helper functions for special eye shapes (memoized for performance)
  const drawStar = useCallback((ctx, x, y, spikes, outerRadius, innerRadius) => {
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
  }, []);

  const drawHeart = useCallback((ctx, x, y, size) => {
    ctx.beginPath();
    ctx.moveTo(x, y + size/4);
    ctx.bezierCurveTo(x, y, x - size/2, y - size/2, x - size/2, y + size/8);
    ctx.bezierCurveTo(x - size/2, y + size/4, x, y + size/2, x, y + size);
    ctx.bezierCurveTo(x, y + size/2, x + size/2, y + size/4, x + size/2, y + size/8);
    ctx.bezierCurveTo(x + size/2, y - size/2, x, y, x, y + size/4);
    ctx.closePath();
    ctx.fill();
  }, []);

  // Helper function to draw individual eye (eliminates code duplication)
  const drawSingleEye = useCallback((ctx, eyeType, eyeHeight, isLeftEye = true, isWinking = false) => {
    // For winking, left eye is closed, right eye is normal
    const shouldDrawSpecialEye = isWinking ? isLeftEye : true;
    
    if (!shouldDrawSpecialEye || eyeType === 'wink') {
      // Draw normal eye for non-winking eye or when winking
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.ellipse(0, 0, 12, eyeHeight/2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Iris
      ctx.fillStyle = '#4169E1';
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, eyeHeight/3, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Pupil
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.ellipse(0, 0, 3, eyeHeight/6, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Highlight
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.ellipse(-2, -2, 2, eyeHeight/8, 0, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    // Draw special eye types
    switch (eyeType) {
      case 'crescent':
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 5, 12, 0, Math.PI);
        ctx.stroke();
        break;
      case 'star':
        ctx.fillStyle = '#FFD700';
        drawStar(ctx, 0, 0, 5, 12, 6);
        break;
      case 'heart':
        ctx.fillStyle = '#FF1493';
        drawHeart(ctx, 0, 0, 10);
        break;
      case 'closed':
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-12, 0);
        ctx.quadraticCurveTo(0, 5, 12, 0);
        ctx.stroke();
        break;
      default:
        // Normal eye (fallback)
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.ellipse(0, 0, 12, eyeHeight/2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#4169E1';
        ctx.beginPath();
        ctx.ellipse(0, 0, 8, eyeHeight/3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(0, 0, 3, eyeHeight/6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.ellipse(-2, -2, 2, eyeHeight/8, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
  }, [drawStar, drawHeart]);

  // Particle system for 3D magic effects
  const createParticle = useCallback(() => {
    if (!EMOTIONS[emotion].sparkles) return;
    
    const particle = {
      id: particleId.current++,
      x: Math.random() * CANVAS_SIZE,
      y: Math.random() * CANVAS_SIZE,
      z: Math.random() * 100, // 3D depth
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      vz: (Math.random() - 0.5) * 1,
      life: 1,
      decay: 0.005 + Math.random() * 0.01,
      size: 2 + Math.random() * 4,
      color: EMOTIONS[emotion].color,
      type: Math.random() > 0.5 ? 'heart' : 'star'
    };
    
    setParticles(prev => [...prev.slice(-MAX_PARTICLES), particle]);
  }, [emotion]);

  // 3D Particle rendering
  const drawParticles = useCallback((ctx, particleList, time) => {
    // Sort particles by Z depth for proper 3D rendering
    const sortedParticles = [...particleList].sort((a, b) => b.z - a.z);
    
    sortedParticles.forEach(particle => {
      const scale = 1 + particle.z * 0.01; // Depth scaling
      const alpha = particle.life * (1 + particle.z * 0.002);
      
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(particle.x, particle.y);
      ctx.scale(scale, scale);
      
      if (particle.type === 'heart') {
        ctx.fillStyle = particle.color;
        drawHeart(ctx, 0, 0, particle.size);
      } else {
        ctx.fillStyle = particle.color;
        drawStar(ctx, 0, 0, 5, particle.size, particle.size * 0.5);
      }
      
      ctx.restore();
    });
  }, []);

  // Animation loop with error handling
  useEffect(() => {
    if (!isActive) return;

    const animate = (currentTime) => {
      try {
        setTime(currentTime);
        
        const canvas = canvasRef.current;
        const characterCanvas = characterCanvasRef.current;
        
        if (!canvas || !characterCanvas) return;

        const ctx = canvas.getContext('2d');
        const charCtx = characterCanvas.getContext('2d');
        
        if (!ctx || !charCtx) {
          console.warn('Could not get canvas context');
          return;
        }
        
        // Clear canvases
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw character
        drawCharacter(charCtx, emotion, currentTime);
        
        // Update and draw particles
        setParticles(prev => {
          const updated = prev.map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            z: particle.z + particle.vz,
            life: particle.life - particle.decay
          })).filter(particle => particle.life > 0 && particle.z > -50);
          
          drawParticles(ctx, updated, currentTime);
          return updated;
        });

        animationRef.current = requestAnimationFrame(animate);
      } catch (error) {
        console.error('Error in animation loop:', error);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, emotion, drawCharacter, drawParticles]);

  // Particle generation
  useEffect(() => {
    if (!isActive || !EMOTIONS[emotion].sparkles) return;

    const interval = setInterval(createParticle, PARTICLE_GENERATION_INTERVAL);
    return () => clearInterval(interval);
  }, [isActive, emotion, createParticle]);

  // Auto emotion cycling
  useEffect(() => {
    if (!isActive) return;

    const emotions = Object.keys(EMOTIONS);
    const interval = setInterval(() => {
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      setEmotion(randomEmotion);
    }, EMOTION_CYCLE_INTERVAL);

    return () => clearInterval(interval);
  }, [isActive]);

  const handleActivate = () => {
    setIsActive(true);
    setMessages([{
      id: 1,
      text: "こんにちは！私はAriaです💕 今日はとても素敵な3Dアニメーションでお会いできて嬉しいです！アニメとおしゃべりが大好きです！",
      sender: 'aria',
      timestamp: Date.now()
    }]);
  };

  // Memoize emotion analysis patterns for performance
  const emotionPatterns = useMemo(() => ({
    excited: ['嬉しい', '楽しい', 'ワクワク'],
    thinking: ['考え', '？', 'なぜ'],
    loving: ['愛', '好き', '💕'],
    surprised: ['びっくり', '驚き', 'すごい'],
    shy: ['恥ずかしい', '照れ'],
    playful: ['遊び', '楽しみ'],
    calm: ['落ち着', '平和'],
    curious: ['知りたい', '興味']
  }), []);

  const handleSendMessage = useCallback(async (text = inputValue) => {
    if (!text.trim()) return;

    // Input sanitization for security
    const sanitizedText = text.trim().slice(0, MESSAGE_MAX_LENGTH);

    const userMessage = {
      id: Date.now(),
      text: sanitizedText,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Emotion analysis (enhanced for Japanese) - using memoized patterns
    const lowerText = sanitizedText.toLowerCase();
    const detectedEmotion = Object.entries(emotionPatterns).find(([emotion, patterns]) =>
      patterns.some(pattern => lowerText.includes(pattern))
    );
    
    if (detectedEmotion) {
      setEmotion(detectedEmotion[0]);
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
  }, [inputValue, emotionPatterns]);

  // Memoize expensive calculations for performance
  const currentEmotion = useMemo(() => EMOTIONS[emotion], [emotion]);
  
  // Memoize emotion control buttons
  const emotionControlButtons = useMemo(() => 
    Object.keys(EMOTIONS).map(emotionType => (
      <button
        key={emotionType}
        onClick={() => setEmotion(emotionType)}
        className={`${classes.emotionButton} ${emotion === emotionType ? classes.active : ''}`}
        style={{ backgroundColor: EMOTIONS[emotionType].color }}
        title={emotionType}
        tabIndex={0}
        role="button"
        aria-label={`感情を${emotionType}に変更`}
      >
        {emotionType.slice(0, 3)}
      </button>
    )), [emotion]
  );

  // Memoize suggested message buttons
  const suggestedMessageButtons = useMemo(() =>
    SUGGESTED_MESSAGES.map((suggestion, index) => (
      <button
        key={index}
        onClick={() => handleSendMessage(suggestion)}
        className={classes.suggestionButton}
        tabIndex={0}
        role="button"
        aria-label={`提案メッセージ: ${suggestion}`}
      >
        {suggestion}
      </button>
    )), [handleSendMessage]
  );

  return (
    <div className={classes.container}>
      <div className={classes.stage}>
        <canvas
          ref={canvasRef}
          className={classes.particleCanvas}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          aria-label="3Dパーティクルエフェクト"
          role="img"
        />
        <canvas
          ref={characterCanvasRef}
          className={`${classes.characterCanvas} ${classes[emotion]}`}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          style={{ 
            filter: `drop-shadow(0 0 20px ${currentEmotion.color}50)`
          }}
          aria-label={`3Dアニメキャラクター Aria - 現在の感情: ${emotion}`}
          role="img"
        />
        
        {!isActive ? (
          <div className={classes.startScreen}>
            <div className={classes.logo}>
              <span className={classes.logoText}>✨ 3D Aria ✨</span>
              <div className={classes.subtitle}>日本アニメ美少女AIコンパニオン</div>
              <div className={classes.subtitle3d}>VTuber超越3Dアニメーション</div>
            </div>
            <button
              onClick={handleActivate}
              className={classes.activateButton}
              aria-label="Ariaコンパニオンを起動"
            >
              ✨ Ariaを起動する ✨
            </button>
          </div>
        ) : (
          <div className={classes.emotionIndicator}>
            感情: <span style={{ color: currentEmotion.color }}>{emotion}</span>
            <div className={classes.emotionControls} role="group" aria-label="感情コントロール">
              {emotionControlButtons}
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
            <div className={classes.suggestedMessages} role="group" aria-label="提案メッセージ">
              {suggestedMessageButtons}
            </div>
            
            <div className={classes.inputGroup}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ariaにメッセージを送る..."
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

// PropTypes for type safety
AriaCompanion.propTypes = {
  // Component currently doesn't accept props, but adding for future extensibility
  initialEmotion: PropTypes.oneOf(Object.keys(EMOTIONS)),
  autoEmotionCycle: PropTypes.bool,
  maxMessageLength: PropTypes.number,
  canvasSize: PropTypes.number
};

AriaCompanion.defaultProps = {
  initialEmotion: 'happy',
  autoEmotionCycle: true,
  maxMessageLength: MESSAGE_MAX_LENGTH,
  canvasSize: CANVAS_SIZE
};