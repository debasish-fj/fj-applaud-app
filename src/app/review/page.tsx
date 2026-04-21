import type { Metadata } from "next";
import ReviewClient from "./client";

export const metadata: Metadata = {
  title: "Submit Recognition",
  description:
    "Nominate a colleague who went the extra mile this month. Share how they helped and rate their impact.",
  openGraph: {
    title: "Submit Recognition | FJ Applaud",
    description:
      "Nominate a colleague who went the extra mile this month. Share how they helped and rate their impact.",
  },
};

export default function ReviewPage() {
  return <ReviewClient />;
}
