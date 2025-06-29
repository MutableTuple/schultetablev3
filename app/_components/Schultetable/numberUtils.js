import { evaluate, format } from "mathjs";
export const GAME_MODES = {
  number: {
    label: "Number Schulte",
    generate: (total, difficulty) => {
      switch (difficulty) {
        case "Easy":
          return Array.from({ length: total }, (_, i) => i + 1);
        case "Medium":
          return shuffle(Array.from({ length: total }, (_, i) => i + 1));
        case "Hard":
          return Array.from({ length: total }, () =>
            Math.floor(Math.random() * 999 + 1)
          );
        case "Extreme":
          return Array.from({ length: total }, () =>
            Math.floor(Math.random() * 9999 + 1000)
          );
        case "Impossible":
          return Array.from({ length: total }, () =>
            Math.random().toString(36).substring(2, 6).toUpperCase()
          );
        default:
          return Array.from({ length: total }, (_, i) => i + 1);
      }
    },
  },
  maths: {
    label: "Maths Schulte",
    generate: (total, difficulty) => {
      const ops = ["+", "-", "×", "÷"];
      const trigOps = ["sin", "cos", "tan", "log", "√"];
      const random = (min, max) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

      const expressions = new Set();
      const results = new Set();
      const generated = [];

      const generateExpression = () => {
        let a, b, op, result, expr;

        let attempts = 0;
        while (attempts < 1000) {
          attempts++;
          try {
            switch (difficulty) {
              case "Easy": {
                op = ops[random(0, 2)]; // "+", "-", or "×"
                a = random(1, 15);
                b = random(1, 15);

                if (op === "+") {
                  result = a + b;
                  expr = `${a} + ${b}`;
                } else if (op === "-") {
                  if (a < b) [a, b] = [b, a]; // prevent negative
                  result = a - b;
                  expr = `${a} - ${b}`;
                } else if (op === "×") {
                  result = a * b;
                  expr = `${a} × ${b}`;
                }
                break;
              }

              case "Medium":
                a = random(2, 10);
                b = random(2, 10);
                op = ops[random(0, 2)];
                result = op === "+" ? a + b : op === "-" ? a - b : a * b;
                expr = `${a} ${op} ${b}`;
                break;

              case "Hard": {
                const variants = [
                  () => {
                    // Clean division
                    b = random(2, 12);
                    result = random(2, 30);
                    a = result * b;
                    expr = `${a} ÷ ${b}`;
                    return { expr, result };
                  },
                  () => {
                    // Multiplication disguised as division
                    a = random(5, 100);
                    b = random(2, 12);
                    result = parseFloat((a / b).toFixed(2));
                    expr = `${a} ÷ ${b}`;
                    return { expr, result };
                  },
                  () => {
                    // Tricky combo
                    a = random(10, 200);
                    b = random(2, 20);
                    result = parseFloat((a / b).toFixed(1));
                    expr = `${a} ÷ ${b}`;
                    return { expr, result };
                  },
                ];
                const { expr: e, result: r } =
                  variants[random(0, variants.length - 1)]();
                expr = e;
                result = r;
                break;
              }
              case "Extreme":
                op = trigOps[random(0, 2)];
                a = random(0, 90);
                result = parseFloat(Math[op](a * (Math.PI / 180)).toFixed(2));
                expr = `${op}(${a}°)`;
                break;

              case "Impossible":
                op = trigOps[random(0, trigOps.length - 1)];
                if (op === "√") {
                  a = random(2, 20);
                  result = parseFloat(Math.sqrt(a).toFixed(2));
                  expr = `√${a}`;
                } else if (op === "log") {
                  a = random(1, 1000);
                  result = parseFloat(Math.log10(a).toFixed(2));
                  expr = `log(${a})`;
                } else {
                  a = random(0, 360);
                  result = parseFloat(Math[op](a * (Math.PI / 180)).toFixed(2));
                  expr = `${op}(${a}°)`;
                }
                break;

              default:
                a = random(1, 9);
                b = random(1, 9);
                result = a + b;
                expr = `${a} + ${b}`;
            }

            if (
              !results.has(result) &&
              !expressions.has(expr) &&
              typeof result === "number" &&
              isFinite(result)
            ) {
              results.add(result);
              expressions.add(expr);
              return { expr, value: result };
            }
          } catch (err) {
            continue;
          }
        }
        return { expr: "N/A", value: -1 };
      };

      while (generated.length < total) {
        generated.push(generateExpression());
      }

      return generated;
    },
  },

  alphabet: {
    label: "Alphabet Schulte",
    generate: (total) =>
      shuffle("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")).slice(0, total),
  },
  word: {
    label: "Word Schulte",
    generate: (total) =>
      shuffle([
        "ONE",
        "TWO",
        "THREE",
        "FOUR",
        "FIVE",
        "SIX",
        "SEVEN",
        "EIGHT",
        "NINE",
        "TEN",
        "ELEVEN",
        "TWELVE",
        "THIRTEEN",
        "FOURTEEN",
        "FIFTEEN",
        "SIXTEEN",
        "SEVENTEEN",
        "EIGHTEEN",
        "NINETEEN",
        "TWENTY",
        "TWENTYONE",
        "TWENTYTWO",
        "TWENTYTHREE",
        "TWENTYFOUR",
        "TWENTYFIVE",
        "TWENTYSIX",
        "TWENTYSEVEN",
        "TWENTYEIGHT",
        "TWENTYNINE",
        "THIRTY",
        "THIRTYONE",
        "THIRTYTWO",
        "THIRTYTHREE",
        "THIRTYFOUR",
        "THIRTYFIVE",
        "THIRTYSIX",
        "THIRTYSEVEN",
        "THIRTYEIGHT",
        "THIRTYNINE",
        "FORTY",
        "FORTYONE",
        "FORTYTWO",
        "FORTYTHREE",
        "FORTYFOUR",
        "FORTYFIVE",
        "FORTYSIX",
        "FORTYSEVEN",
        "FORTYEIGHT",
        "FORTYNINE",
        "FIFTY",
        "FIFTYONE",
        "FIFTYTWO",
        "FIFTYTHREE",
        "FIFTYFOUR",
        "FIFTYFIVE",
        "FIFTYSIX",
        "FIFTYSEVEN",
        "FIFTYEIGHT",
        "FIFTYNINE",
        "SIXTY",
        "SIXTYONE",
        "SIXTYTWO",
        "SIXTYTHREE",
        "SIXTYFOUR",
        "SIXTYFIVE",
        "SIXTYSIX",
        "SIXTYSEVEN",
        "SIXTYEIGHT",
        "SIXTYNINE",
        "SEVENTY",
        "SEVENTYONE",
        "SEVENTYTWO",
        "SEVENTYTHREE",
        "SEVENTYFOUR",
        "SEVENTYFIVE",
        "SEVENTYSIX",
        "SEVENTYSEVEN",
        "SEVENTYEIGHT",
        "SEVENTYNINE",
        "EIGHTY",
        "EIGHTYONE",
        "EIGHTYTWO",
        "EIGHTYTHREE",
        "EIGHTYFOUR",
        "EIGHTYFIVE",
        "EIGHTYSIX",
        "EIGHTYSEVEN",
        "EIGHTYEIGHT",
        "EIGHTYNINE",
        "NINETY",
        "NINETYONE",
        "NINETYTWO",
        "NINETYTHREE",
        "NINETYFOUR",
        "NINETYFIVE",
        "NINETYSIX",
        "NINETYSEVEN",
        "NINETYEIGHT",
        "NINETYNINE",
        "ONEHUNDRED",
      ]).slice(0, total),
  },

  emoji: {
    label: "Emoji Schulte",
    generate: (total, difficulty) => {
      const simpleEmojis = [
        "🐶",
        "🐱",
        "🐭",
        "🐹",
        "🐰",
        "🦊",
        "🐻",
        "🐼",
        "🐨",
        "🐯",
        "🦁",
        "🐮",
        "🐷",
        "🐸",
        "🐵",
        "🐔",
        "🐧",
        "🐦",
        "🐤",
        "🐣",
        "🐠",
        "🐟",
        "🦈",
        "🐙",
        "🐚",
        "🦀",
        "🦞",
        "🐛",
        "🦋",
        "🐌",
        "🐜",
        "🐝",
        "🪲",
        "🕷️",
        "🦂",
        "🐢",
        "🐍",
        "🦎",
        "🦖",
        "🦕",
        "🌻",
        "🌺",
        "🌸",
        "🌼",
        "🌷",
        "🌹",
        "🥀",
        "🌾",
        "🌿",
        "☘️",
        "🍀",
        "🌵",
        "🌴",
        "🌳",
        "🌲",
        "🌱",
        "🌊",
        "🌀",
        "🌈",
        "⭐",
        "🌙",
        "☀️",
        "⛅",
        "☁️",
        "🌥️",
        "⛈️",
        "🌩️",
        "⚡",
        "❄️",
        "☃️",
        "⛄",
        "🔥",
        "💧",
        "🌍",
        "🌎",
        "🌏",
        "🌋",
        "🏔️",
        "⛰️",
        "🏕️",
        "🗻",
      ];
      const mediumEmojis = [
        "🌟",
        "🎭",
        "🎪",
        "🎨",
        "🎬",
        "🎵",
        "🎸",
        "🎹",
        "🎺",
        "🎻",
        "🏆",
        "🏅",
        "🥇",
        "🥈",
        "🥉",
        "🏃",
        "⚽",
        "🏀",
        "🏈",
        "⚾",
        "🎾",
        "🏐",
        "🏓",
        "🏸",
        "🥊",
        "🏋️",
        "🤸",
        "🧘",
        "🏄",
        "🏊",
        "🚗",
        "🚕",
        "🚙",
        "🚌",
        "🚎",
        "🏎️",
        "🚓",
        "🚑",
        "🚒",
        "🚐",
        "🛻",
        "🚚",
        "🚛",
        "🚜",
        "🏍️",
        "🛵",
        "🚲",
        "🛴",
        "🛹",
        "🛼",
        "✈️",
        "🚁",
        "🚂",
        "🚆",
        "🚄",
        "🚅",
        "🚈",
        "🚝",
        "🚞",
        "🚋",
        "🎂",
        "🍰",
        "🧁",
        "🍪",
        "🍫",
        "🍬",
        "🍭",
        "🍮",
        "🍯",
        "🍓",
        "🍒",
        "🍑",
        "🥝",
        "🥭",
        "🍍",
        "🥥",
        "🍇",
        "🍈",
        "🍉",
        "🍊",
        "🍋",
      ];
      const comboEmojis = (count) => {
        const combos = [];
        for (let i = 0; i < count; i++) {
          const mix = shuffle(mediumEmojis)
            .slice(0, Math.floor(Math.random() * 2) + 2)
            .join("");
          combos.push(mix);
        }
        return combos;
      };

      switch (difficulty) {
        case "Easy":
          return shuffle(simpleEmojis).slice(0, total);
        case "Medium":
          return shuffle(mediumEmojis).slice(0, total);
        case "Hard":
          return comboEmojis(total); // 2-emoji combos like "😂🔥"
        case "Extreme":
          return comboEmojis(total); // 2-3 emoji combos like "😱💀🔥"
        case "Impossible":
          return comboEmojis(total).map((e) => e + ""); // Could optionally add invisible char for mind tricks
        default:
          return shuffle(simpleEmojis).slice(0, total);
      }
    },
  },
};

export function generateNumbers(total, difficulty, mode = "number") {
  const modeConfig = GAME_MODES[mode];
  if (!modeConfig || !modeConfig.generate) return [];
  return modeConfig.generate(total, difficulty);
}

export function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
