import React from 'react'
import { useForm } from 'react-hook-form'

function DriverBuses() {
  const {register,handleSubmit,formState:{errors}}=useForm();

  const handleBuses=async(credObj)=>{
      console.log(credObj)
  }

  return (
    <div>
      <form onSubmit={handleSubmit(handleBuses)}>
        <input type="date" {...register('date',{required:true})} className='p-3 rounded-md border-2 border-slate-300 focus:outline-none focus:border-slate-700' />
        <button type='submit' >Find Buses</button>
      </form>
    </div>
  )
}

export default DriverBuses