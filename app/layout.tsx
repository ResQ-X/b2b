import type { Metadata } from "next";
import { Raleway } from 'next/font/google';
// import { Geist, Geist_Mono } from "next/font/google";
import { LoadingProvider } from "@/providers/loading-providers"
import { AuthProvider } from "@/contexts/auth.context"
import "./globals.css";

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-raleway',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://resqx.net'),
  title: {
    template: '%s | ResQ-X - 24/7 Roadside Assistance',
    default: 'ResQ-X - Fast & Reliable Roadside Assistance Services'
  },
  description: 'ResQ-X provides 24/7 emergency roadside assistance including jump starts, fuel delivery, flat tire changes, and towing services. Get immediate help with our mobile app.',
  keywords: ['roadside assistance', 'towing service', 'jump start', 'fuel delivery', 'flat tire', 'emergency car service'],
  openGraph: {
    title: 'ResQ-X - 24/7 Roadside Assistance',
    description: 'Get immediate roadside assistance with ResQ-X. Available 24/7 for jump starts, fuel delivery, tire changes & more.',
    url: 'https://resqx.net',
    siteName: 'ResQ-X',
    type: 'website',
    images: [
      {
        url: '/icons/resqx_icon_orange.png',
        width: 1200,
        height: 630,
        alt: 'ResQ-X Roadside Assistance'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResQ-X - 24/7 Roadside Assistance',
    description: 'Fast & reliable roadside assistance when you need it most.',
    images: ['/icons/resqx_icon_orange.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '2y-F1BcRMBbF7tum2kv_EJqBbh6uXHbELzjR9Dt11ho',
  },
  alternates: {
    canonical: 'https://new.resqx.net',
    languages: {
      'en-NG': 'https://new.resqx.net/',
    },
  },
};

// JSON-LD Schema
// const websiteSchema = {
//   '@context': 'https://schema.org',
//   '@type': 'WebSite',
//   name: 'ResQ-X',
//   url: 'https://new.resqx.net',
//   potentialAction: {
//     '@type': 'SearchAction',
//     target: 'https://new.resqx.net/search?q={search_term_string}',
//     'query-input': 'required name=search_term_string'
//   }
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
     lang="en"
     className={`${raleway.variable}`}
     suppressHydrationWarning
     >
      <body
        className={`antialiased`}
      >
        <LoadingProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
