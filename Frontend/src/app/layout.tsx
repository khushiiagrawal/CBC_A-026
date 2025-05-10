import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChatBotWrapper from "../components/ChatBotWrapper";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "3RVision - Revolutionizing Sustainability",
  description:
    "Empowering sustainable choices through AI-driven intelligence for Reuse, Recycle, and Resale.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="inter_59dee874-module__9CtR0q__className">
        <AuthProvider>{children}</AuthProvider>
        <ChatBotWrapper />
      </body>
    </html>
  );
}
