import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "omixsystems — School Management System",
  description: "Next-generation school management platform by omixsystems",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-surface antialiased`}>
        <div className="min-h-screen bg-animate">
          {children}
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(18, 18, 42, 0.9)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
              color: "#e2e8f0",
              backdropFilter: "blur(12px)",
            },
          }}
        />
      </body>
    </html>
  );
}
