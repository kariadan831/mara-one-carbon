import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "Mara One Carbon Voting Platform",
  description: "Mara One Carbon digital voting and public participation system.",
  openGraph: {
    title: "Mara One Carbon Voting Platform",
    description: "Mara One Carbon digital voting and public participation system.",
    siteName: "Mara One Carbon",
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