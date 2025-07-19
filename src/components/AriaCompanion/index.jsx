import { useState, useEffect, useRef, useCallback } from 'react';
import classes from './AriaCompanion.module.css';

const EMOTIONS = {
  happy: { color: '#FFB6C1', sparkles: true },
  excited: { color: '#FF69B4', sparkles: true, bounce: true },
  thinking: { color: '#87CEEB', rotation: true },
  surprised: { color: '#FFD700', scale: true },
  calm: { color: '#98FB98', float: true },
  playful: { color: '#FF6347', wiggle: true },
  shy: { color: '#F0E68C', shrink: true },
  curious: { color: '#DDA0DD', tilt: true },
  loving: { color: '#FF1493', pulse: true, sparkles: true }
};

const SAMPLE_RESPONSES = [
  "こんにちは！今日はどんな一日でしたか？✨",
  "お疲れ様です！何かお手伝いできることはありますか？",
  "素敵ですね！もっと教えてください💕",
  "わあ、とても興味深いお話ですね！",
  "一緒にお話しできて嬉しいです！",
  "あなたのことをもっと知りたいです！",
  "今日も頑張っていますね！応援しています✨",
  "楽しいお話をありがとうございます！"
];

const SUGGESTED_MESSAGES = [
  "今日の気分はどう？",
  "おすすめの映画は？",
  "好きなアニメキャラクターは？",
  "リラックス方法を教えて",
  "元気が出る言葉をお願い！"
];

export const AriaCompanion = () => {
  const [isActive, setIsActive] = useState(false);
  const [emotion, setEmotion] = useState('happy');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [particles, setParticles] = useState([]);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particleId = useRef(0);

  // Particle animation
  const createParticle = useCallback(() => {
    if (!EMOTIONS[emotion].sparkles) return;
    
    const particle = {
      id: particleId.current++,
      x: Math.random() * 300,
      y: Math.random() * 300,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: 1,
      decay: 0.005 + Math.random() * 0.01,
      size: 2 + Math.random() * 3,
      color: EMOTIONS[emotion].color
    };
    
    setParticles(prev => [...prev.slice(-20), particle]);
  }, [emotion]);

  // Animation loop
  useEffect(() => {
    if (!isActive) return;

    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      setParticles(prev => {
        return prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - particle.decay
        })).filter(particle => particle.life > 0);
      });

      particles.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, particles]);

  // Particle generation
  useEffect(() => {
    if (!isActive || !EMOTIONS[emotion].sparkles) return;

    const interval = setInterval(createParticle, 200);
    return () => clearInterval(interval);
  }, [isActive, emotion, createParticle]);

  // Emotion cycling
  useEffect(() => {
    if (!isActive) return;

    const emotions = Object.keys(EMOTIONS);
    const interval = setInterval(() => {
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      setEmotion(randomEmotion);
    }, 5000);

    return () => clearInterval(interval);
  }, [isActive]);

  const handleActivate = () => {
    setIsActive(true);
    setMessages([{
      id: 1,
      text: "こんにちは！私はAriaです💕 アニメとおしゃべりが大好きです！",
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

    // Change emotion based on message content
    if (text.includes('嬉しい') || text.includes('楽しい')) {
      setEmotion('excited');
    } else if (text.includes('考え') || text.includes('？')) {
      setEmotion('thinking');
    } else if (text.includes('愛') || text.includes('好き')) {
      setEmotion('loving');
    } else if (text.includes('びっくり') || text.includes('驚き')) {
      setEmotion('surprised');
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
      setEmotion('happy');
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
        
        {!isActive ? (
          <div className={classes.startScreen}>
            <div className={classes.logo}>
              <span className={classes.logoText}>✨ Aria ✨</span>
              <div className={classes.subtitle}>AIコンパニオン</div>
            </div>
            <button
              onClick={handleActivate}
              className={classes.activateButton}
            >
              ✨ Ariaを起動する
            </button>
          </div>
        ) : (
          <>
            <div 
              className={`${classes.character} ${classes[emotion]}`}
              style={{ 
                borderColor: currentEmotion.color,
                boxShadow: `0 0 30px ${currentEmotion.color}40`
              }}
            >
              <div className={classes.face}>
                <div className={classes.eyes}>
                  <div className={classes.eye}></div>
                  <div className={classes.eye}></div>
                </div>
                <div className={classes.mouth}></div>
                <div className={classes.blush}></div>
              </div>
              <div className={classes.hair}></div>
              <div className={classes.body}>
                <div className={classes.outfit}></div>
              </div>
            </div>

            <div className={classes.emotionIndicator}>
              気分: <span style={{ color: currentEmotion.color }}>{emotion}</span>
            </div>
          </>
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