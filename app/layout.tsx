// // import type { Metadata } from "next";
// import localFont from "next/font/local";
// import { LoadingProvider } from "@/providers/loading-providers";
// import { AuthProvider } from "@/contexts/auth.context";
// import { AccountProvider } from "@/contexts/account.context";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./globals.css";

// const generalSans = localFont({
//   src: [
//     {
//       path: "./fonts/GeneralSans-Variable.woff2",
//       weight: "200 700",
//       style: "normal",
//     },
//     {
//       path: "./fonts/GeneralSans-VariableItalic.woff2",
//       weight: "200 700",
//       style: "italic",
//     },
//   ],
//   variable: "--font-general-sans",
//   display: "swap",
//   preload: true,
//   fallback: [
//     "system-ui",
//     "-apple-system",
//     "BlinkMacSystemFont",
//     "Segoe UI",
//     "Roboto",
//     "Arial",
//     "sans-serif",
//   ],
//   adjustFontFallback: true,
// });

// export const metadata: Metadata = {
//   metadataBase: new URL("https://resqx.ng"),
//   title: {
//     template: "%s | ResQ-X - 24/7 Roadside Assistance",
//     default: "ResQ-X - Fast & Reliable Roadside Assistance Services",
//   },
//   description:
//     "ResQ-X provides 24/7 emergency roadside assistance including jump starts, fuel delivery, flat tire changes, and towing services. Get immediate help with our mobile app.",
//   keywords: [
//     "roadside assistance",
//     "towing service",
//     "jump start",
//     "fuel delivery",
//     "flat tire",
//     "emergency car service",
//   ],
//   openGraph: {
//     title: "ResQ-X - 24/7 Roadside Assistance",
//     description:
//       "Get immediate roadside assistance with ResQ-X. Available 24/7 for jump starts, fuel delivery, tire changes & more.",
//     url: "https://resqx.ng",
//     siteName: "ResQ-X",
//     type: "website",
//     images: [
//       {
//         url: "/icons/resqx_icon_orange.png",
//         width: 1200,
//         height: 630,
//         alt: "ResQ-X Roadside Assistance",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "ResQ-X - 24/7 Roadside Assistance",
//     description: "Fast & reliable roadside assistance when you need it most.",
//     images: ["/icons/resqx_icon_orange.png"],
//   },
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       "max-video-preview": -1,
//       "max-image-preview": "large",
//       "max-snippet": -1,
//     },
//   },
//   verification: {
//     google: "2y-F1BcRMBbF7tum2kv_EJqBbh6uXHbELzjR9Dt11ho",
//   },
//   alternates: {
//     canonical: "https://new.resqx.net",
//     languages: {
//       "en-NG": "https://new.resqx.net/",
//     },
//   },
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html
//       lang="en"
//       className={`${generalSans.variable}`}
//       suppressHydrationWarning
//     >
//       <head>
//         <meta
//           name="viewport"
//           content="width=device-width, initial-scale=1, maximum-scale=5"
//         />
//         <meta name="theme-color" content="#ffffff" />
//         <link rel="manifest" href="/manifest.json" />
//         <link rel="icon" href="/icons/resqx_icon_orange.png" />
//         <link rel="apple-touch-icon" href="/icons/resqx_icon_orange.png" />
//       </head>
//       <body className={`antialiased`}>
//         <LoadingProvider>
//           <AuthProvider>
//             <AccountProvider>
//               {children}
//               <ToastContainer position="top-right" autoClose={3000} />
//             </AccountProvider>
//           </AuthProvider>
//         </LoadingProvider>
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import localFont from "next/font/local";
import { LoadingProvider } from "@/providers/loading-providers";
import { AuthProvider } from "@/contexts/auth.context";
import { AccountProvider } from "@/contexts/account.context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const generalSans = localFont({
  src: [
    {
      path: "./fonts/GeneralSans-Variable.woff2",
      weight: "200 700",
      style: "normal",
    },
    // {
    //   path: "./fonts/GeneralSans-VariableItalic.woff2",
    //   weight: "200 700",
    //   style: "italic",
    // },
  ],
  variable: "--font-general-sans",
  display: "swap",
  preload: true,
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Arial",
    "sans-serif",
  ],
  // adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://resqx.ng"),
  title: {
    template: "%s | ResQ-X - 24/7 Roadside Assistance",
    default: "ResQ-X - Fast & Reliable Roadside Assistance Services",
  },
  description:
    "ResQ-X provides 24/7 emergency roadside assistance including jump starts, fuel delivery, flat tire changes, and towing services. Get immediate help with our mobile app.",
  keywords: [
    "roadside assistance",
    "towing service",
    "jump start",
    "fuel delivery",
    "flat tire",
    "emergency car service",
  ],
  openGraph: {
    title: "ResQ-X - 24/7 Roadside Assistance",
    description:
      "Get immediate roadside assistance with ResQ-X. Available 24/7 for jump starts, fuel delivery, tire changes & more.",
    url: "https://resqx.ng",
    siteName: "ResQ-X",
    type: "website",
    images: [
      {
        url: "/icons/resqx_icon_orange.png",
        width: 1200,
        height: 630,
        alt: "ResQ-X Roadside Assistance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ResQ-X - 24/7 Roadside Assistance",
    description: "Fast & reliable roadside assistance when you need it most.",
    images: ["/icons/resqx_icon_orange.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "2y-F1BcRMBbF7tum2kv_EJqBbh6uXHbELzjR9Dt11ho",
  },
  alternates: {
    canonical: "https://new.resqx.net",
    languages: {
      "en-NG": "https://new.resqx.net/",
    },
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
      className={`${generalSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/resqx_icon_orange.png" />
        <link rel="apple-touch-icon" href="/icons/resqx_icon_orange.png" />
      </head>
      <body className={`antialiased`}>
        <LoadingProvider>
          <AuthProvider>
            <AccountProvider>
              {children}
              <ToastContainer position="top-right" autoClose={3000} />
            </AccountProvider>
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
