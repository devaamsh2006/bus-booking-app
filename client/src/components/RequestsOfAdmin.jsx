import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function RequestsOfAdmin() {

    const [requests,setRequests]=useState([]);

    const navigate=useNavigate();

    const handleRequests=async()=>{
        const res=await axios.get('http://localhost:4000/admin/requestsofAdmin');
        setRequests(res.data.payLoad);
    }

    useEffect(()=>{
        handleRequests();
    },[])
    
    const addOperator=async(operator)=>{
        navigate(`/admin/requests/${operator.operatorId}`,{state:operator});
    }

  return (
    <div className='p-3'>
      {
        requests.length===0 &&
        <p className='text-lg'>No Requests Found</p>
      }
      {
        requests.length>0 &&
        requests.map((user,index)=>{
            return(
                <div className='flex relative flex-col border-2 border-slate-400 rounded-xl gap-2 shadow-lg p-4' key={index}>
                <h1 className='text-lg'>Passenger Name:{user.fullName}</h1>
                <h1 className='text-lg flex gap-1'>PhoneNO: +91{user.phoneno}</h1>
                <button className='p-2 bg-black text-white rounded-md absolute bottom-2-2 right-2' onClick={()=>addOperator(user)}>Get More Details</button>
      </div>
            )
        })
      }
    </div>
  )
}

export default RequestsOfAdmin