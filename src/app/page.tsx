import { auth } from "@/auth";
import { getCurrentWeekServer, getLeaderboardServer } from "./lib/api";
import type { CurrentWeek, LeaderboardEntry } from "./lib/api-types";
import HomeClient from "./HomeClient";

export default async function Home() {
  const session = await auth();
  const token = session?.backendToken;

  let week: CurrentWeek | null = null;
  let noActiveWeek = false;
  let winners: LeaderboardEntry[] = [];

  if (token) {
    try {
      week = await getCurrentWeekServer(token);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 404) noActiveWeek = true;
    }

    if (week?.status === "RESULTS_PUBLISHED") {
      try {
        const leaderboard = await getLeaderboardServer(token);
        winners = leaderboard.slice(0, 3);
      } catch {
        // winners stays empty
      }
    }
  }

  return (
    <HomeClient
      currentWeek={week}
      noActiveWeek={noActiveWeek}
      winners={winners}
    />
  );
}
