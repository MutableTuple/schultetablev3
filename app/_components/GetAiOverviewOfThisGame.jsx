import React from "react";

export default function GetAiOverviewOfThisGame() {
  // Sample data structure for demonstration
  const gameData = {
    score: 1080,
    accuracy: 100,
    avgReactionTimeMs: 717,
    fastestMs: 223,
    slowestMs: 1658,
    consistencyScore: 455,
    clicks: [
      { number: 1, timeTakenMs: 947, correct: true },
      { number: 2, timeTakenMs: 419, correct: true },
      { number: 3, timeTakenMs: 520, correct: true },
      { number: 4, timeTakenMs: 334, correct: true },
      { number: 5, timeTakenMs: 1658, correct: true },
      { number: 6, timeTakenMs: 1295, correct: true },
      { number: 7, timeTakenMs: 480, correct: true },
      { number: 8, timeTakenMs: 577, correct: true },
      { number: 9, timeTakenMs: 223, correct: true },
    ],
  };

  const getPerformanceRating = (avgTime) => {
    if (avgTime < 500) return { rating: "Elite", badge: "badge-secondary" };
    if (avgTime < 700) return { rating: "Excellent", badge: "badge-success" };
    if (avgTime < 1000) return { rating: "Good", badge: "badge-info" };
    return { rating: "Developing", badge: "badge-warning" };
  };

  const performance = getPerformanceRating(gameData.avgReactionTimeMs);

  const getCognitiveInsight = () => {
    const variability = gameData.slowestMs - gameData.fastestMs;
    if (variability > 1200)
      return "High cognitive load variation - your brain switches between fast instinct and careful analysis";
    if (variability > 800)
      return "Moderate processing variation - shows flexible thinking but could be more consistent";
    return "Low variation - very consistent cognitive processing";
  };

  const getAttentionPattern = () => {
    const clicks = gameData.clicks;
    const firstHalf = clicks.slice(0, Math.floor(clicks.length / 2));
    const secondHalf = clicks.slice(Math.floor(clicks.length / 2));

    const firstAvg =
      firstHalf.reduce((sum, click) => sum + click.timeTakenMs, 0) /
      firstHalf.length;
    const secondAvg =
      secondHalf.reduce((sum, click) => sum + click.timeTakenMs, 0) /
      secondHalf.length;

    if (secondAvg > firstAvg + 100)
      return "📈 Getting slower - possible mental fatigue";
    if (firstAvg > secondAvg + 100)
      return "📉 Warming up - improved focus over time";
    return "📊 Steady performance - consistent attention throughout";
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">
          Brain Performance Analysis
        </h2>
        <p className="text-base-content/70">
          Scientific insights into your cognitive patterns
        </p>
        <div className="divider"></div>
      </div>

      {/* Overall Rating Hero */}
      <div className="hero bg-gradient-to-r from-primary/10 to-secondary/10 rounded-box">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h3 className="text-lg font-bold">Cognitive Speed Rating</h3>
            <div
              className={`badge ${performance.badge} badge-lg text-lg font-bold my-2 px-4 py-3`}
            >
              {performance.rating}
            </div>
            <div className="text-4xl font-bold text-primary">
              {gameData.avgReactionTimeMs}ms
            </div>
            <p className="text-sm opacity-70">Average Response Time</p>
          </div>
        </div>
      </div>

      {/* Key Metrics Stats */}
      {/* <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-figure text-success">
            <div className="text-2xl">🎯</div>
          </div>
          <div className="stat-title">Accuracy</div>
          <div className="stat-value text-success">{gameData.accuracy}%</div>
          <div className="stat-desc">Perfect focus control</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-info">
            <div className="text-2xl">⚡</div>
          </div>
          <div className="stat-title">Peak Speed</div>
          <div className="stat-value text-info">{gameData.fastestMs}ms</div>
          <div className="stat-desc">Your brain's limit</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <div className="text-2xl">📊</div>
          </div>
          <div className="stat-title">Consistency</div>
          <div className="stat-value text-secondary">
            {gameData.consistencyScore}
          </div>
          <div className="stat-desc">Mental stability score</div>
        </div>
      </div> */}

      {/* Cognitive Analysis Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h3 className="card-title text-info">
              🎯 Attention Control
              <div className="badge badge-success badge-sm">Excellent</div>
            </h3>
            <p className="text-sm">
              Perfect accuracy shows exceptional selective attention and impulse
              control. You can maintain focus under pressure.
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h3 className="card-title text-warning">
              ⚡ Processing Speed
              <div className="badge badge-warning badge-sm">Variable</div>
            </h3>
            <p className="text-sm">{getCognitiveInsight()}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h3 className="card-title text-secondary">🧘 Mental Endurance</h3>
            <p className="text-sm">{getAttentionPattern()}</p>
          </div>
        </div>
      </div>

      {/* Performance Visualization */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title">📈 Reaction Time Pattern</h3>
          <div className="flex items-end gap-1 h-24 mt-4">
            {gameData.clicks.map((click, index) => {
              const height = Math.max(
                8,
                (click.timeTakenMs / gameData.slowestMs) * 80
              );
              let colorClass = "bg-success";
              if (click.timeTakenMs > 800) colorClass = "bg-warning";
              if (click.timeTakenMs > 1200) colorClass = "bg-error";

              return (
                <div
                  key={index}
                  className={`${colorClass} rounded-t flex-1 transition-all hover:opacity-70 tooltip`}
                  style={{ height: `${height}px` }}
                  data-tip={`Click ${index + 1}: ${click.timeTakenMs}ms`}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-xs opacity-60 mt-2">
            <span>Start</span>
            <span>Middle</span>
            <span>End</span>
          </div>
          <div className="mt-3">
            <div className="flex gap-4 justify-center text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-success rounded"></div>
                <span>&lt;800ms</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-warning rounded"></div>
                <span>800-1200ms</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-error rounded"></div>
                <span>&gt;1200ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Training Recommendations */}
      <div className="alert alert-info shadow-lg">
        <div className="flex-1">
          <h3 className="font-bold">💡 Your Personal Brain Training Plan</h3>
          <div className="text-sm mt-2 space-y-1">
            {gameData.avgReactionTimeMs > 800 && (
              <div className="flex items-center gap-2">
                <div className="badge badge-outline badge-xs">Speed</div>
                <span>
                  Focus on maintaining sub-600ms reactions consistently
                </span>
              </div>
            )}
            {gameData.slowestMs - gameData.fastestMs > 1000 && (
              <div className="flex items-center gap-2">
                <div className="badge badge-outline badge-xs">Consistency</div>
                <span>Practice maintaining steady reaction times</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="badge badge-outline badge-xs">Potential</div>
              <span>
                Your peak performance ({gameData.fastestMs}ms) shows your
                brain's true potential
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="badge badge-outline badge-xs">Strength</div>
              <span>
                Perfect accuracy means you can push for faster speeds without
                losing precision
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scientific Context */}
      <div className="alert alert-warning">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">🧪</span>
            <div>
              <div className="font-bold">Scientific Context</div>
              <div className="text-sm mt-1">
                Your {gameData.avgReactionTimeMs}ms average is{" "}
                {gameData.avgReactionTimeMs < 600
                  ? "above"
                  : gameData.avgReactionTimeMs < 800
                    ? "at"
                    : "near"}
                the typical range (400-800ms) for complex cognitive tasks. Elite
                gamers average 200-400ms.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center pt-4">
        <button className="btn btn-primary btn-wide">
          🎮 Train Your Brain Further
          <div className="badge badge-secondary">+50 IQ Points</div>
        </button>
      </div>
    </div>
  );
}
