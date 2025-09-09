// src/app/layout.tsx
import { type Metadata } from "next";
import { Manrope } from "next/font/google";
import { Providers } from "./Providers";
import { getServerSession } from "next-auth";
import { SessionWrapper } from "./SessionWrapper";
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
  const session = await getServerSession(); 
  return (
    <html lang="en" className={manrope.className}>
      <body>
        <SessionWrapper session={session}>
          <Providers>
            {children}
          </Providers>
        </SessionWrapper>
      </body>
    </html>
  );
}