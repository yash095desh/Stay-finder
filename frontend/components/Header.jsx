"use client";

import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  SignOutButton,
  useClerk,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { LayoutDashboard, LogOut, UserCircle2 } from "lucide-react";
import useCreateUser from "@/hooks/useCreateUser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/hooks/userContext";
import Image from "next/image";
import HeaderLogo from "@/public/HeaderLogo.svg"

const Header = () => {
  useCreateUser();
  const router = useRouter();
  const { user, setUser } = useUserContext();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className="py-4 px-2 flex items-center bg-gray-50 border-b border-b-gray-200">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Image src={HeaderLogo} alt="Stay Finder Logo" className="h-10 w-auto" />

        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton>
              <Button
                className="px-3 py-1 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                variant="ghost"
              >
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button className="px-3 py-1 bg-blue-600 hover:bg-blue-700">
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-4">
              {user?.role === "host" && (
                <Link href="/host-dashboard">
                  <Button
                    variant="outline"
                    className="px-4 py-2 border-blue-600 text-blue-600"
                  >
                    <LayoutDashboard className="size-4 mr-1" />
                    Dashboard
                  </Button>
                </Link>
              )}

              {/* Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user?.imageUrl || ""} />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || <UserCircle2 />}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => router.push(`/user/${user?._id}`)}
                  >
                    <UserCircle2 className="w-4 h-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;
