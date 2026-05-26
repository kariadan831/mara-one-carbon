import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mara One Carbon Public Voice",
  description: "Public voting platform for Mara One Carbon.",
  openGraph: {
    title: "Mara One Carbon Public Voice",
    description: "Public voting platform for Mara One Carbon.",
    siteName: "Mara One Carbon Public Voice",
    type: "website",
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