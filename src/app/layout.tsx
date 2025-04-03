import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "おてつだいアプリ",
  description:
    "おてつだいを管理。ファミリー向けのTODOを、楽しく管理することができます。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
