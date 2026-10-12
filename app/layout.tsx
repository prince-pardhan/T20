import "@mantine/core/styles.css";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "liveupdate24",
  description: "NewzFast brings you the latest breaking news, live updates, India news, world news, politics, business, technology, sports, entertainment, education, and local news. Get fast, accurate, and reliable news updates every day.",


  icons: {    
    icon: "/fast.png",
    shortcut: "/fast.png",
    apple: "/fast.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>

      <body className={inter.className}>
        <MantineProvider defaultColorScheme="light">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
