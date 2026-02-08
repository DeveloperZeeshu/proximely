
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Proximely – Find Products in Nearby Shops',
    template: '%s | Proximely',
  },
  description:
    'Search products near you and discover nearby shops with prices, distance, and map directions. Proximely helps customers find local stores and shop owners manage products easily.',

  keywords: [
    'nearby shops',
    'find products near me',
    'local store search',
    'compare prices nearby',
    'product availability near me',
    'local shopping app',
    'shop discovery',
    'location based product search',
  ],

  applicationName: 'Proximely',
  authors: [{ name: 'Proximely Team' }],
  creator: 'Proximely',
  publisher: 'Proximely',

  metadataBase: new URL('https://proximely.in'),

  openGraph: {
    title: 'Proximely – Find Products in Nearby Shops',
    description:
      'Find products available in nearby shops with prices, distance, and directions. Proximely connects buyers with local stores instantly.',
    url: 'https://proximely.in',
    siteName: 'Proximely',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Proximely – Local Product Discovery',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Proximely – Find Products in Nearby Shops',
    description:
      'Search products near you and see which local shops have them with prices and distance.',
    images: ['/og-image.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  alternates: {
    canonical: 'https://proximely.in',
  },

  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#fafafa]`}
      >
        <Toaster position="top-center" />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
