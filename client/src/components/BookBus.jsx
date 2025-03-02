import React from 'react'
import { useLocation } from 'react-router-dom'
import DriverIcon from './DriverIcon';

function BookBus() {
    const {state}=useLocation();
    const noOfSeats=state.busDetails[0].seats;
    const noOfRows=state.busDetails[0].rows;
    
  return (
    <div className='flex p-10 w-full justify-center items-center'>
        <div className='flex flex-col min-h-[70vh] gap-7 p-3 border-2 border-black rounded-md'>
        <div className='border-2 w-10 h-10 border-black rounded-md'><DriverIcon className='scale-[1.5]' /></div>
          {
            noOfSeats%4===0 
            ?
            <>
              {
                Array.from({length:noOfRows}).map(()=>{
                  return (
                    <div className='flex gap-12'>
                      <div className='flex gap-1'>
                      <div className='border-2 w-10 h-10 border-black rounded-md'></div>
                      <div className='border-2 w-10 h-10 border-black rounded-md'></div>
                      </div>
                      <div className='flex gap-1'>
                      <div className='border-2 w-10 h-10 border-black rounded-md'></div>
                      <div className='border-2 w-10 h-10 border-black rounded-md'></div>
                      </div>
                    </div>
                  )
                })
              }
            </>
            :
            <>
            {
                Array.from({length:noOfRows}).map((_,index)=>{
                  return (
                    <div className='flex gap-12'>
                    {
                      index!==noOfRows-1 ?
                      <>
                      <div className='flex gap-1'>
                      <div className='border-2 w-10 h-10 border-black rounded-md'></div>
                      <div className='border-2 w-10 h-10 border-black rounded-md'></div>
                      </div>
                      <div className='flex gap-1'>
                      <div className='border-2 w-10 h-10 border-black rounded-md'></div>
                      <div className='border-2 w-10 h-10 border-black rounded-md'></div>
                      </div>
                      </>
                      :
                      <>
                      <div className='flex gap-1'>
                      <div className='border-2 w-10 h-10 border-black rounded-md'></div>
                      <div className='border-2 w-10 h-10 border-black rounded-md'></div>
                      <div className='border-2 w-10 h-10 border-black rounded-md'></div>
                      <div className='border-2 w-10 h-10 border-black rounded-md'></div>
                      <div className='border-2 w-10 h-10 border-black rounded-md'></div>
                      </div>
                      </>
                    }
                    </div>
                  
                  )
                })
              }
            </>
          }
        </div>
    </div>
  )
}

export default BookBus