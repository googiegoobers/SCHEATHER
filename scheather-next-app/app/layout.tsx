import "./globals.css";
import { ClientProviders } from "./ClientProviders";
import { ReactNode } from "react";
import Script from "next/script";

import { Analytics } from "@vercel/analytics/next";

import {
  Poppins,
  Montserrat,
  Cedarville_Cursive,
  Inter,
  Roboto,
} from "next/font/google";
import { Metadata } from "next";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // optional for CSS variable use
  display: "swap",
});

const cedarvilleCursive = Cedarville_Cursive({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-cedarville-cursive",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Scheather",
  icons: {
    icon: "/hero-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} ${montserrat.variable} ${cedarvilleCursive.variable} ${roboto.variable}`}
    >
      <body>
        <ClientProviders>{children}</ClientProviders>
        <Analytics />

        {/* Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-QMVC5BR2W3`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
               window.dataLayer = window.dataLayer || [];
               function gtag(){dataLayer.push(arguments);}
               gtag('js', new Date());
               gtag('config', 'G-QMVC5BR2W3', {
                 page_path: window.location.pathname,
               });
             `,
          }}
        />

      </body>
    </html>
  );
}
