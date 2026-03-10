import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Fenix Car Hire | Premium Car Rental in Eswatini",
  description:
    "Drive your dream forward with Fenix Car Hire. Premium vehicle rentals including Toyota Fortuner, Hilux, Corolla, and more in Eswatini.",
  keywords: [
    "car rental",
    "Eswatini",
    "Toyota",
    "Fortuner",
    "Hilux",
    "vehicle hire",
  ],
};

export const viewport: Viewport = {
  themeColor: "#1a5490",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
