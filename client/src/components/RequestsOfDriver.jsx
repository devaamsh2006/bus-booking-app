import React, { useContext, useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa";
import { useForm } from 'react-hook-form';
import { userDetails } from '../context/UserAuthentication';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

function RequestsOfDriver() {
  const { currentUser } = useContext(userDetails);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const handleOperators = async () => {
    try {
      const res = await axios.post('https://bus-booking-app-1-okbp.onrender.com/driver/login', currentUser);
      setRequests(res.data.payLoad?.pending || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setRequests([]);
    }
  }

  const addOperator = async (credObj) => {
    try {
      let details = {
        username:currentUser.email,
        fullName: currentUser.fullName,
        operatorname: credObj.operatorname,
        request: 'add'
      };

      
      const res = await axios.put('https://bus-booking-app-1-okbp.onrender.com/driver/operators', details);
      console.log(res)
      if (res.data.message === 'operator finalized') {
        navigate(`/driver/${currentUser.userId}`);
      }
    } catch (error) {
      console.error("Error accepting operator:", error);
    }
  }

  const removeOperator = async (credObj) => {
    try {
      let details = {
        username: currentUser.email,
        operatorname: credObj.operatorname,
        request: 'remove'
      };
      
      const res = await axios.put('https://bus-booking-app-1-okbp.onrender.com/driver/operators', details);
      if (res.data.message === 'operator deleted') {
        navigate(`/driver/${currentUser.userId}`);
      }
    } catch (error) {
      console.error("Error declining operator:", error);
    }
  }

  useEffect(() => {
    handleOperators();
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <div className='flex gap-3 flex-col w-full p-4 z-10 h-[75vh] overflow-scroll'>
      <div className='z-10 flex flex-col gap-3'>
        {
          !requests || requests.length === 0 ? (
            <div className='flex items-center justify-center h-60'>
              <p className='text-gray-500 text-xl font-medium z-10'>No Requests Found</p>
            </div>
          ) : (
            requests.map((operator, index) => (
              <div className='p-3 border-2 border-black rounded-xl flex justify-between z-10' key={index}>
                <div className='flex flex-col gap-2'>
                  <h1 className='text-3xl font-semibold'>{operator.operatorname}</h1>
                  <h1 className='text-xl'>Salary: {operator.salary}</h1>
                </div>
                <div className='flex gap-2'>
                  <button 
                    className='p-3 h-14 rounded-xl flex items-center justify-center text-white bg-green-500 shadow-md hover:shadow-green-500/50 z-10' 
                    onClick={() => addOperator(operator)}
                  >
                    Accept Request
                  </button>
                  <button 
                    className='p-3 h-14 rounded-xl flex items-center justify-center text-white bg-red-500 shadow-md hover:shadow-red-500/50 z-10' 
                    onClick={() => removeOperator(operator)}
                  >
                    Decline Request
                  </button>
                </div>
              </div>
            ))
          )
        }
      </div>
    </div>
  )
}

export default RequestsOfDriver