import type { Metadata } from "next";
import "../styles/globals.css";
import { SessionProviders, HeroUIProviders } from "@/providers";
import AppProviders from "@/providers/AppProviders";
import CartProviders from "@/providers/CartProviders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        <ToastContainer position="top-right" autoClose={3000} />
        <SessionProviders>
          <AppProviders>
            <HeroUIProviders>
              <CartProviders>{children}</CartProviders>
            </HeroUIProviders>
          </AppProviders>
        </SessionProviders>
      </body>
    </html>
  );
}
