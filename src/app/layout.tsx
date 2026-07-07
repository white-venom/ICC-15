import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Ink & Cotton Club | Premium Formal Shirts",
  description: "Experience the art of luxury shirtmaking. Handcrafted to be remembered, tailored for leadership, and engineered with microscopic precision.",
  keywords: "luxury shirts, premium menswear, custom tailoring, formal shirts, cotton shirts, designer menswear, bespoke fashion",
  authors: [{ name: "Ink & Cotton Club" }],
  openGraph: {
    title: "Ink & Cotton Club | Premium Formal Shirts",
    description: "Experience the art of luxury shirtmaking. Handcrafted to be remembered, tailored for leadership, and engineered with microscopic precision.",
    type: "website",
    locale: "en_US",
  },
};

import { AppProvider } from "@/context/AppContext";
import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";
import CartWrapper from "@/components/CartWrapper";
import FloatingSupport from "@/components/FloatingSupport";
import AuthProvider from "@/components/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full bg-matte-black text-ivory font-sans selection:bg-gold selection:text-matte-black overflow-x-hidden flex flex-col">
        <AuthProvider>
          <AppProvider>
            <SmoothScroll>
              <NavbarWrapper />
              <main className="flex-grow relative">
                {children}
              </main>
              <Footer />
              <CartWrapper />
              <FloatingSupport />
            </SmoothScroll>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

