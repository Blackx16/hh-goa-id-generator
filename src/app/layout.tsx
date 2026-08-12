import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HH Goa 2026 | Frame & Builder ID Generator #FrameInGoa",
  description: "Official photo frame and builder ID card generator for Hacker House Goa 2026 (28-31 OCT 2026). Generate your badge, customize your builder class, and share on X with #FrameInGoa.",
  keywords: ["Hacker House Goa", "HH Goa 2026", "FrameInGoa", "Builder ID", "PFP Frame Generator", "Goa Hackathon", "2:47 pm Studio"],
  authors: [{ name: "HH Goa Team" }],
  openGraph: {
    title: "HH Goa 2026 | Frame & Builder ID Generator",
    description: "Generate your official Hacker House Goa 2026 badge & PFP frame. Ready to download and share on X with #FrameInGoa.",
    url: "https://hhgoa.com/",
    siteName: "HH Goa 2026",
    images: [
      {
        url: "https://hhgoa.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "HH Goa 2026 Builder ID",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HH Goa 2026 | Frame & Builder ID Generator",
    description: "Generate your official Hacker House Goa 2026 badge & PFP frame. #FrameInGoa",
    creator: "@247pmstudio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Imbue:opsz,wght@10..20,100..900&family=Victor+Mono:ital,wght@0,100..700;1,100..700&family=Rubik:wght@700;900&family=JetBrains+Mono:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-hhgoa-green text-hhgoa-white font-body">
        {children}
      </body>
    </html>
  );
}
