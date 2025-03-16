import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

function Admin() {
  return (
    <div className='flex flex-col'>
        <div className='flex p-5 bg-slate-300 justify-around'>
            <NavLink to='requests' className='p-2 rounded-md text-black hover:bg-slate-200 flex justify-center items-center gap-2'>Requests</NavLink>
            <NavLink to='operators' className='p-2 rounded-md text-black hover:bg-slate-200 flex justify-center items-center gap-2'>Operators</NavLink>
            <NavLink to='drivers' className='p-2 rounded-md text-black hover:bg-slate-200 flex justify-center items-center gap-2'>Drivers</NavLink>
        </div>
        <div className='min-h-[70vh]'>
        <Outlet />
        </div>
    </div>
  )
}

export default Admin