import React, { useContext } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { userDetails } from '../context/UserAuthentication';

function OpeartorBuses() {
    const {currentUser}=useContext(userDetails);
  return (
    <div className='flex flex-col'>
    <div className='flex p-5 bg-slate-300 justify-around'>
        <NavLink to={`${currentUser.userId}`} className='p-2 rounded-md text-black hover:bg-slate-200 flex justify-center items-center gap-2'>Your Buses</NavLink>
        <NavLink to="newbus" className='p-2 rounded-md text-black hover:bg-slate-200 flex justify-center items-center gap-2'>Add New Buses</NavLink>
    </div>
    <Outlet />
    </div>
  )
}

export default OpeartorBuses