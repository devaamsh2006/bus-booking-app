import React,{useContext, useEffect} from 'react'
import { NavLink } from 'react-router-dom'
import './Header.css';
import { BsBusFront } from "react-icons/bs";
import { FaHome } from "react-icons/fa";
import { CiFaceSmile } from "react-icons/ci";
import { CiLogin } from "react-icons/ci";
import { useClerk, useUser } from '@clerk/clerk-react';
import { userDetails } from '../context/UserAuthentication';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Header() {
  const navigate=useNavigate();
  const {isSignedIn,user,isLoaded}=useUser();
  const {currentUser,setCurrentUser}=useContext(userDetails);
  const {signOut}=useClerk();
  async function handleSignOut(){
    await signOut();
  }

  return (
    <div className='flex flex-row justify-between p-5 pr-10 fixed w-full items-center bg-white shadow-md shadow-slate-300 z-50 h-16'>
        <h1 className='flex gap-3 items-center text-black font-bold text-xl'><BsBusFront className='text-black scale-[2]'/>BusBuddy</h1>
        <div className='flex w-1/4 justify-between gap-1'>
            <NavLink to="" className='p-2 rounded-md text-black hover:bg-slate-200 flex justify-center items-center gap-2'><FaHome className='scale-[1.2]'/>Home</NavLink>
            
            {
            isSignedIn
            ?
            <>
            {currentUser.userType==='user'&&<><NavLink to="buses" className='p-2 rounded-md text-black hover:bg-slate-200 flex justify-center items-center gap-2'>Buses</NavLink></>}
            {currentUser.userType==='operator'&&
            <>
            <NavLink to={`operator/profile/${currentUser.userId}`} className='p-2 rounded-md text-black hover:bg-slate-200 flex justify-center items-center gap-2'>Profile</NavLink>
            <NavLink to={`operator/buses/${currentUser.userId}`} className='p-2 rounded-md text-black hover:bg-slate-200 flex justify-center items-center gap-2'>Buses</NavLink>
            </>}
            {currentUser.userType==='driver'&&<><NavLink to={`driver/${currentUser.userId}`} className='p-2 rounded-md text-black hover:bg-slate-200 flex justify-center items-center gap-2'>Driver</NavLink></>}
            <button onClick={handleSignOut} className='p-2 rounded-md text-black hover:bg-slate-200 flex justify-center items-center gap-2'>SignOut</button>
            </>
            :<>
            <NavLink to="login" className='p-2 rounded-md text-black hover:bg-slate-200 flex justify-center items-center gap-2'><CiLogin className='scale-[1.2]'/>Login</NavLink>
            <NavLink to="signup" className='p-2 rounded-md text-black hover:bg-slate-200 flex justify-center items-center gap-2'><CiFaceSmile className='scale-[1.2]'/>SignUp</NavLink>
            </>
            }
            
        </div>
    </div>
  )
}

export default Header