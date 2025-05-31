import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "BCoffee",
  description: "Coffee Shop Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-montserrat antialiased">
        {children}
      </body>
    </html>
  );
}
