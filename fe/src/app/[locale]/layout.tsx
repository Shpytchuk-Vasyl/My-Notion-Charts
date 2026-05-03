import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Notion Charts",
  description:
    "Data visualization tool for Notion. Make Notion Charts And Graphs From Your Tables",
  icons: {
    icon: "/site-icon.svg",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL!,
    languages: {
      en: `${process.env.NEXT_PUBLIC_SITE_URL}/en`,
      uk: `${process.env.NEXT_PUBLIC_SITE_URL}/uk`,
    },
  },
  openGraph: {
    title: "My Notion Charts",
    description:
      "Data visualization tool for Notion. Make Notion Charts And Graphs From Your Tables",
    url: process.env.NEXT_PUBLIC_SITE_URL!,
    siteName: "My Notion Charts",
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <html lang={locale} content="var(--primary)">
      <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={{}}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
            enableColorScheme
            themes={["light", "dark"]}
          >
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
