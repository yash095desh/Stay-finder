"use client"
import React from 'react'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from './ui/button';
import useCreateUser from '@/hooks/useCreateUser';
import { LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

const Header = () => {
  useCreateUser();
  return (
    <header className='py-4 px-2 flex items-center bg-gray-50 border-b border-b-gray-200 '>
        <div className=' container mx-auto flex items-center justify-between'>
            {/* Logo */}
            <h1 className='text-2xl font-bold text-slate-900'>Stay Finder</h1>

            <div className='flex items-center gap-4 '>
              <SignedOut>
                    <SignInButton >
                        <Button className=' px-3 py-1 text-blue-600 hover:bg-blue-100 hover:text-blue-700' variant={'ghost'}>
                          Sign In
                        </Button>
                    </SignInButton>  
                    <SignUpButton >
                      <Button className=' px-3 py-1 bg-blue-600 hover:bg-blue-700 '>
                        Sign Up
                      </Button>
                    </SignUpButton>
              </SignedOut>
              <SignedIn>
                    <div className='flex items-center gap-4'>
                      <Button
                      variant={'outline'}
                      className={'px-4 py-2 border-blue-600 text-blue-600'}
                      >
                        <LayoutDashboard className=' size-4 text-blue-600'/>
                         <Link href={'/host-dashboard'} >
                          Dashboard
                         </Link>
                      </Button>
                      <UserButton />
                    </div>
              </SignedIn>
            </div>
        </div>
    </header>
  )
}

export default Header