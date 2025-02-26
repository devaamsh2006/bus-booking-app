import React from 'react'
import Header from './Header'
import {Outlet, useLocation} from 'react-router-dom';
import Footer from './Footer';
import {ClerkProvider} from '@clerk/clerk-react';

function RootLayout() {
  // const location = useLocation()

  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

  if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key")
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl='\'>
      <div className='flex flex-col min-h-full'>
        <Header />
        <div className='mt-8 pt-8 flex-1'>
        <Outlet />
        </div>
        <Footer />
    </div>
    </ClerkProvider>
    
  )
}

export default RootLayout