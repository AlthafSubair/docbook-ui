import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocBook",
  description: "Book clinic appointments easily with DocBook.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}