import "./globals.css";

import {
  Poppins,
  Montserrat,
  Inter,
  Island_Moments,
  Libre_Baskerville,
  Cedarville_Cursive,
} from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-montserrat",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const island = Island_Moments({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-island",
});

const libre = Libre_Baskerville({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-libre",
});

const cedarville = Cedarville_Cursive({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cedarville",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${montserrat.variable} ${inter.variable} ${island.variable} ${libre.variable} ${cedarville.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
