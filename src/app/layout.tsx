import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { APP_INFO } from "@/shared/constants";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import AuthProvider from "@/shared/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: APP_INFO.NAME,
  description: APP_INFO.DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <QueryProvider>{children}</QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
