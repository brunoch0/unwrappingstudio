import type { Metadata } from "next";
import { Golos_Text } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const golos = Golos_Text({
  variable: "--font-golos",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://unwrappingstudio.com"),
  title: {
    default: "Unwrapping Studio — A curation shop for the Gulf",
    template: "%s · Unwrapping Studio",
  },
  description:
    "Objects, space, and culture — curated with a reason. From Unwrapping Studio, Seoul & Dubai, for customers across the Middle East.",
  openGraph: {
    title: "Unwrapping Studio — A curation shop for the Gulf",
    description:
      "Seeing beyond the surface. A curated shop of objects worth trusting, with clear shipping and duties for the Middle East.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${golos.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
