import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "Snapvisor | Instant Event Photography, Social Media, and Digital Products",
  description: "Snapvisor delivers event photos in seconds from iPhone and camera teams, plus social media management and website/app development services.",
  keywords: ["event photography", "instant photo delivery", "iPhone photography", "camera photography", "social media management", "website development", "app development", "Snapvisor"],
  authors: [{ name: "Snapvisor Team" }],
  openGraph: {
    title: "Snapvisor | Instant Event Photography and Growth Services",
    description: "Photography delivered in seconds, plus social media management and digital product development.",
    url: "https://snapvisor.com",
    siteName: "Snapvisor",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Snapvisor Experience",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snapvisor | Instant Event Photography and Growth Services",
    description: "Event photos in seconds with social media and product development support.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col relative selection:bg-primary/30 selection:text-primary">
        {children}
      </body>
    </html>
  );
}
