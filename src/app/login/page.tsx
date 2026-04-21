import type { Metadata } from "next";
import LoginClient from "./client";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in with your FischerJordan Google account to recognize colleagues and vote for April's cycle.",
  openGraph: {
    title: "Sign In | FJ Applaud",
    description:
      "Sign in with your FischerJordan Google account to recognize colleagues and vote for April's cycle.",
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
