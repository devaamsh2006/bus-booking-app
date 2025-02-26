import React, { useContext } from 'react'
import { FaSearch } from "react-icons/fa";
import {useForm} from 'react-hook-form';
import { userDetails } from '../context/UserAuthentication';

function RequestsOfOperator() {
  const {currentUser}=useContext(userDetails);
  const {register,handleSubmit,formState:{errors}}=useForm();
  return (
    <div className='flex gap-3 flex-col w-full p-4 z-10 h-[75vh] overflow-scroll'>
      <div className='z-10 flex flex-col gap-3'>
        <div className='p-3 border-2 border-black rounded-xl flex justify-between z-10'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-3xl font-semibold'>{currentUser.fullName}</h1>
            <h1 className='text-xl'>{currentUser.email}</h1>
            <h1 className='text-xl'>+91{currentUser.phoneno}</h1>
          </div>
          <button className='p-3 h-14 rounded-xl flex items-center justify-center text-white bg-purple-500 shadow-md hover:shadow-purple-500/50 z-10'>Accept Request</button>
        </div>
        <div className='p-3 border-2 border-black rounded-xl flex justify-between z-10'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-3xl font-semibold'>{currentUser.fullName}</h1>
            <h1 className='text-xl'>{currentUser.email}</h1>
            <h1 className='text-xl'>+91{currentUser.phoneno}</h1>
          </div>
          <button className='p-3 h-14 rounded-xl flex items-center justify-center text-white bg-purple-500 shadow-md hover:shadow-purple-500/50 z-10'>Accept Request</button>
        </div>
        <div className='p-3 border-2 border-black rounded-xl flex justify-between z-10'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-3xl font-semibold'>{currentUser.fullName}</h1>
            <h1 className='text-xl'>{currentUser.email}</h1>
            <h1 className='text-xl'>+91{currentUser.phoneno}</h1>
          </div>
          <button className='p-3 h-14 rounded-xl flex items-center justify-center text-white bg-purple-500 shadow-md hover:shadow-purple-500/50 z-10'>Accept Request</button>
        </div>
      </div>
    </div>
  )
}

export default RequestsOfOperator