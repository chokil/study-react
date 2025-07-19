import { useState, useEffect, useRef, useCallback } from 'react';
import { Layout } from 'src/components/Layout';
import classes from '../styles/Aria.module.css';

const Aria = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [particles, setParticles] = useState([]);
  const [timeOffset, setTimeOffset] = useState(0);

  // Japanese anime character emotions with advanced expressions
  const emotions = {
    neutral: { eyeShape: 'normal', mouthShape: 'small', blush: false, sparkles: false },
    happy: { eyeShape: 'crescent', mouthShape: 'smile', blush: true, sparkles: true },
    excited: { eyeShape: 'star', mouthShape: 'open', blush: true, sparkles: true },
    shy: { eyeShape: 'closed', mouthShape: 'tiny', blush: true, sparkles: false },
    surprised: { eyeShape: 'wide', mouthShape: 'o', blush: false, sparkles: true },
    thinking: { eyeShape: 'half', mouthShape: 'neutral', blush: false, sparkles: false },
    loving: { eyeShape: 'heart', mouthShape: 'kiss', blush: true, sparkles: true },
    playful: { eyeShape: 'wink', mouthShape: 'grin', blush: false, sparkles: true },
    calm: { eyeShape: 'gentle', mouthShape: 'soft', blush: false, sparkles: false }
  };

  // Enhanced particle system for magical effects
  const createParticle = useCallback((x, y, type = 'sparkle') => {
    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: 1,
      decay: 0.02,
      size: Math.random() * 3 + 1,
      type,
      color: type === 'heart' ? '#ff69b4' : '#ffd700',
      rotation: Math.random() * Math.PI * 2
    };
  }, []);

  // Advanced anime character drawing function
  const drawCharacter = useCallback((ctx, time) => {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const emotion = emotions[currentEmotion];
    
    // Breathing animation
    const breathOffset = Math.sin(time * 0.003) * 2;
    
    // Head (with anime proportions)
    ctx.save();
    ctx.translate(centerX, centerY - 50 + breathOffset);
    
    // Face outline with anime styling
    ctx.fillStyle = '#ffdbac'; // Anime skin tone
    ctx.beginPath();
    ctx.ellipse(0, 0, 60, 70, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Face shadow for depth
    ctx.fillStyle = 'rgba(255, 200, 150, 0.3)';
    ctx.beginPath();
    ctx.ellipse(15, 10, 45, 60, 0.1, 0, Math.PI * 2);
    ctx.fill();
    
    // Hair (detailed anime hair)
    ctx.fillStyle = '#8B4513'; // Brown hair
    ctx.beginPath();
    // Main hair shape
    ctx.ellipse(0, -25, 75, 50, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Hair strands for detail
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x1 = Math.cos(angle) * 60;
      const y1 = Math.sin(angle) * 40 - 25;
      const x2 = Math.cos(angle) * 85;
      const y2 = Math.sin(angle) * 55 - 25;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    
    // Twin tails (iconic anime hairstyle)
    ctx.fillStyle = '#8B4513';
    // Left twin tail
    ctx.beginPath();
    ctx.ellipse(-45, -10, 20, 35, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // Right twin tail
    ctx.beginPath();
    ctx.ellipse(45, -10, 20, 35, 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes (large anime eyes with detailed reflections)
    const eyeY = -15;
    const blinkOffset = Math.sin(time * 0.002) > 0.95 ? 20 : 0; // Blinking
    
    // Left eye
    ctx.fillStyle = '#ffffff';
    if (emotion.eyeShape === 'normal' && blinkOffset === 0) {
      ctx.beginPath();
      ctx.ellipse(-18, eyeY, 12, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Iris
      ctx.fillStyle = '#4169E1'; // Royal blue
      ctx.beginPath();
      ctx.ellipse(-18, eyeY, 8, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Pupil
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.ellipse(-18, eyeY, 3, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Eye reflection (anime style)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-22, eyeY - 5, 3, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(-15, eyeY + 3, 1.5, 2, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (emotion.eyeShape === 'crescent') {
      // Happy crescent eyes
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(-18, eyeY, 12, 0.2, Math.PI - 0.2);
      ctx.stroke();
    } else if (emotion.eyeShape === 'heart') {
      // Heart-shaped eyes
      ctx.fillStyle = '#ff69b4';
      const heartSize = 10;
      ctx.beginPath();
      ctx.moveTo(-18, eyeY - heartSize / 2);
      ctx.bezierCurveTo(-18 - heartSize, eyeY - heartSize, -18 - heartSize, eyeY, -18, eyeY + heartSize / 2);
      ctx.bezierCurveTo(-18 + heartSize, eyeY, -18 + heartSize, eyeY - heartSize, -18, eyeY - heartSize / 2);
      ctx.fill();
    }
    
    // Right eye (mirror left eye)
    ctx.save();
    ctx.scale(-1, 1);
    if (emotion.eyeShape === 'normal' && blinkOffset === 0) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-18, eyeY, 12, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#4169E1';
      ctx.beginPath();
      ctx.ellipse(-18, eyeY, 8, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.ellipse(-18, eyeY, 3, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-22, eyeY - 5, 3, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(-15, eyeY + 3, 1.5, 2, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (emotion.eyeShape === 'crescent') {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(-18, eyeY, 12, 0.2, Math.PI - 0.2);
      ctx.stroke();
    } else if (emotion.eyeShape === 'heart') {
      ctx.fillStyle = '#ff69b4';
      const heartSize = 10;
      ctx.beginPath();
      ctx.moveTo(-18, eyeY - heartSize / 2);
      ctx.bezierCurveTo(-18 - heartSize, eyeY - heartSize, -18 - heartSize, eyeY, -18, eyeY + heartSize / 2);
      ctx.bezierCurveTo(-18 + heartSize, eyeY, -18 + heartSize, eyeY - heartSize, -18, eyeY - heartSize / 2);
      ctx.fill();
    }
    ctx.restore();
    
    // Eyebrows
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-28, eyeY - 20);
    ctx.lineTo(-8, eyeY - 18);
    ctx.moveTo(8, eyeY - 18);
    ctx.lineTo(28, eyeY - 20);
    ctx.stroke();
    
    // Nose (subtle anime style)
    ctx.strokeStyle = '#ffb366';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-2, 5);
    ctx.lineTo(0, 8);
    ctx.stroke();
    
    // Mouth based on emotion
    ctx.strokeStyle = '#ff6b9d';
    ctx.lineWidth = 2;
    if (emotion.mouthShape === 'smile') {
      ctx.beginPath();
      ctx.arc(0, 20, 15, 0.3, Math.PI - 0.3);
      ctx.stroke();
    } else if (emotion.mouthShape === 'open') {
      ctx.fillStyle = '#ff6b9d';
      ctx.beginPath();
      ctx.ellipse(0, 20, 8, 12, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (emotion.mouthShape === 'tiny') {
      ctx.fillStyle = '#ff6b9d';
      ctx.beginPath();
      ctx.ellipse(0, 20, 3, 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Blush if emotional
    if (emotion.blush) {
      ctx.fillStyle = 'rgba(255, 182, 193, 0.6)';
      ctx.beginPath();
      ctx.ellipse(-35, 10, 8, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(35, 10, 8, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
    
    // Body (simple but proportional)
    ctx.fillStyle = '#87CEEB'; // Light blue dress
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 100 + breathOffset, 40, 80, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Arms
    ctx.fillStyle = '#ffdbac';
    ctx.beginPath();
    ctx.ellipse(centerX - 50, centerY + 60 + breathOffset, 15, 40, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(centerX + 50, centerY + 60 + breathOffset, 15, 40, 0.2, 0, Math.PI * 2);
    ctx.fill();
    
  }, [currentEmotion, emotions]);

  // Particle rendering
  const drawParticles = useCallback((ctx) => {
    particles.forEach((particle, index) => {
      if (particle.life <= 0) {
        particles.splice(index, 1);
        return;
      }
      
      ctx.save();
      ctx.globalAlpha = particle.life;
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      
      if (particle.type === 'sparkle') {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.moveTo(0, -particle.size);
        ctx.lineTo(particle.size * 0.3, 0);
        ctx.lineTo(particle.size, 0);
        ctx.lineTo(particle.size * 0.3, particle.size * 0.3);
        ctx.lineTo(0, particle.size);
        ctx.lineTo(-particle.size * 0.3, particle.size * 0.3);
        ctx.lineTo(-particle.size, 0);
        ctx.lineTo(-particle.size * 0.3, 0);
        ctx.closePath();
        ctx.fill();
      } else if (particle.type === 'heart') {
        ctx.fillStyle = particle.color;
        const size = particle.size;
        ctx.beginPath();
        ctx.moveTo(0, size / 2);
        ctx.bezierCurveTo(-size, -size / 2, -size, -size, 0, -size / 4);
        ctx.bezierCurveTo(size, -size, size, -size / 2, 0, size / 2);
        ctx.fill();
      }
      
      ctx.restore();
      
      // Update particle
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= particle.decay;
      particle.rotation += 0.1;
    });
  }, [particles]);

  // Main animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const time = Date.now() + timeOffset;
    
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#ff9a9e');
    gradient.addColorStop(0.5, '#fecfef');
    gradient.addColorStop(1, '#fecfef');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw floating background particles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 20; i++) {
      const x = (Math.sin(time * 0.001 + i) * 100) + canvas.width / 2;
      const y = (Math.cos(time * 0.0015 + i) * 50) + canvas.height / 2;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    if (isActive) {
      drawCharacter(ctx, time);
      drawParticles(ctx);
      
      // Add magical particles if emotion supports it
      if (emotions[currentEmotion].sparkles && Math.random() < 0.1) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const particle = createParticle(
          centerX + (Math.random() - 0.5) * 200,
          centerY + (Math.random() - 0.5) * 200,
          Math.random() < 0.3 ? 'heart' : 'sparkle'
        );
        setParticles(prev => [...prev, particle]);
      }
    }
    
    animationRef.current = requestAnimationFrame(animate);
  }, [isActive, drawCharacter, drawParticles, createParticle, currentEmotion, emotions, timeOffset]);

  // Start animation
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // AI responses with emotion mapping
  const getAIResponse = useCallback((message) => {
    const responses = {
      'こんにちは': { text: 'こんにちは！お元気ですか？✨', emotion: 'happy' },
      'おはよう': { text: 'おはようございます！今日も素敵な一日にしましょうね💕', emotion: 'excited' },
      'ありがとう': { text: 'どういたしまして！お役に立てて嬉しいです😊', emotion: 'loving' },
      'かわいい': { text: 'えへへ...ありがとうございます💖', emotion: 'shy' },
      'すごい': { text: 'わあ！本当ですか？✨', emotion: 'surprised' },
      'default': { text: 'そうですね...とても興味深いお話ですね！', emotion: 'thinking' }
    };
    
    const lowerMessage = message.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key) && key !== 'default') {
        return response;
      }
    }
    return responses.default;
  }, []);

  // Handle sending messages
  const sendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = { sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Get AI response
    const response = getAIResponse(inputValue);
    setCurrentEmotion(response.emotion);
    
    // Simulate typing delay
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'aria', text: response.text }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
    
  }, [inputValue, getAIResponse]);

  // Suggested messages for quick interaction
  const suggestedMessages = [
    'こんにちは！',
    'お元気ですか？',
    '今日はどんな日でしたか？',
    'Ariaちゃん、かわいいね！',
    '一緒に遊びましょう！'
  ];

  const handleSuggestedMessage = (message) => {
    setInputValue(message);
  };

  return (
    <Layout title="AI コンパニオン Aria">
      <div className={classes.ariaContainer}>
        <div className={classes.header}>
          <h1 className={classes.title}>AI コンパニオン Aria</h1>
          <p className={classes.subtitle}>最新技術で実現された日本のアニメ美少女AI</p>
        </div>
        
        <div className={classes.mainContent}>
          <div className={classes.characterSection}>
            <div className={classes.canvasContainer}>
              <canvas ref={canvasRef} className={classes.characterCanvas} />
              {!isActive && (
                <div className={classes.startOverlay}>
                  <button 
                    className={classes.startButton}
                    onClick={() => setIsActive(true)}
                  >
                    ✨ Ariaを起動する
                  </button>
                </div>
              )}
            </div>
            
            {isActive && (
              <div className={classes.emotionControls}>
                <p>感情コントロール:</p>
                <div className={classes.emotionButtons}>
                  {Object.keys(emotions).map(emotion => (
                    <button
                      key={emotion}
                      className={`${classes.emotionButton} ${currentEmotion === emotion ? classes.active : ''}`}
                      onClick={() => setCurrentEmotion(emotion)}
                    >
                      {emotion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {isActive && (
            <div className={classes.chatSection}>
              <div className={classes.chatContainer}>
                <div className={classes.messages}>
                  {messages.map((message, index) => (
                    <div key={index} className={`${classes.message} ${classes[message.sender]}`}>
                      <div className={classes.messageContent}>
                        {message.text}
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
                
                <div className={classes.suggestedMessages}>
                  {suggestedMessages.map((suggestion, index) => (
                    <button
                      key={index}
                      className={classes.suggestionButton}
                      onClick={() => handleSuggestedMessage(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
                
                <div className={classes.inputContainer}>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className={classes.messageInput}
                    placeholder="Ariaとお話ししてみましょう..."
                  />
                  <button 
                    className={classes.sendButton}
                    onClick={sendMessage}
                  >
                    送信
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Aria;