import { useState, useEffect, useRef, useCallback } from 'react';
import classes from './AriaCompanion.module.css';

const EMOTIONS = {
  happy: { 
    face: 'happy', 
    color: '#FFB6C1', 
    sparkles: true,
    animation: 'bounce',
    intensity: 0.7
  },
  excited: { 
    face: 'excited', 
    color: '#FF69B4', 
    sparkles: true, 
    animation: 'spin',
    intensity: 0.9
  },
  thinking: { 
    face: 'thinking', 
    color: '#87CEEB', 
    animation: 'rotate',
    intensity: 0.4
  },
  surprised: { 
    face: 'surprised', 
    color: '#FFD700', 
    animation: 'scale',
    intensity: 0.6
  },
  calm: { 
    face: 'calm', 
    color: '#98FB98', 
    animation: 'float',
    intensity: 0.5
  },
  playful: { 
    face: 'playful', 
    color: '#FF6347', 
    animation: 'wiggle',
    intensity: 0.7
  },
  shy: { 
    face: 'shy', 
    color: '#F0E68C', 
    animation: 'shrink',
    intensity: 0.9
  },
  curious: { 
    face: 'curious', 
    color: '#DDA0DD', 
    animation: 'tilt',
    intensity: 0.6
  },
  loving: { 
    face: 'loving', 
    color: '#FF1493', 
    sparkles: true, 
    animation: 'pulse',
    intensity: 0.8
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

// Create anime character textures as data URIs
const createCharacterTextures = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  const textures = {};
  
  // Create base face texture
  const createFaceTexture = (emotion) => {
    ctx.clearRect(0, 0, 512, 512);
    
    // Face shape
    const faceGradient = ctx.createRadialGradient(256, 220, 50, 256, 220, 150);
    faceGradient.addColorStop(0, '#FDBCB4');
    faceGradient.addColorStop(0.7, '#F8A5A0');
    faceGradient.addColorStop(1, '#F2948C');
    ctx.fillStyle = faceGradient;
    ctx.beginPath();
    ctx.ellipse(256, 220, 140, 160, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes based on emotion
    drawAnimeFace(ctx, emotion);
    
    return canvas.toDataURL();
  };
  
  const drawAnimeFace = (ctx, emotion) => {
    // Large anime eyes
    const eyeWidth = 60;
    const eyeHeight = 80;
    const eyeY = 180;
    
    // Left eye
    ctx.save();
    ctx.translate(200, eyeY);
    drawAnimEye(ctx, emotion, 'left');
    ctx.restore();
    
    // Right eye  
    ctx.save();
    ctx.translate(312, eyeY);
    drawAnimEye(ctx, emotion, 'right');
    ctx.restore();
    
    // Nose
    ctx.fillStyle = '#F8A5A0';
    ctx.beginPath();
    ctx.ellipse(256, 240, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Mouth based on emotion
    drawAnimeMouth(ctx, emotion);
    
    // Blush
    const blushIntensity = EMOTIONS[emotion]?.intensity || 0.5;
    ctx.fillStyle = `rgba(255, 105, 180, ${blushIntensity})`;
    ctx.beginPath();
    ctx.ellipse(180, 250, 25, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(332, 250, 25, 20, 0, 0, Math.PI * 2);
    ctx.fill();
  };
  
  const drawAnimEye = (ctx, emotion, side) => {
    const eyeWidth = 50;
    const eyeHeight = 70;
    
    if (emotion === 'shy' || emotion === 'happy') {
      // Closed/crescent eyes
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, 10, eyeWidth/2, 0, Math.PI);
      ctx.stroke();
      return;
    }
    
    if (emotion === 'playful' && side === 'left') {
      // Wink
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, 10, eyeWidth/2, 0, Math.PI);
      ctx.stroke();
      return;
    }
    
    // White of eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(0, 0, eyeWidth/2, eyeHeight/2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Iris color based on emotion
    let irisColor = '#4169E1';
    if (emotion === 'loving') irisColor = '#FF1493';
    if (emotion === 'excited') irisColor = '#FF6347';
    if (emotion === 'thinking') irisColor = '#87CEEB';
    
    // Iris
    ctx.fillStyle = irisColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, eyeWidth/3, eyeHeight/3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupil
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(0, 0, eyeWidth/6, eyeHeight/6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Highlights
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(-8, -12, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(6, -6, 3, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Special effects for emotions
    if (emotion === 'loving') {
      // Heart-shaped highlights
      ctx.fillStyle = '#FF69B4';
      drawHeart(ctx, 0, -8, 8);
    } else if (emotion === 'excited') {
      // Star highlights
      ctx.fillStyle = '#FFD700';
      drawStar(ctx, 0, -8, 5, 8, 4);
    }
  };
  
  const drawAnimeMouth = (ctx, emotion) => {
    ctx.strokeStyle = '#FF1493';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    
    const mouthY = 280;
    
    switch(emotion) {
      case 'happy':
      case 'excited':
      case 'loving':
        ctx.beginPath();
        ctx.arc(256, mouthY, 20, 0.3 * Math.PI, 0.7 * Math.PI);
        ctx.stroke();
        break;
      case 'surprised':
        ctx.fillStyle = '#FF1493';
        ctx.beginPath();
        ctx.ellipse(256, mouthY, 12, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'shy':
        ctx.beginPath();
        ctx.ellipse(256, mouthY, 8, 6, 0, 0, Math.PI * 2);
        ctx.stroke();
        break;
      default:
        ctx.beginPath();
        ctx.moveTo(246, mouthY);
        ctx.lineTo(266, mouthY);
        ctx.stroke();
    }
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
  
  // Generate face textures for each emotion
  Object.keys(EMOTIONS).forEach(emotion => {
    textures[emotion] = createFaceTexture(emotion);
  });
  
  return textures;
};

export const AriaCompanion = () => {
  const [isActive, setIsActive] = useState(false);
  const [emotion, setEmotion] = useState('happy');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [particles, setParticles] = useState([]);
  const [time, setTime] = useState(0);
  const [textures, setTextures] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  
  const canvasRef = useRef(null);
  const characterRef = useRef(null);
  const animationRef = useRef(null);
  const particleId = useRef(0);

  // Initialize textures
  useEffect(() => {
    const characterTextures = createCharacterTextures();
    setTextures(characterTextures);
    setIsLoaded(true);
  }, []);

  // 3D Character rendering with image textures
  const render3DCharacter = useCallback((timestamp) => {
    if (!characterRef.current || !isLoaded) return;
    
    const character = characterRef.current;
    const currentEmotion = EMOTIONS[emotion];
    
    // Breathing animation
    const breathScale = 1 + Math.sin(timestamp * 0.002) * 0.05;
    const breathY = Math.sin(timestamp * 0.002) * 10;
    
    // Emotion-based animations
    let transform = `translate3d(-50%, -50%, 0) scale3d(${breathScale}, ${breathScale}, 1) translateY(${breathY}px)`;
    
    switch(currentEmotion.animation) {
      case 'bounce':
        const bounceY = Math.abs(Math.sin(timestamp * 0.004)) * 20;
        transform += ` translateY(${-bounceY}px)`;
        break;
      case 'spin':
        const rotation = (timestamp * 0.001) % (Math.PI * 2);
        transform += ` rotateY(${rotation}rad)`;
        break;
      case 'scale':
        const scaleBonus = 1 + Math.sin(timestamp * 0.005) * 0.1;
        transform += ` scale3d(${scaleBonus}, ${scaleBonus}, 1)`;
        break;
      case 'float':
        const floatY = Math.sin(timestamp * 0.003) * 15;
        const floatZ = Math.sin(timestamp * 0.002) * 50;
        transform += ` translateY(${floatY}px) translateZ(${floatZ}px)`;
        break;
      case 'wiggle':
        const wiggleX = Math.sin(timestamp * 0.008) * 10;
        const wiggleZ = Math.cos(timestamp * 0.006) * 20;
        transform += ` translateX(${wiggleX}px) rotateZ(${wiggleZ * 0.02}rad)`;
        break;
      case 'shrink':
        const shrinkScale = 0.9 + Math.sin(timestamp * 0.003) * 0.05;
        transform += ` scale3d(${shrinkScale}, ${shrinkScale}, 1)`;
        break;
      case 'tilt':
        const tiltX = Math.sin(timestamp * 0.004) * 15;
        const tiltY = Math.cos(timestamp * 0.003) * 10;
        transform += ` rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        break;
      case 'pulse':
        const pulseScale = 1 + Math.sin(timestamp * 0.006) * 0.1;
        const pulseGlow = Math.abs(Math.sin(timestamp * 0.005)) * 20;
        transform += ` scale3d(${pulseScale}, ${pulseScale}, 1)`;
        character.style.filter = `drop-shadow(0 0 ${pulseGlow}px ${currentEmotion.color})`;
        break;
    }
    
    character.style.transform = transform;
    
    if (currentEmotion.animation !== 'pulse') {
      character.style.filter = `drop-shadow(0 0 20px ${currentEmotion.color}50)`;
    }
    
    setTime(timestamp);
    
  }, [emotion, isLoaded]);

  // Enhanced particle system
  const createParticle = useCallback(() => {
    if (!EMOTIONS[emotion].sparkles) return;
    
    const particle = {
      id: particleId.current++,
      x: Math.random() * 400,
      y: Math.random() * 400,
      z: Math.random() * 200 - 100,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      vz: (Math.random() - 0.5) * 2,
      life: 1,
      decay: 0.003 + Math.random() * 0.007,
      size: 3 + Math.random() * 6,
      color: EMOTIONS[emotion].color,
      type: ['heart', 'star', 'sparkle', 'bubble', 'diamond'][Math.floor(Math.random() * 5)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1
    };
    
    setParticles(prev => [...prev.slice(-40), particle]);
  }, [emotion]);

  // 3D Particle rendering with physics
  const drawParticles = useCallback((ctx, particleList, timestamp) => {
    // Sort particles by Z depth for proper 3D rendering
    const sortedParticles = [...particleList].sort((a, b) => b.z - a.z);
    
    sortedParticles.forEach(particle => {
      const perspective = 300;
      const scale = perspective / (perspective + particle.z);
      const alpha = particle.life * Math.max(0.1, scale);
      
      if (scale < 0.1) return;
      
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(particle.x, particle.y);
      ctx.scale(scale, scale);
      ctx.rotate(particle.rotation);
      
      const size = particle.size * scale;
      
      switch(particle.type) {
        case 'heart':
          ctx.fillStyle = particle.color;
          drawHeart(ctx, 0, 0, size);
          break;
        case 'star':
          ctx.fillStyle = particle.color;
          drawStar(ctx, 0, 0, 5, size, size * 0.5);
          break;
        case 'sparkle':
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-size, 0);
          ctx.lineTo(size, 0);
          ctx.moveTo(0, -size);
          ctx.lineTo(0, size);
          ctx.stroke();
          break;
        case 'bubble':
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
          gradient.addColorStop(0, particle.color + '80');
          gradient.addColorStop(0.7, particle.color + '40');
          gradient.addColorStop(1, particle.color + '00');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, size, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'diamond':
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.moveTo(0, -size);
          ctx.lineTo(size * 0.7, 0);
          ctx.lineTo(0, size);
          ctx.lineTo(-size * 0.7, 0);
          ctx.closePath();
          ctx.fill();
          break;
      }
      
      ctx.restore();
    });
  }, []);

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

  // Animation loop
  useEffect(() => {
    if (!isActive || !isLoaded) return;

    const animate = (timestamp) => {
      // Render 3D character
      render3DCharacter(timestamp);
      
      // Update particles with physics
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        setParticles(prev => {
          const updated = prev.map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            z: particle.z + particle.vz,
            life: particle.life - particle.decay,
            rotation: particle.rotation + particle.rotationSpeed,
            // Physics effects
            vy: particle.vy + 0.02, // gravity
            vx: particle.vx * 0.999, // air resistance
            vz: particle.vz * 0.998
          })).filter(particle => 
            particle.life > 0 && 
            particle.z > -200 && 
            particle.x > -50 && particle.x < 450 &&
            particle.y > -50 && particle.y < 450
          );
          
          drawParticles(ctx, updated, timestamp);
          return updated;
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, isLoaded, render3DCharacter, drawParticles]);

  // Particle generation
  useEffect(() => {
    if (!isActive || !EMOTIONS[emotion].sparkles) return;

    const interval = setInterval(createParticle, 200);
    return () => clearInterval(interval);
  }, [isActive, emotion, createParticle]);

  const handleActivate = () => {
    setIsActive(true);
    setMessages([{
      id: 1,
      text: "こんにちは！私はAriaです💕 新しい3D画像レンダリングシステムでお会いできて嬉しいです！本物のアニメテクスチャを使って、もっとリアルになりました！",
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

    // Enhanced emotion analysis
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

    // Simulate AI response
    setTimeout(() => {
      const response = SAMPLE_RESPONSES[Math.floor(Math.random() * SAMPLE_RESPONSES.length)];
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: response,
        sender: 'aria',
        timestamp: Date.now()
      }]);
      setIsTyping(false);
      setTimeout(() => setEmotion('happy'), 3000);
    }, 1000 + Math.random() * 2000);
  };

  const currentEmotion = EMOTIONS[emotion];

  return (
    <div className={classes.container}>
      <div className={classes.stage}>
        {/* Particle Canvas */}
        <canvas
          ref={canvasRef}
          className={classes.particleCanvas}
          width={400}
          height={400}
        />
        
        {/* 3D Character Container */}
        <div className={classes.characterContainer}>
          {isLoaded && textures[emotion] ? (
            <img
              ref={characterRef}
              src={textures[emotion]}
              alt="Aria Character"
              className={`${classes.character3D} ${classes[emotion]}`}
              style={{
                filter: `drop-shadow(0 0 20px ${currentEmotion.color}50)`,
              }}
            />
          ) : (
            <div className={classes.loadingCharacter}>
              テクスチャをロード中...
            </div>
          )}
        </div>
        
        {!isActive ? (
          <div className={classes.startScreen}>
            <div className={classes.logo}>
              <span className={classes.logoText}>✨ 3D Aria ✨</span>
              <div className={classes.subtitle}>画像ベース3Dレンダリング</div>
              <div className={classes.subtitle3d}>日本アニメ美少女AIコンパニオン</div>
            </div>
            <button
              onClick={handleActivate}
              className={classes.activateButton}
              disabled={!isLoaded}
            >
              {isLoaded ? '✨ Ariaを起動する ✨' : 'ロード中...'}
            </button>
          </div>
        ) : (
          <div className={classes.emotionIndicator}>
            感情: <span style={{ color: currentEmotion.color }}>{emotion}</span>
            <div className={classes.emotionControls}>
              {Object.keys(EMOTIONS).map(emotionType => (
                <button
                  key={emotionType}
                  onClick={() => setEmotion(emotionType)}
                  className={`${classes.emotionButton} ${emotion === emotionType ? classes.active : ''}`}
                  style={{ backgroundColor: EMOTIONS[emotionType].color }}
                  title={emotionType}
                >
                  {emotionType === 'happy' ? '😊' :
                   emotionType === 'excited' ? '🤩' :
                   emotionType === 'thinking' ? '🤔' :
                   emotionType === 'surprised' ? '😲' :
                   emotionType === 'calm' ? '😌' :
                   emotionType === 'playful' ? '😄' :
                   emotionType === 'shy' ? '😊' :
                   emotionType === 'curious' ? '🧐' :
                   emotionType === 'loving' ? '🥰' : '💕'}
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