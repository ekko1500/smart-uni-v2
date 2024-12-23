/** @format */

import type { Metadata } from "next";
import "./globals.css";
import { cn } from "../lib/utils";
import SideNavbar from "@/components/SideNavbar";
import ChatBot from "@/components/ChatBot/ChatBot";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Smart-Campus",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn("min-h-screen w-full bg-white text-black flex ", {
          "debug-screens": process.env.NODE_ENV === "development",
        })}
      >
        {/* sidebar */}
        {/* <p className="border">Sidebar</p> */}

        <SideNavbar />

        <ChatBot />
        {/* main page */}
        <Suspense fallback={<LoadingSkeleton />}>
          {" "}
          <div className="p-8 w-full">{children}</div>
        </Suspense>

        <Toaster />
      </body>
    </html>
  );
}
