import type { Metadata } from "next";
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

export default function LeaderboardPage() {
  return <LeaderboardClient />;
}
