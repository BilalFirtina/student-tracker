import "./globals.scss";
import Client from "@/app/components/Client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Öğrenci Takip Sistemi",
  icons: {
    icon: "/logo-light.png",
    shortcut: "/logo-light.png",
    apple: "/logo-light.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>
        <Client>{children}</Client>
      </body>
    </html>
  );
}
