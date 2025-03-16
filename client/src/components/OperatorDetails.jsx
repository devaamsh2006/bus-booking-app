import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { userDetails } from '../context/UserAuthentication';
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { RiBusLine } from "react-icons/ri";
import axios from 'axios';

function OperatorDetails() {
    let noOfBuses=0;
    const {state}=useLocation();

    const navigate=useNavigate();

    const addOperator=async()=>{
        const res=await axios.put('http://localhost:4000/admin/accept',{accept:true,username:state.username});
        if(res.data.message==='operator accepted'){
            navigate('/admin/operators');
        }
    }

    const blockOrUnblockOperator=async()=>{
        const res=await axios.put('http://localhost:4000/admin/block',state);
        if(res.data.message==='operation done'){
            navigate(`/admin/operators/${state.operatorId}`,{state:res.data.payLoad});
        }
    }

  return (
    <div>
    <div className='w-full relative p-5 flex flex-col gap-5 h-[75vh]'>
          <div className='flex gap-4 items-center w-full z-10'>
            <img src={state.imageUrl} className='w-40 rounded-full' />
            <div className='flex flex-col gap-3'>
            <p className='font-semibold text-4xl'>{state.fullName}</p>
            <p className='font-medium text-2xl'>Id:{state.operatorId}</p>
            </div>
          </div>
          <div className='flex justify-between w-full z-10'>
              <h1 className='text-2xl font-semibold'>Personal Info</h1>
              {state.accepted==true ? 
              (
                state.blocked===false ?
              <button  className='rounded-lg text-white bg-black p-3' onClick={blockOrUnblockOperator}>Block Operator</button>
                :
                <button  className='rounded-lg text-white bg-black p-3' onClick={blockOrUnblockOperator}>Unblock Operator</button>
              ):
              <button  className='rounded-lg text-white bg-black p-3' onClick={addOperator}>Accept Operator</button>
              }
          </div>
          <h1 className='flex items-center gap-2 z-10'><FaPhoneAlt className='scale-[1.5]'/>{state.phoneno}</h1>
          <h1 className='flex items-center gap-2 z-10'><MdOutlineEmail className='scale-[1.5]'/>{state.username}</h1>
          <h1 className='flex items-center gap-2 z-10'><CiLocationOn className='scale-[1.5]'/>{state.location}</h1>
          
              <h1 className='text-2xl font-semibold z-10'>Bus stats:</h1>
              <h1 className='flex items-center gap-2 z-10'><RiBusLine className='scale-[1.5]'/>Buses Registered:{noOfBuses}</h1>
              <h1 className='text-2xl font-semibold z-10'>Drivers</h1>
              {
               state?.drivers?.map((driver)=>{
                return (
                  <div className='flex gap-3'>
                  <h1 className='flex items-center gap-2 z-10'>{driver.drivername}</h1>
                  <h1 className='flex items-center gap-2 z-10'>{driver.salary}</h1>
                  </div>
                )
               })
              }
          
        </div>
        </div>
  )
}

export default OperatorDetails