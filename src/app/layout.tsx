// src/app/layout.tsx
import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "../styles/globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-fredoka",
});

export const metadata: Metadata = {
  title: "Crishette",
  description: "Crishette school e-commerce project 🧶",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fredoka.variable} antialiased`}>{children}</body>
    </html>
  );
}
