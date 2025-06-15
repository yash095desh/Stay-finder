import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/hooks/userContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Stay Finder",
  description:
    "Find and book the perfect place to stay for your next trip. Whether you're looking for a short getaway or a long-term stay, discover comfortable and convenient properties tailored to your needs.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`min-h-screen ${inter.className}`}>
          <UserProvider>
            <Toaster />
            <Header />
            <main className=" pb-4 container mx-auto">{children}</main>
          </UserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
