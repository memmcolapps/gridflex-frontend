// src/app/layout.tsx
import { type Metadata } from "next";
import { Manrope } from "next/font/google";
import { Providers } from "./Providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Gridflex",
  description: "Developed by The R&D Team of Momas/Epail MIC",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const manrope = Manrope({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={manrope.className}>
      <body>
          <Providers>
            {children}
          </Providers>
      </body>
    </html>
  );
}