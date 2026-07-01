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
      <body className="min-h-full bg-matte-black text-ivory font-sans selection:bg-gold selection:text-matte-black overflow-x-hidden">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}

