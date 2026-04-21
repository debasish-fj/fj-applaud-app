import type { Metadata } from "next";
import { auth } from "@/auth";
import { getLeaderboardServer } from "../lib/api";
import type { LeaderboardEntry } from "../lib/api-types";
import LeaderboardClient from "./client";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "See who has earned the most recognition this cycle at FischerJordan. Live rankings updated as votes come in.",
  openGraph: {
    title: "Leaderboard | FJ Applaud",
    description:
      "See who has earned the most recognition this cycle at FischerJordan. Live rankings updated as votes come in.",
  },
};

export default async function LeaderboardPage() {
  const session = await auth();
  const token = session?.backendToken;

  let entries: LeaderboardEntry[] = [];
  let error = false;

  if (token) {
    try {
      entries = await getLeaderboardServer(token);
    } catch {
      error = true;
    }
  }

  return <LeaderboardClient entries={entries} error={error} />;
}
