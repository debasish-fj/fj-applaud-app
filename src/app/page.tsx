import { auth } from "@/auth";
import { apiClient } from "./lib/api";
import type { CurrentWeek, LeaderboardEntry } from "./lib/api-types";
import HomeClient from "./HomeClient";

async function fetchCurrentWeek(
  token: string,
): Promise<{ week: CurrentWeek | null; noActiveWeek: boolean }> {
  try {
    const { data } = await apiClient.get<CurrentWeek>(
      "/api/rewards/weeks/current/",
      { headers: { Authorization: `Token ${token}` } },
    );
    return { week: data, noActiveWeek: false };
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response
      ?.status;
    return { week: null, noActiveWeek: status === 404 };
  }
}

async function fetchLeaderboard(token: string): Promise<LeaderboardEntry[]> {
  try {
    const { data } = await apiClient.get<LeaderboardEntry[]>(
      "/api/rewards/leaderboard/",
      { headers: { Authorization: `Token ${token}` } },
    );
    return data;
  } catch {
    return [];
  }
}

export default async function Home() {
  const session = await auth();
  const token = session?.backendToken;

  let week: CurrentWeek | null = null;
  let noActiveWeek = false;
  let winners: LeaderboardEntry[] = [];

  if (token) {
    ({ week, noActiveWeek } = await fetchCurrentWeek(token));
    if (week?.status === "RESULTS_PUBLISHED") {
      const leaderboard = await fetchLeaderboard(token);
      winners = leaderboard.slice(0, 3);
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
