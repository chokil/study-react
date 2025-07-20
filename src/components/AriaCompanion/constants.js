// Configuration constants for AriaCompanion
// アニメキャラクター設定定数

export const CANVAS_CONFIG = {
  WIDTH: 400,
  HEIGHT: 400,
  CENTER_X: 200,
  CENTER_Y: 200
};

export const ANIMATION_CONFIG = {
  TARGET_FPS: 60,
  FRAME_TIME: 1000 / 60, // 16.67ms per frame
  MAX_FRAME_SKIP: 5,
  BREATH_SPEED: 0.002,
  HEARTBEAT_SPEED: 0.005,
  BLINK_SPEED: 0.0008,
  TWIN_TAIL_SPEED: 0.003
};

export const PARTICLE_CONFIG = {
  MAX_PARTICLES: 30, // Reduced from 40 for better performance
  CREATION_BASE_INTERVAL: 200,
  DECAY_RATE: {
    MIN: 0.003,
    MAX: 0.011
  },
  SIZE: {
    MIN: 3,
    MAX: 9
  },
  PHYSICS: {
    GRAVITY: 0.02,
    BOUNCE: 0.8,
    AIR_RESISTANCE: 0.995
  }
};

export const CHARACTER_CONFIG = {
  FACE: {
    SCALE_BASE: 1,
    SCALE_VARIATION: 0.002
  },
  EYES: {
    BASE_WIDTH: 30,
    BASE_HEIGHT: 25,
    BLINK_HEIGHT: 3,
    BLINK_WIDTH_SCALE: 0.1
  },
  HAIR: {
    COLORS: {
      BASE: '#8A2BE2',
      LIGHT: '#9370DB',
      DARK: '#6A5ACD'
    }
  },
  DRESS: {
    COLORS: {
      GRADIENT: ['#FFE4E6', '#FFB6C1', '#FF91A4', '#FF69B4']
    }
  }
};

export const PERFORMANCE_CONFIG = {
  LOW_QUALITY_THRESHOLD: 30, // FPS threshold for quality reduction
  PARTICLE_REDUCTION_FACTOR: 0.5,
  ANIMATION_QUALITY_LEVELS: {
    HIGH: 1.0,
    MEDIUM: 0.7,
    LOW: 0.5
  }
};

// Emotion system configuration
export const EMOTIONS = {
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

export const SAMPLE_RESPONSES = [
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

export const SUGGESTED_MESSAGES = [
  "あなたの大きな瞳、素敵ですね！👀✨",
  "アニメの中のキャラクターみたい！",
  "あなたのツインテールを揺らして！",
  "一緒にアニメを話しませんか？",
  "美しいアニメーションですね！",
  "きょうは元気ですか？😊",
  "私の3Dアニメーションどうですか？",
  "感情コントロールを試してみて！"
];