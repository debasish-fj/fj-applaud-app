import type { Metadata } from "next";
import { Raleway, Montserrat, JetBrains_Mono } from "next/font/google";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import { Header } from "./components/Header";
import { LogoBar } from "./components/LogoBar";
import "./globals.css";

/* Geist — ATS-fj primary UI font (clean, modern sans-serif) */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* Montserrat — body text, UI labels, nav, buttons */
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

/* Raleway — headings, hero text, display copy */
const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const FJ_LOGO = "/fj_logo_white.png";

export const metadata: Metadata = {
  title: {
    default: "FJ Applaud – Employee Recognition | FischerJordan",
    template: "%s | FJ Applaud",
  },
  description:
    "Recognize and celebrate the colleagues who go the extra mile. Submit a recognition, cast your vote, and track monthly leaders at FischerJordan.",
  metadataBase: new URL("https://fischerjordan.com"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fischerjordan.com",
    siteName: "FischerJordan",
    title: "FJ Applaud – Employee Recognition",
    description:
      "Nominate colleagues, cast your vote, and see who's leading the recognition cycle at FischerJordan.",
    images: [
      {
        url: FJ_LOGO,
        width: 1080,
        height: 1080,
        type: "image/jpeg",
        alt: "FischerJordan – FJ Applaud",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@fischerjordanny",
    title: "FJ Applaud – Employee Recognition",
    description:
      "Nominate colleagues, cast your vote, and see who's leading the recognition cycle at FischerJordan.",
    images: [FJ_LOGO],
  },
  icons: {
    icon: [{ url: "/fj_logo_white.png", type: "image/jpeg" }],
    shortcut: "/fj_logo_white.png",
    apple: [
      { url: "/fj_logo_white.png", sizes: "180x180", type: "image/jpeg" },
    ],
  },
};

// Temp flag — set to false to restore the navbar
const HIDE_NAVBAR = true;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${raleway.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {HIDE_NAVBAR ? <LogoBar /> : <Header />}
          {children}
        </Providers>
      </body>
    </html>
  );
}
