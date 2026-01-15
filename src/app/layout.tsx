import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Office Hours Sign Builder",
  description: "Create professional office hours signs for professors. Upload a spreadsheet for bulk generation or create individual signs.",
  keywords: ["office hours", "professor", "sign builder", "academic"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
