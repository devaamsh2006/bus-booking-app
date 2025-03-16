import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function OperatorsOfAdmin() {
  const [operators,setOperators]=useState([]);

  const navigate=useNavigate();

  const handleOperators=async()=>{
      const res=await axios.get('http://localhost:4000/admin/operatorsofAdmin');
      setOperators(res.data.payLoad);
  }

  useEffect(()=>{
      handleOperators();
  },[])

  const handleOperator=(operator)=>{
    operator.userType='operator';
    navigate(`/admin/operators/${operator.operatorId}`,{state:operator})
  }

return (
  <div className='p-3 flex flex-col gap-3'>
    {
      operators.length===0 &&
      <p className='text-lg'>No Requests Found</p>
    }
    {
      operators.length>0 &&
      operators.map((user,index)=>{
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

export default OperatorsOfAdmin