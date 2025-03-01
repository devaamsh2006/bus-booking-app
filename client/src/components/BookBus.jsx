import React from 'react'
import { useLocation } from 'react-router-dom'

function BookBus() {
    const {state}=useLocation();
    console.log(state);
    
  return (
    <div></div>
  )
}

export default BookBus