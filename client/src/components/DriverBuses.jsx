import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { userDetails } from '../context/UserAuthentication';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DriverBuses() {
  const {register,handleSubmit,formState:{errors}}=useForm();

  const [buses,setBuses]=useState([]);

  const {currentUser}=useContext(userDetails);

  const handleBuses=async()=>{
    console.log(currentUser);
      const res=await axios.post('http://localhost:4000/driver/buses',currentUser);
      setBuses(res.data.payLoad);
  }

  const navigate=useNavigate();

  useEffect(()=>{
    handleBuses();
  },[])

  const handleBus=(credObj)=>{
    navigate(`/driver/${credObj.busId}/userdetails`,{state:credObj});
  }

  return (
    <div className='flex flex-col gap-5 p-5 min-h-[80vh]'>
    {
      buses?.length===0 ?
      <h1>No Buses Have Been found..Try Another Route</h1>
      :
      buses?.map((bus,index) => {
        return  (
      <div className='flex relative flex-col border-2 border-slate-400 rounded-xl gap-2 shadow-lg p-4 hover:shadow-slate-300'>
      <h1 className='text-xl font-medium'>From <span className='text-3xl font-semibold'>{bus.route[0].source}</span> To <span className='text-3xl font-semibold'>{bus.route[0].destination}</span></h1>
      <h1 className='text-lg'>Time:{bus.stTime}</h1>
      <h1 className='text-lg flex gap-1'>Ac: {bus.Ac ? <h1>Yes</h1> : <h1>No</h1>}</h1>
      <h1>Price of ticket:{bus.price}</h1>
      <button className='p-2 bg-black text-white rounded-md absolute bottom-2-2 right-2' onClick={()=>handleBus(bus)}>Get More User Details</button>
      </div>
        )
        }
    )}
    </div>
  )
}

export default DriverBuses