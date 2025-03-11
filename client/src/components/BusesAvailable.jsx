import React from 'react'
import axios from 'axios';
import { useEffect,useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function BusesAvailable() {
    const {state}=useLocation();
    const [buses,setBuses]=useState([]);
    const [busDetails,setBusDetails]=useState([]);
    const navigate=useNavigate();
    async function getBuses(){
        const res=await axios.post('http://localhost:4000/user/buses',state);
        if(res.data.message==='buses found'){
            setBuses(res.data.payLoad);
            setBusDetails(res.data.busDetails);
        }
    }
    useEffect(()=>{
        getBuses();
    },[]);
    
    function handlebus(bus,index){
      const route=state;
        navigate(`/bookbus?id=${bus.busId}`,{state:{route,bus,busDetails}});
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
      <h1 className='text-xl font-medium'>From <span className='text-3xl font-semibold'>{state.source}</span> To <span className='text-3xl font-semibold'>{state.destination}</span></h1>
      <h1 className='text-lg'>Time:{busDetails[index].stTime}</h1>
      <h1 className='text-lg flex gap-1'>Ac: {busDetails[index].Ac ? <h1>Yes</h1> : <h1>No</h1>}</h1>
      <h1>Price of ticket:{busDetails[index].price}</h1>
      <h1>Date:{state.date}</h1>
      <button className='p-2 bg-black text-white rounded-md absolute bottom-2-2 right-2' onClick={()=>handlebus(bus,index)}>Book Now</button>
      </div>
        )
        }
    )}
    </div>
    )
}
export default BusesAvailable