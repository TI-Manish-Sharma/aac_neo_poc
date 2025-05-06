import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import '@/shared/styles/globals.css';
import Navigation from "@/shared/components/Navigation";
import Footer from "@/shared/components/Footer";

// Load Inter font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://aacneo.com"),
  title: {
    template: "%s | AAC Neo",
    default: "AAC Neo",
  },
  description: "Modern AAC tools to enhance communication accessibility",
  keywords: ["AAC", "accessibility", "communication", "assistive technology"],
  authors: [{ name: "AAC Neo Team" }],
  icons: {
    icon: [
      { url: "/icon.png", sizes: "any" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "AAC Neo",
    title: "AAC Neo",
    description: "Modern AAC tools to enhance communication accessibility",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AAC Neo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AAC Neo",
    description: "Modern AAC tools to enhance communication accessibility",
    images: ["/twitter-image.jpg"],
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  maximumScale: 2,
  minimumScale: 1,
  userScalable: true,
  themeColor: "#3B82F6", // blue-600 color
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className={`${inter.variable} scroll-smooth`}
    >
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/icon-48x48.png" sizes="48x48" type="image/png"></link>
      </head>
      <body className="flex flex-col min-h-screen bg-gray-50 antialiased">
        <header>
          <Navigation />
        </header>

        <main id="main-content" className="flex-grow pt-20">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}