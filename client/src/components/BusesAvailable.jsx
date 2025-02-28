import axios from 'axios';
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function BusesAvailable() {
    const {state}=useLocation();
    const [buses,setBuses]=useState([]);
    async function getBuses(){
        const res=await axios.get('http://localhost:4000/user/buses',state);
        if(res.data.message==='buses found'){
            setBuses(res.data.payLoad);
        }
    }
    useEffect(()=>{
        getBuses();
    },[]);
    useEffect(()=>{
        console.log("buses",buses);
    },[buses])
  return (
    <div>BusesAvailable</div>
  )
}

export default BusesAvailable