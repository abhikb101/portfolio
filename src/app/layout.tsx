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
  title: "Abhishek - Architect & Creative Technologist",
  description: "An interactive canvas exploring the intersection of structure, creativity, and execution. See live projects, career history, and a design manifesto.",
  openGraph: {
    title: "Abhishek - Architect & Creative Technologist",
    description: "An interactive canvas exploring the intersection of structure, creativity, and execution. See live projects, career history, and a design manifesto.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Abhishek - Architect & Creative Technologist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhishek - Architect & Creative Technologist",
    description: "An interactive canvas exploring the intersection of structure, creativity, and execution. See live projects, career history, and a design manifesto.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/site_logo.png",
    shortcut: "/site_logo.png",
    apple: "/site_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/site_logo.png" type="image/png" />
        <link rel="shortcut icon" href="/site_logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/site_logo.png" />
      </head>
      <body
        className={`${outfit.variable} ${playfair.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
