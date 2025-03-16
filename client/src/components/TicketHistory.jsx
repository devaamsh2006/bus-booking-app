import React, { useContext, useEffect, useState } from 'react'
import { userDetails } from '../context/UserAuthentication'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TicketHistory() {
  const { currentUser } = useContext(userDetails);
  const [tickets, settickets] = useState([]);
  const navigate=useNavigate();

  const gethistory = async() => {
    const res = await axios.post('https://bus-booking-app-1-okbp.onrender.com/user/gettickets', { userId: currentUser.userId });
    settickets(res.data.payLoad);
  }
  
  useEffect(() => {
    gethistory();
  }, [])

  const cancelticket=async(credObj)=>{
    credObj.action='cancel';
    credObj.selectedSeats=credObj.seats;
    const res=await axios.put('https://bus-booking-app-1-okbp.onrender.com/user/book',credObj);
    if(res.data.message==="Tickets cancelled successfully"){
      const result=await axios.post('https://bus-booking-app-1-okbp.onrender.com/user/cancelticket',credObj);
      if(result.data.message==='cancelled successfully'){
        gethistory();
      }
    }
  }

  return (
    <div className='flex z-10 flex-col min-h-[80vh] p-5 gap-5 bg-gray-50'>
      {tickets.length === 0 ? (
        <div className='flex items-center justify-center h-60'>
          <p className='text-gray-500 text-xl font-medium z-10'>No History Found</p>
        </div>
      ) : (
        tickets?.map((ticket, index) => (
          <div key={index} className='z-10 p-6 flex flex-col gap-3 shadow-lg shadow-slate-300 rounded-xl bg-white border border-gray-100 hover:shadow-xl transition-shadow duration-300'>
            <div className='flex justify-between items-center border-b border-gray-100 pb-3'>
              <h1 className='font-semibold text-gray-800'>
                Trip <span className='text-blue-600'>#{index + 1}</span>
              </h1>
              <div className='px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full'>
                Confirmed
              </div>
            </div>
            
            <div className='flex items-center justify-between my-2'>
              <div className='flex flex-col'>
                <span className='text-sm text-gray-500'>From</span>
                <span className='text-black text-xl font-bold'>{ticket.source}</span>
              </div>
              
              <div className='flex-1 mx-4 relative'>
                <div className='border-t-2 border-dashed border-gray-300'></div>
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 rounded-full p-1'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              
              <div className='flex flex-col items-end'>
                <span className='text-sm text-gray-500'>To</span>
                <span className='text-black font-bold text-xl'>{ticket.destination}</span>
              </div>
            </div>
            
            <div className='grid grid-cols-2 gap-4 mt-2'>
              <div className='bg-gray-50 p-3 rounded-lg'>
                <p className='text-sm text-gray-500'>Date</p>
                <p className='text-lg font-medium'>
                  {typeof ticket.date === 'string' ? ticket.date.split('T')[0] : new Date(ticket.date).toLocaleDateString()}
                </p>
              </div>
              
              <div className='bg-gray-50 p-3 rounded-lg'>
                <p className='text-sm text-gray-500'>Time</p>
                <p className='text-lg font-medium'>{ticket.time} AM</p>
              </div>
            </div>
            
            <div className='mt-2'>
              <p className='text-sm text-gray-500 mb-2'>Seats No:</p>
              <div className='flex flex-wrap gap-2'>
                {ticket.seats?.map((seat, seatIndex) => (
                  <span key={seatIndex} className='px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium'>
                    {seat}
                  </span>
                ))}
              </div>
            </div>
            
            <div className='mt-4 pt-3 border-t border-gray-100 flex justify-between items-center'>
              <div className='text-gray-600 text-sm'>
                Bus ID: <span className='font-medium'>{ticket.busId}</span>
              </div>
              <button className='px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors' onClick={()=>cancelticket(ticket)}>
                Cancel Ticket
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default TicketHistory