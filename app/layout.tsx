import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Loon & Pine | Fabric, Notions & Handmade Goods",
  description:
    "A new independent sewing and craft shop offering thoughtfully selected fabric, precuts, notions, and handmade quilted goods.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
