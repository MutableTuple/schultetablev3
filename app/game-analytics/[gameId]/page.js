import GetAiOverviewOfThisGame from "@/app/_components/GetAiOverviewOfThisGame";
import SingleGameAnalyticsPage from "@/app/_components/SingleGameAnalyticsPage";
import { getGameById } from "@/app/_lib/data-service";
import { getCurrentUser } from "@/app/_utils/getCurrentUser";

export async function generateMetadata({ params }) {
  const { gameId } = params;
  const game = await getGameById(gameId);

  if (!game[0]) {
    return {
      title: "Game Not Found - Schulte Table",
      description: `No game found with ID: ${gameId}.`,
    };
  }

  const { created_at, grid_size, mode, difficulty } = game[0];
  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return {
    title: `Game Analytics - ${grid_size}x${grid_size}, ${difficulty}, ${mode} | Schulte Table`,
    description: `Detailed performance analysis of your ${difficulty} game played on ${formattedDate} in ${mode} mode with a ${grid_size}x${grid_size} grid.`,
  };
}

export default async function Page({ params }) {
  const { gameId } = params;
  const user = await getCurrentUser();
  const currentUser = Array.isArray(user?.user) ? user.user[0] : null;
  const isPro = currentUser?.is_pro_user;
  const game = await getGameById(gameId);
  const gameData = game?.[0];

  if (!currentUser) {
    throw new Error("You must be logged in to view this game analytics.");
  }

  if (!gameData) {
    throw new Error("No game found with this ID.");
  }

  if (!isPro) {
    throw new Error("Upgrade to Pro to view single game analytics.");
  }

  if (gameData.user_id !== currentUser.id) {
    throw new Error("This game does not belong to your account.");
  }

  return (
    <div>
      <SingleGameAnalyticsPage game={gameData} />
      {/* ⚠️! under update */}
      {/* <GetAiOverviewOfThisGame /> */}
    </div>
  );
}
