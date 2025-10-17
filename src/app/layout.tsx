import type { Metadata } from "next";
import { Outfit, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "PORTA - Unlock the On-chain Economy",
  description: "Porta is your private passport to a more trusted and accessible Superchain. Prove you're a unique human, unlock compliant DeFi, and move assets seamlessly—all with one secure identity.",
  openGraph: {
    title: "PORTA - Unlock the On-chain Economy",
    description: "Porta is your private passport to a more trusted and accessible Superchain. Prove you're a unique human, unlock compliant DeFi, and move assets seamlessly—all with one secure identity.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "PORTA - Unlock the On-chain Economy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PORTA - Unlock the On-chain Economy",
    description: "Porta is your private passport to a more trusted and accessible Superchain. Prove you're a unique human, unlock compliant DeFi, and move assets seamlessly—all with one secure identity.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/porta_logo.png",
    shortcut: "/porta_logo.png",
    apple: "/porta_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${playfair.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
