import React, { useContext, useState } from 'react'
import {useForm} from 'react-hook-form';
import {useLocation,useNavigate} from 'react-router-dom';
import { userDetails } from '../context/UserAuthentication';
import axios from 'axios';
import { useClerk, useUser } from '@clerk/clerk-react';
function SignupDetails() {
  const {isSignedIn,user,isLoaded}=useUser();
  const {currentUser,setCurrentuser}=useContext(userDetails);
  const {register,handleSubmit,formState:{errors}}=useForm();
  const navigate=useNavigate();
  const [nowuser,setUser]=useState(null);
  function settingUser(obj){
      setUser(obj.role);
  }

  async function handleDetails(credObj){
    credObj.userId=Date.now();
    credObj.username=user?.emailAddresses[0].emailAddress;
    credObj.dateOfJoining=new Date();
    credObj.imageUrl=user?.imageUrl;
    credObj.fullName=user?.fullName;
    if(nowuser==='user'){
      const res=await axios.post('https://bus-booking-app-1-okbp.onrender.com/user/signup',{user:credObj}); 
      if(res.data.message==='user created'){
        navigate('/');
      }
    }else if(nowuser==='operator'){
      credObj.operatorId=Date.now();      
      const res=await axios.post('https://bus-booking-app-1-okbp.onrender.com/operator/signup',{user:credObj}); 
      console.log(res)
      if(res.data.message==='operator created'){
        navigate('/');
      }
    }else if(nowuser==='driver'){
      credObj.driverId=Date.now();
      credObj.yearsOfExperience=credObj.experience;
      delete credObj.experience;
      const res=await axios.post('https://bus-booking-app-1-okbp.onrender.com/driver/signup',{user:credObj}); 
      console.log(res);
      if(res.data.message==='driver created'){
        navigate('/');
      }
    }
  }

  return (
    <div className='relative h-screen '>
      <img src="/nature.jpg" className="w-full h-full object-cover" alt="Background" />
      <div className="absolute inset-0 backdrop-blur-md"></div>
      <div className='absolute top-1/4 left-1/3 w-1/3 p-5  flex flex-col justify-center items-center gap-5 bg-white rounded-md'>
      {
      nowuser===null&&
      <>
      <form onSubmit={handleSubmit(settingUser)} className='flex flex-col gap-5'>
      <div className='flex flex-col justify-center items-center gap-5'>
        <h1 className='text-2xl font-bold '>WELCOME TO BUSBUDDY</h1>
        <h1 className='text-lg font-semibold'>Choose Your Role</h1>
        <div className='flex gap-3'>
        <div className='flex gap-3'>
        <input type="radio" {...register('role', { required: "Please select a role" })} id="user" value="user" />
        <label htmlFor="user">User</label>
        </div>
        <div className='flex gap-3'>
        <input type="radio" {...register('role', { required: "Please select a role" })} id="operator" value="operator" />
        <label htmlFor="operator">Operator</label>
        </div>
        <div className='flex gap-3'>
        <input type="radio" {...register('role', { required: "Please select a role" })} id="driver" value="driver" />
        <label htmlFor="driver">Driver</label>
        </div>
        {errors.role && <span className='text-red-500'>{errors.role.message}</span>}
        </div>
      </div>
      <button className='p-3 rounded-sm bg-sky-400 text-white hover:bg-sky-500 transition-all'>Next</button>
      </form>
      </>
      }
      <form onSubmit={handleSubmit(handleDetails)} className='flex flex-col gap-5 justify-center items-center'>
      {
        nowuser!==null&&
        <>
        <div className='flex flex-col gap-3'>
        <h1 className='text-2xl font-bold '>Fill Your Details</h1>
        <input type="text" {...register('phoneno',{required:true})} id="phoneno" className='p-3 border-2 rounded-lg focus:outline-none focus:border-slate-600 border-slate-400' placeholder='PhoneNumber' />
        {errors.phoneno && <span className='text-red-500'>{errors.phoneno.message}</span>}
        <label htmlFor="dateOfBirth" className='text-lg font-medium'>D.O.B:</label>
        <input type="date" {...register('dateOfBirth',{required:true})} id="dateOfBirth" className='p-3 border-2 rounded-lg focus:outline-none focus:border-slate-600 border-slate-400' />
        {errors.dateOfBirth && <span className='text-red-500'>{errors.dateOfBirth.message}</span>}
        </div>
        </>
      }
      {
        nowuser==='driver'&&
        <>
        <input type="text" {...register('licenceno',{required:true})} id="licenceno" placeholder='Licence Number' className='p-3 border-2 rounded-lg focus:outline-none focus:border-slate-600 border-slate-400' />
        {errors.licenceno && <span className='text-red-500'>{errors.licenceno.message}</span>}
        <input type="text" {...register('location',{required:true})} id="location" placeholder='Location' className='p-3 border-2 rounded-lg focus:outline-none focus:border-slate-600 border-slate-400' />
        {errors.location && <span className='text-red-500'>{errors.location.message}</span>}
        <input type="text" {...register('experience',{required:true})} id="experience" placeholder='Years Of experience' className='p-3 border-2 rounded-lg focus:outline-none focus:border-slate-600 border-slate-400' />
        {errors.experience && <span className='text-red-500'>{errors.experience.message}</span>}
        </>
      }
      {
        nowuser==='operator'&&
        <>
        <input type="text" {...register('address',{required:true})} id="address" placeholder='Address' className='p-3 border-2 rounded-lg focus:outline-none focus:border-slate-600 border-slate-400' />
        {errors.address && <span className='text-red-500'>{errors.address.message}</span>}
        <input type="text" {...register('gstNo',{required:true})} id="gstNo" placeholder='GSTNO' className='p-3 border-2 rounded-lg focus:outline-none focus:border-slate-600 border-slate-400' />
        {errors.gstNo && <span className='text-red-500'>{errors.gstNo.message}</span>}
        <input type="text" {...register('location',{required:true})} id="Location" placeholder='Location' className='p-3 border-2 rounded-lg focus:outline-none focus:border-slate-600 border-slate-400' />
        {errors.location && <span className='text-red-500'>{errors.location.message}</span>}
        </>
      }
      {nowuser!==null&& <button type="submit" className='p-3 rounded-sm bg-sky-400 text-white hover:bg-sky-500 transition-all'>Submit</button>}
      </form>
      </div>
    </div>
  )
}

export default SignupDetails