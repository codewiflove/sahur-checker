import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sahur Checker - Gut Friendly",
  description: "Check if your Sahur meal is gut-friendly based on the Butyrate/Nasi Sejuk concept",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sahur Checker",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
