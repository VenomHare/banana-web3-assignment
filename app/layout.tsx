import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono, Salsa } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

const bricolageGrot = Bricolage_Grotesque({
  variable: "--font-sans",
});


const salsa = Salsa({
    variable: "--font-salsa",
    weight: "400"
})

export const metadata: Metadata = {
  title: "Banana Wallet",
  description: "Opensource Web-based Web3 wallet",

  icons: {
    icon: [
      { url: "/banana.png" },         // Default icon
    ],
    shortcut: "/banana.png",
    apple: "/banana.png",
    other: [
      {
        rel: "icon",
        url: "/banana.png",
      },
      {
        rel: "apple-touch-icon",
        url: "/banana.png",
      },
      {
        rel: "icon",
        url: "/favicon.ico",
        type: "image/x-icon"
      }
    ],
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bricolageGrot.variable} ${salsa.variable} antialiased`}
      >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            <Toaster />
            {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
