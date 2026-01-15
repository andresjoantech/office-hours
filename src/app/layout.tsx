import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Office Hours Sign Builder | FIU Engineering",
  description: "Create professional office hours signs for FIU College of Engineering and Computing professors. Upload a spreadsheet for bulk generation or create individual signs.",
  keywords: ["FIU", "Florida International University", "office hours", "professor", "sign builder", "engineering"],
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
