import React from 'react'
import { SignUp } from '@clerk/clerk-react'
function Signup() {
  return (
    <div className='h-[90vh] flex justify-center p-5'>
      <SignUp />
    </div>
  )
}

export default Signup
