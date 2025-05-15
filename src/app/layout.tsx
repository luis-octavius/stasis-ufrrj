import type { Metadata } from "next";
import { IBM_Plex_Serif as FontSerif } from "next/font/google"; // Using Inter as a modern, readable sans-serif
// import localFont from 'next/font/local'; // Keep for potential custom font
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme/theme-provider";

const fontSerif = FontSerif({
  subsets: ["latin"], // Specify subsets if necessary
  variable: "--font-sans",
  weight: ["400", "700"],
});

// Example for a local serif font (e.g., a specific "ancient" looking one if available)
// const fontSerif = localFont({
//   src: '../../public/fonts/YourSerifFont.ttf',
//   variable: '--font-serif',
// });

export const metadata: Metadata = {
  title: "ΣΤΑΣΙΣ UFRRJ - Grupo de Estudos em Filosofia",
  description:
    "Página do Grupo de Estudos em Filosofia ΣΤΑΣΙΣ da UFRRJ. Eventos, postagens e publicações.",
  icons: {
    icon: "/greek.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-serif antialiased", // font-serif applies Tailwind's default serif stack, will be overridden by the variable
          fontSerif.variable, // Use the IBM Plex Serif variable
          // fontSerif.variable // Add if a custom local serif font is loaded
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system">
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
