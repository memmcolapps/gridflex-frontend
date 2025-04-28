import "../styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "../context/auth-context";

export const metadata: Metadata = {
  title: "Gridflex",
  description: "Developed by The R&D Team of Momas/Epail MIC",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <AuthProvider>
          <Toaster />

          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
