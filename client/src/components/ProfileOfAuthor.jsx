import React, { useContext, useEffect, useState } from 'react'
import { userDetails } from '../context/UserAuthentication';
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { RiBusLine } from "react-icons/ri";
import axios from 'axios';

function ProfileOfAuthor() {
  const [operatordrivers,setDrivers]=useState([]);
  const [driver,setDriver]=useState({});
  const noOfBuses=0;
  const {currentUser}=useContext(userDetails);

  useEffect(()=>{
    if(currentUser.userType==='operator'){
    handleDrivers();
    }
    if(currentUser.userType==='driver'){
    handleDriver();
    }
  },[])


  const handleDrivers=async()=>{
    const res=await axios.post('http://localhost:4000/operator/drivers',currentUser);
    setDrivers(res.data.payLoad);
  }

  const handleDriver=async()=>{
    const res=await axios.post('http://localhost:4000/driver/login',currentUser)
    setDriver(res.data.payLoad?.occupied?.[0]);
  }

  return (
    <div className='w-full relative p-5 flex flex-col gap-5 h-[75vh]'>
      <div className='flex justify-center gap-4 items-center w-full z-10'>
        <img src={currentUser.imageUrl} className='w-40 rounded-full' />
        <div className='flex flex-col gap-3'>
        <p className='font-semibold text-4xl'>{currentUser.fullName}</p>
        <p className='font-medium text-2xl'>Id:{currentUser.userId}</p>
        </div>
      </div>
      <div className='flex justify-between w-full z-10'>
          <h1 className='text-2xl font-semibold'>Personal Info</h1>
          <button  className='rounded-lg text-white bg-black p-3'>Edit Details</button>
      </div>
      <h1 className='flex items-center gap-2 z-10'><FaPhoneAlt className='scale-[1.5]'/>{currentUser.phoneno}</h1>
      <h1 className='flex items-center gap-2 z-10'><MdOutlineEmail className='scale-[1.5]'/>{currentUser.email}</h1>
      <h1 className='flex items-center gap-2 z-10'><CiLocationOn className='scale-[1.5]'/>{currentUser.location}</h1>
      {
        currentUser.userType==='operator' &&
        <>
          <h1 className='text-2xl font-semibold z-10'>Bus stats:</h1>
          <h1 className='flex items-center gap-2 z-10'><RiBusLine className='scale-[1.5]'/>Buses Registered:{noOfBuses}</h1>
          {
           operatordrivers[0]?.drivers?.map((driver)=>{
            return (
              <>
              <h1 className='flex items-center gap-2 z-10'>{driver.fullName}</h1>
              <h1 className='flex items-center gap-2 z-10'>{driver.drivername}</h1>
              <h1 className='flex items-center gap-2 z-10'>{driver.salary}</h1>
              </>
            )
           })
          }
        </>
      }
      {
        currentUser.userType==='driver' &&
        <>
        <h1 className='text-2xl font-semibold z-10'>Bus stats:</h1>
        <h1 className='flex items-center gap-2 z-10'>Salary:{driver?.salary}</h1>
        </>
      }
      
    </div>
  )
}

export default ProfileOfAuthor