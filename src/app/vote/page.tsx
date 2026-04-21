import type { Metadata } from "next";
import VoteClient from "./client";

export const metadata: Metadata = {
  title: "Cast Your Vote",
  description:
    "Review this month's nominees and vote for the colleague who made the biggest impact at FischerJordan.",
  openGraph: {
    title: "Cast Your Vote | FJ Applaud",
    description:
      "Review this month's nominees and vote for the colleague who made the biggest impact at FischerJordan.",
  },
};

export default function VotePage() {
  return <VoteClient />;
}
