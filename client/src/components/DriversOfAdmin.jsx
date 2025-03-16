import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function DriversOfAdmin() {
  const [drivers,setDrivers]=useState([]);
  
    const navigate=useNavigate();
  
    const handleDrivers=async()=>{
        const res=await axios.get('http://localhost:4000/admin/driversofAdmin');
        setDrivers(res.data.payLoad);
    }
  
    useEffect(()=>{
        handleDrivers();
    },[])
  
    const handleOperator=(driver)=>{
      driver.userType='driver';
      navigate(`/admin/drivers/${driver.driverId}`,{state:driver})
    }
  
  return (
    <div className='p-3 flex flex-col gap-3'>
      {
        drivers.length===0 &&
        <p className='text-lg'>No Requests Found</p>
      }
      {
        drivers.length>0 &&
        drivers.map((user,index)=>{
            return(
                <div className='flex relative flex-col border-2 border-slate-400 rounded-xl gap-2 shadow-lg p-4' key={index}>
                <h1 className='text-lg'>Operator Name:{user.fullName}</h1>
                <h1 className='text-lg flex gap-1'>PhoneNO: +91{user.phoneno}</h1>
                <button className='p-2 bg-black text-white rounded-md absolute bottom-2 right-2' onClick={()=>handleOperator(user)}>Get More Details</button>
              </div>
            )
        })
      }
    </div>
  )
}

export default DriversOfAdmin