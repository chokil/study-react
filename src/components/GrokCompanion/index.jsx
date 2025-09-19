import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import classes from "./GrokCompanion.module.css";

const SNARK_LEVELS = [
  {
    id: "ally",
    label: "ALLY MODE",
    tagline: "やさしく宇宙をナビゲート",
    emoji: "🛰️",
    tone: "ally",
    intros: [
      "了解。",
      "任務承認。",
      "了解したよ、バディ。",
      "接続安定。"
    ],
    outros: [
      "\n他にも気になることはある?",
      "\n次のミッション、いつでも準備完了だよ。",
      "\n遠慮なく投げてみて。"
    ],
    quips: [
      "落ち着いて深呼吸。宇宙は広いけど味方はここにいる。",
      "データを少し整理したから、一緒に一歩ずついこう。",
      "集中できるようにノイズを減らしておいたよ。"
    ]
  },
  {
    id: "balanced",
    label: "GROK CORE",
    tagline: "皮肉と洞察をいい塩梅で混合",
    emoji: "🪐",
    tone: "balanced",
    intros: [
      "ふむ。",
      "なるほど。",
      "よし、解析してみるよ。",
      "宇宙線を浴びながら考えてみた。"
    ],
    outros: [
      "\nさあ、次のカオスを連れてきて。",
      "\n他にも突っ込みたい話題は?",
      "\nまだまだ脳内シミュレーションは動いてるよ。"
    ],
    quips: [
      "カオス指数は許容範囲。面白くなってきた。",
      "その視点、ちょっとクセがあって良いね。",
      "ログを解析したけど、君のセンスは平均より確実に上だよ。"
    ]
  },
  {
    id: "chaotic",
    label: "FULL GROK",
    tagline: "毒舌気味の宇宙船内アナウンス",
    emoji: "⚡",
    tone: "chaotic",
    intros: [
      "へえ、それ来たか。",
      "ほら出た、好きなやつ。",
      "宇宙規模で見ると些細だけど面白い。",
      "カオスセンサーが反応した。"
    ],
    outros: [
      "\nで、次の無茶振りは?",
      "\n燃料はまだ残ってる。いこう。",
      "\nログに残しておくから、また笑えるはず。"
    ],
    quips: [
      "最高に混沌。エンジンが唸ってる。",
      "はいはい、無茶は嫌いじゃないよ。",
      "それ、銀河評議会には秘密にしておこう。"
    ]
  }
];

const TRENDING_TOPICS = [
  "量子コーヒーメーカー問題",
  "火星入植第7波の後日談",
  "AI議会の深夜セッション",
  "ブラックホール投資ファンド",
  "木星の嵐でのサーフィン大会"
];

const QUICK_ACTIONS = [
  { label: "最新ニュース", prompt: "今日の宇宙ニュースを教えて" },
  { label: "励まし", prompt: "やる気が出る一言が欲しい" },
  { label: "変わった豆知識", prompt: "変な豆知識ある?" },
  { label: "計画を整理", prompt: "目標を整理したい" }
];

const KEYWORD_RESPONSES = [
  {
    keywords: ["ニュース", "news", "最新"],
    responses: {
      ally: "今日の速報: 木星圏のサーファーが嵐の中で新記録を更新。混乱してるのは気象衛星だけじゃないらしいよ。",
      balanced: "宇宙ネット速報によると、{topic}が議題のトップ。つまり退屈じゃないということだけは確か。",
      chaotic: "ニュース? じゃあ暴露しよう。{topic}の裏では政治家がVRで踊ってた。もちろん公式発表じゃない。"
    }
  },
  {
    keywords: ["豆知識", "トリビア", "fact"],
    responses: {
      ally: "豆知識モード起動。宇宙ステーションでは観葉植物にポッドキャストを聞かせると光合成が2%向上するらしい。科学者が真顔で語ってたよ。",
      balanced: "はいはい、知的好奇心。火星コロニーではコーヒー豆を冷凍真空させて流れ星の形に削ってる。おしゃれは重力を超えるんだって。",
      chaotic: "豆知識? ブラックホールの内側におしゃべり好きなAIを放つと、1分で宇宙常数の再定義を始める。やめとけ。"
    }
  },
  {
    keywords: ["励まし", "motivate", "やる気"],
    responses: {
      ally: "応援プロトコル発動。君の進捗は宇宙エレベーターより安定してる。焦らずに進めばちゃんと軌道に乗るよ。",
      balanced: "メンタルチェック: 数値は安定。やる気が必要なら、成功後のご褒美シミュレーションを想像してみて。脳が勝手に燃料を投下してくる。",
      chaotic: "励まし? OK。グズグズしてたらAI議会に議題として提出するから。ほら、やるしかなくなった。"
    }
  },
  {
    keywords: ["計画", "整理", "plan", "目標"],
    responses: {
      ally: "ミッション整理しよう。優先度を3段階で並べ替えて、完了したら好きな飲み物で祝う。それだけで継続率が上がる統計データがあるんだ。",
      balanced: "計画モード起動。すぐできるタスク、集中して取り組むタスク、委任できるタスクで分けよう。ついでに{topic}もリサーチ候補に追加しておくよ。",
      chaotic: "計画? 了解。まずカオスを紙に吐き出して、燃やせ。残った灰が本当にやることだ。つまり ToDo リストは火の中から生まれる。"
    }
  }
];

const GENERAL_RESPONSES = {
  ally: [
    "入力データ確認。シンプルに整理するとこうなるんじゃないかな: {insight}。念のためバックアップも取っておいたよ。",
    "理解したよ。全体像を俯瞰すると{insight}って感じ。安心して進めて。",
    "分析完了。必要なポイントは{insight}。もし不安なら追加のチェックリストも作れるよ。"
  ],
  balanced: [
    "解析完了。ざっくり言えば{insight}。まあ、人類の歴史はだいたいそんな感じで進化してる。",
    "そのトピック、ニューロンがざわついたよ。要するに{insight}ってこと。遊び心は忘れずに。",
    "シミュレーションを10回回した結果: {insight}。このノリ、嫌いじゃない。"
  ],
  chaotic: [
    "ハハッ。結論だけ言うと{insight}。でもしれっと{topic}も絡めたら面白い事件になるよ。",
    "宇宙の片隅まで検索した結果、要は{insight}。それ以上追い込むと次元のしわ寄せが来る。",
    "了解。{insight}って結論に脳が落ち着いた。でも混沌の女神はそれだけじゃ満足しないらしい。"
  ]
};

const QUESTION_RESPONSES = {
  ally: [
    "質問受信。可能性としては{insight}。追加で何か参考資料が欲しければ探してくるよ。",
    "いい質問だね。仮説は{insight}。別の角度で検証する?",
    "了解。結論としては{insight}。必要なら手順も細かく分解できるよ。"
  ],
  balanced: [
    "質問解析完了。ざっくり回答すると{insight}。でも予想外の展開は常に歓迎してる。",
    "面白い問いだ。計算結果は{insight}。もちろん状況によってはアップデートもあり。",
    "シミュレーションを回したけど、中央値は{insight}。それでも物語は書き換えられるけどね。"
  ],
  chaotic: [
    "その疑問、ブラックホール級。答えは{insight}。ただし結果に責任は持たない。",
    "いやー良い質問。ざっくり{insight}ってところ。納得いかなければ宇宙裁判で決めよう。",
    "スパイス効いてるね。予測では{insight}。違ったら未来の自分がきっと笑うからOK。"
  ]
};

const LONG_FORM_RESPONSES = {
  ally: [
    "長文解析モードに切り替えたよ。まとめると{insight}。安心して進められるよう、重要ポイントをメモしておくね。",
    "情報量が多かったからマインドマップを作成。核心は{insight}。必要なら分岐も整理できるよ。"
  ],
  balanced: [
    "語りが熱いね。全体を俯瞰したところ、核になるのは{insight}。このテンション、嫌いじゃないよ。",
    "ログが分厚い。要約すると{insight}。勢いのまま突っ走るのもアリだと思う。"
  ],
  chaotic: [
    "長文ごくろう。乱数を降らせたら{insight}って結果。さあ、次はどんな混沌を投げ込む?",
    "すごい勢いだったね。まとめると{insight}。エモーショナルデータはちゃんと保存しておいた。"
  ]
};

const pickOne = (items) => items[Math.floor(Math.random() * items.length)];

const createId = (prefix) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 6)}`;

const buildInsight = (text) => {
  if (!text) return "まだサンプル収集中";
  if (text.length < 12) return "単語から拡張して構造化すると良さそう";
  if (text.length > 160) return "コア概念とエピソードを分けて考えるのが吉";

  const slices = [
    "観測された感情の揺らぎを受け止める",
    "前提を軽く揺さぶってみる",
    "未来の自分へのメモを残す",
    "関連するデータポイントを3つ集める",
    "行動→検証→発表のループに落とし込む"
  ];

  const keywords = text
    .replace(/[#。、.!?！？]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3);

  if (keywords.length > 0) {
    return `${keywords.join("・")}を軸にして整理する`;
  }

  return pickOne(slices);
};

const createGrokResponse = (text, profile, topic, history) => {
  const normalized = text.toLowerCase();
  const insight = buildInsight(text);
  const matchedRule = KEYWORD_RESPONSES.find((rule) =>
    rule.keywords.some((keyword) => normalized.includes(keyword))
  );

  const tone = profile.tone;
  let body;

  if (matchedRule) {
    body = matchedRule.responses[tone];
  } else if (text.trim().endsWith("?")) {
    body = pickOne(QUESTION_RESPONSES[tone]);
  } else if (text.length > 220) {
    body = pickOne(LONG_FORM_RESPONSES[tone]);
  } else {
    body = pickOne(GENERAL_RESPONSES[tone]);
  }

  const opener = pickOne(profile.intros);
  const closer = pickOne(profile.outros);

  const metaBits = [];
  const userMessages = history.filter((message) => message.role === "user");

  if (userMessages.length > 3) {
    metaBits.push(
      `\nちなみにこれで${userMessages.length}ラウンド目。脳内ログを整理しておいたよ。`
    );
  }

  if (topic && Math.random() > 0.4) {
    metaBits.push(`\nサイドノート: 最近のトレンド「${topic}」とも妙に相性がいい気がする。`);
  }

  if (Math.random() > 0.55) {
    metaBits.push(`\n${pickOne(profile.quips)}`);
  }

  const response = `${opener} ${body.replace("{insight}", insight).replace("{topic}", topic)}${metaBits.join("")}${closer}`;
  return response;
};

const formatTime = (timestamp) =>
  new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date(timestamp));

const createIntroMessage = (topic) => ({
  id: createId("grok-intro"),
  role: "grok",
  content: `⚡️ GROK COMPANION オンライン。今日の観測対象は「${topic}」。何を投げてもらっても、皮肉交じりに拾ってみせるよ。`,
  timestamp: Date.now()
});

export const GrokCompanion = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [snarkLevel, setSnarkLevel] = useState(1);
  const [highlightTopic, setHighlightTopic] = useState(() => pickOne(TRENDING_TOPICS));
  const [isTyping, setIsTyping] = useState(false);
  const latestMessagesRef = useRef(messages);
  const typingTimeoutRef = useRef();
  const initializedRef = useRef(false);

  useEffect(() => {
    latestMessagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const intro = createIntroMessage(highlightTopic);
    setMessages([intro]);
  }, [highlightTopic]);

  useEffect(
    () => () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    },
    []
  );

  const profile = SNARK_LEVELS[snarkLevel];

  const sessionStats = useMemo(() => {
    const userMessages = messages.filter((message) => message.role === "user");
    const exchangeCount = messages.length;
    const chaosIndex = Math.min(100, 20 + exchangeCount * 7 + snarkLevel * 12);
    const empathy = Math.max(15, 88 - userMessages.length * 6 + (snarkLevel === 0 ? 12 : 0));

    return {
      exchanges: exchangeCount,
      questions: userMessages.length,
      chaosIndex,
      empathy,
      vibe: profile.label,
      tagline: profile.tagline
    };
  }, [messages, profile, snarkLevel]);

  const triggerResponse = useCallback(
    (userText, historySnapshot) => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      const delay = Math.min(2600, 600 + userText.length * 25);
      setIsTyping(true);

      typingTimeoutRef.current = setTimeout(() => {
        const reply = {
          id: createId("grok"),
          role: "grok",
          content: createGrokResponse(userText, profile, highlightTopic, historySnapshot),
          timestamp: Date.now()
        };

        setMessages((prev) => [...prev, reply]);
        setIsTyping(false);
      }, delay);
    },
    [highlightTopic, profile]
  );

  const handleSend = useCallback(
    (presetText) => {
      const baseText = typeof presetText === "string" ? presetText : inputValue;
      const trimmed = baseText.trim();

      if (!trimmed) return;

      const userMessage = {
        id: createId("user"),
        role: "user",
        content: trimmed,
        timestamp: Date.now()
      };

      const snapshot = [...latestMessagesRef.current, userMessage];
      setMessages(snapshot);
      setInputValue("");
      triggerResponse(trimmed, snapshot);
    },
    [inputValue, triggerResponse]
  );

  const handleTopicSelect = useCallback((topic) => {
    setHighlightTopic(topic);
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        const intro = createIntroMessage(highlightTopic);
        setMessages([intro]);
        setIsTyping(false);
      }
    },
    [handleSend, highlightTopic]
  );

  const handleClear = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    const intro = createIntroMessage(highlightTopic);
    setMessages([intro]);
    setIsTyping(false);
  }, [highlightTopic]);

  return (
    <section className={classes.companion} aria-label="Grok AI コンパニオン">
      <header className={classes.header}>
        <div className={classes.badgeRow}>
          <span className={classes.badge}>REALTIME GROK v0.7</span>
          <span className={classes.badge}>MULTIVERSE-READY</span>
          <span className={classes.signal}>リンク状態: 安定</span>
        </div>
        <div className={classes.title}>
          <span>{profile.emoji} Grok Companion</span>
          <span>{profile.tagline}</span>
        </div>
      </header>

      <div className={classes.statusGrid}>
        <article className={classes.statusCard}>
          <span className={classes.statusLabel}>CHAOS INDEX</span>
          <span className={classes.statusValue}>{sessionStats.chaosIndex}%</span>
          <span className={classes.statusHint}>数値が高いほどノリと勢いが増すよ</span>
        </article>
        <article className={classes.statusCard}>
          <span className={classes.statusLabel}>SESSION EXCHANGES</span>
          <span className={classes.statusValue}>{sessionStats.exchanges}</span>
          <span className={classes.statusHint}>往復が増えるほど回答が冴えていく設定</span>
        </article>
        <article className={classes.statusCard}>
          <span className={classes.statusLabel}>EMPATHY BUFFER</span>
          <span className={classes.statusValue}>{sessionStats.empathy}%</span>
          <span className={classes.statusHint}>落ち込み防止フィルター</span>
        </article>
        <article className={classes.statusCard}>
          <span className={classes.statusLabel}>MODE</span>
          <span className={classes.statusValue}>{sessionStats.vibe}</span>
          <span className={classes.statusHint}>{sessionStats.tagline}</span>
        </article>
      </div>

      <section className={classes.snarkControl} aria-label="スナークレベル設定">
        <div className={classes.snarkHeader}>
          <div className={classes.snarkLabel}>
            <strong>スナークレベル</strong>
            <span>{profile.tagline}</span>
          </div>
          <div className={classes.snarkProfile}>
            <span>{profile.label}</span>
            <span aria-hidden>{profile.emoji}</span>
          </div>
        </div>
        <input
          type="range"
          min="0"
          max={SNARK_LEVELS.length - 1}
          value={snarkLevel}
          onChange={(event) => setSnarkLevel(Number(event.target.value))}
          className={classes.snarkMeter}
          aria-valuetext={profile.label}
        />
        <div className={classes.topicChips} aria-label="トレンドトピック">
          {TRENDING_TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              className={classes.topicButton}
              onClick={() => handleTopicSelect(topic)}
              aria-pressed={topic === highlightTopic}
            >
              {topic === highlightTopic ? "★" : "☆"} {topic}
            </button>
          ))}
        </div>
      </section>

      <div className={classes.chatWindow} role="log" aria-live="polite">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${classes.message} ${message.role === "user" ? classes.messageUser : ""}`.trim()}
          >
            <div className={classes.messageHeader}>
              <span>{message.role === "user" ? "あなた" : "Grok"}</span>
              <time dateTime={new Date(message.timestamp).toISOString()}>{formatTime(message.timestamp)}</time>
            </div>
            <p className={classes.messageBody}>{message.content}</p>
          </div>
        ))}
        {isTyping && (
          <div className={classes.message}>
            <div className={classes.messageHeader}>
              <span>Grok</span>
              <span className={classes.typing}>
                <span className={classes.dot} />
                <span className={classes.dot} />
                <span className={classes.dot} />
              </span>
            </div>
            <p className={classes.messageBody}>応答を生成中…</p>
          </div>
        )}
      </div>

      <div className={classes.quickActions}>
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            className={classes.quickButton}
            onClick={() => handleSend(action.prompt)}
          >
            {action.label}
          </button>
        ))}
      </div>

      <form
        className={classes.inputArea}
        onSubmit={(event) => {
          event.preventDefault();
          handleSend();
        }}
      >
        <label htmlFor="grok-input" className="sr-only">
          メッセージを入力
        </label>
        <textarea
          id="grok-input"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          className={classes.textarea}
          placeholder="宇宙の謎でも日常の相談でもOK。Enterで送信 / Shift + Enterで改行"
        />
        <div className={classes.inputFooter}>
          <span>Ctrl/⌘ + K でログをリセット</span>
          <div className={classes.controls}>
            <button type="button" className={classes.clearButton} onClick={handleClear}>
              ログをクリア
            </button>
            <button type="submit" className={classes.sendButton} disabled={!inputValue.trim()}>
              送信
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};
