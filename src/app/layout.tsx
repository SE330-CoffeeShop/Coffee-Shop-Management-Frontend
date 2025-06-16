import type { Metadata } from "next";
import "../styles/globals.css";
import { SessionProviders, HeroUIProviders } from "@/providers";
import AppProviders from "@/providers/AppProviders";

export const metadata: Metadata = {
  title: "BCoffee",
  description: "Coffee Shop Management",
  icons: {
    icon: "/images/logo_bcoffee.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-montserrat antialiased min-h-screen w-full">
        <SessionProviders>
          <AppProviders>
            <HeroUIProviders>{children}</HeroUIProviders>
          </AppProviders>
        </SessionProviders>
      </body>
    </html>
  );
}
