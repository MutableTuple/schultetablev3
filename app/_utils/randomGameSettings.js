export function getRandomGameSettings() {
  const allGridOptions = [3, 4, 5];
  const modes = ["number", "word", "alphabet", "emoji", "maths"];
  const difficulties = ["Easy", "Medium", "Hard", "Extreme", "Impossible"];

  // Pick random mode first
  const mode = modes[Math.floor(Math.random() * modes.length)];

  // Adjust grid size options based on mode
  let gridOptions;
  if (mode === "alphabet") {
    gridOptions = [3, 4, 5];
  } else if (mode === "maths") {
    gridOptions = allGridOptions.filter((g) => g <= 7);
  } else {
    gridOptions = allGridOptions;
  }

  const gridSize = gridOptions[Math.floor(Math.random() * gridOptions.length)];
  const difficulty =
    difficulties[Math.floor(Math.random() * difficulties.length)];

  return {
    gridSize,
    difficulty,
    mode,
  };
}
