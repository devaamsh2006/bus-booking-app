import React, { useEffect ,useRef, useState} from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import "./Buses.css";
import { useNavigate } from 'react-router-dom';

function Buses() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [routes,setRoutes]=useState([]);
  const navigate=useNavigate();
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const routePresent = await axios.get('https://bus-booking-app-1-okbp.onrender.com/user/routes');
        setRoutes(routePresent.data.payLoad);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };

    fetchRoutes();
  }, []);


  let handleDetails = (credObj) => {
    navigate('/busesavailable',{state:credObj});
  };

  return(
    <div className="relative flex flex-wrap">
    <img src="/nature.jpg" className="w-full h-screen object-cover" alt="Background" />
    <div className="absolute inset-0 backdrop-blur-xl"></div>
    <form onSubmit={handleSubmit(handleDetails)}>
    <div className="absolute p-4 pb-8 flex flex-col border-2 border-black justify-center items-center 
                    top-[15%] gap-8 left-1/4 w-1/2 bg-white shadow-xl rounded-xl z-10 buses">
      <h1 className="font-bold text-5xl text-center">BOOK YOUR<br /> BUS NOW</h1>
      <div className='flex w-full gap-3 justify-center items-center'>
      <input type="text" {...register('source')} 
        className="w-1/2 p-4 rounded-xl focus:outline-none focus:border-slate-800 
                   border-2 border-slate-500" 
        placeholder="From" 
        list='source'
      />
      <datalist id="source">
        {
          routes.length!==0 &&
          routes.map(route=>{
           return <option value={`${route.station}`} />
          })
        }
        
      </datalist>
  
      <h1 className="font-semibold text-xl">TO</h1>
  
      <input type="text" {...register('destination')} 
        className="w-1/2 p-4 rounded-xl focus:outline-none focus:border-slate-800 
                   border-2 border-slate-500" 
        placeholder="To" 
        list='destination'
      />
      <datalist id="destination">
        {
          routes.length!==0 &&
          routes.map(route=>{
           return <option value={`${route.station}`} />
          })
        }
        
      </datalist>


      </div>
      <input type="date" {...register('date',{setValueAs: (value) => {
                if (value) {
                    const [year, month, day] = value.split('-');
                    return `${day}-${month}-${year}`;
                }
                return value;
            }})} id="" className='w-1/2 flex justify-center border-2 border-slate-500 p-4 rounded-xl focus:outline-none focus:border-slate-800' />
      <button className="bg-black text-white rounded-3xl p-3 hover:bg-gray-800 transition">
        Search Buses
      </button>
    </div>
    </form>
    
  </div>
  
  )
}

export default Buses;
