import React, {useContext, useEffect } from 'react';
import { SignIn } from '@clerk/clerk-react'
function Login() {
  return (
    <div className='h-[90vh] flex justify-center p-5'>
      <SignIn />
    </div>
  )
}

export default Login;