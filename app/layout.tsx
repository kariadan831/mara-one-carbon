import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Google Analytics */}
        <GoogleAnalytics gaId="G-XRMXC34SSZ" />
      </body>
    </html>
  );
}