import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { userDetails } from '../context/UserAuthentication'
import { useNavigate } from 'react-router-dom';

function BusesOfOperator() {

  const {currentUser}=useContext(userDetails);
  const [buses,setBuses]=useState([]);
  const navigate=useNavigate();

  async function handleBuses(){
    const res=await axios.post('https://bus-booking-app-1-okbp.onrender.com/operator/buses',{username:currentUser.email});
    if(res.data.message==='buses found'){
      setBuses(res.data.payLoad);
    }
  }

  function handlenewTrips(credObj){
    navigate('/operator/buses/addtrips',{state:credObj});
  }

  useEffect(()=>{
    handleBuses();
  },[]);

  return (
    <div className='flex flex-col gap-5 p-5 min-h-[80vh]'>
    {
      buses.length===0 ?
      <h1>Currently no buses have been added</h1>
      :
      buses.map(bus => {
    return  (
      <div className='flex relative flex-col border-2 border-slate-400 rounded-xl gap-2 shadow-lg p-4 hover:shadow-slate-300'>
      <h1 className='text-xl font-medium'>From <span className='text-3xl font-semibold'>{bus.route[0].source}</span> To <span className='text-3xl font-semibold'>{bus.route[0].destination}</span></h1>
      <h1 className='text-lg'>Time:{bus.stTime}</h1>
      <h1 className='text-lg flex gap-1'>Ac: {bus.Ac ? <h1>Yes</h1> : <h1>No</h1>}</h1>
      <h1>Price of ticket:{bus.price}</h1>
      <h1 className='font-semibold'>Intermediate Stations</h1>
      <ul className='px-4'>
      {
        bus.route[0].intermediate.map(route=>{
          return <li className='list-disc'>{route.station}</li>
        })
      }
      </ul>
      <button className='absolute right-2 top-3 bg-black text-white rounded-md p-2' onClick={()=>handlenewTrips(bus)}>Add Bus Trips</button>
      </div>)
      }
      )
    }
    </div>
  )
}

export default BusesOfOperator