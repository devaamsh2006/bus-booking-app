import React, { useContext } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { userDetails } from '../context/UserAuthentication';

function Operator() {
  const {currentUser}=useContext(userDetails);
  return (
    <div className='p-5 flex justify-center w-full'>
    <div className='flex py-5 w-3/4 flex-col items-center border-2 border-black rounded-lg'>
      <div className="flex border-b-2 pb-3 border-black justify-around w-full">
        <NavLink to={`${currentUser.userId}`} className='p-2 rounded-md text-black hover:bg-slate-200 flex justify-center items-center gap-2'>Profile</NavLink>
        {currentUser.userType==='driver' &&
        <>
        <NavLink to="accept" className='p-2 rounded-md text-black hover:bg-slate-200 flex justify-center items-center gap-2'>Requests</NavLink>
        </>
        }
        {
          currentUser.userType==='operator' &&
          <NavLink to="follow" className='p-2 rounded-md text-black hover:bg-slate-200 flex justify-center items-center gap-2'>Follow</NavLink>
        }
        {
          currentUser.userType==='user' &&
          <NavLink to="tickethistory" className='p-2 rounded-md text-black hover:bg-slate-200 flex justify-center items-center gap-2'>Ticket History</NavLink>
        }
      </div>
      <div className='relative w-full'>
      <div 
        className='absolute inset-0 z-0'
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(255, 255, 255, 0.85), 
              rgba(255, 255, 255, 0.85)
            ),
            url("/manwalking.png")
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className='z-10'>
      <Outlet />
      </div>
      
      </div>
   </div>  
    </div>
  )
}

export default Operator