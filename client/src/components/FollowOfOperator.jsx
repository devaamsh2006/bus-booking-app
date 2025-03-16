import React, { useContext, useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa";
import {useForm} from 'react-hook-form';
import { userDetails } from '../context/UserAuthentication';
import axios from 'axios';

function FollowOfOperator() {
  const {currentUser}=useContext(userDetails);

  const [drivers,setdrivers]=useState([]);

  const handledrivers=async()=>{
      const res=await axios.get('https://bus-booking-app-1-okbp.onrender.com/operator/getdrivers');
      setdrivers(res.data.payLoad);
  }

  const adddriver=async(salary,credObj)=>{
    let details={};
    details.username=currentUser.email;
    details.drivername=credObj.username;
    details.salary=Number(salary.salary);
    const res=await axios.put('https://bus-booking-app-1-okbp.onrender.com/operator/adddrivers',details);
    console.log(res)
    if(res.data.message==="driver requested"){
      alert('request sent');
    }
  }

  useEffect(()=>{
    handledrivers();
  },[]);

  const {register,handleSubmit,formState:{errors}}=useForm();
  return (
    <div className='flex gap-3 flex-col w-full p-4 z-10 h-[75vh] overflow-scroll'>
      <div className='flex items-center justify-between z-10 border-2 border-slate-500 focus:border-slate-800 p-3 rounded-xl'>
        <input type="text" {...register('driverusername')} id="driverusername" placeholder='Driver Username' className='focus:outline-none w-3/4 bg-transparent' />
        <button className='p-3 rounded-lg bg-cyan-500 shadow-md hover:shadow-cyan-500/50 text-white flex gap-2 items-center'><FaSearch />Search</button>
      </div>
      <div className='z-10 flex flex-col gap-3'>
      {
        drivers.length===0 ?
        <p>No Drivers Found</p>
        :
        drivers.map((driver)=>{
          return(
          <div className='p-3 border-2 border-black rounded-xl flex justify-between z-10'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-3xl font-semibold'>{driver.fullName}</h1>
            <h1 className='text-xl'>{driver.username}</h1>
            <h1 className='text-xl'>+91{driver.phoneno}</h1>
          </div>
            <form onSubmit={handleSubmit((salary)=>adddriver(salary,driver))} className='flex flex-col gap-2'>
              <input type='text' {...register('salary')} className='focus:outline-none border-2 border-slate-300 focus:border-slate-600 w-32 p-2 rounded-lg' placeholder='Enter Salary' />
              <button className='p-3 h-14 rounded-xl flex items-center justify-center text-white bg-purple-500 shadow-md hover:shadow-purple-500/50 z-10'>Send Request</button>
            </form>
        </div>
          )
      })
      }
      </div>
    </div>
  )
}

export default FollowOfOperator