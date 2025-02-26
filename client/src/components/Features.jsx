import React from 'react'
import { GiJourney } from "react-icons/gi";
import { FaEarthAmericas } from "react-icons/fa6";
import { FcInTransit } from "react-icons/fc";
import "./Features.css";

function Features() {
  return (
    <div className='w-full p-5 flex justify-around mt-10 features'>
        <div className='w-64 p-9 border-2 border-black flex flex-col gap-7 items-center justify-center'>
            <FaEarthAmericas className='text-black scale-[3.5] text-center' />
            <h1 className='text-2xl font-semibold'>Discover the Convience</h1>
            <p>Streamline your bus travel with our website</p>
        </div>
        <div className='w-64 p-9 border-2 border-black flex flex-col gap-7 items-center justify-center'>
            <GiJourney className='text-black scale-[3.5]' />
            <h1 className='text-2xl font-semibold'>Your Jouney Starts</h1>
            <p>Explore our services across the website</p>
        </div> 
        <div className='w-64 p-9 border-2 border-black flex flex-col gap-7 items-center justify-center'>
            <FcInTransit className='text-black scale-[3.5]' />
            <h1 className='text-2xl font-semibold'>Reliable Transportation</h1>
            <p>Sit back,relax and let us handle the rest</p>
        </div>
    </div>
  )
}

export default Features