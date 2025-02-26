import React from 'react'
import "./Details.css";


function Details() {
  return (
    <div className='flex gap-1 p-5'>
      <div className='detailsleft w-1/2 flex flex-col gap-5'>
          <p className='text-gray-500 text-lg'>Connect with Us</p>
          <h1 className='text-7xl  text-black font-bold'>Discover the<br /> Ultimate Experience</h1>
          <p className='text-gray-500 text-lg'>Welcome to our comprehensive bus ticket booking website.Here,you can easily manage your travel needs with our user-friendly interface.Whether you're a passenger,leisure traveler,explorer or in a need of Transportation facilities,our platform delivers a smoothful experience for you.</p>
      </div>
      <div className='w-1/2 detailsright'>
        <img src="/bus2.jpg" className='w-full h-3/4'/>
      </div>
    </div>
  )
}

export default Details