export const GAME_MODES = {
  number: {
    label: "Number Schulte",
    generate: (total, difficulty) => {
      let base = [];
      switch (difficulty) {
        case "Easy":
          base = Array.from({ length: total }, (_, i) => i + 1);
          break;
        case "Medium":
          base = shuffle(Array.from({ length: total }, (_, i) => i + 1));
          break;
        case "Hard":
          base = Array.from(
            { length: total },
            () => Math.floor(Math.random() * 999) + 1
          );
          break;
        case "Extreme":
          base = Array.from(
            { length: total },
            () => Math.floor(Math.random() * 9999) + 1000
          );
          break;
        case "Impossible":
          base = Array.from({ length: total }, () =>
            Math.random().toString(36).substring(2, 6).toUpperCase()
          );
          break;
        default:
          base = Array.from({ length: total }, (_, i) => i + 1);
      }
      return base.slice(0, total);
    },
  },

  alphabet: {
    label: "Alphabet Schulte",
    generate: (total) => {
      const base = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      const fullSet = [];
      while (fullSet.length < total) {
        fullSet.push(...shuffle(base));
      }
      return fullSet.slice(0, total);
    },
  },

  word: {
    label: "Word Schulte",
    generate: (total) => {
      const base = [
        "FOCUS",
        "MIND",
        "ZEN",
        "POWER",
        "LOGIC",
        "SPEED",
        "WILL",
        "THINK",
        "PLAN",
        "WORK",
        "FAST",
        "WIN",
        "STAY",
        "GRIT",
        "TASK",
        "JUMP",
        "MOVE",
        "RUN",
        "GROW",
        "SHARP",
        "DEEP",
        "LEARN",
        "FIRE",
        "BRAIN",
        "CORE",
        "ZOOM",
      ];
      const fullSet = [];
      while (fullSet.length < total) {
        fullSet.push(...shuffle(base));
      }
      return fullSet.slice(0, total);
    },
  },

  emoji: {
    label: "Emoji Schulte",
    generate: (total) => {
      const base = [
        "🧠",
        "🚀",
        "🎯",
        "✨",
        "🔥",
        "🤖",
        "🧘",
        "📈",
        "💡",
        "📚",
        "⚡",
        "👁️",
        "🎨",
        "🌟",
        "🎵",
        "🏆",
        "🎪",
        "🎭",
        "🎬",
        "🎮",
        "🌈",
        "🌸",
        "🌺",
        "🌻",
        "🌼",
        "🌷",
        "🌹",
        "🌳",
        "🌲",
        "🌴",
        "🍀",
        "🍃",
        "🍄",
        "🍊",
        "🍋",
        "🍌",
        "🍎",
        "🍓",
        "🍇",
        "🍉",
        "🍒",
        "🍑",
        "🥝",
        "🥭",
        "🍍",
        "🥥",
        "🥨",
        "🧀",
        "🍞",
        "🥐",
        "🍕",
        "🍔",
        "🍟",
        "🍗",
        "🍖",
        "🍳",
        "🥘",
        "🍝",
        "🍜",
        "🍲",
        "🍱",
        "🍣",
        "🍤",
        "🍙",
        "🍚",
        "🍛",
        "🍡",
        "🍧",
        "🍨",
        "🍦",
        "🎂",
        "🍰",
        "🧁",
        "🍪",
        "🍫",
        "🍬",
        "🍭",
        "🍮",
        "🍯",
        "🧊",
        "☕",
      ];
      const fullSet = [];
      while (fullSet.length < total) {
        fullSet.push(...shuffle(base));
      }
      return fullSet.slice(0, total);
    },
  },
};

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
